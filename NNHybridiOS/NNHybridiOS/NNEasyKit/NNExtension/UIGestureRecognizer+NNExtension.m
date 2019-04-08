//
//  UIGestureRecognizer+NNExtension.m
//  NNProject
//
//  Created by NeroXie on 2018/11/28.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "UIGestureRecognizer+NNExtension.h"
#import "NNGlobalHelper.h"
#import <objc/runtime.h>

@interface UIGestureRecognizer()

@property (nonatomic, copy, setter=nn_setHandler:) void (^nn_handler)(UIGestureRecognizer *sender);
@property (nonatomic, assign, setter=nn_setDelayTime:) NSTimeInterval nn_delayTime;
@property (nonatomic, copy, setter=nn_setDelayBlock:) NNDispatchDelayBlock nn_delayBlock;

@end

@implementation UIGestureRecognizer (NNExtension)

+ (instancetype)nn_recognizerWithHandler:(void (^)(UIGestureRecognizer *sender))handler {
    return [[self alloc] nn_initWithHandler:handler];
}

+ (instancetype)nn_recognizerWithHandler:(void (^)(UIGestureRecognizer *sender))handler
                                   delay:(NSTimeInterval)delay {
    return [[self alloc] nn_initWithHandler:handler
                                      delay:delay];
}

- (instancetype)nn_initWithHandler:(void (^)(UIGestureRecognizer *sender))handler {
    NSParameterAssert(handler);
    if (self = [self initWithTarget:self action:@selector(nn_handleAction:)]) {
        self.nn_handler = handler;
    }
    
    return self;
}

- (instancetype)nn_initWithHandler:(void (^)(UIGestureRecognizer *sender))handler delay:(NSTimeInterval)delay {
    self = [self nn_initWithHandler:handler];
    self.nn_delayTime = delay;
    
    return self;
}

#pragma mark - Private

- (void)nn_handleAction:(UIGestureRecognizer *)sender {
    BOOL onlyLastHandlerValid = self.nn_onlyLastHandlerValid;
    if (onlyLastHandlerValid) {
        nn_dispatch_cancel(self.nn_delayBlock);
    }
    
    NNDispatchDelayBlock delayBlock = nn_dispatch_delay(self.nn_delayTime, dispatch_get_main_queue(), ^{
        NN_BLOCK_EXEC(self.nn_handler, sender);
    });
    
    if (onlyLastHandlerValid) {
        self.nn_delayBlock = delayBlock;
    }
}

#pragma mark - Setter & Getter

- (void)nn_setHandler:(void (^)(UIGestureRecognizer *))nn_handler {
    objc_setAssociatedObject(self, @selector(nn_handler), nn_handler, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (void (^)(UIGestureRecognizer *))nn_handler {
    return objc_getAssociatedObject(self, @selector(nn_handler));
}

- (void)nn_setDelayTime:(NSTimeInterval)nn_delayTime {
    NSNumber *number = nn_delayTime > 0.0 ? @(nn_delayTime) : nil;
    objc_setAssociatedObject(self, @selector(nn_delayTime), number, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSTimeInterval)nn_delayTime {
    return [objc_getAssociatedObject(self, @selector(nn_delayTime)) doubleValue];
}

- (void)nn_setOnlyLastHandlerValid:(BOOL)nn_onlyLastHandlerValid {
    NSNumber *number = @(nn_onlyLastHandlerValid);
    objc_setAssociatedObject(self, @selector(nn_onlyLastHandlerValid), number, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (BOOL)nn_onlyLastHandlerValid {
    return [objc_getAssociatedObject(self, @selector(nn_onlyLastHandlerValid)) boolValue];
}

- (void)nn_setDelayBlock:(NNDispatchDelayBlock)nn_delayBlock {
    objc_setAssociatedObject(self, @selector(nn_delayBlock), nn_delayBlock, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (NNDispatchDelayBlock)nn_delayBlock {
    return objc_getAssociatedObject(self, @selector(nn_delayBlock));
}

@end
