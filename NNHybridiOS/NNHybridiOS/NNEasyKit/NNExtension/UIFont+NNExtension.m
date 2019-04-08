//
//  UIFont+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/8/15.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UIFont+NNExtension.h"
#import "NNDefineMacro.h"

static NSDictionary *nn_newFontMap = nil;
static NSDictionary *nn_oldFontMap = nil;

@implementation UIFont (NNExtension)

+ (UIFont *)nn_systemFontOfSize:(CGFloat)fontSize fontWeight:(NNFontWeight)fontWeight {
    UIFont *font = nil;
    
    if NN_IOS_AVAILABLE(8.2) {
        if (!nn_newFontMap) {
            nn_newFontMap = @{@(NNFontWeightUltraLight): @(UIFontWeightUltraLight),
                              @(NNFontWeightThin): @(UIFontWeightThin),
                              @(NNFontWeightLight): @(UIFontWeightLight),
                              @(NNFontWeightRegular): @(UIFontWeightRegular),
                              @(NNFontWeightMedium): @(UIFontWeightMedium),
                              @(NNFontWeightSemibold): @(UIFontWeightSemibold),
                              @(NNFontWeightBold): @(UIFontWeightBold),
                              @(NNFontWeightHeavy): @(UIFontWeightHeavy),
                              @(NNFontWeightBlack): @(UIFontWeightBlack)};
        }
        
        NSNumber *fontWeightNumber = nn_newFontMap[@(fontWeight)] ?: [NSNumber numberWithFloat:UIFontWeightRegular];
        font = [UIFont systemFontOfSize:fontSize weight:fontWeightNumber.floatValue];
    } else {
        if (!nn_oldFontMap) {
            nn_oldFontMap = @{@(NNFontWeightUltraLight): @"HelveticaNeue-UltraLight",
                              @(NNFontWeightThin): @"HelveticaNeue-Thin",
                              @(NNFontWeightLight): @"HelveticaNeue-Light",
                              @(NNFontWeightRegular): @"HelveticaNeue",
                              @(NNFontWeightMedium): @"HelveticaNeue-Medium",
                              @(NNFontWeightSemibold): @"Helvetica-Bold",
                              @(NNFontWeightBold): @"HelveticaNeue-Bold",
                              @(NNFontWeightHeavy): @"HelveticaNeue-CondensedBold",
                              @(NNFontWeightBlack): @"HelveticaNeue-CondensedBlack"};
        }
        
        NSString *fontName = nn_oldFontMap[@(fontWeight)] ?: @"HelveticaNeue";
        font = [UIFont fontWithName:fontName size:fontSize];
    }
    
    return font ?: [UIFont systemFontOfSize:fontSize];
}

@end


