//
//  UIColor+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/8/23.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UIColor+NNExtension.h"

static NSCache *nn_colorCache = nil;

@implementation UIColor (NNExtension)

- (CGFloat)nn_red {
    CGFloat r = 0.0;
    [self getRed:&r green:0 blue:0 alpha:0];
    
    return r;
}

- (CGFloat)nn_green {
    CGFloat g = 0.0;
    [self getRed:0 green:&g blue:0 alpha:0];
    
    return g;
}

- (CGFloat)nn_blue {
    CGFloat b = 0.0;
    [self getRed:0 green:0 blue:&b alpha:0];
    
    return b;
}

- (CGFloat)nn_alpha {
    CGFloat a;
    [self getRed:0 green:0 blue:0 alpha:&a];
    
    return a;
}

+ (instancetype)nn_colorWithHex:(int)hex {
    return [self nn_colorWithHex:hex alpha:1.0];
}

+ (instancetype)nn_colorWithHex:(int)hex alpha:(float)alpha {
    int r =  (hex & 0xFF0000) >> 16;
    int g = (hex & 0xFF00) >> 8;
    int b = hex & 0xFF;
    
    UIColor *color = [UIColor colorWithRed:((float)r / 255.0f)
                                     green:((float)g / 255.0f)
                                      blue:((float)b / 255.0f)
                                     alpha:alpha];
    
    return color;
}

+ (UIColor *)nn_colorWithHexString:(NSString *)hexString {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        nn_colorCache = [NSCache new];
    });
    
    hexString = [hexString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
    
    if (hexString.length < 6) {
        return nil;
    }
    
    if ([hexString hasPrefix:@"#"]) {
        hexString = [hexString substringFromIndex:1];
    }
    
    if ([hexString hasPrefix:@"0x"]) {
        hexString = [hexString substringFromIndex:2];
    }
    
    UIColor *cacheColor = [nn_colorCache objectForKey:hexString];
    if (cacheColor) {
        return cacheColor;
    }
    
    NSRange range = NSMakeRange(0, 2);
    NSString *rs = [hexString substringWithRange:range];
    range.location = 2;
    NSString *gs = [hexString substringWithRange:range];
    range.location = 4;
    NSString *bs = [hexString substringWithRange:range];
    
    unsigned int r, g, b, a;
    [[NSScanner scannerWithString:rs] scanHexInt:&r];
    [[NSScanner scannerWithString:gs] scanHexInt:&g];
    [[NSScanner scannerWithString:bs] scanHexInt:&b];
    
    if ([hexString length] == 8) {
        range.location = 6;
        NSString *as = [hexString substringWithRange:range];
        [[NSScanner scannerWithString:as] scanHexInt:&a];
    } else {
        a = 255;
    }
    
    UIColor *color = [UIColor colorWithRed:((float)r / 255.0f)
                                     green:((float)g / 255.0f)
                                      blue:((float)b / 255.0f)
                                     alpha:((float)a / 255.0f)];
    
    [nn_colorCache setObject:color forKey:hexString];
    
    return color;
}

@end

