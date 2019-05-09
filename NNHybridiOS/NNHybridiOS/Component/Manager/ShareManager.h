//
//  ShareManager.h
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ShareManager : NSObject

@property (nonatomic, copy) void (^completionHandler)(NSError *error);

- (instancetype)initWithTitle:(NSString *)title
                  description:(NSString *)description
                thumbImageUrl:(id)thumbImageUrl
                   webpageUrl:(NSString *)webpageUrl
                  sendMessage:(NSString *)message;

- (void)shareOnView:(UIView *)view currentViewController:(UIViewController *)vc;

@end

