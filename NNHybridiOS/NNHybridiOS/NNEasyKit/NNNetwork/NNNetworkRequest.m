//
//  NNNetworkRequest.m
//  NNNetworking
//
//  Created by NeroXie on 2018/12/10.
//  Copyright © 2018 NeroXie. All rights reserved.
//

#import "NNNetworkRequest.h"
#import "NSString+NNExtension.h"

NSString* nn_stringUrlTrimming(NSString *string) {
    NSString *tmp = [string stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"/"]];
    while (tmp && tmp.length && [tmp hasPrefix:@"/"]) {
        tmp = [tmp substringFromIndex:1];
    }
    
    return tmp;
}

NSString* nn_stringAddUrlPathComponent(NSString *string, NSString *component) {
    return [NSString stringWithFormat:@"%@/%@", nn_stringUrlTrimming(string), nn_stringUrlTrimming(component)];
}

@interface NNNetworkRequest()

@property (nonatomic, strong) NSURLSessionDataTask *dataTask;

- (BOOL)couldSendRequest;

@end

@implementation NNNetworkRequest

#pragma mark - Init

- (instancetype)init {
    if (self = [super init]) {
        self.httpMethod = NNHTTPMethodPOST;
        self.responseClass = NNNetworkResponse.class;

        self.apiParameters = [NSMutableDictionary dictionary];
    }
    
    return self;
}

- (void)dealloc {
    [self.dataTask cancel];
}

#pragma mark - Public

- (BOOL)send:(void(^)(NSURLSessionDataTask *dataTask, NNNetworkResponse *response, NSError *error))completionHander {
    if (self.couldSendRequest) {
        [self.dataTask cancel];
        self.dataTask = [self.netService sendRequest:self completionHandler:completionHander];
        
        return self.dataTask != nil;
    }
    
    return NO;
}

- (void)cancel {
    [self.dataTask cancel];
}

- (NSDictionary *)finalParameters {
    return self.apiParameters;
}

- (NSString *)finalRequestUrl {
    return nn_stringAddUrlPathComponent(self.apiHost, self.apiPath);
}

#pragma mark - Getter

- (BOOL)couldSendRequest {
    return self.netService && [self.finalRequestUrl nn_isNotNilOrBlank];
}

@end

