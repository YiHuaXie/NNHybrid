//
//  UserDefaultModule.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/4/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "UserDefaultModule.h"

@implementation UserDefaultModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(objectForKey:(NSString *)key callback:(RCTResponseSenderBlock)callback) {
    id obj = [StandardUserDefaults objectForKey:key];
    
    NSArray *result = obj ? @[obj] : @[];
    callback(@[result]);
}

@end
