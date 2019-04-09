//
//  AppDelegatePluginManager.m
//  MYRoom
//
//  Created by 谢翼华 on 2018/4/17.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "AppDelegatePluginManager.h"
#import "SystemConfigPlugin.h"

static AppDelegatePluginManager *_manager = nil;

@interface AppDelegatePluginManager()

@property (nonatomic, copy) NSArray *plugins;
@property (nonatomic, copy) NSDictionary *notificationMap;

@end

@implementation AppDelegatePluginManager

#pragma mark - Init

+ (instancetype)sharedManager {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _manager = [AppDelegatePluginManager new];
    });
    
    return _manager;
}

- (void)dealloc {
    for (id<AppDelegatePlugin> target in self.plugins) {
        nn_notificationRemoveObserver(target);
    }
}

#pragma mark - Public

- (void)launch {
    self.plugins = @[[SystemConfigPlugin new]];

    for (id<AppDelegatePlugin> target in self.plugins) {
        [target launch];
        
        for (NSString *key in self.notificationMap.allKeys) {
            NSString *selectorString = self.notificationMap[key];
            SEL selector = NSSelectorFromString(selectorString);
            
            if ([target respondsToSelector:selector]) {
                nn_notificationAdd(target, selector, key, nil);
            }
        }
    }
}

#pragma mark - Getter

- (NSDictionary *)notificationMap {
    if (!_notificationMap) {
        SEL didFinishLaunching = @selector(applicationDidFinishLaunchingWithNotification:);
        SEL willResignActive = @selector(applicationWillResignActiveWithNotification:);
        SEL didEnterBackground = @selector(applicationDidEnterBackgroundWithNotification:);
        SEL willEnterForeground = @selector(applicationWillEnterForegroundWithNotification:);
        SEL didBecomeActive = @selector(applicationDidBecomeActiveWithNotification:);
        SEL willTerminate = @selector(applicationWillTerminateWithNotification:);
        SEL receiveMemoryWarning = @selector(applicationDidReceiveMemoryWarningWithNotification:);
        SEL receiveLocalNotification = @selector(applicationDidReceiveLocalNotificationWithNotification:);
        SEL registerForRemoteNotifications = @selector(applicationDidRegisterForRemoteNotificationsWithNotification:);
        SEL receiveRemoteNotification = @selector(applicationDidReceiveRemoteNotificationWithNotification:);
        
        _notificationMap = @{UIApplicationDidFinishLaunchingNotification : NSStringFromSelector(didFinishLaunching),
                             UIApplicationWillResignActiveNotification : NSStringFromSelector(willResignActive),
                             UIApplicationDidEnterBackgroundNotification : NSStringFromSelector(didEnterBackground),
                             UIApplicationWillEnterForegroundNotification : NSStringFromSelector(willEnterForeground),
                             UIApplicationDidBecomeActiveNotification : NSStringFromSelector(didBecomeActive),
                             UIApplicationWillTerminateNotification : NSStringFromSelector(willTerminate),
                             UIApplicationDidReceiveMemoryWarningNotification : NSStringFromSelector(receiveMemoryWarning),
                             UIApplicationDidReceiveLocalNotification : NSStringFromSelector(receiveLocalNotification),
                             UIApplicationDidRegisterForRemoteNotification : NSStringFromSelector(registerForRemoteNotifications),
                             UIApplicationDidReceiveRemoteNotification : NSStringFromSelector(receiveRemoteNotification)};
    }
    
    return _notificationMap;
}

@end
