//
//  RNContainerViewController.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/11.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "RNContainerViewController.h"
#import <React/RCTRootView.h>

@interface RNContainerViewController ()

@end

@implementation RNContainerViewController

#pragma mark - Lifecycle

- (void)viewDidLoad {
    [super viewDidLoad];
    
//    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://192.168.2.13:8081/index.bundle?platform=ios"];
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://127.0.0.1:8081/index.bundle?platform=ios"];
    //手动拼接jsCodeLocation用于开发环境
    //       jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"]; //release之后从包中读取名为main的静态js bundle
//        NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil]; // 通过RCTBundleURLProvider生成，用于开发环境
    self.view = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                            moduleName:@"App"
                                     initialProperties:nil
                                         launchOptions:nil];
    self.view.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
}

@end
