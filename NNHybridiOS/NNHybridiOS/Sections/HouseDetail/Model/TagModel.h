//
//  TagModel.h
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NNBaseModel.h"

@protocol TagModel;

@interface TagModel : NNBaseModel

@property (nonatomic, copy) NSString *tagName;
@property (nonatomic, copy) NSString *tagColor;
@property (nonatomic, copy) NSString *backgroundColor;
@property (nonatomic, copy) NSString *borderColor;
@property (nonatomic, copy) NSString *tagIcon;
@property (nonatomic, copy) NSString *url;
@property (nonatomic, assign) CGFloat iconWidth;
@property (nonatomic, assign) CGFloat iconHeight;

@end

