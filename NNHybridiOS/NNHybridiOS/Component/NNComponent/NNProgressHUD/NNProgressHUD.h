//
//  NNProgressHUD.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "MBProgressHUD.h"

@interface NNProgressHUD : MBProgressHUD

+ (instancetype)nn_showHUDAddedTo:(UIView *)view animated:(BOOL)animated;

+ (BOOL)nn_hideHUDForView:(UIView *)view animated:(BOOL)animated;

/**
 show a loading view in window
 */
+ (instancetype)nn_showHUDWithAnimated:(BOOL)animated;

/**
 hide the loading view in window if exsit
 */
+ (BOOL)nn_hideHUDWithAnimated:(BOOL)animated;

/**
 a loading view have text only, will disappear automatically
 
 @param text                    text
 @param view                    loading view's super view
 @param delay                   delay time
 */
+ (instancetype)nn_showAutoDisappearWithText:(NSString *)text inView:(UIView *)view delay:(CGFloat)delay;

+ (instancetype)nn_showAutoDisappearWithText:(NSString *)text inView:(UIView *)view;

/**
 a loading view have text only, will not disappear
 
 @param text                    text
 @param view                    loading view's super view
 */
+ (instancetype)nn_showWithText:(NSString *)text inView:(UIView *)view;

+ (instancetype)nn_showWithText:(NSString *)text;

/**
 a custom loading view, will not disappear
 
 @param customView              a view shown in the loading view
 @param text                    text
 @param view                    loading view's super view
 */
+ (instancetype)nn_showCustomView:(UIView *)customView withText:(NSString *)text inView:(UIView *)view;

/**
 display a custom view on the view
 */
+ (instancetype)nn_showInfoViewWithText:(NSString *)text inView:(UIView *)view;

+ (instancetype)nn_showDoneViewWithText:(NSString *)text inView:(UIView *)view;

+ (instancetype)nn_showErrorViewWithText:(NSString *)text inView:(UIView *)view;

/**
 display a custom view on the window
 */
+ (instancetype)nn_showInfoWindowWithText:(NSString *)text;

+ (instancetype)nn_showDoneWindowWithText:(NSString *)text;

+ (instancetype)nn_showErrorWindowWithText:(NSString *)text;

@end
