//
//  NNGCDTimer.h
//  NNProject
//
//  Created by 谢翼华 on 2018/8/13.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NNGCDTimer : NSObject

+ (instancetype)scheduleDisposableWithInterval:(NSTimeInterval)interval
                                         queue:(dispatch_queue_t)queue
                                        action:(void (^)(void))action;

+ (instancetype)scheduleRepeatingWithInterval:(NSTimeInterval)interval
                                        queue:(dispatch_queue_t)queue
                                       action:(void (^)(void))action;

- (instancetype)initWithInterval:(NSTimeInterval)interval
                       startTime:(dispatch_time_t)startTime
                         repeats:(BOOL)repeats
                           queue:(dispatch_queue_t)queue
                          action:(void (^)(void))action;

- (void)start;
- (void)suspend;
- (void)resume;
- (void)cancel;

@end
