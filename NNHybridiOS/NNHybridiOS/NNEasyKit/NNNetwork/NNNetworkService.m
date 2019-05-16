//
//  NNNetworkService.m
//  NNNetworking
//
//  Created by NeroXie on 2018/12/10.
//  Copyright © 2018 NeroXie. All rights reserved.
//

#import "NNNetworkService.h"
#import <objc/message.h>
#import "AFNetworkReachabilityManager.h"
#import "NNNetworkRequest.h"
#import "NNNetworkResponse.h"

typedef NSURLSessionDataTask* (*Network_msgSend)(AFHTTPSessionManager *,
                                                 SEL,
                                                 NSString *,
                                                 NSString *,
                                                 id,
                                                 void(^)(NSProgress *uploadProgress),
                                                 void(^)(NSProgress *downloadProgress),
                                                 void(^)(NSURLSessionDataTask *dataTask, id responseObject),
                                                 void(^)(NSURLSessionDataTask *dataTask, NSError *error));

static NSDictionary *_httpMethodMap = nil;

@interface NNNetworkService()

@end

@implementation NNNetworkService

#pragma mark - Init

- (instancetype)init {
    if (self = [super init]) {
        self.sessionManager = [AFHTTPSessionManager manager];
        self.sessionManager.requestSerializer.timeoutInterval = 10.0f;
        self.sessionManager.requestSerializer = [AFJSONRequestSerializer serializer];
        AFJSONResponseSerializer *response = [AFJSONResponseSerializer serializer];
        response.removesKeysWithNullValues = YES;
        self.sessionManager.responseSerializer = response;
        self.sessionManager.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json",@"text/html",nil];
    }
    
    return self;
}

#pragma mark - Public

- (NSURLSessionDataTask *)sendRequest:(NNNetworkRequest *)request
                    completionHandler:(void(^)(NSURLSessionDataTask *dataTask, NNNetworkResponse *response, NSError *error))handler {
    __weak typeof(self)weakSelf = self;
    
    void (^successBlock)(NSURLSessionDataTask *dataTask, id responseObject) = ^(NSURLSessionDataTask *dataTask, id responseObject) {
        NNNetworkResponse *res = [weakSelf _responseWithResponseObject:responseObject
                                                            inDataTask:dataTask
                                                            forRequest:request];
        if (handler) handler(dataTask, res, nil);
    };
    
    void (^failureBlock)(NSURLSessionDataTask *dataTask, NSError *error) = ^(NSURLSessionDataTask *dataTask, NSError *error) {
        if (handler) handler(dataTask, nil, error);
    };
    
    // AFNetworking内部的一个方法
    SEL method = NSSelectorFromString(@"dataTaskWithHTTPMethod:URLString:parameters:uploadProgress:downloadProgress:success:failure:");
    if (![self.sessionManager respondsToSelector:method]) {
        return nil;
    }
    
    Network_msgSend network_msgSend = (Network_msgSend)objc_msgSend;
    
    NSURLSessionDataTask *dataTask = network_msgSend(self.sessionManager,
                                                     method,
                                                     [self _stringForHttpMethod:request.httpMethod],
                                                     request.finalRequestUrl,
                                                     request.finalParameters,
                                                     request.post_uploadProgress,
                                                     request.get_downloadProgress,
                                                     successBlock,
                                                     failureBlock);
    [dataTask resume];
    
    return dataTask;
}

#pragma mark - Private

- (NSString *)_stringForHttpMethod:(NNHTTPMethod)httpMethod {
    if (!_httpMethodMap) {
        _httpMethodMap = @{@(NNHTTPMethodGET): @"GET",
                           @(NNHTTPMethodPOST): @"POST",
                           @(NNHTTPMethodPUT): @"PUT",
                           @(NNHTTPMethodHEAD): @"HEAD",
                           @(NNHTTPMethodDELETE): @"DELETE",
                           @(NNHTTPMethodPATCH): @"PATCH"};
    }
    
    return _httpMethodMap[@(httpMethod)];
}

- (NNNetworkResponse *)_responseWithResponseObject:(id)responseObject
                            inDataTask:(NSURLSessionDataTask *)dataTask
                            forRequest:(NNNetworkRequest *)request {
    Class responseClass = request.responseClass;
    NNNetworkResponse *res = nil;
    if (!responseClass || ![responseClass isSubclassOfClass:NNNetworkResponse.class]) return res;
    // 检查有效性
    if (![responseClass responseValidWithResponseObject:responseObject inDataTask:dataTask forRequest:request]) return res;
    
    res = [[responseClass alloc] initWithResponseObject:responseObject];
    
    return res;
}

@end
