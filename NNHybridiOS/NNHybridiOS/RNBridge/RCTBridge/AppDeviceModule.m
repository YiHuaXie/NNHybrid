//
//  AppDeviceModule.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/3/27.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "AppDeviceModule.h"
#import <NNEasyKit/NNGlobalHelper.h>
#import <NNEasyKit/NNDefineMacro.h>

@implementation AppDeviceModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(appVersion:(RCTResponseSenderBlock)callBack) {
    NN_BLOCK_EXEC(callBack, @[nn_appVersion()]);
}

RCT_EXPORT_METHOD(deviceModelName:(RCTResponseSenderBlock)callBack) {
    NN_BLOCK_EXEC(callBack, @[nn_deviceModelName()]);
}

RCT_EXPORT_METHOD(systemVersion:(RCTResponseSenderBlock)callBack) {
    NN_BLOCK_EXEC(callBack, @[nn_systemVersion()]);
}

@end
