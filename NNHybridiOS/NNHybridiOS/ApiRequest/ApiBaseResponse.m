//
//  ApiBaseResponse.m
//  NNProject
//
//  Created by NeroXie on 2018/12/11.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "ApiBaseResponse.h"

@implementation ApiBaseResponse

- (instancetype)initWithResponseObject:(id)responseObject {
    if (self = [super initWithResponseObject:responseObject]) {
        self.data = responseObject[@"data"];
        self.code = [responseObject[@"code"] integerValue];
        self.message = responseObject[@"message"];
    }
    
    return self;
}

@end
