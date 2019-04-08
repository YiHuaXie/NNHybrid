//
//  NSObject+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NSObject+NNExtension.h"
#import <objc/runtime.h>
#import <objc/message.h>

#pragma mark - NSObject+NNExtension

@implementation NSObject (NNExtension)

#pragma mark - Public

+ (NSString *)nn_classString {
    return NSStringFromClass(self.class);
}

- (NSString *)nn_classString {
    return self.class.nn_classString;
}

@end

#pragma mark - NSObject+MethodSwizzling

typedef NS_ENUM(NSUInteger, MethodType) {
    MethodTypeClass,
    MethodTypeInstance
};

@implementation NSObject (MethodSwizzling)

#pragma mark - Public

+ (void)nn_classMethodSwizzling:(SEL)originalSelector
               swizzledSelector:(SEL)swizzledSelector {
    [self nn_methodSwizzlingWithType:MethodTypeClass
                  originalSelector:originalSelector
                  swizzledSelector:swizzledSelector];
}

+ (void)nn_instanceMethodSwizzling:(SEL)originalSelector
                  swizzledSelector:(SEL)swizzledSelector {
    [self nn_methodSwizzlingWithType:MethodTypeInstance
                  originalSelector:originalSelector
                  swizzledSelector:swizzledSelector];
}

#pragma mark - Private

+ (void)nn_methodSwizzlingWithType:(MethodType)methodType
                originalSelector:(SEL)originalSelector
                swizzledSelector:(SEL)swizzledSelector {
    Class class = methodType == MethodTypeClass ? object_getClass((id)self) : [self class];
    
    Method originalMethod =
    methodType == MethodTypeClass ?
    class_getClassMethod(class, originalSelector) :
    class_getInstanceMethod(class, originalSelector);
    
    Method swizzledMethod =
    methodType == MethodTypeClass ?
    class_getClassMethod(class, swizzledSelector) :
    class_getInstanceMethod(class, swizzledSelector);
    
    BOOL didAddMethod =
    class_addMethod(class,
                    originalSelector,
                    method_getImplementation(swizzledMethod),
                    method_getTypeEncoding(swizzledMethod));
    
    didAddMethod ?
    class_replaceMethod(class,
                        swizzledSelector,
                        method_getImplementation(originalMethod),
                        method_getTypeEncoding(originalMethod)) :
    method_exchangeImplementations(originalMethod, swizzledMethod);
}

@end

#pragma mark - NSObject+KVOBlock

static void *NNObserverBlockContext = &NNObserverBlockContext;

typedef void (^NNObserverBlock) (id obj, NSString *keyPath, NSDictionary<NSKeyValueChangeKey,id> *change);

#pragma mark - Private Class

@interface _NNInternalObserver : NSObject

@property (nonatomic, assign) BOOL isObserving;
@property (nonatomic, weak) id observed;
@property (nonatomic, copy) NSString *keyPath;
@property (nonatomic, copy) NNObserverBlock observerBlock;

@end

@implementation _NNInternalObserver

#pragma mark - Init

- (instancetype)initWithObserved:(id)observed
                         keyPath:(NSString *)keyPath
                   observerBlock:(NNObserverBlock)observerBlock {
    if ((self = [super init])) {
        self.isObserving = NO;
        self.observed = observed;
        self.keyPath = keyPath;
        self.observerBlock = [observerBlock copy];
    }
    
    return self;
}

- (void)dealloc {
    if (self.keyPath) [self stopObserving];
}

#pragma mark - Helper

- (void)startObservingWithOptions:(NSKeyValueObservingOptions)options {
    @synchronized(self) {
        if (self.isObserving) return;
        
        [self.observed addObserver:self forKeyPath:self.keyPath options:options context:NNObserverBlockContext];
        
        self.isObserving = YES;
    }
}

- (void)stopObserving {
    NSParameterAssert(self.keyPath);
    
    @synchronized (self) {
        if (!self.isObserving) return;
        if (!self.observed) return;
        
        [self.observed removeObserver:self forKeyPath:self.keyPath context:NNObserverBlockContext];
        
        self.observed = nil;
        self.keyPath = nil;
        self.observerBlock = nil;
    }
}

#pragma mark - KVO

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    if (context != NNObserverBlockContext) return;
    
    @synchronized (self) {
        self.observerBlock(object, keyPath, change);
    }
}

@end

@interface NSObject()

/** save all observerBlock */
@property (nonatomic, strong, setter=nn_setObserverBlockMap:) NSMutableDictionary *nn_observerBlockMap;

@end

@implementation NSObject(KVOBlock)

