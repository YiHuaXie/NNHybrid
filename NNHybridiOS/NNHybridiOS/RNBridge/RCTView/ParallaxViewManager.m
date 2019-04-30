//
// Created by NeroXie on 2019-04-02.
// Copyright (c) 2019 NeroXie. All rights reserved.
//

#import "ParallaxViewManager.h"
#import "ParallaxView.h"
#import <SDWebImage/UIImageView+WebCache.h>

#pragma mark - ParallaxView+NNExtension

@interface ParallaxView (NNExtension)

@end

@implementation ParallaxView(NNExtension)

- (void)setImageUrl:(NSString *)imageUrl {
    [self.imageView sd_setImageWithURL:[NSURL URLWithString:imageUrl]];
}

- (void)setCornerRadius:(CGFloat)cornerRadius {
    self.imageView.layer.cornerRadius = cornerRadius;
}

@end

#pragma mark - ParallaxViewManager

@interface ParallaxViewManager()

@end

@implementation ParallaxViewManager

RCT_EXPORT_MODULE();

// 属性的映射和导出
RCT_EXPORT_VIEW_PROPERTY(smoothFactor, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(imageUrl, NSString);
RCT_EXPORT_VIEW_PROPERTY(cornerRadius, CGFloat);

- (UIView *)view {
    ParallaxView *parallaxView = [[ParallaxView alloc] initWithFrame:CGRectZero];
    parallaxView.smoothFactor = 0.03;
    parallaxView.imageView.contentMode = UIViewContentModeScaleAspectFill;
    parallaxView.clipsToBounds = YES;
    [parallaxView startUpdates];
    
    return parallaxView;
}

@end
