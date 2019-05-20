//
//  CityManager.h
//  NNProject
//
//  Created by NeroXie on 2019/1/12.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CityModel.h"

#define SharedCityManager [CityManager sharedInstance]

@interface CityManager : NSObject

/** 有房源城市数组 */
@property (nonatomic, readonly, copy) NSArray *haveHouseCityModels;

/** 热门城市数组 */
@property (nonatomic, readonly, copy) NSArray *hotCityModels;

/** 选择城市 */
@property (nonatomic, readonly, copy) NSString *selectedCityName;

/** 选择城市Id */
@property (nonatomic, readonly, copy) NSString *selectedCityId;

/** 定位城市 */
@property (nonatomic, readonly, copy) NSString *locationCityName;

/** 定位城市Id */
@property (nonatomic, readonly, copy) NSString *locationCityId;

/** 省市区字典数组 */
@property (nonatomic, readonly, copy) NSArray *cityList;

/** 省市区模型数组 */
@property (nonatomic, readonly, copy) NSArray *cityModels;

/** 最近访问城市数组 */
@property (nonatomic, readonly, copy) NSArray *visitedCityModels;

/** 单例 */
+ (instancetype)sharedInstance;

/** 省市区列表请求 */
- (void)loadInitCityList;

/** 房源城市请求 */
- (void)loadHaveHouseCityListWithCompletionHander:(void(^)(NSError *error))completionHander;

/** 保存选择城市 */
- (void)saveSelectedCityWithCityName:(NSString *)cityName cityId:(NSString *)cityId;

/** 切换到定位城市 */
- (void)changeToLocationCityWithCompletion:(void (^)(NSString *cityName, NSString *cityId))completion;

/** 保存定位城市 */
- (void)saveLocationCityWithCityName:(NSString *)cityName cityId:(NSString *)cityId;

/** 城市定位，包括选择城市和定位城市的更新 */
- (void)cityLocationWithCompletion:(void (^)(NSString *cityName, NSString *cityId))completion;

/** 添加最近访问城市 */
- (void)addVisitedCity:(CityModel *)city;

/** 根据房源城市同步调整最近访问城市 */
- (void)fixVisitedCityList;

- (NSArray *)getCityRegionListWithCityId:(NSString *)cityId;

@end

