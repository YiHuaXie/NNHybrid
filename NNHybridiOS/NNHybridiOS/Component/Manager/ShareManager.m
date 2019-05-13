//
//  ShareManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "ShareManager.h"
#import "NNProgressHUD.h"
#import <MessageUI/MessageUI.h>
#import <objc/runtime.h>

#import "BHBPopView.h"
#import "BHBItem.h"

typedef NS_ENUM(NSInteger, ShareType) {
    ShareTypeMoments,
    ShareTypeWechat,
    ShareTypeWeibo,
    ShareTypeQQ,
    ShareTypeCopyLink,
    ShareTypeMessage
};

const ConstString kShareManager = @"kShareManager";

@interface ShareManager () <MFMessageComposeViewControllerDelegate>

@property (nonatomic, copy) NSString *shareTitle;
@property (nonatomic, copy) NSString *shareDescription;
@property (nonatomic, copy) NSString *shareLink;
@property (nonatomic, strong) id shareImage;
@property (nonatomic, copy) NSString *shareMessage;

@property (nonatomic, copy) NSArray<BHBItem *> *shareItems;
@property (nonatomic, copy) NSDictionary *shareTypeMap;

@property (nonatomic, weak) UIViewController *associatedViewController;

@end

@implementation ShareManager

- (void)dealloc {
    NNLog(@"%@ dealloc", self.class);
}

- (instancetype)initWithTitle:(NSString *)title
                  description:(NSString *)description
                     image:(id)image
                       webUrl:(NSString *)webeUrl
                      message:(NSString *)message {
    if (self = [super init]) {
        self.shareTitle = title;
        self.shareDescription = description;
        self.shareLink = webeUrl;
        self.shareImage = image;
        self.shareMessage = message;
    }

    return self;
}

- (void)showInView:(UIView *)view currentViewController:(UIViewController *)vc {
    [BHBPopView showToView:view withItems:self.shareItems andSelectBlock:^(BHBItem *item) {
        switch ([self.shareTypeMap[item.title] integerValue]) {
            case ShareTypeMessage: {
                if ([MFMessageComposeViewController canSendText]) {
                    self.associatedViewController = vc;
                    objc_setAssociatedObject(vc, &kShareManager, self, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
                    
                    MFMessageComposeViewController *message = [[MFMessageComposeViewController alloc] init];
                    message.messageComposeDelegate = self;
                    message.body = self.shareMessage;
                    message.recipients = nil;
                    
                    [vc presentViewController:message animated:YES completion:nil];
                } else {
                    [NNProgressHUD nn_showInfoWindowWithText:@"该设备没有短信功能"];
                }
            }
                return ;
            case ShareTypeCopyLink: {
                UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
                pasteboard.string = self.shareLink;
                [NNProgressHUD nn_showDoneWindowWithText:@"复制成功"];
            }
                return;
            case ShareTypeWeibo:
                return;
            default:
                break;
        }
    }];
}

#pragma mark - MFMessageComposeViewControllerDelegate

- (void)messageComposeViewController:(MFMessageComposeViewController *)controller
                 didFinishWithResult:(MessageComposeResult)result {
    NN_WEAK_SELF;
    
    [controller dismissViewControllerAnimated:YES completion:^{
        objc_setAssociatedObject(weakSelf.associatedViewController,
                                 &kShareManager,
                                 nil,
                                 OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }];
}

#pragma mark - Getter

- (NSArray<BHBItem *> *)shareItems {
    if (!_shareItems) {
        BHBItem *item0 = [[BHBItem alloc] initWithTitle:@"朋友圈" Icon:@"icon_share_wechat_moments"];
        BHBItem *item1 = [[BHBItem alloc] initWithTitle:@"微信好友" Icon:@"icon_share_wechat"];
        BHBItem *item2 = [[BHBItem alloc] initWithTitle:@"新浪微博" Icon:@"icon_share_weibo"];
        BHBItem *item3 = [[BHBItem alloc] initWithTitle:@"QQ好友" Icon:@"icon_share_QQ"];
        BHBItem *item4 = [[BHBItem alloc] initWithTitle:@"复制链接" Icon:@"icon_share_link"];
        BHBItem *item5 = [[BHBItem alloc] initWithTitle:@"短信" Icon:@"icon_share_message"];
        
        _shareItems = @[item0, item1, item2, item3, item4, item5];
        
    }
    
    return _shareItems;
}

- (NSDictionary *)shareTypeMap {
    if (!_shareTypeMap) {
        _shareTypeMap = @{@"朋友圈": @(ShareTypeMoments),
                          @"微信好友": @(ShareTypeWechat),
                          @"新浪微博": @(ShareTypeWeibo),
                          @"QQ好友": @(ShareTypeQQ),
                          @"复制链接": @(ShareTypeCopyLink),
                          @"短信": @(ShareTypeMessage)};
    }
    
    return _shareTypeMap;
}

@end
