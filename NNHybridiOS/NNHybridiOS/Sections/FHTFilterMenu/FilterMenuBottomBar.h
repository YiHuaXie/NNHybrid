//
//  FilterMenuBottomBar.h
//  MYRoom
//
//  Created by NeroXie on 2019/3/20.
//  Copyright © 2019 Perfect. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FilterMenuBottomBar : UIView

@property (nonatomic, readonly, strong) UIButton *resetButton;
@property (nonatomic, readonly, strong) UIButton *confirmButton;

@property (nonatomic, copy) void(^resetButtonPressedHandler)(void);
@property (nonatomic, copy) void(^confirmButtonPressedHandler)(void);

@end
