//
//  AppDesignMacro.h
//  NNProject
//
//  Created by NeroXie on 2018/12/12.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#ifndef AppDesignMacro_h
#define AppDesignMacro_h

// App主色
#define APP_THEME_COLOR nn_colorHexString(@"FF8C07")

#define APP_TABLE_COLOR [UIColor whiteColor]

// 文字黑色
#define APP_TEXT_BLACK_COLOR nn_colorHexString(@"333333")

// 文字灰色
#define APP_TEXT_GRAY_COLOR nn_colorHexString(@"999999")

// 分割线颜色
#define APP_LINE_COLOR nn_colorHexString(@"F2F2F2")

// 填充灰色
#define APP_FILL_GRAY_COLOR nn_colorHexString(@"f5f6f6")

// 默认动画时间
#define APP_DEFAULT_ANIMATION_DURATION 0.3

// 价格字体
#define APP_PRICE_FONT_SIZE(x)   [UIFont fontWithName:@"FuturaStd-Condensed" size:x]

// 导航条back
#define NAVI_BACK_BLACK_IMAGE   [UIImage imageNamed:@"navigation_back_black"];
#define NAVI_BACK_WHITE_IMAGE   [UIImage imageNamed:@"navigation_back_white"];

// 导航条close
#define NAVI_CLOSE_BLACK_IMAGE   [UIImage imageNamed:@"navigation_close_black"];

#endif /* AppDesignMacro_h */
