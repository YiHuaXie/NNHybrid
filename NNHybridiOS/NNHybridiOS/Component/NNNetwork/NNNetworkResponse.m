//
//  NNNetworkResponse.m
//  NNNetworking
//
//  Created by NeroXie on 2018/12/10.
//  Copyright © 2018 NeroXie. All rights reserved.
//

#import "NNNetworkResponse.h"

@implementation NNNetworkResponse

+ (BOOL)responseValidWithResponseObject:(id)responseObject
                             inDataTask:(NSURLSessionDataTask *)dataTask
                             forRequest:(NNNetworkRequest *)request {
    return YES;
}

- (instancetype)initWithResponseObject:(id)responseObject {
    if (self = [super init]) {
        _responseObject = responseObject;
    }
    
    return self;
}

@end
