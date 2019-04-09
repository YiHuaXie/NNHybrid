//
//  SystemConfigPlugin.m
//  NNProject
//
//  Created by NeroXie on 2019/2/28.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "SystemConfigPlugin.h"
#import <AMapFoundationKit/AMapFoundationKit.h>

static ConstString kAMapKey = @"6c5d062e9e30a68cafe2669f4f19459a";

@implementation SystemConfigPlugin

#pragma mark - AppDelegatePlugin

- (void)launch {
    
    [AMapServices sharedServices].apiKey = kAMapKey;
    [AMapServices sharedServices].enableHTTPS = YES;
}

@end
