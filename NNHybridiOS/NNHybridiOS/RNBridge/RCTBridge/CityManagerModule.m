//
//  CityManagerModule.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/4/10.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "CityManagerModule.h"
#import "CityManager.h"

@implementation CityManagerModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(cityLocation:(RCTResponseSenderBlock)callback) {
    [SharedCityManager cityLocationWithCompletion:^(NSString *cityName, NSString *cityId) {
        BLOCK_EXEC(callback, @[cityName, cityId]);
    }];
}

@end
