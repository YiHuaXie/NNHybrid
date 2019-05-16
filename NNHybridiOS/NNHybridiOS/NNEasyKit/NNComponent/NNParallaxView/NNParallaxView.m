//
//  NNParallaxView.m
//  NNEasyKit
//
//  Created by NeroXie on 2019/5/16.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NNParallaxView.h"
#import <CoreMotion/CoreMotion.h>

@interface NNParallaxView()

@property (nonatomic, strong) UIImageView *imageView;

@property (nonatomic, weak) NSLayoutConstraint *constraintCenterX;
@property (nonatomic, weak) NSLayoutConstraint *constraintCenterY;
@property (nonatomic, weak) NSLayoutConstraint *constraintSizeWidth;
@property (nonatomic, weak) NSLayoutConstraint *constraintSizeHeight;

@property (nonatomic, strong) CMMotionManager *motionManager;

@property (nonatomic, assign) double totalRotRateX;
@property (nonatomic, assign) double totalRotRateY;
@property (nonatomic, assign) double radiusH;
@property (nonatomic, assign) double radiusV;

@end

@implementation NNParallaxView

#pragma mark - Init

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.clipsToBounds = YES;
        self.smoothFactor = 0.1;
        
        self.imageView = [[UIImageView alloc] initWithFrame:self.bounds];
        [self addSubview:self.imageView];
        self.imageView.contentMode = UIViewContentModeScaleAspectFill;
        
        self.imageView.translatesAutoresizingMaskIntoConstraints = NO;
        self.constraintCenterX = [NSLayoutConstraint constraintWithItem:self
                                                              attribute:NSLayoutAttributeCenterX
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:self.imageView
                                                              attribute:NSLayoutAttributeCenterX
                                                             multiplier:1
                                                               constant:0];
        self.constraintCenterY = [NSLayoutConstraint constraintWithItem:self
                                                              attribute:NSLayoutAttributeCenterY
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:self.imageView
                                                              attribute:NSLayoutAttributeCenterY
                                                             multiplier:1
                                                               constant:0];
        self.constraintSizeWidth = [NSLayoutConstraint constraintWithItem:self
                                                                attribute:NSLayoutAttributeWidth
                                                                relatedBy:NSLayoutRelationEqual
                                                                   toItem:self.imageView
                                                                attribute:NSLayoutAttributeWidth
                                                               multiplier:1
                                                                 constant:0];
        self.constraintSizeHeight = [NSLayoutConstraint constraintWithItem:self
                                                                 attribute:NSLayoutAttributeHeight
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:self.imageView
                                                                 attribute:NSLayoutAttributeHeight
                                                                multiplier:1
                                                                  constant:0];
        [self addConstraints:@[self.constraintCenterX, self.constraintCenterY, self.constraintSizeWidth, self.constraintSizeHeight]];
        
        self.backgroundColor = [UIColor whiteColor];
        self.imageView.backgroundColor = [UIColor whiteColor];
        self.motionManager = [[CMMotionManager alloc] init];
        [self setMaxOffsetHorizontal:40 vertical:40];
    }
    return self;
}

#pragma mark - Public

- (void)setMaxOffsetHorizontal:(CGFloat)offsetH vertical:(CGFloat)offsetV {
    self.radiusH = offsetH;
    self.radiusV = offsetV;
    self.constraintSizeWidth.constant = -offsetH*2;
    self.constraintSizeHeight.constant = -offsetV*2;
}

/**
 绕Y轴旋转角转化为水平方向偏移量，绕X轴旋转角转化为垂直方向偏移量。
 采用公式 弧长=圆心角弧度*半径 将角度转化为长度
 */
- (CGPoint)offsetFromRotationRate:(CGPoint)rotRate {
    return (CGPoint){rotRate.y * self.radiusH, rotRate.x * self.radiusV};
}

- (void)startUpdates {
    CMMotionManager *motionManager = self.motionManager;
    if (motionManager == nil || !motionManager.isGyroAvailable) {
        return;
    }
    
    motionManager.gyroUpdateInterval = 1.0/60.0;
    motionManager.showsDeviceMovementDisplay = YES;
    [motionManager startGyroUpdatesToQueue:[NSOperationQueue mainQueue] withHandler:^(CMGyroData * _Nullable gyroData, NSError * _Nullable error) {
        //当陀螺仪偏角大于一定值时，才认为设备在移动
        double xxx = ABS(gyroData.rotationRate.x) < 0.1 ? 0 : gyroData.rotationRate.x;
        double yyy = ABS(gyroData.rotationRate.y) < 0.05 ? 0 : gyroData.rotationRate.y;
        
        //低通滤波。防止偏角变化频率过大，产生抖动
        self.totalRotRateX = [NNParallaxView lowPassFilterForSampledValue:xxx+self.totalRotRateX
                                                     withPrePassedValue:self.totalRotRateX
                                                           smoothFactor:self.smoothFactor];
        self.totalRotRateY = [NNParallaxView lowPassFilterForSampledValue:yyy+self.totalRotRateY
                                                     withPrePassedValue:self.totalRotRateY
                                                           smoothFactor:self.smoothFactor];
        //用阈值修正偏角。将偏角控制在阈值范围内, 将阈值设为1，可以通过设置半径来控制最大偏移量，依据公式 |弧长=圆心角弧度*半径|
        self.totalRotRateX = [NNParallaxView modifiedValue:self.totalRotRateX withThreshold:1];
        self.totalRotRateY = [NNParallaxView modifiedValue:self.totalRotRateY withThreshold:1];
        self.imageOffset = [self offsetFromRotationRate:(CGPoint){self.totalRotRateX, self.totalRotRateY}];
    }];
}

- (void)stopUpdates {
    CMMotionManager *motionManager = self.motionManager;
    if (motionManager == nil || !motionManager.isGyroAvailable) {
        return;
    }
    
    [motionManager stopGyroUpdates];
}

#pragma mark - Private

+ (double)modifiedValue:(double)originalValue withThreshold:(double)threshold {
    NSAssert(threshold > 0, @"Threshold should be positive");
    return originalValue > threshold ? threshold : originalValue < -threshold ? -threshold : originalValue;
}

+ (double)modifiedValue:(double)originalValue withMaxValue:(double)maxValue minValue:(double)minValue {
    NSAssert(minValue <= maxValue, @"minValue should less than or equal to maxValue");
    return originalValue > maxValue ? maxValue : originalValue < minValue ? minValue : originalValue;
}

+ (double)lowPassFilterForSampledValue:(double)sampled withPrePassedValue:(double)prePass smoothFactor:(double)smoothFactor {
    return sampled * smoothFactor + prePass * (1 - smoothFactor);
}

#pragma mark - Setter

- (void)setImageOffset:(CGPoint)imageOffset {
    self.constraintCenterX.constant = imageOffset.x;
    self.constraintCenterY.constant = imageOffset.y;
}

@end
