//
//  UIView+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/9/7.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (NNExtension)

@property (nonatomic, assign, setter=nn_setOrigin:) CGPoint nn_origin;
@property (nonatomic, assign, setter=nn_setX:) CGFloat nn_x;
@property (nonatomic, assign, setter=nn_setY:) CGFloat nn_y;
@property (nonatomic, assign, setter=nn_setSize:) CGSize  nn_size;
@property (nonatomic, assign, setter=nn_setWidth:) CGFloat nn_width;
@property (nonatomic, assign, setter=nn_setHeight:) CGFloat nn_height;
@property (nonatomic, assign, setter=nn_setCenterX:) CGFloat nn_centerX;
@property (nonatomic, assign, setter=nn_setCenterY:) CGFloat nn_centerY;

@property (nonatomic, copy, setter=nn_setStringTag:) NSString *nn_stringTag;

/**
 Get a subview through the stringTag
 
 @param stringTag subview's stringTag
 @return a subview
 */
- (UIView *)nn_viewWithStringTag:(NSString *)stringTag;

/**
 Create a view from a nib
 
 @return UIView
 */
+ (instancetype)nn_createWithNib;

/**
 Snapshot, scroll view only captures the visible part
 
 @return UIImage
 */
- (UIImage *)nn_snapshot;

@end
