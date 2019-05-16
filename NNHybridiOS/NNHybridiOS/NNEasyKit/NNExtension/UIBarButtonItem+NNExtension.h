//
//  UIBarButtonItem+NNExtension.h
//  NNProject
//
//  Created by NeroXie on 2019/1/12.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "NNGlobalHelper.h"

@interface UIBarButtonItem (NNExtension)

+ (instancetype)navigationItemWithTitle:(NSString *)title actions:(NNSenderBlock)actions;
+ (instancetype)navigationItemWithTitle:(NSString *)title titleColor:(UIColor *)titleColor actions:(NNSenderBlock)actions;
+ (instancetype)navbarButtonItemWithImage:(UIImage *)image actions:(NNSenderBlock)actions;
+ (instancetype)navbarButtonItemWithTitle:(NSString *)title image:(UIImage *)image action:(NNSenderBlock)action;

@end
