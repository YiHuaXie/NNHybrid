//
//  AppDelegatePluginManager.h
//  MYRoom
//
//  Created by 谢翼华 on 2018/4/17.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AppDelegatePlugin.h"

#define SharedAppDelegatePluginManager  [AppDelegatePluginManager sharedManager]

@interface AppDelegatePluginManager : NSObject

+ (instancetype)sharedManager;

- (void)launch;

@end
