//
//  CADisplayLink+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "CADisplayLink+NNExtension.h"
#import <objc/message.h>

@interface _NNWeakLinkTarget: NSObject

@property (nonatomic, weak) CADisplayLink *link;
@property (nonatomic, weak) id target;
@property (nonatomic, assign) SEL selector;

@end

@implementation _NNWeakLinkTarget

- (void)linkAction {
    if (self.target) {
        void (*linkAction_msgSend)(id, SEL, CADisplayLink *) = (typeof(linkAction_msgSend))objc_msgSend;
        linkAction_msgSend(self.target, self.selector, self.link);
    } else {
        [self.link invalidate];
    }
}

@end

@implementation CADisplayLink (NNExtension)

+ (CADisplayLink *)nn_displayLinkWithWeakTarget:(id)weakTarget selector:(SEL)sel {
    if (!weakTarget) {
        return nil;
    }

    if (![weakTarget respondsToSelector:sel]) {
        return nil;
    }

    _NNWeakLinkTarget *tmpTarget = [_NNWeakLinkTarget new];
    tmpTarget.target = weakTarget;
    tmpTarget.selector = sel;

    CADisplayLink *link = [CADisplayLink displayLinkWithTarget:tmpTarget selector:@selector(linkAction)];
    tmpTarget.link = link;

    return link;
}
@end
