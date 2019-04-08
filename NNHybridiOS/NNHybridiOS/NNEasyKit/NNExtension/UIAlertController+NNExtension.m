//
//  UIAlertController+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/8/9.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UIAlertController+NNExtension.h"

NSInteger const UIAlertCnontrollerCancelButtonIndex = 0;
NSInteger const UIAlertControllerDestructiveButtonIndex = 1;
NSInteger const UIAlertControllerFirstOtherButtonIndex = 2;

@implementation UIAlertController (NNExtension)

+ (instancetype)nn_alertControllerWithTitle:(NSString *)title
                                    message:(NSString *)message
                             preferredStyle:(UIAlertControllerStyle)preferredStyle
                          cancelButtonTitle:(NSString *)cancelButtonTitle
                     destructiveButtonTitle:(NSString *)destructiveButtonTitle
                          otherButtonTitles:(NSArray *)otherButtonTitles
                          completionHandler:(UIAlertControllerCompletionHandler)completionHandler {
    UIAlertController *vc = [UIAlertController alertControllerWithTitle:title
                                                                message:message
                                                         preferredStyle:preferredStyle];
    
    if (cancelButtonTitle) {
        [vc addAction: [UIAlertAction actionWithTitle:cancelButtonTitle
                                                style:UIAlertActionStyleCancel
                                              handler:^(UIAlertAction * _Nonnull action) {
                                                  if (completionHandler) {
                                                      completionHandler(vc, action, UIAlertCnontrollerCancelButtonIndex);
                                                  }
                                              }]];
    }
    
    if (destructiveButtonTitle) {
        [vc addAction: [UIAlertAction actionWithTitle:destructiveButtonTitle
                                                style:UIAlertActionStyleDestructive
                                              handler:^(UIAlertAction * _Nonnull action) {
                                                  if (completionHandler) {
                                                      completionHandler(vc, action, UIAlertControllerDestructiveButtonIndex);
                                                  }
                                              }]];
    }
    
    for (NSUInteger i = 0; i < otherButtonTitles.count; i++) {
        [vc addAction: [UIAlertAction actionWithTitle:otherButtonTitles[i]
                                                style:UIAlertActionStyleDefault
                                              handler:^(UIAlertAction * _Nonnull action) {
                                                  if (completionHandler) {
                                                      completionHandler(vc, action, UIAlertControllerFirstOtherButtonIndex + i);
                                                  }
                                              }]];
    }
    
    return vc;
}

@end
