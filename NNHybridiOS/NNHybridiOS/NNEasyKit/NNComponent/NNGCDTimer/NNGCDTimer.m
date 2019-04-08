//
//  NNGCDTimer.m
//  NNProject
//
//  Created by 谢翼华 on 2018/8/13.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNGCDTimer.h"

@interface NNGCDTimer()

@property (nonatomic, strong) dispatch_source_t timerSource;
@property (nonatomic, assign) BOOL running;

@end

@implementation NNGCDTimer

#pragma mark - Init

+ (instancetype)scheduleDisposableWithInterval:(NSTimeInterval)interval
                                         queue:(dispatch_queue_t)queue
                                        action:(void (^)(void))action {
    NNGCDTimer *timer = [[NNGCDTimer alloc] initWithInterval:interval
                                                   startTime:DISPATCH_TIME_NOW
                                                     repeats:NO
                                                       queue:queue
                                                      action:action];
    [timer start];
    
    return timer;
}

+ (instancetype)scheduleRepeatingWithInterval:(NSTimeInterval)interval
                                        queue:(dispatch_queue_t)queue
                                       action:(void (^)(void))action {
    NNGCDTimer *timer = [[NNGCDTimer alloc] initWithInterval:interval
                                                   startTime:DISPATCH_TIME_NOW
                                                     repeats:YES
                                                       queue:queue
                                                      action:action];
    [timer start];
    
    return timer;
}

- (instancetype)initWithInterval:(NSTimeInterval)interval
                       startTime:(dispatch_time_t)startTime
                         repeats:(BOOL)repeats
                           queue:(dispatch_queue_t)queue
                          action:(void (^)(void))action {
    if (self = [super init]) {
        self.running = NO;
        self.timerSource = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, queue);
        uint64_t trigger = repeats ? interval * NSEC_PER_SEC : DISPATCH_TIME_FOREVER;
        dispatch_source_set_timer(self.timerSource, startTime, trigger, 0);
        
        __weak dispatch_source_t weakTimerSource = self.timerSource;
        
        dispatch_source_set_event_handler(self.timerSource, ^{
            action();
            
            if (!repeats) {
                dispatch_cancel(weakTimerSource);
            }
        });
    }
    
    return self;
}

#pragma mark - Public

- (void)start {
    if (self.running) {
        return;
    }
    
    if (@available(iOS 10.0, *)) {
        dispatch_activate(self.timerSource);
    } else {
        dispatch_resume(self.timerSource);
    }
    
    self.running = YES;
}

- (void)suspend {
    if (!self.running) {
        return;
    }
    
    dispatch_suspend(self.timerSource);
    self.running = NO;
}

- (void)resume {
    if (self.running) {
        return;
    }
    
    dispatch_resume(self.timerSource);
    self.running = YES;
}

- (void)cancel {
    dispatch_cancel(self.timerSource);
}

@end
