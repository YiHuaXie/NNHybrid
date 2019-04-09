//
//  CityModel.h
//  NNProject
//
//  Created by NeroXie on 2019/1/4.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "NNBaseModel.h"

//@protocol CityModel;

@interface CityModel : NNBaseModel

@property (nonatomic, copy) NSString *cityId;
@property (nonatomic, copy) NSString *cityName;

//@property (nonatomic, copy) NSString *areaId;        //区域ID
//@property (nonatomic, copy) NSString *areaName;       //区域名称

//@property (nonatomic, strong) NSNumber *locationLat;
//@property (nonatomic, strong) NSNumber *locationLng;
//@property (nonatomic, assign) BOOL *ishot;

@end