/** 所有修改过dealloc方法的类 */
+ (NSMutableSet *)nn_observedClasses {
    static dispatch_once_t onceToken;
    static NSMutableSet *classes = nil;
    dispatch_once(&onceToken, ^{
        classes = [[NSMutableSet alloc] init];
    });
    
    return classes;
}

#pragma mark - Public

- (NSString *)nn_addObserverForKeyPath:(NSString *)keyPath
                               options:(NSKeyValueObservingOptions)options
                                  usingBlock:(void (^)(id obj, NSString *keyPath, NSDictionary *change))block {
    NSString *identifier = [NSProcessInfo processInfo].globallyUniqueString;
    [self nn_addObserverForKeyPath:keyPath identifier:identifier options:options block:block];
    
    return identifier;
}

- (void)nn_removeBlockObserverWithIdentifier:(NSString *)identifier {
    NSParameterAssert(identifier.length);
    
    NSMutableDictionary *dict;
    
    @synchronized (self) {
        dict = self.nn_observerBlockMap;
        if (!dict) return;
    }
    
    _NNInternalObserver *observer = dict[identifier];
    [observer stopObserving];
    [dict removeObjectForKey:identifier];
    if (dict.count == 0) self.nn_observerBlockMap = nil;
}


- (void)nn_removeAllBlockObservers {
    NSDictionary *dict;
    
    @synchronized (self) {
        dict = [self.nn_observerBlockMap copy];
        self.nn_observerBlockMap = nil;
    }
    
    [dict.allValues enumerateObjectsUsingBlock:^(_NNInternalObserver *obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [obj stopObserving];
    }];
}

#pragma mark - Core Method

/**
 KVO Block 实现
 
 @param keyPath     被观察的属性
 @param identifier  唯一标识符 用来标记内部观察者
 @param options     观察选项
 @param block       KVO Block
 */
- (void)nn_addObserverForKeyPath:(NSString *)keyPath
                      identifier:(NSString *)identifier
                         options:(NSKeyValueObservingOptions)options
                            block:(NNObserverBlock)block {
    NSParameterAssert(keyPath.length);
    NSParameterAssert(identifier.length);
    NSParameterAssert(block);
    
    Class classToSwizzle = self.class;
    NSMutableSet *classes = self.class.nn_observedClasses;
    @synchronized (classes) {
        NSString *className = NSStringFromClass(classToSwizzle);
        if (![classes containsObject:className]) {
            SEL deallocSelector = sel_registerName("dealloc");
            
            __block void (*originalDealloc)(__unsafe_unretained id, SEL) = NULL;
            
            id newDealloc = ^(__unsafe_unretained id objSelf) {
                [objSelf nn_removeAllBlockObservers];
                
                if (originalDealloc == NULL) {
                    struct objc_super superInfo = {
                        .receiver = objSelf,
                        .super_class = class_getSuperclass(classToSwizzle)
                    };
                    
                    void (*msgSend)(struct objc_super *, SEL) = (__typeof__(msgSend))objc_msgSendSuper;
                    msgSend(&superInfo, deallocSelector);
                } else {
                    originalDealloc(objSelf, deallocSelector);
                }
            };
            
            IMP newDeallocIMP = imp_implementationWithBlock(newDealloc);
            
            if (!class_addMethod(classToSwizzle, deallocSelector, newDeallocIMP, "v@:")) {
                Method deallocMethod = class_getInstanceMethod(classToSwizzle, deallocSelector);
                originalDealloc = (void(*)(__unsafe_unretained id, SEL))method_getImplementation(deallocMethod);
                originalDealloc = (void(*)(__unsafe_unretained id, SEL))method_setImplementation(deallocMethod, newDeallocIMP);
            }
            
            [classes addObject:className];
        }
    }
    
    _NNInternalObserver *observer = [[_NNInternalObserver alloc] initWithObserved:self
                                                                          keyPath:keyPath
                                                                    observerBlock:block];
    [observer startObservingWithOptions:options];
    
    @synchronized (self) {
        if (!self.nn_observerBlockMap) self.nn_observerBlockMap = [NSMutableDictionary dictionary];
    }
    
    self.nn_observerBlockMap[identifier] = observer;
}

#pragma mark - Setter & Getter

- (void)nn_setObserverBlockMap:(NSMutableDictionary *)nn_observerBlockMap {
    objc_setAssociatedObject(self, @selector(nn_observerBlockMap), nn_observerBlockMap, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSMutableDictionary *)nn_observerBlockMap {
    return objc_getAssociatedObject(self, @selector(nn_observerBlockMap));
}

@end
