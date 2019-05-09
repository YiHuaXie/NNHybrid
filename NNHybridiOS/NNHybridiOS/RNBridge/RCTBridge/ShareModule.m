//
//  ShareModule.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "ShareModule.h"
#import "ShareManager.h"

@implementation ShareModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(shareWithParameters:(NSDictionary *)paramters) {
    dispatch_async(dispatch_get_main_queue(), ^{
       ShareManager *manager = [[ShareManager alloc] initWithTitle:paramters[@"title"]
                                description:paramters[@"description"]
                              thumbImageUrl:paramters[@"thumbImageUrl"]
                                 webpageUrl:paramters[@"webpageUrl"]
                                sendMessage:paramters[@"messages"]];
        [manager shareOnView:SharedApplication.keyWindow
       currentViewController:nil];
    });
}

@end
