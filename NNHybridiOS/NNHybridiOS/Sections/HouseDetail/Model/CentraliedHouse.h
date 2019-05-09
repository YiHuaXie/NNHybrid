//
//  CentraliedHouse.h
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NNBaseModel.h"
#import "TagModel.h"

// 只显示桥接需要字段
@interface CentraliedHouse : NNBaseModel

@property (nonatomic, copy) NSString *estateName;
@property (nonatomic, copy) NSString *styleName;
@property (nonatomic, copy) NSString *rentPrice;
//@property (nonatomic, assign) int minFloorNum;
//@property (nonatomic, assign) int maxFloorNum;
@property (nonatomic, assign) int minChamber;
@property (nonatomic, assign) int maxChamber;
@property (nonatomic, assign) double minRoomArea;
//@property (nonatomic, strong) NSArray *rentTypes;
@property (nonatomic, copy) NSArray<TagModel> *showTagList;

@end
