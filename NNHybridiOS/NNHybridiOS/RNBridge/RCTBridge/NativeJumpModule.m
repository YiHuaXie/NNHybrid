//
//  NativeJumpModule.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/11.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NativeJumpModule.h"
#import "AddressOnMapViewController.h"

@implementation NativeJumpModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(jumpToNativePage:(NSString *)page parameters:(NSDictionary *)parameters isModal:(BOOL)isModal) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *viewController = nil;
        if ([page isEqualToString:@"AddressOnMapViewController"]) {
            AddressOnMapViewController *vc = [AddressOnMapViewController new];
            vc.address = parameters[@"address"];
            vc.name = parameters[@"name"];
            vc.longitude = [parameters[@"longitude"] doubleValue];
            vc.latitude = [parameters[@"latitude"] doubleValue];
            
            viewController = vc;
        }
        
        
        UINavigationController *nav = (UINavigationController *)SharedApplication.keyWindow.rootViewController;
        
        isModal ?
        [nav.visibleViewController presentViewController:viewController animated:YES completion:nil] :
        [nav pushViewController:viewController animated:YES];
    });
}

@end
