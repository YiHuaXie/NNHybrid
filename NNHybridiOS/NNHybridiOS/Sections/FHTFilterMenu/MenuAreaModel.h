//
//  MenuAreaModel.h
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/20.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import <Foundation/Foundation.h>

@class MenuZoneModel;

@interface MenuAreaModel : NSObject

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *regionId;
@property (nonatomic, strong) NSArray<MenuZoneModel *> *children;

@end

@interface MenuZoneModel : NSObject

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *zoneId;

@end

@interface MenuSubwayStationModel : NSObject

@property (nonatomic, strong) NSString *stationCode;
@property (nonatomic, strong) NSString *stationName;

@end

@interface MenuSubwayRouteModel : NSObject

@property (nonatomic, strong) NSString *routeCode;
@property (nonatomic, strong) NSString *subwayRouteName;
@property (nonatomic, copy) NSArray<MenuSubwayStationModel *> *subwayStationInfo;

@end

