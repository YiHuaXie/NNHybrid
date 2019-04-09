//
//  UIViewController+Landspace.m
//  NNProject
//
//  Created by NeroXie on 2018/11/11.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "UIViewController+Landspace.h"

/*
先是陀螺仪捕获到一个横屏事件
接下来系统会找到当前用户操作的那个 APP
APP 会找到当前的窗口 window
窗口 window 会找到根控制器，这个时候事件终于传到我们开发者手里了
对于我们自定义的根控制器，它需要把这个事件传递到 UITabbarController
对于 UITabbarController，需要把事件传递到 UINavigationController
对于 UINavigationController，需要把事件传递到我们自己的控制器*/

static NSDictionary *autorotateMap = nil;

@implementation UIViewController (Landspace)

+ (void)load {
//    [self nn_instanceMethodSwizzling:@selector(shouldAutorotate)
//                    swizzledSelector:@selector(nn_shouldAutorotate)];
//    [self nn_instanceMethodSwizzling:@selector(supportedInterfaceOrientations)
//                    swizzledSelector:@selector(nn_supportedInterfaceOrientations)];
}

#pragma mark - Method Swizzing

- (BOOL)nn_shouldAutorotate {
    if ([self isKindOfClass:UITabBarController.class]) {
        return ((UITabBarController *)self).selectedViewController.shouldAutorotate;
    }
    
    if ([self isKindOfClass:UINavigationController.class]) {
        return ((UINavigationController *)self).topViewController.shouldAutorotate;
    }
    
//    id value = autorotateMap[self.nn_objectTag];
//    if (value && [value isKindOfClass:NSNumber.class]) {
//        return YES;
//    }
    
    return NO;
}

- (UIInterfaceOrientationMask)nn_supportedInterfaceOrientations {
    if ([self isKindOfClass:UITabBarController.class]) {
        return ((UITabBarController *)self).selectedViewController.nn_supportedInterfaceOrientations;
    }
    
    if ([self isKindOfClass:UINavigationController.class]) {
        return ((UINavigationController *)self).topViewController.nn_supportedInterfaceOrientations;
    }
    
//    NSNumber *value = autorotateMap[self.nn_objectTag];
//    if (value) {
//        return value.unsignedIntegerValue;
//    }
    
    return UIInterfaceOrientationMaskPortrait;
}

#pragma mark - Public

+ (void)setAutorotateMap:(NSDictionary *)map {
    if (!autorotateMap) {
        autorotateMap = [map copy];
    }
}

@end
