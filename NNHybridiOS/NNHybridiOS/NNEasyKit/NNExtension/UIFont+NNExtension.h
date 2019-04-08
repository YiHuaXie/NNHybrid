//
//  UIFont+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/8/15.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSUInteger, NNFontWeight) {
    NNFontWeightUltraLight,
    NNFontWeightThin,
    NNFontWeightLight,
    NNFontWeightRegular,
    NNFontWeightMedium,
    NNFontWeightSemibold,
    NNFontWeightBold,
    NNFontWeightHeavy,
    NNFontWeightBlack
};

@interface UIFont (NNExtension)

+ (UIFont *)nn_systemFontOfSize:(CGFloat)fontSize fontWeight:(NNFontWeight)fontWeight;

@end

static inline UIFont* nn_regularFontSize(CGFloat fontSize) {
    return [UIFont nn_systemFontOfSize:fontSize fontWeight:NNFontWeightRegular];
}

static inline UIFont* nn_mediumFontSize(CGFloat fontSize) {
    return [UIFont nn_systemFontOfSize:fontSize fontWeight:NNFontWeightMedium];
}

static inline UIFont* nn_lightFontSize(CGFloat fontSize) {
    return [UIFont nn_systemFontOfSize:fontSize fontWeight:NNFontWeightLight];
}

static inline UIFont* nn_blodFontSize(CGFloat fontSize) {
    return [UIFont nn_systemFontOfSize:fontSize fontWeight:NNFontWeightBold];
}
