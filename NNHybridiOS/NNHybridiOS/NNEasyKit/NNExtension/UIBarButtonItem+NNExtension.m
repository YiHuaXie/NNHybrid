//
//  UIBarButtonItem+NNExtension.m
//  NNProject
//
//  Created by NeroXie on 2019/1/12.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import "UIBarButtonItem+NNExtension.h"
#import "NSString+NNExtension.h"
#import "UIControl+NNExtension.h"

static CGFloat kButtonSize = 24.0;

@implementation UIBarButtonItem (NNExtension)

+ (instancetype)navigationItemWithTitle:(NSString *)title actions:(NNSenderBlock)actions {
    return [self navbarButtonItemWithTitle:title image:nil action:actions];
}

+ (instancetype)navigationItemWithTitle:(NSString *)title titleColor:(UIColor *)titleColor actions:(NNSenderBlock)actions {
    UIBarButtonItem *item = [UIBarButtonItem navigationItemWithTitle:title actions:actions];
    UIButton *button = (UIButton *)item.customView;
    [button setTitleColor:titleColor forState:UIControlStateNormal];
    
    return item;
}

+ (instancetype)navbarButtonItemWithImage:(UIImage *)image actions:(NNSenderBlock)actions {
    return [self navbarButtonItemWithTitle:nil image:image action:actions];
}

+ (instancetype)navbarButtonItemWithTitle:(NSString *)title image:(UIImage *)image action:(NNSenderBlock)action {
    if (![title nn_isNotNilOrBlank] && !image) {
        return nil;
    }
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    button.titleLabel.font = nn_regularFontSize(14);
    
    if (image) {
        [button setImage:image forState:UIControlStateNormal];
        
        button.adjustsImageWhenDisabled =
        button.adjustsImageWhenHighlighted = NO;
    }
    
    if ([title nn_isNotNilOrBlank]) {
        [button setTitle:title forState:UIControlStateNormal];
    }
    
    [button sizeToFit];
    button.height = kButtonSize;
    
    if (image && ![title nn_isNotNilOrBlank]) {
        button.frame = CGRectMake(0, 0, kButtonSize, kButtonSize);
    }
    
    [button nn_addEventHandler:[action copy]
              forControlEvents:UIControlEventTouchUpInside];
    
    return [[UIBarButtonItem alloc] initWithCustomView:button];
}

@end
