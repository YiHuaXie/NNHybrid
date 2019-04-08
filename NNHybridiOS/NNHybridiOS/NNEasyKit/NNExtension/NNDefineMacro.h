//
//  NNDefineMacro.h
//  NNProject
//
//  Created by 谢翼华 on 2018/9/29.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#ifndef NNDefineMacro_h
#define NNDefineMacro_h

// nn_init...
#if !defined(NN_INITIALIZER)
#if __has_attribute(objc_method_family)
#define NN_INITIALIZER __attribute__((objc_method_family(init)))
#else
#define NN_INITIALIZER
#endif
#endif

// Log
#if     DEBUG
#define NNLog(fmt, ...)               NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
#else
#define NNLog(...)
#endif

//available
#define NN_IOS_AVAILABLE(num)          (@available(iOS num, *))

//block
#define NN_BLOCK_EXEC(block, ...)      if (block) { block(__VA_ARGS__); };

//weak and strong
#define NN_WEAK_SELF                   __weak __typeof(self) weakSelf = self
#define NN_STRONG_SELF                 __strong __typeof(weakSelf) strongSelf = weakSelf

//iPhone full screen
#define NN_IS_ALL_SCREEN \
({\
    BOOL result = NO;\
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {\
        CGSize size = [UIScreen mainScreen].bounds.size;\
        CGFloat maxLength = size.width > size.height ? size.width : size.height;\
        if (maxLength >= 812.0f) \
            result = YES;\
    }\
    (result);\
})\

#endif /* NNDefineMacro_h */
