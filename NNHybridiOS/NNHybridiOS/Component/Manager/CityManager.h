//
//  CityManager.h
//  NNProject
//
//  Created by NeroXie on 2019/1/12.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>

#define SharedCityManager [CityManager sharedInstance]

@interface CityManager : NSObject

/** 单例 */
+ (instancetype)sharedInstance;

/** 省市区列表请求 */
- (void)loadInitCityList;

@end

