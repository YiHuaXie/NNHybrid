//
//  NNGlobalHelper.m
//  NNProject
//
//  Created by 谢翼华 on 2018/9/18.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNGlobalHelper.h"
#import <objc/runtime.h>
#import <sys/utsname.h>
#include <sys/sysctl.h>

#import "NNDefineMacro.h"

#import "NSString+NNExtension.h"
#import "UIColor+NNExtension.h"
#import "UIFont+NNExtension.h"

#define MainBundle                   [NSBundle mainBundle]
#define CurrentDevice                [UIDevice currentDevice]

#pragma mark - Make Sure

NSString* nn_makeSureString(NSString *string) {
    if ([string isKindOfClass:NSString.class]) {
        return string;
    }
    
    if ([string isKindOfClass:NSNumber.class]) {
        return [(NSNumber *)string stringValue];
    }
    
    return @"";
}

NSDictionary* nn_makeSureDictionary(NSDictionary *dict) {
    return [dict isKindOfClass:NSDictionary.class] ? dict : @{};
}

NSArray* nn_makeSureArray(NSArray *array) {
    return [array isKindOfClass:NSArray.class] ? array : @[];
}

#pragma mark - Cancel Dispatch After

NNDispatchDelayBlock nn_dispatch_delay(NSTimeInterval delay, dispatch_queue_t queue, dispatch_block_t block) {
    if (!block) {
        return nil;
    }
    
    __block dispatch_block_t blockCopy = [block copy];
    __block NNDispatchDelayBlock delayBlockCopy = nil;
    
    NNDispatchDelayBlock delayBlock = ^(BOOL cancel) {
        if (!cancel && blockCopy) {
            blockCopy();
        }
        
        blockCopy = nil;
        delayBlockCopy = nil;
    };
    
    delayBlockCopy = [delayBlock copy];
    
    dispatch_time_t when = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC));
    dispatch_after(when, queue, ^{
        NN_BLOCK_EXEC(delayBlockCopy, NO);
    });
    
    return delayBlockCopy;
}

void nn_dispatch_cancel(NNDispatchDelayBlock block) {
    NN_BLOCK_EXEC(block, YES);
}

#pragma mark - Weak Associated Object

@interface _NNWeakAssociatedWrapper : NSObject

@property (nonatomic, weak) id associatedObject;

@end

@implementation _NNWeakAssociatedWrapper

@end

