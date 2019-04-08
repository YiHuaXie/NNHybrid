//
//  NNAlertView.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/25.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

@class NNAlertView;

extern const NSInteger kNNAlertViewTag;

typedef void (^NNAlertViewLayoutContentBlock)(UIView *contentView);

typedef NS_ENUM(NSUInteger, NNAlertViewAnimationType) {
    NNAlertViewAnimationTypeRaise,
    NNAlertViewAnimationTypeDrop,
    NNAlertViewAnimationTypeZoom,
    NNAlertViewAnimationTypeSnap,
};

@protocol NNAlertViewProtocol <NSObject>

@optional
- (void)alertViewWillAppear:(NNAlertView *)alertView;
- (void)alertViewDidAppear:(NNAlertView *)alertView;
- (void)alertViewWillDisappear:(NNAlertView *)alertView;
- (void)alertViewDidDisapperar:(NNAlertView *)alertView;

@end

@interface NNAlertView : UIView

@property (nonatomic, readonly, assign) BOOL displayed;

@property (nonatomic, assign) BOOL touchBackgroundToDismiss;
@property (nonatomic, assign) BOOL alertShadowHidden UI_APPEARANCE_SELECTOR;
@property (nonatomic, assign) CGSize alertShadowOffset UI_APPEARANCE_SELECTOR;
@property (nonatomic, assign) CGFloat alertCornerRadius UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIColor *alertShadowColor UI_APPEARANCE_SELECTOR;
@property (nonatomic, strong) UIColor *backgroundViewColor UI_APPEARANCE_SELECTOR;

@property (nonatomic, copy) NNAlertViewLayoutContentBlock layoutContentHandler;
@property (nonatomic, weak) id<NNAlertViewProtocol> delegate;

+ (instancetype)showAlertWithLayoutContent:(NNAlertViewLayoutContentBlock)layoutContentHandler;
+ (instancetype)showAlertWithLayoutContent:(NNAlertViewLayoutContentBlock)layoutContentHandler animationType:(NNAlertViewAnimationType)animationType;
+ (void)dismissAlert;

- (void)show;
- (void)showWithAnimationType:(NNAlertViewAnimationType)animationType;
- (void)showInView:(UIView *)view animationType:(NNAlertViewAnimationType)animationType;

- (void)dismiss;

@end
