//
// Created by NeroXie on 2019-04-02.
// Copyright (c) 2019 NeroXie. All rights reserved.
//

#import "NNParallaxViewManager.h"
#import "NNParallaxView.h"
#import <SDWebImage/UIImageView+WebCache.h>

#pragma mark - NNParallaxView+NNExtension

@interface NNParallaxView (NNExtension)

@end

@implementation NNParallaxView(NNExtension)

- (void)setImageUrl:(NSString *)imageUrl {
    [self.imageView sd_setImageWithURL:[NSURL URLWithString:imageUrl]];
}

- (void)setCornerRadius:(CGFloat)cornerRadius {
    self.imageView.layer.cornerRadius = cornerRadius;
}

@end

#pragma mark - NNParallaxViewManager

@implementation NNParallaxViewManager

RCT_EXPORT_MODULE();

// 属性的映射和导出
RCT_EXPORT_VIEW_PROPERTY(smoothFactor, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(imageUrl, NSString);
RCT_EXPORT_VIEW_PROPERTY(cornerRadius, CGFloat);

- (UIView *)view {
    NNParallaxView *parallaxView = [[NNParallaxView alloc] initWithFrame:CGRectZero];
    parallaxView.smoothFactor = 0.03;
    parallaxView.imageView.contentMode = UIViewContentModeScaleAspectFill;
    parallaxView.clipsToBounds = YES;
    [parallaxView startUpdates];
    
    return parallaxView;
}

@end
