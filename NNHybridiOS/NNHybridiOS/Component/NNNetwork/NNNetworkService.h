//
//  NNNetworkService.h
//  NNNetworking
//
//  Created by NeroXie on 2018/12/10.
//  Copyright © 2018 NeroXie. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFHTTPSessionManager.h"

@class NNNetworkRequest;
@class NNNetworkResponse;

@interface NNNetworkService : NSObject

@property (nonatomic, strong) AFHTTPSessionManager *sessionManager;

- (NSURLSessionDataTask *)sendRequest:(NNNetworkRequest *)request
                    completionHandler:(void(^)(NSURLSessionDataTask *dataTask, NNNetworkResponse *response, NSError *error))handler;


@end
