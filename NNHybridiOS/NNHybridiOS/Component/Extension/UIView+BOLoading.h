//
//  UIView+BOLoading.h
//  beone
//
//  Created by Bruce Jackson on 2018/6/7.
//  Copyright © 2018年 Bruce Jackson. All rights reserved.
//

#import <UIKit/UIKit.h>

extern const NSInteger kPlaneLoadingViewTag;

@interface UIView (BOLoading)

- (void)showPlaneLoading;
- (void)showPlaneLoadingWithMessage:(NSString *)message;
- (void)showPlaneLoadingWithVerticalOffset:(CGFloat)verticalOffset;
- (void)showPlaneLoadingWithMessage:(NSString *)message verticalOffset:(CGFloat)verticalOffset;
- (void)hidePlaneLoading;

@end
