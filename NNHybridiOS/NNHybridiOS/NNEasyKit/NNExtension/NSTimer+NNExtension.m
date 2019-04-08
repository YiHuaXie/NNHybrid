//
//  NSTimer+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/9/19.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NSTimer+NNExtension.h"
#import <objc/message.h>

#pragma mark - Private Class

@interface _NNTimerWeakTarget: NSObject

@property (nonatomic, weak) id target;
@property (nonatomic, assign) SEL selector;
@property (nonatomic, weak) NSTimer *timer;

@end

@implementation _NNTimerWeakTarget

- (void)weakTargetAction {
    if (!self.target) {
        [self.timer invalidate];
        return;
    }
    
    void (*timer_msgSend)(id, SEL, NSTimer *) = (typeof(timer_msgSend))objc_msgSend;
    timer_msgSend(self.target, self.selector, self.timer);
}

@end

#pragma mark - NSTimer+NNExtension

@implementation NSTimer (NNExtension)

#pragma mark - Public

+ (NSTimer *)nn_scheduledTimerWithTimeInterval:(NSTimeInterval)ti
                                       repeats:(BOOL)repeats
                                         block:(TimerInvokeHandler)block {
    NSTimer *timer = [self nn_timerWithTimeInterval:ti repeats:repeats block:block];
    [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
    
    return timer;
}

+ (NSTimer *)nn_timerWithTimeInterval:(NSTimeInterval)ti
                              repeats:(BOOL)repeats
                                block:(TimerInvokeHandler)block {
    if (!block) {
        return nil;
    }
    
    CFAbsoluteTime seconds = fmax(ti, 0.0001);
    CFAbsoluteTime interval = repeats ? seconds : 0;
    return (__bridge_transfer NSTimer *)CFRunLoopTimerCreateWithHandler(NULL, CFAbsoluteTimeGetCurrent() + seconds, interval, 0, 0, (void(^)(CFRunLoopTimerRef))block);
}

+ (NSTimer *)nn_scheduledAutoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                                   target:(id)aTarget
                                                 selector:(SEL)aSelector
                                                 userInfo:(id)userInfo
                                                  repeats:(BOOL)repeats {
    if (!aTarget) {
        return nil;
    }
    
    if (![aTarget respondsToSelector:aSelector]) {
        return nil;
    }
    
    _NNTimerWeakTarget *weakTarget = [_NNTimerWeakTarget new];
    weakTarget.target = aTarget;
    weakTarget.selector = aSelector;
    
    NSTimer *timer = [self scheduledTimerWithTimeInterval:ti
                                          target:weakTarget
                                        selector:@selector(weakTargetAction)
                                        userInfo:userInfo
                                         repeats:repeats];
    weakTarget.timer = timer;
    
    return timer;
}

+ (NSTimer *)nn_autoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                          target:(id)aTarget
                                        selector:(SEL)aSelector
                                        userInfo:(id)userInfo
                                         repeats:(BOOL)repeats {
    if (!aTarget) {
        return nil;
    }
    
    if (![aTarget respondsToSelector:aSelector]) {
        return nil;
    }
    
    _NNTimerWeakTarget *weakTarget = [_NNTimerWeakTarget new];
    weakTarget.target = aTarget;
    weakTarget.selector = aSelector;
    
    NSTimer *timer = [self timerWithTimeInterval:ti
                                          target:weakTarget
                                        selector:@selector(weakTargetAction)
                                        userInfo:userInfo
                                         repeats:repeats];
    weakTarget.timer = timer;
    
    return timer;
}

+ (NSTimer *)nn_scheduledAutoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                                   target:(id)aTarget
                                                  repeats:(BOOL)repeats
                                                    block:(TimerInvokeHandler)block {
    if (!aTarget || !block) {
        return nil;
    }
    
    __block _NNTimerWeakTarget *weakTarget = [_NNTimerWeakTarget new];
    weakTarget.target = aTarget;

    NSTimer *timer = [self nn_scheduledTimerWithTimeInterval:ti
                                                     repeats:repeats
                                                       block:^(NSTimer *timer) {
                                                           if (!weakTarget.target) {
                                                               [timer invalidate];
                                                               weakTarget = nil;
                                                           } else {
                                                               block(timer);
                                                           }
                                                       }];
    return timer;
}

+ (NSTimer *)nn_autoReleaseTimerWithTimeInterval:(NSTimeInterval)ti
                                          target:(id)aTarget
                                         repeats:(BOOL)repeats
                                           block:(TimerInvokeHandler)block {
    if (!aTarget || !block) {
        return nil;
    }
    
    __block _NNTimerWeakTarget *weakTarget = [_NNTimerWeakTarget new];
    weakTarget.target = aTarget;
    
    NSTimer *timer = [self nn_timerWithTimeInterval:ti
                                            repeats:repeats
                                              block:^(NSTimer *timer) {
                                                  if (!weakTarget.target) {
                                                      [timer invalidate];
                                                      weakTarget = nil;
                                                  } else {
                                                      block(timer);
                                                  }
                                              }];
    
    return timer;
}

@end

