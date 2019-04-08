//
//  UIGestureRecognizer+NNExtension.h
//  NNProject
//
//  Created by NeroXie on 2018/11/28.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "NNDefineMacro.h"

@interface UIGestureRecognizer (NNExtension)

/** 延迟调用下，连续点击，仅最后一次有效 */
@property (nonatomic, assign, setter=nn_setOnlyLastHandlerValid:) BOOL nn_onlyLastHandlerValid;

+ (instancetype)nn_recognizerWithHandler:(void (^)(UIGestureRecognizer *sender))handler;
+ (instancetype)nn_recognizerWithHandler:(void (^)(UIGestureRecognizer *sender))handler
                                   delay:(NSTimeInterval)delay;

- (instancetype)nn_initWithHandler:(void (^)(UIGestureRecognizer *sender))handler NN_INITIALIZER;
- (instancetype)nn_initWithHandler:(void (^)(UIGestureRecognizer *sender))handler
                             delay:(NSTimeInterval)delay NN_INITIALIZER;

@end