void nn_objc_setWeakAssociatedObject(id object, const void * key, id value) {
    _NNWeakAssociatedWrapper *wrapper = objc_getAssociatedObject(object, key);
    if (!wrapper) {
        wrapper = [_NNWeakAssociatedWrapper new];
        objc_setAssociatedObject(object, key, wrapper, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    wrapper.associatedObject = value;
}

id nn_objc_getWeakAssociatedObject(id object, const void * key) {
    id wrapper = objc_getAssociatedObject(object, key);
    
    id objc = wrapper && [wrapper isKindOfClass:_NNWeakAssociatedWrapper.class] ?
    [(_NNWeakAssociatedWrapper *)wrapper associatedObject] :
    nil;
    
    return objc;
}

#pragma mark - APP Information

NSString* nn_deviceName(void) {
    return [UIDevice currentDevice].name;
}

NSString* nn_deviceModel(void) {
    return [UIDevice currentDevice].model;
}

NSString* nn_systemVersion(void) {
    return [UIDevice currentDevice].systemVersion;
}

NSString* nn_deviceModelName(void) {
    size_t size;
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);
    char *machine = malloc(size);
    sysctlbyname("hw.machine", machine, &size, NULL, 0);
    NSString *platform = [NSString stringWithUTF8String:machine];
    free(machine);
    
    if ([platform isEqualToString:@"iPhone1,1"])    return @"iPhone 1G";
    if ([platform isEqualToString:@"iPhone1,2"])    return @"iPhone 3G";
    if ([platform isEqualToString:@"iPhone2,1"])    return @"iPhone 3GS";
    if ([platform isEqualToString:@"iPhone3,1"])    return @"iPhone 4";
    if ([platform isEqualToString:@"iPhone3,3"])    return @"iPhone 4";
    if ([platform isEqualToString:@"iPhone4,1"])    return @"iPhone 4S";
    if ([platform isEqualToString:@"iPhone5,1"])    return @"iPhone 5";
    if ([platform isEqualToString:@"iPhone5,2"])    return @"iPhone 5";
    if ([platform isEqualToString:@"iPhone5,3"])    return @"iPhone 5c";
    if ([platform isEqualToString:@"iPhone5,4"])    return @"iPhone 5c";
    if ([platform isEqualToString:@"iPhone6,1"])    return @"iPhone 5s";
    if ([platform isEqualToString:@"iPhone6,2"])    return @"iPhone 5s";
    if ([platform isEqualToString:@"iPhone7,2"])    return @"iPhone 6";
    if ([platform isEqualToString:@"iPhone7,1"])    return @"iPhone 6 Plus";
    if ([platform isEqualToString:@"iPhone8,1"])    return @"iPhone 6s";
    if ([platform isEqualToString:@"iPhone8,2"])    return @"iPhone 6s Plus";
    if ([platform isEqualToString:@"iPhone8,4"])    return @"iPhone SE";
    if ([platform isEqualToString:@"iPhone9,1"])    return @"iPhone 7";
    if ([platform isEqualToString:@"iPhone9,3"])    return @"iPhone 7";
    if ([platform isEqualToString:@"iPhone10,1"])   return @"iPhone 8";
    if ([platform isEqualToString:@"iPhone10,4"])   return @"iPhone 8";
    if ([platform isEqualToString:@"iPhone10,2"])   return @"iPhone 8 Plus";
    if ([platform isEqualToString:@"iPhone10,5"])   return @"iPhone 8 Plus";
    if ([platform isEqualToString:@"iPhone10,3"])   return @"iPhone X";
    if ([platform isEqualToString:@"iPhone10,6"])   return @"iPhone X";
    if ([platform isEqualToString:@"iPod1,1"])      return @"iPod Touch 1";
    if ([platform isEqualToString:@"iPod2,1"])      return @"iPod Touch 2";
    if ([platform isEqualToString:@"iPod3,1"])      return @"iPod Touch 3";
    if ([platform isEqualToString:@"iPod4,1"])      return @"iPod Touch 4";
    if ([platform isEqualToString:@"iPod5,1"])      return @"iPod Touch 5";
    if ([platform isEqualToString:@"iPod7,1"])      return @"iPod Touch 6";
    if ([platform isEqualToString:@"iPad1,1"])      return @"iPad";
    if ([platform isEqualToString:@"iPad2,1"])      return @"iPad 2";
    if ([platform isEqualToString:@"iPad2,2"])      return @"iPad 2";
    if ([platform isEqualToString:@"iPad2,3"])      return @"iPad 2";
    if ([platform isEqualToString:@"iPad2,4"])      return @"iPad 2";
    if ([platform isEqualToString:@"iPad2,5"])      return @"iPad Mini";
    if ([platform isEqualToString:@"iPad2,6"])      return @"iPad Mini";
    if ([platform isEqualToString:@"iPad2,7"])      return @"iPad Mini";
    if ([platform isEqualToString:@"iPad3,1"])      return @"iPad 3";
    if ([platform isEqualToString:@"iPad3,2"])      return @"iPad 3";
    if ([platform isEqualToString:@"iPad3,3"])      return @"iPad 3";
    if ([platform isEqualToString:@"iPad3,4"])      return @"iPad 4";
    if ([platform isEqualToString:@"iPad3,5"])      return @"iPad 4";
    if ([platform isEqualToString:@"iPad3,6"])      return @"iPad 4";
    if ([platform isEqualToString:@"iPad4,1"])      return @"iPad Air";
    if ([platform isEqualToString:@"iPad4,2"])      return @"iPad Air";
    if ([platform isEqualToString:@"iPad4,3"])      return @"iPad Air";
    if ([platform isEqualToString:@"iPad4,4"])      return @"iPad Mini 2";
    if ([platform isEqualToString:@"iPad4,5"])      return @"iPad Mini 2";
    if ([platform isEqualToString:@"iPad4,6"])      return @"iPad Mini 2";
    if ([platform isEqualToString:@"iPad5,3"])      return @"iPad Air 2";
    if ([platform isEqualToString:@"iPad6,11"])     return @"iPad 5";
    if ([platform isEqualToString:@"iPad6,12"])     return @"iPad 5";
    if ([platform isEqualToString:@"iPad6,12"])     return @"iPad 5";
    if ([platform isEqualToString:@"iPad7,5"])      return @"iPad 6";
    if ([platform isEqualToString:@"iPad7,6"])      return @"iPad 6";
    if ([platform isEqualToString:@"iPad4,7"])      return @"iPad Mini 3";
    if ([platform isEqualToString:@"iPad4,8"])      return @"iPad Mini 3";
    if ([platform isEqualToString:@"iPad4,9"])      return @"iPad Mini 3";
    if ([platform isEqualToString:@"iPad5,1"])      return @"iPad Mini 4";
    if ([platform isEqualToString:@"iPad5,2"])      return @"iPad Mini 4";
    if ([platform isEqualToString:@"iPad6,3"])      return @"iPad Pro 9.7 Inch";
    if ([platform isEqualToString:@"iPad6,4"])      return @"iPad Pro 9.7 Inch";
    if ([platform isEqualToString:@"iPad6,7"])      return @"iPad Pro 12.9 Inch";
    if ([platform isEqualToString:@"iPad6,8"])      return @"iPad Pro 12.9 Inch";
    if ([platform isEqualToString:@"iPad7,1"])      return @"iPad Pro 12.9 Inch 2. Generation";
    if ([platform isEqualToString:@"iPad7,2"])      return @"iPad Pro 12.9 Inch 2. Generation";
    if ([platform isEqualToString:@"iPad7,3"])      return @"iPad Pro 10.5 Inch";
    if ([platform isEqualToString:@"iPad7,4"])      return @"iPad Pro 10.5 Inch";
    if ([platform isEqualToString:@"i386"])         return @"Simulator";
    if ([platform isEqualToString:@"x86_64"])       return @"Simulator";
    
    return platform;
}

NSString* nn_appName(void) {
    return [NSBundle mainBundle].infoDictionary[@"CFBundleDisplayName"];
}

NSString* nn_appVersion(void) {
    return [NSBundle mainBundle].infoDictionary[@"CFBundleShortVersionString"];
}

NSString* nn_appBuildVersion(void) {
    return [NSBundle mainBundle].infoDictionary[@"CFBundleVersion"];
}

