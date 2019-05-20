//
//  MenuAreaModel.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/20.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "MenuAreaModel.h"

@implementation MenuAreaModel

+ (NSDictionary *)mj_replacedKeyFromPropertyName{
    return @{
             @"regionId":@"id",
             };
}

@end

@implementation MenuZoneModel

+ (NSDictionary *)mj_replacedKeyFromPropertyName{
    return @{
             @"zoneId":@"id",
             };
}

@end

@implementation MenuSubwayStationModel

+ (NSDictionary *)mj_replacedKeyFromPropertyName{
    return @{
             @"zoneId":@"id",
             };
}

@end

@implementation MenuSubwayRouteModel

+ (NSDictionary *)mj_replacedKeyFromPropertyName{
    return @{
             @"routeCode": @"id",
             };
}

+ (NSDictionary *)mj_objectClassInArray {
    return @{@"subwayStationInfo": @"MenuSubwayStationModel"};
}

@end

