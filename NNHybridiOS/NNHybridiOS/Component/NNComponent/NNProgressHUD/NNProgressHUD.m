//
//  NNProgressHUD.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNProgressHUD.h"

@implementation NNProgressHUD

#pragma mark - Init

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        UIBlurEffect *blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleLight];
        UIVisualEffectView *visualEffectView = [[UIVisualEffectView alloc] initWithEffect:blurEffect];
        visualEffectView.frame = frame;
        [self.bezelView insertSubview:visualEffectView atIndex:0];
        self.bezelView.layer.cornerRadius = 10;
        // Looks a bit nicer if we make it square.
        //            self.square = YES;
    }
    
    return self;
}

#pragma mark - Public

+ (instancetype)nn_showHUDAddedTo:(UIView *)view animated:(BOOL)animated {
    NNProgressHUD *hud = [NNProgressHUD showHUDAddedTo:view animated:animated];
    return hud;
}

+ (BOOL)nn_hideHUDForView:(UIView *)view animated:(BOOL)animated {
    return [NNProgressHUD hideHUDForView:view animated:animated];
}

+ (instancetype)nn_showHUDWithAnimated:(BOOL)animated {
    return [self nn_showHUDAddedTo:SharedApplication.delegate.window animated:animated];
}

+ (BOOL)nn_hideHUDWithAnimated:(BOOL)animated {
    UIWindow *window = [UIApplication sharedApplication].delegate.window;
    return [NNProgressHUD hideHUDForView:window animated:animated];
}

+ (instancetype)nn_showAutoDisappearWithText:(NSString *)text inView:(UIView *)view delay:(CGFloat)delay {
    NNProgressHUD *hud = [NNProgressHUD showHUDAddedTo:view animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.label.text = text;
    hud.removeFromSuperViewOnHide = YES;
    hud.userInteractionEnabled = NO;
    [hud hideAnimated:YES afterDelay:delay];
    
    return hud;
}

+ (instancetype)nn_showAutoDisappearWithText:(NSString *)text inView:(UIView *)view {
    return [self nn_showAutoDisappearWithText:text inView:view delay:1.5];
}

+ (instancetype)nn_showWithText:(NSString *)text inView:(UIView *)view {
    NNProgressHUD *hud = [NNProgressHUD showHUDAddedTo:view animated:YES];
    hud.mode = MBProgressHUDModeText;
    hud.label.text = text;
    hud.removeFromSuperViewOnHide = YES;
    hud.userInteractionEnabled = NO;
    
    return hud;
}

+ (instancetype)nn_showWithText:(NSString *)text {
    return [self nn_showWithText:text inView:SharedApplication.delegate.window];
}

+ (instancetype)nn_showCustomView:(UIView *)customView withText:(NSString *)text inView:(UIView *)view {
    NNProgressHUD *hud = [NNProgressHUD showHUDAddedTo:view animated:YES];
    hud.mode = MBProgressHUDModeCustomView;
    hud.customView = customView;
    hud.label.text = text;
    hud.label.font = [UIFont systemFontOfSize:14.0];
    
    return hud;
}

+ (instancetype)nn_showInfoViewWithText:(NSString *)text inView:(UIView *)view {
    return [self nn_showTipViewWithText:text inView:view imageName:@"info"];
}

+ (instancetype)nn_showDoneViewWithText:(NSString *)text inView:(UIView *)view {
    return [self nn_showTipViewWithText:text inView:view imageName:@"success"];
}

+ (instancetype)nn_showErrorViewWithText:(NSString *)text inView:(UIView *)view {
    return [self nn_showTipViewWithText:text inView:view imageName:@"error"];
}

+ (instancetype)nn_showInfoWindowWithText:(NSString *)text {
    return [self nn_showTipWindowWithText:text imageName:@"info"];
}

+ (instancetype)nn_showDoneWindowWithText:(NSString *)text {
    return [self nn_showTipWindowWithText:text imageName:@"success"];
}

+ (instancetype)nn_showErrorWindowWithText:(NSString *)text {
    return [self nn_showTipWindowWithText:text imageName:@"error"];
}

#pragma mark - Private

+ (instancetype)nn_showTipViewWithText:(NSString *)text inView:(UIView *)view imageName:(NSString *)imageName {
    UIImage *image = [[UIImage imageNamed:imageName] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    UIImageView *imageView = [[UIImageView alloc] initWithImage:image];
    NNProgressHUD *hud = [self nn_showCustomView:imageView withText:text inView:view];
    [hud hideAnimated:YES afterDelay:1.5];
    
    return hud;
}

+ (instancetype)nn_showTipWindowWithText:(NSString *)text imageName:(NSString *)imageName {
    return [self nn_showTipViewWithText:text
                                 inView:SharedApplication.delegate.window
                              imageName:imageName];
}


@end
