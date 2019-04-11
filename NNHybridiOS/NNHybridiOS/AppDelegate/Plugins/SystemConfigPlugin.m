//
//  SystemConfigPlugin.m
//  NNProject
//
//  Created by NeroXie on 2019/2/28.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "SystemConfigPlugin.h"
#import "CityManager.h"
#import <AMapFoundationKit/AMapFoundationKit.h>

static ConstString kAMapKey = @"4f351241f70702b74f1aba52e4e878c7";

@implementation SystemConfigPlugin

#pragma mark - AppDelegatePlugin

- (void)launch {
    [SharedCityManager loadInitCityList];
    
    [AMapServices sharedServices].apiKey = kAMapKey;
    [AMapServices sharedServices].enableHTTPS = YES;
}

@end
