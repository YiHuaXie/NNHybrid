//
//  UIControl+NNExtension.m
//  NNProject
//
//  Created by NeroXie on 2018/11/22.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "UIControl+NNExtension.h"
#import "NSObject+NNExtension.h"
#import <objc/runtime.h>

#pragma mark - Private Class

@interface _NNControlWarpper: NSObject

@property (nonatomic, assign) UIControlEvents controlEvents;
@property (nonatomic, copy) void (^handler)(id sender);

@end

@implementation _NNControlWarpper

- (void)_controlHandlerInvoke:(id)sender {
    self.handler(sender);
}

@end

#pragma mark - UIControl+NNExtension

@implementation UIControl (NNExtension)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self nn_instanceMethodSwizzling:@selector(pointInside:withEvent:)
                        swizzledSelector:@selector(nn_pointInside:withEvent:)];
    });
}

#pragma mark - Public

- (void)nn_addEventHandler:(void (^)(id sender))handler
          forControlEvents:(UIControlEvents)controlEvents {
    NSParameterAssert(handler);
    
    NSMutableDictionary *events = [self events];
    NSMutableSet *handlers = events[@(controlEvents)];
    if (!handlers) {
        handlers = [NSMutableSet set];
        events[@(controlEvents)] = handlers;
    }
    
    _NNControlWarpper *target = [_NNControlWarpper new];
    target.controlEvents = controlEvents;
    target.handler = handler;
    
    [handlers addObject:target];
    [self addTarget:target action:@selector(_controlHandlerInvoke:) forControlEvents:controlEvents];
}

- (void)nn_removeEventHandlersForControlEvents:(UIControlEvents)controlEvents {
    NSMutableDictionary *events = [self events];
    NSMutableSet *handlers = events[@(controlEvents)];
    
    if (!handlers) {
        return;
    }
    
    [handlers enumerateObjectsUsingBlock:^(_NNControlWarpper *sender, BOOL * _Nonnull stop) {
        [self removeTarget:sender action:NULL forControlEvents:controlEvents];
    }];
    
    [events removeObjectForKey:@(controlEvents)];
}

- (BOOL)nn_hasEventHandlersForControlEvents:(UIControlEvents)controlEvents {
    NSMutableSet *handlers = [self events][@(controlEvents)];
    
    return handlers.count > 0;
}

#pragma mark - Method Swizzling

- (BOOL)nn_pointInside:(CGPoint)point withEvent:(UIEvent *)event {
    UIEdgeInsets enlargedEdgeInsets = self.nn_enlargedEdgeInsets;
    
    if (event.type != UIEventTypeTouches ||
        UIEdgeInsetsEqualToEdgeInsets(enlargedEdgeInsets, UIEdgeInsetsZero)) {
        return [self nn_pointInside:point withEvent:event];
    }
    
    CGRect rect = CGRectMake(self.bounds.origin.x - enlargedEdgeInsets.left,
                             self.bounds.origin.y - enlargedEdgeInsets.top,
                             self.bounds.size.width + enlargedEdgeInsets.left + enlargedEdgeInsets.right,
                             self.bounds.size.height + enlargedEdgeInsets.top + enlargedEdgeInsets.bottom);
    
    return CGRectContainsPoint(rect, point);
}

#pragma mark - Setter && Getter

- (void)nn_setEnlargedEdgeInsets:(UIEdgeInsets)nn_enlargedEdgeInsets {
    objc_setAssociatedObject(self,
                             @selector(nn_enlargedEdgeInsets),
                             [NSValue valueWithUIEdgeInsets:nn_enlargedEdgeInsets],
                             OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (UIEdgeInsets)nn_enlargedEdgeInsets {
    id value = objc_getAssociatedObject(self, @selector(nn_enlargedEdgeInsets));
    
    return value ? [value UIEdgeInsetsValue] : UIEdgeInsetsZero;
}

- (NSMutableDictionary *)events {
    id value = objc_getAssociatedObject(self, @selector(events));
    if (!value) {
        value = [NSMutableDictionary dictionary];
        objc_setAssociatedObject(self, @selector(events), value, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    
    return value;
}

@end
