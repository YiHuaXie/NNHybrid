//
//  NNParallaxView.h
//  NNEasyKit
//
//  Created by NeroXie on 2019/5/16.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NNParallaxView : UIView

@property (nonatomic, readonly, strong) UIImageView *imageView;

/**
 偏移平滑参数，取值范围 大于0，小于1，值越小平移变化越小。
 */
@property (nonatomic, assign) double smoothFactor;

/**
 设置平移偏量的上限，水平和垂直方向分别设置，取值范围大于0
 */
- (void)setMaxOffsetHorizontal:(CGFloat)offsetH vertical:(CGFloat)offsetV;

/** 开始获取陀螺仪数据并移动图片 */
- (void)startUpdates;

/**
 停止获取陀螺仪数据和移动图片
 */
- (void)stopUpdates;

@end
