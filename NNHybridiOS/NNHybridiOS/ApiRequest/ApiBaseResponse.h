//
//  ApiBaseResponse.h
//  NNProject
//
//  Created by NeroXie on 2018/12/11.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "NNNetworkResponse.h"

@interface ApiBaseResponse : NNNetworkResponse

@property (nonatomic, strong) id data;
@property (nonatomic, assign) NSInteger code;
@property (nonatomic, copy) NSString *message;

@end
