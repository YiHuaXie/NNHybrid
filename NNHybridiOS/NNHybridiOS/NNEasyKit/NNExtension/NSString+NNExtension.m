//
//  NSString+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/8/15.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NSString+NNExtension.h"
#import <CommonCrypto/CommonDigest.h>
#import <stdarg.h>

@implementation NSString (NNExtension)

- (NSString *)nn_md5 {
    const char *cStr = [self UTF8String];
    unsigned char result[16];
    CC_MD5(cStr, (CC_LONG)strlen(cStr), result);
    return [NSString stringWithFormat:
            @"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",
            result[0], result[1], result[2], result[3],
            result[4], result[5], result[6], result[7],
            result[8], result[9], result[10], result[11],
            result[12], result[13], result[14], result[15]];
}

- (NSString *)nn_sha1 {
    const char *cstr = [self cStringUsingEncoding:NSUTF8StringEncoding];
    NSData *data = [NSData dataWithBytes:cstr length:self.length];
    
    uint8_t digest[CC_SHA1_DIGEST_LENGTH];
    CC_SHA1(data.bytes, (CC_LONG)data.length, digest);
    
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_SHA1_DIGEST_LENGTH * 2];
    
    for(int i = 0; i < CC_SHA1_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02x", digest[i]];
    
    return output;
}

#pragma mark - Filter

- (NSString *)nn_trimming {
    return [self stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
}

#pragma mark - Judgment

- (BOOL)nn_isNotNilOrBlank {
    return [self nn_trimming].length > 0;
}

- (BOOL)nn_isPureInt {
    NSScanner *scan = [NSScanner scannerWithString:self];
    int val;
    
    return [scan scanInt:&val] && [scan isAtEnd];
}

- (BOOL)nn_isPureFloat {
    NSScanner *scan = [NSScanner scannerWithString:self];
    float val;
    
    return [scan scanFloat:&val] && [scan isAtEnd];
}

- (BOOL)nn_isEmail {
    NSString *emailRegex = @"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}";
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    
    return [emailTest evaluateWithObject:self];
}

#pragma mark - Height

+ (NSString *)nn_stringWithStrings:(NSArray<NSString *> *)strings
                    joinedByString:(NSString *)joinedByString {
    NSMutableArray *tmp = [NSMutableArray array];
    [strings enumerateObjectsUsingBlock:^(NSString * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if (obj.length) [tmp addObject:obj];
    }];
    
    return [tmp componentsJoinedByString:joinedByString];
}

#pragma mark - Width

+ (CGFloat)nn_widthWithString:(NSString *)string
                    maxHeight:(CGFloat)maxHeight
                   attributes:(NSDictionary *)attributes {
    if (!string.length) return 0.0;
    
    CGFloat labelWidth = [string boundingRectWithSize:CGSizeMake(MAXFLOAT, maxHeight)
                                              options:NSStringDrawingUsesFontLeading | NSStringDrawingUsesLineFragmentOrigin
                                           attributes:attributes
                                              context:nil].size.width;
    
    return labelWidth;
}

#pragma mark - Height

+ (CGFloat)nn_heightWithAttributedString:(NSAttributedString *)attributedString
                                maxWidth:(CGFloat)maxWidth {
    if (!attributedString) return 0.0;
    
    NSStringDrawingOptions options = NSStringDrawingUsesFontLeading | NSStringDrawingUsesLineFragmentOrigin;
    CGFloat height = [attributedString boundingRectWithSize:CGSizeMake(maxWidth, MAXFLOAT)
                                                         options:options
                                                         context:nil].size.height;
    
    return height;
}

@end
