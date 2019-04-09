//
//  NNRefreshFooter.m
//  NNProject
//
//  Created by NeroXie on 2019/1/10.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "NNRefreshFooter.h"
#import "NNRefreshLoadingView.h"

@interface NNRefreshFooter()

@property (nonatomic, strong) NNRefreshLoadingView *loadingView;

@end

@implementation NNRefreshFooter

#pragma mark - Override

- (void)prepare {
    [super prepare];

    [self setTitle:@"" forState:MJRefreshStateIdle];
    [self setTitle:@"" forState:MJRefreshStateRefreshing];
    [self setTitle:@"我也是有底线的！" forState:MJRefreshStateNoMoreData];
    
    self.loadingView = [NNRefreshLoadingView new];
    [self addSubview:self.loadingView];

    self.loadingView.origin =
    CGPointMake((SCREEN_WIDTH - self.loadingView.width) / 2.0, (self.mj_h - self.loadingView.height) / 2.0);
}

- (void)setState:(MJRefreshState)state {
    MJRefreshCheckState
    
    if (state == MJRefreshStateNoMoreData || state == MJRefreshStateIdle) {
        [self.loadingView endLoading];
    } else if (state == MJRefreshStateRefreshing) {
        [self.loadingView startLoading];
    }
}

@end
