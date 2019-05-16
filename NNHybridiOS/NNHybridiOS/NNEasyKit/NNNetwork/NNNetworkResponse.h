//
//  NNNetworkResponse.h
//  NNNetworking
//
//  Created by NeroXie on 2018/12/10.
//  Copyright © 2018 NeroXie. All rights reserved.
//

#import <Foundation/Foundation.h>

@class NNNetworkRequest;

@interface NNNetworkResponse : NSObject

@property (nonatomic, readonly, strong) id responseObject;

+ (BOOL)responseValidWithResponseObject:(id)responseObject
                             inDataTask:(NSURLSessionDataTask *)dataTask
                          forRequest:(NNNetworkRequest *)request;

- (instancetype)initWithResponseObject:(id)responseObject;

@end

