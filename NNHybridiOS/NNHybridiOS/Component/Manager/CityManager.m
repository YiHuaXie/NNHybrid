//
//  CityManager.m
//  NNProject
//
//  Created by NeroXie on 2019/1/12.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "CityManager.h"


@implementation CityManager

#pragma mark - Public

/** 单例 */
+ (instancetype)sharedInstance {
    static CityManager *_sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [self new];
    });
    
    return _sharedInstance;
}

/** 省市区列表请求 */
- (void)loadInitCityList {
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
