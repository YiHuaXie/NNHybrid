//
//  NNPinYin.h
//  NNProject
//
//  Created by NeroXie on 2019/1/11.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NNPinYin : NSObject

/**
 * 中文转全拼，例如“你好”，返回“NIHAO”
 * 如果是英文，例如“string”，返回“STRING”
 */
+ (NSString *)quanPinWithString:(NSString *)string;

/*
 * 获取汉字拼音的首字母, 返回的字母是大写形式, 例如: @"你好", 返回 @"N"
 * 如果字符串开头不是汉字, 而是字母, 则直接返回该字母, 例如: @"n你好", 返回 @"N"
 * 如果字符串开头不是汉字和字母, 则直接返回 @"#", 例如: @"&你好", 返回 @"#"
 * 字符串开头有特殊字符(空格,换行)不影响判定, 例如@"       n你好", 返回 @"N"
 */
+ (NSString *)firstLetterWithString:(NSString *)string;

/**
 * 拼音首字母缩写，例如“你好”，返回“NH”
 * 如果是英文，例如“string”，返回“STRING”
 * 如果是中文混英文的，例如“xx你好啊xx”，返回“NHA”
 */
+ (NSString *)allFirstLetterWithString:(NSString *)string;

@end

static inline NSString *nn_quanPin(NSString *string) {
    return [NNPinYin quanPinWithString:string];
}

static inline NSString *nn_firstLetter(NSString *string) {
    return [NNPinYin firstLetterWithString:string];
}

static inline NSString *nn_allFirstLetter(NSString *string) {
    return [NNPinYin allFirstLetterWithString:string];
}

