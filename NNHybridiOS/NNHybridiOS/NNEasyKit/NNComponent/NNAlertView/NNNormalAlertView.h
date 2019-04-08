//
//  NNNormalAlertView.h
//  NNAlertView
//
//  Created by 谢翼华 on 2018/3/21.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNAlertView.h"

typedef void(^NNNormalAlertViewButtonBlock)(NSInteger index);

@interface NNNormalAlertView : NNAlertView

@property (nonatomic, strong) UIFont *titleFont UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIFont *messageFont UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIFont *cancelButtonFont UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIFont *otherButtonsFont UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIColor *titleColor UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIColor *messageColor UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIColor *cancelButtonTitleColor UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIColor *otherButtonTitleColor UI_APPEARANCE_SELECTOR;

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle;

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                     animationType:(NNAlertViewAnimationType)animationType;

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler;

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     animationType:(NNAlertViewAnimationType)animationType
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler;

+ (instancetype)showAlertWithImage:(UIImage *)image
                             title:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler;

+ (instancetype)showAlertWithImage:(UIImage *)image
                             title:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     animationType:(NNAlertViewAnimationType)animationType
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler;

@end
