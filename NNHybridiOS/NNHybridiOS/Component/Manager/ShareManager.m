//
//  ShareManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "ShareManager.h"

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

static NSDictionary *_shareTypeMap = nil;

@interface ShareManager ()

//@property (nonatomic, strong) UMSocialMessageObject *messageObject;
@property(nonatomic, copy) NSString *shareTitle;
@property(nonatomic, copy) NSString *shareDescription;
@property(nonatomic, copy) NSString *shareLink;
@property(nonatomic, strong) id thumbImageUrl;
@property(nonatomic, copy) NSString *shareMessage;

@property(nonatomic, copy) NSArray<BHBItem *> *shareItems;
@property (nonatomic, copy) NSDictionary *shareTypeMap;

//@property (nonatomic, strong) UIViewController *currentVc;
//@property (nonatomic, strong) MFMessageComposeViewController *message;

@end

@implementation ShareManager

- (instancetype)initWithTitle:(NSString *)title
                  description:(NSString *)description
                thumbImageUrl:(id)thumbImageUrl
                   webpageUrl:(NSString *)webpageUrl
                  sendMessage:(NSString *)message {
    if (self = [super init]) {
        
//        self.messageObject = [UMSocialMessageObject messageObject];
        self.shareTitle = title;
        self.shareDescription = description;
        self.shareLink = webpageUrl;
        self.thumbImageUrl = thumbImageUrl;
        self.shareMessage = message;
    }

    return self;
}

- (void)shareOnView:(UIView *)view currentViewController:(UIViewController *)vc {
    WEAK_SELF;
    
    [BHBPopView showToView:view withItems:self.shareItems andSelectBlock:^(BHBItem *item) {
        switch ([weakSelf.shareTypeMap[item.title] integerValue]) {
            case ShareTypeMessage:
                return ;
            case ShareTypeCopyLink:
                return;
            case ShareTypeWeibo:
                return;
            default:
                break;
        }
//        if (item.shareType == FHTShareTypeMessage) {
//           
//        }
//        if (item.shareType == FHTShareTypeCopyLink) {
//            [self copyLink];
//            return ;
//        }
//        if (item.shareType == FHTShareTypeWeibo) {
//            [self shareToSina];
//            return ;
//        }
//        UMSocialPlatformType type = UMSocialPlatformType_UnKnown;
//        if (item.shareType == FHTShareTypeWeChatFriends) {
//            type = UMSocialPlatformType_WechatTimeLine;
//        }else if (item.shareType == FHTShareTypeWechat) {
//            type = UMSocialPlatformType_WechatSession;
//        }else if (item.shareType == FHTShareTypeQQ) {
//            type = UMSocialPlatformType_QQ;
//        }
//        if (type == UMSocialPlatformType_UnKnown) {
//            return ;
//        }
//        UMShareWebpageObject *object = [UMShareWebpageObject shareObjectWithTitle:self.shareTitle descr:self.ShareDes thumImage:self.thumbImageUrl];
//        object.webpageUrl =self.shareLink;
//        self.messageObject.shareObject = object;
//        [self shareToPlatform:type];
    }];
}

#pragma mark - Getter

- (NSArray<BHBItem *> *)shareItems {
    if (_shareItems == nil) {
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
        _shareTypeMap = @{
                          @"朋友圈": @(ShareTypeMoments),
                          @"微信好友": @(ShareTypeWechat),
                          @"新浪微博": @(ShareTypeWeibo),
                          @"QQ好友": @(ShareTypeQQ),
                          @"复制链接": @(ShareTypeCopyLink),
                          @"短信": @(ShareTypeMessage)
                          };
    }
    
    return _shareTypeMap;
}

@end
