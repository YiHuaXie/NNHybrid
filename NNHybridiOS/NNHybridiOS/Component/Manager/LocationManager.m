//
//  LocationManager.m
//  NNProject
//
//  Created by NeroXie on 2018/12/22.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "LocationManager.h"

@interface LocationManager()

@property (nonatomic, strong) AMapLocationManager *locationManager;

@end

@implementation LocationManager

#pragma mark - Public

+ (instancetype)sharedInstance {
    static LocationManager *_sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [self new];
    });
    
    return _sharedInstance;
}

- (void)locationWithCompletion:(void (^)(CLLocation *, AMapLocationReGeocode *, NSError *))completion {
#warning 解决不连接wifi也可以定位的问题
    [self.locationManager requestLocationWithReGeocode:YES completionBlock:completion];
}

- (BOOL)locationAuthorizedDenied {
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
    
    return kCLAuthorizationStatusDenied == status || kCLAuthorizationStatusRestricted == status;
}

#pragma mark - Setter & Getter

- (AMapLocationManager *)locationManager {
    if (!_locationManager) {
        _locationManager = [[AMapLocationManager alloc] init];
        _locationManager.delegate = self;
        _locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters;
        _locationManager.locationTimeout = 6.0;
        _locationManager.reGeocodeTimeout = 4.0;
    }
    
    return _locationManager;
}

@end
