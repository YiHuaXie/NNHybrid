//
//  NSString+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/8/15.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface NSString (NNExtension)

- (NSString *)nn_md5;
- (NSString *)nn_sha1;

- (NSString *)nn_trimming;

- (BOOL)nn_isNotNilOrBlank;
- (BOOL)nn_isPureInt;
- (BOOL)nn_isPureFloat;
- (BOOL)nn_isEmail;

+ (NSString *)nn_stringWithStrings:(NSArray<NSString *> *)strings
                         joinedByString:(NSString *)joinedByString;

+ (CGFloat)nn_widthWithString:(NSString *)string
                maxHeight:(CGFloat)maxHeight
                attributes:(NSDictionary *)attributes;

+ (CGFloat)nn_heightWithAttributedString:(NSAttributedString *)attributedString
                                maxWidth:(CGFloat)maxWidth;

@end
