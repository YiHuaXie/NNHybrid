//
//  UIControl+NNExtension.h
//  NNProject
//
//  Created by NeroXie on 2018/11/22.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIControl (NNExtension)

/** Expand the click area of ​​the UIControl */
@property (nonatomic, assign, setter=nn_setEnlargedEdgeInsets:) UIEdgeInsets nn_enlargedEdgeInsets;

- (void)nn_addEventHandler:(void (^)(id sender))handler
          forControlEvents:(UIControlEvents)controlEvents;

- (void)nn_removeEventHandlersForControlEvents:(UIControlEvents)controlEvents;

- (BOOL)nn_hasEventHandlersForControlEvents:(UIControlEvents)controlEvents;

@end
