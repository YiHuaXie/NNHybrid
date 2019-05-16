//
//  NNNetworkRequest.h
//  NNNetworking
//
//  Created by NeroXie on 2018/12/10.
//  Copyright © 2018 NeroXie. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NNNetworkService.h"
#import "NNNetworkResponse.h"

typedef NS_ENUM(NSInteger, NNHTTPMethod) {
    NNHTTPMethodGET,
    NNHTTPMethodPOST,
    NNHTTPMethodPUT,
    NNHTTPMethodHEAD,
    NNHTTPMethodDELETE,
    NNHTTPMethodPATCH
};

@interface NNNetworkRequest : NSObject

/** 网络服务 */
@property (nonatomic, weak) NNNetworkService *netService;

/** http请求类型，默认是POST */
@property (nonatomic, assign) NNHTTPMethod httpMethod;

/** API地址，如：https://xxxx.com */
@property (nonatomic, copy) NSString *apiHost;
/** API的路径，如：xxx/xxxx */
@property (nonatomic, copy) NSString *apiPath;

/** API参数 */
@property (nonatomic, copy) NSDictionary *apiParameters;

@property (nonatomic, copy) void (^post_uploadProgress) (NSProgress *uploadProgress);
@property (nonatomic, copy) void (^get_downloadProgress) (NSProgress *downloadProgress);

/** responseClass必须是NNNetworkResponse或其子类 */
@property (nonatomic, strong) Class responseClass;

/** 发送请求 */
- (BOOL)send:(void(^)(NSURLSessionDataTask *dataTask, NNNetworkResponse *response, NSError *error))completionHander;
/** 取消请求 */
- (void)cancel;

/** 网络请求最终使用的url，默认是apiHost+apiPath，子类可重写 */
- (NSString *)finalRequestUrl;
/** 网络请求最终使用的参数，默认是apiParameters，子类可重写 */
- (NSDictionary *)finalParameters;

@end

