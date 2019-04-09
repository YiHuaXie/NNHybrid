//
//  NNRefreshLoadingView.m
//  NNProject
//
//  Created by NeroXie on 2019/1/9.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "NNRefreshLoadingView.h"
#import "DGActivityIndicatorView.h"

const CGFloat kIndicatorSize = 30.0;

@interface NNRefreshLoadingView()

@property (nonatomic, strong) DGActivityIndicatorView *indicatorView;

@end

@implementation NNRefreshLoadingView

#pragma mark - Init

- (instancetype)init {
    if (self = [super init]) {
        [self _setup];
    }
    
    return self;
}

- (void)_setup {
    self.indicatorView =
    [[DGActivityIndicatorView alloc] initWithType:DGActivityIndicatorAnimationTypeRotatingTrigons
                                        tintColor:APP_THEME_COLOR
                                             size:kIndicatorSize];
    [self addSubview:self.indicatorView];
    
    CGSize indicatorSize = CGSizeMake(kIndicatorSize, kIndicatorSize);
    
    [self.indicatorView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(self);
        make.size.mas_equalTo(indicatorSize);
    }];
}

#pragma mark - Public

- (void)startLoading {
    [self.indicatorView startAnimating];
}

- (void)endLoading {
    [self.indicatorView stopAnimating];
}

@end
