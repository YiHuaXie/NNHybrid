//
//  NNGlobalHelper.h
//  NNProject
//
//  Created by 谢翼华 on 2018/9/18.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NSString *const ConstString;
FOUNDATION_EXPORT

#pragma mark - Typedef Block

typedef void(^NNVoidBlock)(void);
typedef void(^NNBoolBlock)(BOOL boolValue);
typedef void(^NNErrorBlock)(NSError *error);
typedef void(^NNSenderBlock)(id sender);
typedef void(^NNIndexBlock)(NSInteger index);
typedef void(^NNIndexPathBlock)(NSIndexPath *indexPath);
typedef void(^NNDateBlock)(NSDate *date);

#pragma mark - MakeSure

NSString* nn_makeSureString(NSString *string);
NSDictionary* nn_makeSureDictionary(NSDictionary *dict);
NSArray* nn_makeSureArray(NSArray *array);

#pragma mark - Cancel Dispatch After

typedef void (^NNDispatchDelayBlock) (BOOL cancel);

NNDispatchDelayBlock nn_dispatch_delay(NSTimeInterval delay, dispatch_queue_t queue, dispatch_block_t block);
void nn_dispatch_cancel(NNDispatchDelayBlock block);

#pragma mark - Weak Associated Object

void nn_objc_setWeakAssociatedObject(id object, const void * key, id value);
id nn_objc_getWeakAssociatedObject(id object, const void * key);

#pragma mark - APP Information

NSString* nn_deviceName(void);
NSString* nn_deviceModel(void);
NSString* nn_deviceModelName(void);
NSString* nn_systemVersion(void);

NSString* nn_appName(void);
NSString* nn_appVersion(void);
NSString* nn_appBuildVersion(void);

#pragma mark - Notification

static inline void nn_notificationAdd(id anObserver, SEL aSEL, NSString *notiName, id anObj) {
    [[NSNotificationCenter defaultCenter] addObserver:anObserver selector:aSEL name:notiName object:anObj];
}

static inline void nn_notificationRemoveObserver(id anObserver) {
    [[NSNotificationCenter defaultCenter] removeObserver:anObserver];
}

static inline void nn_notificationRemove(id anObserver, NSString *notiName, id anObj) {
    [[NSNotificationCenter defaultCenter] removeObserver:anObserver name:notiName object:anObj];
}

static inline void nn_notificationPost(NSString *notifName, id anObj, id anUserInfo) {
    [[NSNotificationCenter defaultCenter] postNotificationName:notifName object:anObj userInfo:anUserInfo];
}

static inline void nn_notificationPostOnMainThread(NSString *notifName, id anObj, id anUserInfo) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] postNotificationName:notifName object:anObj userInfo:anUserInfo];
    });
}

#pragma mark - IndexPath

static inline NSIndexPath* nn_indexPathMake(NSInteger row, NSInteger section) {
    return [NSIndexPath indexPathForRow:row inSection:section];
}

#pragma mark - Error

static inline NSError *nn_errorMake(NSErrorDomain domain, NSInteger code, NSString *description) {
    NSDictionary *userInfo = nil;
    
    if (description.length > 0) {
        userInfo = @{NSLocalizedFailureReasonErrorKey: description,
                     NSLocalizedDescriptionKey: description};
    }
    
    return [NSError errorWithDomain:domain code:code userInfo:userInfo];
}

