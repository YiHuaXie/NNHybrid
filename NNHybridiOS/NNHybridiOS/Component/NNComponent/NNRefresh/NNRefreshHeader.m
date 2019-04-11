//
//  NNRefreshHeader.m
//  NNProject
//
//  Created by NeroXie on 2019/1/9.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "NNRefreshHeader.h"

#import <Lottie/Lottie.h>

@interface NNRefreshHeader()

//@property (nonatomic, strong) LOTAnimationView *beforeLoadingView;
//@property (nonatomic, strong) DGActivityIndicatorView *loadingView;
@property (nonatomic, strong) NNRefreshLoadingView *loadingView;

@end

@implementation NNRefreshHeader

#pragma mark - Public Methods

- (void)prepare {
    [super prepare];
    self.automaticallyChangeAlpha = YES;
    
//    self.beforeLoadingView = [LOTAnimationView animationNamed:@"data"];
//    self.beforeLoadingView.contentMode = UIViewContentModeScaleAspectFill;
//    self.beforeLoadingView.animationSpeed = 1.0;
//    [self addSubview:self.beforeLoadingView];
//    [self.beforeLoadingView mas_makeConstraints:^(MASConstraintMaker *make) {
//        make.size.mas_equalTo(CGSizeMake(200, 40));
//        make.center.equalTo(self);
//    }];
    
    self.loadingView = [NNRefreshLoadingView new];
    [self addSubview:self.loadingView];
    [self.loadingView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(self);
        make.size.mas_equalTo(CGSizeMake(kIndicatorSize, kIndicatorSize));
    }];
}

- (void)beginRefreshing {
    [super beginRefreshing];

//    [self.beforeLoadingView pause];
}

- (void)setState:(MJRefreshState)state {
    MJRefreshCheckState
    
    if (state == MJRefreshStateIdle) {
        [self.loadingView endLoading];
//        self.beforeLoadingView.hidden = NO;
    } else if (state == MJRefreshStateRefreshing) {
//        self.beforeLoadingView.hidden = YES;
        [self.loadingView startLoading];
    }
}

//- (void)setPullingPercent:(CGFloat)pullingPercent {
//    [super setPullingPercent:pullingPercent];
//    
//    CGFloat progress = pullingPercent - 1 > 0 ? 1.0 : pullingPercent;
//    progress = progress - 0.3 < 0 ? 0.0 : progress - 0.3;
//    
//    self.beforeLoadingView.animationProgress = progress / 0.7 * 0.45 ;
//}

@end
