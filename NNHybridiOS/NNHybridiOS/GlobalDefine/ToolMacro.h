//
//  ToolMacro.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#ifndef ToolMacro_h
#define ToolMacro_h

//block
#define BLOCK_EXEC(block, ...)      if (block) { block(__VA_ARGS__); };

#define GET_KEY_PATH(obj, PATH)     FormatString(@"%s", ((void)obj.PATH, # PATH))

//string
#define FormatString(args...)       [NSString stringWithFormat:args]

//weak and strong
#define WEAK_SELF                   __weak __typeof(self) weakSelf = self
#define STRONG_SELF                 __strong __typeof(weakSelf) strongSelf = weakSelf

//系统单例
#define SharedApplication            [UIApplication sharedApplication]
#define StandardUserDefaults         [NSUserDefaults standardUserDefaults]
#define MainBundle                   [NSBundle mainBundle]
#define CurrentDevice                [UIDevice currentDevice]

//第三方单例
#define SharedIQKeyboardManager      [IQKeyboardManager sharedManager]

//iPhone 相关区域高度
#define SAFE_AREA_HEIGHT            (NN_IS_ALL_SCREEN ? 34 : 0)
#define STATUS_BAR_HEIGHT           (NN_IS_ALL_SCREEN ? 44 : 20.0)
#define NAVIGATION_BAR_HEIGHT       44.0
#define FULL_NAVIGATION_BAR_HEIGHT  (STATUS_BAR_HEIGHT + NAVIGATION_BAR_HEIGHT)
#define TAB_BAR_HEIGHT              49.0

//屏幕
#define MainScreen      [UIScreen mainScreen]

#define SCREEN_WIDTH     (MainScreen.bounds.size.width)
#define SCREEN_HEIGHT    (MainScreen.bounds.size.height)
#define SCREEN_SIZE      MainScreen.bounds.size
#define SCREEN_BOUNDS    MainScreen.bounds

#endif /* ToolMacro_h */
