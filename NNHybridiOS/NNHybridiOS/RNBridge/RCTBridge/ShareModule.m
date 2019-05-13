//
//  ShareModule.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "ShareModule.h"
#import "ShareManager.h"

@interface ShareModule()

@property (nonatomic, strong) ShareManager *shareManager;

@end

@implementation ShareModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(shareWithParameters:(NSDictionary *)paramters) {
    dispatch_async(dispatch_get_main_queue(), ^{
        ShareManager *manager = [[ShareManager alloc] initWithTitle:paramters[@"title"]
                                                        description:paramters[@"description"]
                                                              image:paramters[@"image"]
                                                             webUrl:paramters[@"webUrl"]
                                                            message:paramters[@"message"]];
        UINavigationController *nav =
        (UINavigationController *)SharedApplication.keyWindow.rootViewController;
        
        [manager showInView:SharedApplication.keyWindow currentViewController:nav.visibleViewController];
    });
}

@end
