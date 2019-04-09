//
//  CityManager.m
//  NNProject
//
//  Created by NeroXie on 2019/1/12.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "CityManager.h"
#import "LocationManager.h"

static ConstString kCityName = @"name";
static ConstString kCityId = @"id";

static ConstString defaultCityName = @"杭州市";
static ConstString defaultCityId = @"330100";

@interface CityManager()

@property (nonatomic, copy) NSArray *haveHouseCityModels;
@property (nonatomic, copy) NSArray *hotCityModels;

@end

@implementation CityManager

#pragma mark - Private

- (NSString *)_getCityIdWithCityName:(NSString *)name {
    for (NSDictionary *dict in self.cityList) {
        if ([dict[kCityName] isEqualToString:name]) {
            return nn_makeSureString(dict[kCityId]);
        }
    }
    
    return nil;
}

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

- (void)loadHaveHouseCityListWithCompletionHander:(void(^)(NSError *error))completionHander  {
    ApiBaseRequest *req = [ApiBaseRequest new];
    req.apiPath = API_HOME;
    req.apiMethod = @"homeCityList";
    req.apiVersion = @"1.0";
    req.apiParameters = @{@"appType":@"1"};
    
    WEAK_SELF;
    [req nn_send:^(id data, NSError *error) {
        if (!error) {
            weakSelf.haveHouseCityModels = [CityModel arrayOfModelsFromDictionaries:data[@"normalCityList"]
                                                                        error:nil];
            weakSelf.hotCityModels = [CityModel arrayOfModelsFromDictionaries:data[@"hotCityList"]
                                                                        error:nil];
        }
        
        BLOCK_EXEC(completionHander, error);
    }];
}

/** 保存选择城市 */
- (void)saveSelectedCityWithCityName:(NSString *)cityName cityId:(NSString *)cityId {
    [StandardUserDefaults setObject:@{kCityName: cityName, kCityId: cityId}
                             forKey:kSelectedCity];
}

/** 切换到定位城市 */
- (void)changeToLocationCityWithCompletion:(void (^)(NSString *cityName, NSString *cityId))completion {
    NSDictionary *city = [StandardUserDefaults objectForKey:kLocationCity];
    if (!city) {
        return;
    }
    
    NSString *cityName = city[kCityName];
    NSString *cityId = city[kCityId];
    
    [self saveSelectedCityWithCityName:cityName cityId:cityId];
    
    BLOCK_EXEC(completion, cityName, cityId);
}

/** 保存定位城市 */
- (void)saveLocationCityWithCityName:(NSString *)cityName cityId:(NSString *)cityId {
    [StandardUserDefaults setObject:@{kCityName: cityName, kCityId: cityId}
                             forKey:kLocationCity];
}

/** 城市定位，包括选择城市和定位城市的更新 */
- (void)cityLocationWithCompletion:(void (^)(NSString *cityName, NSString *cityId))completion {
    NSDictionary *dict = [StandardUserDefaults objectForKey:kSelectedCity];
    if (dict) {
        BLOCK_EXEC(completion, dict[kCityName], dict[kCityId]);
        return;
    }
    
    WEAK_SELF;
    
    [SharedLocationManager locationWithCompletion:^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error) {
        NSString *cityName = regeocode.city;
        if (!cityName.length) cityName = regeocode.province; //直辖市在province的字段里
        NSString *cityId = [weakSelf _getCityIdWithCityName:cityName];
        
        if (!cityName.length || [cityId isEqualToString:@"000000"] || error) {
            //使用选择城市使用默认城市
            [weakSelf saveSelectedCityWithCityName:defaultCityName cityId:defaultCityId];
            BLOCK_EXEC(completion, defaultCityName, defaultCityId);
            
            return;
        }
        [weakSelf saveSelectedCityWithCityName:cityName cityId:cityId];
        [weakSelf saveLocationCityWithCityName:cityName cityId:cityId];
        
        BLOCK_EXEC(completion, cityName, cityId);
    }];
}

/** 添加最近访问城市 */
- (void)addVisitedCity:(CityModel *)city {
    if (!city) return;
    
    NSDictionary *cityDict = [city toDictionary];
    NSArray *dictionaries = [StandardUserDefaults objectForKey:kVisitedCityList];
    NSMutableArray *tmp = [NSMutableArray arrayWithArray:dictionaries];
    
    if (dictionaries.count == 0) {
        [tmp addObject:cityDict];
    } else {
        __block NSInteger index = -1;
        [dictionaries enumerateObjectsUsingBlock:^(NSDictionary *  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if ([obj[@"cityName"] isEqualToString:city.cityName]) {
                index = idx;
                *stop = YES;
            }
        }];
        
        if (index < 0) {
            [tmp insertObject:cityDict atIndex:0];
            if (dictionaries.count > 2) {
                [tmp removeObject:tmp.lastObject];
            }
        } else if (index > 0) {
            [tmp removeObjectAtIndex:index];
            [tmp insertObject:cityDict atIndex:0];
        }
    }
    
    [StandardUserDefaults setObject:[tmp copy] forKey:kVisitedCityList];
    [StandardUserDefaults synchronize];
}

/** 根据房源城市同步调整最近访问城市 */
- (void)fixVisitedCityList {
    NSMutableArray *tmp = [NSMutableArray array];
    for (NSDictionary *visited in [StandardUserDefaults objectForKey:kVisitedCityList]) {
        for (CityModel *city in self.haveHouseCityModels) {
            if ([city.cityName isEqualToString:visited[@"cityName"]]) {
                [tmp addObject:visited];
            }
        }
    }
    
    [StandardUserDefaults setObject:[tmp copy] forKey:kVisitedCityList];
    [StandardUserDefaults synchronize];
}

- (NSArray *)cityList {
    return [StandardUserDefaults objectForKey:kInitCityList];
}

- (NSArray *)cityModels {
    return [CityModel arrayOfModelsFromDictionaries:self.cityList error:nil];
}

- (NSArray *)visitedCityModels {
    NSArray *tmp = [StandardUserDefaults objectForKey:kVisitedCityList];
    if (!tmp.count) return nil;
    
    return [CityModel arrayOfModelsFromDictionaries:tmp error:nil];
}

- (NSString *)selectedCityName {
    NSDictionary *city = [StandardUserDefaults objectForKey:kSelectedCity];
    
    return !city ? defaultCityName : city[kCityName];
}

- (NSString *)selectedCityId {
    NSDictionary *city = [StandardUserDefaults objectForKey:kSelectedCity];
    
    return !city ? defaultCityId : city[kCityId];
}

- (NSString *)locationCityName {
    NSDictionary *city = [StandardUserDefaults objectForKey:kLocationCity];
    
    return city[kCityName];
}

- (NSString *)locationCityId {
    NSDictionary *city = [StandardUserDefaults objectForKey:kLocationCity];
    
    return city[kCityId];
}

@end
