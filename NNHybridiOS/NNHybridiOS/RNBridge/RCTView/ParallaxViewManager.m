//
// Created by NeroXie on 2019-04-02.
// Copyright (c) 2019 NeroXie. All rights reserved.
//

#import "ParallaxViewManager.h"
#import "ParallaxView.h"
#import <SDWebImage/UIImageView+WebCache.h>

@interface ParallaxViewManager()

@property (nonatomic, strong) ParallaxView *parallaxView;

@end

@implementation ParallaxViewManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(loadImageWithUrl:(NSString *)url) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.parallaxView.imageView sd_setImageWithURL:[NSURL URLWithString:url]];
    });
}

- (UIView *)view {
    [self.parallaxView startUpdates];
    
    return self.parallaxView;
}

#pragma mark - Getter

- (ParallaxView *)parallaxView {
    if (!_parallaxView) {
        _parallaxView = [[ParallaxView alloc] initWithFrame:CGRectZero];
        _parallaxView.smoothFactor = 0.03;
        _parallaxView.imageView.contentMode = UIViewContentModeScaleAspectFill;
        _parallaxView.layer.cornerRadius = 8;
        _parallaxView.clipsToBounds = YES;
    }

    return _parallaxView;
}

@end
