//
//  NNBaseViewController.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

/** 用于标识需要隐藏navbar的controller */
@protocol NNNavigationBarHidden <NSObject>

@end

@interface NNBaseViewController : UIViewController

/** 默认UIStatusBarStyleDefault */
@property (nonatomic, assign) UIStatusBarStyle currentStatusBarStyle;

/** 是否是第一次将要显示*/
@property (nonatomic, readonly, assign) BOOL willFirstAppear;

/** 是否是第一次显示完毕*/
@property (nonatomic, readonly, assign) BOOL didFirstAppear;

/** 控制器将要第一次显示 */
- (void)viewWillFirstAppear:(BOOL)animated;

/** 控制器第一次显示完毕 */
- (void)viewDidFirstAppear:(BOOL)animated;

/** 配置自定义导航栏，遵循NNNavigationBarHidden将不调用这个方法 */
- (void)setupNavigationItem;

/** 配置必要的通知 */
- (void)setupNotification;

- (void)backOrDismiss;

@end
