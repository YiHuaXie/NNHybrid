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

#pragma mark - Private

/** 省市区列表请求 */
- (void)_loadInitCityList {
    ApiBaseRequest *req = [ApiBaseRequest new];
    req.apiPath = API_ESTATE;
    req.apiMethod = @"initCityData";
    req.apiVersion = @"1.0";
    req.dataField = @"initCity";
    
    [req nn_send:^(id data, NSError *error) {
        if (!error) [StandardUserDefaults setObject:data forKey:kInitCityList];
    }];
}

@end
