//
//  NSObject+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>

@interface NSObject (NNExtension)

/** 类名*/
+ (NSString *)nn_classString;
/** 对象名*/
- (NSString *)nn_classString;

@end

@interface NSObject(MethodSwizzling)

/**
 *  对类方法进行方法交叉
 *
 *  @param originalSelector 原始方法
 *  @param swizzledSelector 新的交叉方法
 */
+ (void)nn_classMethodSwizzling:(SEL)originalSelector
               swizzledSelector:(SEL)swizzledSelector;

/**
 *  对实例方法进行方法交叉
 *
 *  @param originalSelector 原始方法
 *  @param swizzledSelector 新的交叉方法
 */
+ (void)nn_instanceMethodSwizzling:(SEL)originalSelector
                  swizzledSelector:(SEL)swizzledSelector;

@end

@interface NSObject(KVOBlock)

- (NSString *)nn_addObserverForKeyPath:(NSString *)keyPath
                               options:(NSKeyValueObservingOptions)options
                            usingBlock:(void (^)(id obj, NSString *keyPath, NSDictionary *change))block;

- (void)nn_removeBlockObserverWithIdentifier:(NSString *)identifier;
- (void)nn_removeAllBlockObservers;

@end



