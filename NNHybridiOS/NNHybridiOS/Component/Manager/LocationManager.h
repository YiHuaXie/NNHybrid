//
//  LocationManager.h
//  NNProject
//
//  Created by NeroXie on 2018/12/22.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AMapLocationKit/AMapLocationKit.h>

#define SharedLocationManager [LocationManager sharedInstance]

@interface LocationManager : NSObject <AMapLocationManagerDelegate>

+ (instancetype)sharedInstance;

/** 获取定位 */
- (void)locationWithCompletion:(void (^)(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error))completion;

- (BOOL)locationAuthorizedDenied;

@end

