//
//  DecentraliedHouse.h
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NNBaseModel.h"
#import "TagModel.h"

// 只显示桥接需要字段
@interface DecentraliedHouse : NNBaseModel

@property (nonatomic, copy) NSString *houseName;
//@property (nonatomic, strong) NSArray *rentTypes;
@property (nonatomic, copy) NSString *price;
@property (nonatomic, copy) NSString *houseType;
@property (nonatomic, assign) double houseArea;
@property (nonatomic, copy) NSArray<TagModel> *showTagList;

@end

