//
//  NSTimer+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/9/19.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void (^TimerInvokeHandler) (NSTimer *timer);

@interface NSTimer (NNExtension)

+ (NSTimer *)nn_scheduledTimerWithTimeInterval:(NSTimeInterval)ti
                                       repeats:(BOOL)repeats
                                         block:(TimerInvokeHandler)block;

+ (NSTimer *)nn_timerWithTimeInterval:(NSTimeInterval)ti
                              repeats:(BOOL)repeats
                                block:(TimerInvokeHandler)block;

+ (NSTimer *)nn_scheduledAutoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                                   target:(id)aTarget
                                                 selector:(SEL)aSelector
                                                 userInfo:(id)userInfo
                                                  repeats:(BOOL)repeats;

+ (NSTimer *)nn_autoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                                   target:(id)aTarget
                                                 selector:(SEL)aSelector
                                                 userInfo:(id)userInfo
                                                  repeats:(BOOL)repeats;

+ (NSTimer *)nn_scheduledAutoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                                   target:(id)aTarget
                                                  repeats:(BOOL)repeats
                                                    block:(TimerInvokeHandler)block;

+ (NSTimer *)nn_autoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                          target:(id)aTarget
                                         repeats:(BOOL)repeats
                                           block:(TimerInvokeHandler)block;

@end
