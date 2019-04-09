//
//  UIView+BOLoading.m
//  beone
//
//  Created by Bruce Jackson on 2018/6/7.
//  Copyright © 2018年 Bruce Jackson. All rights reserved.
//

#import "UIView+BOLoading.h"

#import "DGActivityIndicatorView.h"

const NSInteger kPlaneLoadingViewTag = 909192;

static const CGFloat kPlaneLoadingIndicatorSize = 40.0;

static UIWindow *_loadingWindow = nil;

static NSMutableDictionary *_baseToastViewOptions = nil;

@implementation UIView (BOLoading)

#pragma mark - Super Class Mehods - UIView

- (void)showPlaneLoading {
    [self showPlaneLoadingWithMessage:nil];
}

- (void)showPlaneLoadingWithMessage:(NSString *)message {
    [self showPlaneLoadingWithMessage:message verticalOffset:0];
}

- (void)showPlaneLoadingWithVerticalOffset:(CGFloat)verticalOffset {
    [self showPlaneLoadingWithMessage:nil verticalOffset:verticalOffset];
}

- (void)showPlaneLoadingWithMessage:(NSString *)message verticalOffset:(CGFloat)verticalOffset {
    if ([self viewWithTag:kPlaneLoadingViewTag]) {
        return;
    }
    
    UIView *planeLoadingView = [[UIView alloc] initWithFrame:self.bounds];
    planeLoadingView.tag = kPlaneLoadingViewTag;
    planeLoadingView.backgroundColor = [UIColor whiteColor];
    UIView *containerView = [[UIView alloc] initWithFrame:CGRectZero];
    containerView.backgroundColor = [UIColor whiteColor];
    [planeLoadingView addSubview:containerView];
    [containerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(planeLoadingView);
    }];

    DGActivityIndicatorView *indicatorView =
    [[DGActivityIndicatorView alloc] initWithType:DGActivityIndicatorAnimationTypeLineScale
                                        tintColor:APP_THEME_COLOR
                                             size:kPlaneLoadingIndicatorSize];
    [containerView addSubview:indicatorView];

    CGSize indicatorSize = CGSizeMake(kPlaneLoadingIndicatorSize, kPlaneLoadingIndicatorSize);
    if ([message nn_isNotNilOrBlank]) {
        UILabel *messageLabel = [[UILabel alloc] initWithFrame:CGRectZero];
        messageLabel.text = message;
        messageLabel.textColor = APP_TEXT_GRAY_COLOR;
        messageLabel.font = nn_mediumFontSize(16);
        [containerView addSubview:messageLabel];

        [indicatorView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(containerView);
            make.centerX.equalTo(containerView);
            make.size.mas_equalTo(indicatorSize);
        }];

        [messageLabel mas_makeConstraints:^(MASConstraintMaker *make) {
           make.top.equalTo(indicatorView.mas_bottom).with.offset(10.0);
           make.left.equalTo(containerView);
           make.right.equalTo(containerView);
           make.bottom.equalTo(containerView);
        }];

    } else {
        [indicatorView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(containerView);
            make.size.mas_equalTo(indicatorSize);
        }];
    }

    [self addSubview:planeLoadingView];
    [planeLoadingView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self).with.insets(UIEdgeInsetsMake(verticalOffset, 0, 0, 0));
    }];

    [indicatorView startAnimating];
}

- (void)hidePlaneLoading {
    UIView *planeLoadingView = [self viewWithTag:kPlaneLoadingViewTag];
    if (!planeLoadingView) {
        return;
    }

    [UIView animateWithDuration:APP_DEFAULT_ANIMATION_DURATION animations:^{
        planeLoadingView.alpha = 0;
    } completion:^(BOOL finished) {
        [planeLoadingView removeFromSuperview];
    }];
}

@end
