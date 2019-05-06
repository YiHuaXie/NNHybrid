//
//  AMapLocationModule.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/4/18.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "AMapLocationModule.h"
#import "LocationManager.h"

@implementation AMapLocationModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(locationWithCompletion:(RCTResponseSenderBlock)callback) {
    [SharedLocationManager locationWithCompletion:^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error) {
        if (error) {
            BLOCK_EXEC(callback, @[@{@"error": error.localizedDescription}]);
        } else {
            BLOCK_EXEC(callback, @[@{@"latitude": @(location.coordinate.latitude),
                                     @"longitude": @(location.coordinate.longitude),
                                     @"formattedAddress":nn_makeSureString(regeocode.formattedAddress),
                                     @"country": nn_makeSureString(regeocode.country),
                                     @"province": nn_makeSureString(regeocode.province),
                                     @"city": nn_makeSureString(regeocode.city),
                                     @"district": nn_makeSureString(regeocode.district)}]);
        }
    }];
}

RCT_EXPORT_METHOD(locationAuthorizedDenied:(RCTResponseSenderBlock)callback) {
    BLOCK_EXEC(callback, @[@(SharedLocationManager.locationAuthorizedDenied)]);
}

@end
