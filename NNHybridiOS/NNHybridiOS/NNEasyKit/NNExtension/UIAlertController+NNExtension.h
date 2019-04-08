//
//  UIAlertController+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/8/9.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

UIKIT_EXTERN NSInteger const UIAlertCnontrollerCancelButtonIndex;
UIKIT_EXTERN NSInteger const UIAlertControllerDestructiveButtonIndex;
UIKIT_EXTERN NSInteger const UIAlertControllerFirstOtherButtonIndex;

typedef void (^UIAlertControllerCompletionHandler) (UIAlertController * controller, UIAlertAction * action, NSInteger buttonIndex);

@interface UIAlertController (NNExtension)

+ (instancetype)nn_alertControllerWithTitle:(NSString *)title
                                 message:(NSString *)message
                          preferredStyle:(UIAlertControllerStyle)preferredStyle
                       cancelButtonTitle:(NSString *)cancelButtonTitle
                  destructiveButtonTitle:(NSString *)destructiveButtonTitle
                       otherButtonTitles:(NSArray *)otherButtonTitles
                       completionHandler:(UIAlertControllerCompletionHandler)completionHandler;

@end
