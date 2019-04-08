//
//  UIView+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/9/7.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UIView+NNExtension.h"
#import "NSString+NNExtension.h"
#import "NSObject+NNExtension.h"
#import <objc/runtime.h>

@implementation UIView (NNExtension)

- (UIView *)nn_viewWithStringTag:(NSString *)stringTag {
    if (![stringTag nn_isNotNilOrBlank]) {
        return nil;
    }
    
    for (UIView *subView in self.subviews) {
        if ([stringTag isEqualToString:subView.nn_stringTag]) {
            return subView;
        }
    }
    
    return nil;
}

+ (instancetype)nn_createWithNib {
    return [[NSBundle mainBundle] loadNibNamed:self.nn_classString
                                         owner:nil
                                       options:nil].firstObject;
}

- (UIImage *)nn_snapshot {
    UIGraphicsBeginImageContextWithOptions(self.bounds.size, self.opaque, [UIScreen mainScreen].scale);
    CGContextRef context = UIGraphicsGetCurrentContext();
    if ([self isKindOfClass:UIScrollView.class]) {
        UIScrollView *tmp = (UIScrollView *)self;
        CGContextTranslateCTM(context, 0.0f, -tmp.contentOffset.y);
    }
    [self.layer renderInContext:context];
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return image;
}

#pragma mark - Setter & Getter

- (void)nn_setOrigin:(CGPoint)nn_origin {
    CGRect frame = self.frame;
    frame.origin = nn_origin;
    self.frame = frame;
}

- (CGPoint)nn_origin {
    return self.frame.origin;
}

- (void)nn_setX:(CGFloat)nn_x {
    CGRect frame = self.frame;
    frame.origin.x = nn_x;
    self.frame = frame;
}

- (CGFloat)nn_x {
    return self.frame.origin.x;
}

- (void)nn_setY:(CGFloat)nn_y {
    CGRect frame = self.frame;
    frame.origin.y = nn_y;
    self.frame = frame;
}

- (CGFloat)nn_y {
    return self.frame.origin.y;
}

- (void)nn_setSize:(CGSize)nn_size {
    CGRect frame = self.frame;
    frame.size = nn_size;
    self.frame = frame;
}

- (CGSize)nn_size {
    return self.frame.size;
}

- (void)nn_setWidth:(CGFloat)nn_width {
    CGRect frame = self.frame;
    frame.size.width = nn_width;
    self.frame = frame;
}

- (CGFloat)nn_width {
    return self.frame.size.width;
}

- (void)nn_setHeight:(CGFloat)nn_height {
    CGRect frame = self.frame;
    frame.size.height = nn_height;
    self.frame = frame;
}

- (CGFloat)nn_height {
    return self.frame.size.height;
}

- (void)nn_setCenterX:(CGFloat)nn_centerX {
    CGPoint center = self.center;
    center.x = nn_centerX;
    self.center = center;
}

- (CGFloat)nn_centerX {
    return self.center.x;
}

- (void)nn_setCenterY:(CGFloat)nn_centerY {
    CGPoint center = self.center;
    center.y = nn_centerY;
    self.center = center;
}

- (CGFloat)nn_centerY {
    return self.center.y;
}

- (void)nn_setStringTag:(NSString *)nn_stringTag {
    objc_setAssociatedObject(self,
                             @selector(nn_stringTag),
                             nn_stringTag,
                             OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (NSString *)nn_stringTag {
    return objc_getAssociatedObject(self, @selector(nn_stringTag));
}

@end
