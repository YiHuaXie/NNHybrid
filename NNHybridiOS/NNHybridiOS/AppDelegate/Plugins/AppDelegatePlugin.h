//
//  AppDelegatePlugin.h
//  MYRoom
//
//  Created by 谢翼华 on 2018/4/17.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>

//#define UIApplicationDidReceiveLocalNotification        @"UIApplicationDidReceiveLocalNotification"
//#define UIApplicationDidRegisterForRemoteNotification   @"UIApplicationDidRegisterForRemoteNotification"
//#define UIApplicationDidReceiveRemoteNotification       @"UIApplicationDidReceiveRemoteNotification"

static ConstString UIApplicationDidReceiveLocalNotification = @"UIApplicationDidReceiveLocalNotification";
static ConstString UIApplicationDidRegisterForRemoteNotification = @"UIApplicationDidRegisterForRemoteNotification";
static ConstString UIApplicationDidReceiveRemoteNotification =     @"UIApplicationDidReceiveRemoteNotification";

@protocol AppDelegatePlugin <NSObject>

@required

- (void)launch;//启动插件

@optional

- (void)applicationDidFinishLaunchingWithNotification:(NSNotification *)notification;
- (void)applicationWillResignActiveWithNotification:(NSNotification *)notification;
- (void)applicationDidEnterBackgroundWithNotification:(NSNotification *)notification;
- (void)applicationWillEnterForegroundWithNotification:(NSNotification *)notification;
- (void)applicationDidBecomeActiveWithNotification:(NSNotification *)notification;
- (void)applicationWillTerminateWithNotification:(NSNotification *)notification;
- (void)applicationDidReceiveMemoryWarningWithNotification:(NSNotification *)notification;
- (void)applicationDidReceiveLocalNotificationWithNotification:(NSNotification *)notification;
- (void)applicationDidRegisterForRemoteNotificationsWithNotification:(NSNotification *)notification;
- (void)applicationDidReceiveRemoteNotificationWithNotification:(NSNotification *)notification;

@end
