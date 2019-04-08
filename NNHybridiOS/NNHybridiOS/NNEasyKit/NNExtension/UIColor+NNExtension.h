//
//  UIColor+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/8/23.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIColor (NNExtension)

- (CGFloat)nn_red;
- (CGFloat)nn_green;
- (CGFloat)nn_blue;
- (CGFloat)nn_alpha;

/**
 hex to Color
 
 @param hex             0xFFFFFF
 */
+ (UIColor *)nn_colorWithHex:(int)hex;

/**
 hex to Color
 
 @param hex             0xFFFFFF
 @param alpha           0 ~ 1
 */
+ (UIColor *)nn_colorWithHex:(int)hex alpha:(float)alpha;

/**
 * hexString to Color
 *
 * @param hexString     support FFFFFF 0xFFFFFF #FFFFFF 0xFFFFFFFF #FFFFFFFF
 */
+ (UIColor *)nn_colorWithHexString:(NSString *)hexString;

@end

static inline UIColor* nn_rgb(CGFloat r, CGFloat g, CGFloat b) {
   return [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:1.0];
}

static inline UIColor* nn_rgba(CGFloat r, CGFloat g, CGFloat b, CGFloat a) {
    return [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:a];
}

static inline UIColor* nn_colorHexString(NSString *hexString) {
    return [UIColor nn_colorWithHexString:hexString];
}

static inline UIColor* nn_colorHex(int hex) {
    return [UIColor nn_colorWithHex:hex];
}

