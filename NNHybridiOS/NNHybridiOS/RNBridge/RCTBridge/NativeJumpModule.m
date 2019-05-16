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
        UIViewController *viewController = [NativeJumpModule viewControllerWithName:page parameters:parameters];
        
        if (viewController) {
            UINavigationController *nav = (UINavigationController *)SharedApplication.keyWindow.rootViewController;
            
            isModal ?
            [nav.visibleViewController presentViewController:viewController animated:YES completion:nil] :
            [nav pushViewController:viewController animated:YES];
        }
    });
}

+ (UIViewController *)viewControllerWithName:(NSString *)name parameters:(NSDictionary *)parameters {
    Class tmpClass = NSClassFromString(name);
    
    if (![tmpClass isSubclassOfClass:UIViewController.class]) {
        return nil;
    }
    
    id instance = [tmpClass new];
    [parameters enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
        objc_property_t property = class_getProperty(tmpClass, [key cStringUsingEncoding:NSUTF8StringEncoding]);
        if (property) {
            const char *attrs = property_getAttributes(property);
            NSString *propertyAttributes = @(attrs);
            NSArray *attributeItems = [propertyAttributes componentsSeparatedByString:@","];
            
            if (![attributeItems containsObject:@"R"]) {
               [instance setValue:obj forKey:key];
            }
        }
    }];
    
    return instance;
}

@end
