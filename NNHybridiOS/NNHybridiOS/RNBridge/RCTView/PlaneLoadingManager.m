//
//  PlaneLoadingManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/4/30.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "PlaneLoadingManager.h"
#import "UIView+BOLoading.h"

@interface PlaneLoading: UIView

@property (nonatomic, assign) BOOL show;

@end

@implementation PlaneLoading

- (void)setShow:(BOOL)show {
    _show = show;
    
    show ? [self showPlaneLoading] : [self hidePlaneLoading];
}

@end

@implementation PlaneLoadingManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(show, BOOL);
    
- (UIView *)view {
    return [[PlaneLoading alloc] initWithFrame:CGRectZero];
}

@end
