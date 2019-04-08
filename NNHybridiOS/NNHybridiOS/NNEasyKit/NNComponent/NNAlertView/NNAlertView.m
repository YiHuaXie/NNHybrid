//
//  NNAlertView.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/25.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNAlertView.h"

#define NNKeyWindow     [UIApplication sharedApplication].keyWindow
#define NNScreenWidth   [UIScreen mainScreen].bounds.size.width
#define NNScreenHeight  [UIScreen mainScreen].bounds.size.height

static const NSTimeInterval kNNAlertAniamtionDuration = 0.3;
static const float kNNAlertAnimationSpringDamping = 0.6;
static const float kNNAlertAnimationSpringVelocity = 0;
const NSInteger kNNAlertViewTag = 901080;

@interface NNAlertView()

@property (nonatomic, assign) BOOL displayed;
@property (nonatomic, assign) NNAlertViewAnimationType animationType;

@property (nonatomic, strong) UIDynamicAnimator *dynamicAnimator;
@property (nonatomic, strong) UISnapBehavior *snapBehavior;

@property (nonatomic, strong) UIView *backgroundView;
@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, strong) UIView *contentView;
@property (nonatomic, strong) UIView *contentShadowView;

@property (nonatomic, strong) NSLayoutConstraint *containerViewCenterXConstraint;
@property (nonatomic, strong) NSLayoutConstraint *containerViewCenterYConstraint;

@end

@implementation NNAlertView

#pragma mark - Init

+ (instancetype)showAlertWithLayoutContent:(NNAlertViewLayoutContentBlock)layoutContentHandler {
    return [self showAlertWithLayoutContent:layoutContentHandler
                              animationType:NNAlertViewAnimationTypeRaise];
}

+ (instancetype)showAlertWithLayoutContent:(NNAlertViewLayoutContentBlock)layoutContentHandler animationType:(NNAlertViewAnimationType)animationType {
    NNAlertView *alertView = [[NNAlertView alloc] initWithFrame:CGRectZero];
    alertView.layoutContentHandler = layoutContentHandler;
    [alertView showWithAnimationType:animationType];
    
    return alertView;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self _setup];
    }
    
    return self;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - Private

- (void)_setup {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(_keyboardChanged:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(_keyboardChanged:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
    
    self.tag = kNNAlertViewTag;
    self.translatesAutoresizingMaskIntoConstraints = NO;
    self.displayed = NO;
    self.touchBackgroundToDismiss = YES;
    self.backgroundColor = [UIColor clearColor];
    
    self.backgroundView = [[UIView alloc] initWithFrame:CGRectZero];
    self.backgroundView.translatesAutoresizingMaskIntoConstraints = NO;
    self.backgroundView.backgroundColor = [UIColor clearColor];
    [self addSubview:self.backgroundView];
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                          action:@selector(_backgroundTapped:)];
    [self.backgroundView addGestureRecognizer:tap];
    
    self.contentShadowView = [[UIView alloc] initWithFrame:CGRectZero];
    self.contentShadowView.userInteractionEnabled =
    self.contentShadowView.translatesAutoresizingMaskIntoConstraints = NO;
    self.contentShadowView.layer.shadowOpacity = 1;
    self.contentShadowView.layer.shadowColor = [[UIColor lightGrayColor] colorWithAlphaComponent:0.3].CGColor;
    self.contentShadowView.layer.shadowOffset = CGSizeMake(1, 1);
    self.contentShadowView.hidden = NO;
    
    self.contentView = [[UIView alloc] initWithFrame:CGRectZero];
    self.contentView.clipsToBounds = YES;
    self.contentView.translatesAutoresizingMaskIntoConstraints = NO;
    self.contentView.backgroundColor = [UIColor whiteColor];
    self.contentView.layer.cornerRadius = 6.0;
    
    self.containerView = [[UIView alloc] initWithFrame:CGRectZero];
    self.containerView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.containerView addSubview:self.contentShadowView];
    [self.containerView addSubview:self.contentView];
    [self addSubview:self.containerView];
}

- (void)_layoutContent {
    NSLayoutConstraint *backgroundViewTopConstraint = [NSLayoutConstraint constraintWithItem:self.backgroundView
                                                                                   attribute:NSLayoutAttributeTop
                                                                                   relatedBy:NSLayoutRelationEqual
                                                                                      toItem:self
                                                                                   attribute:NSLayoutAttributeTop
                                                                                  multiplier:1
                                                                                    constant:0];
    NSLayoutConstraint *backgroundViewLeftConstraint = [NSLayoutConstraint constraintWithItem:self.backgroundView
                                                                                    attribute:NSLayoutAttributeLeft
                                                                                    relatedBy:NSLayoutRelationEqual
                                                                                       toItem:self
                                                                                    attribute:NSLayoutAttributeLeft
                                                                                   multiplier:1
                                                                                     constant:0];
    NSLayoutConstraint *backgroundViewRightConstraint = [NSLayoutConstraint constraintWithItem:self.backgroundView
                                                                                     attribute:NSLayoutAttributeRight
                                                                                     relatedBy:NSLayoutRelationEqual
                                                                                        toItem:self
                                                                                     attribute:NSLayoutAttributeRight
                                                                                    multiplier:1
                                                                                      constant:0];
    NSLayoutConstraint *backgroundViewBottomConstraint = [NSLayoutConstraint constraintWithItem:self.backgroundView
                                                                                      attribute:NSLayoutAttributeBottom
                                                                                      relatedBy:NSLayoutRelationEqual
                                                                                         toItem:self
                                                                                      attribute:NSLayoutAttributeBottom
                                                                                     multiplier:1
                                                                                       constant:0];
    [self addConstraints:@[backgroundViewTopConstraint, backgroundViewLeftConstraint, backgroundViewRightConstraint, backgroundViewBottomConstraint]];
    
    self.containerViewCenterXConstraint = [NSLayoutConstraint constraintWithItem:self.containerView
                                                                       attribute:NSLayoutAttributeCenterX
                                                                       relatedBy:NSLayoutRelationEqual
                                                                          toItem:self
                                                                       attribute:NSLayoutAttributeCenterX
                                                                      multiplier:1
                                                                        constant:0];
    self.containerViewCenterYConstraint = [NSLayoutConstraint constraintWithItem:self.containerView
                                                                       attribute:NSLayoutAttributeCenterY
                                                                       relatedBy:NSLayoutRelationEqual
                                                                          toItem:self
                                                                       attribute:NSLayoutAttributeCenterY
                                                                      multiplier:1
                                                                        constant:0];
    [self addConstraints:@[self.containerViewCenterXConstraint, self.containerViewCenterYConstraint]];
    
    NSLayoutConstraint *contentViewTopConstraint = [NSLayoutConstraint constraintWithItem:self.contentView
                                                                                attribute:NSLayoutAttributeTop
                                                                                relatedBy:NSLayoutRelationEqual
                                                                                   toItem:self.containerView
                                                                                attribute:NSLayoutAttributeTop
                                                                               multiplier:1
                                                                                 constant:0];
    NSLayoutConstraint *contentViewLeftConstraint = [NSLayoutConstraint constraintWithItem:self.contentView
                                                                                 attribute:NSLayoutAttributeLeft
                                                                                 relatedBy:NSLayoutRelationEqual
                                                                                    toItem:self.containerView
                                                                                 attribute:NSLayoutAttributeLeft
                                                                                multiplier:1
                                                                                  constant:0];
    NSLayoutConstraint *contentViewRightConstraint = [NSLayoutConstraint constraintWithItem:self.contentView
                                                                                  attribute:NSLayoutAttributeRight
                                                                                  relatedBy:NSLayoutRelationEqual
                                                                                     toItem:self.containerView
                                                                                  attribute:NSLayoutAttributeRight
                                                                                 multiplier:1
                                                                                   constant:0];
    NSLayoutConstraint *contentViewBottomConstraint = [NSLayoutConstraint constraintWithItem:self.contentView
                                                                                   attribute:NSLayoutAttributeBottom
                                                                                   relatedBy:NSLayoutRelationEqual
                                                                                      toItem:self.containerView
                                                                                   attribute:NSLayoutAttributeBottom
                                                                                  multiplier:1
                                                                                    constant:0];
    [self.containerView addConstraints:@[contentViewTopConstraint, contentViewLeftConstraint, contentViewRightConstraint, contentViewBottomConstraint]];
    
    if (self.layoutContentHandler) {
        self.layoutContentHandler(self.contentView);
    } else {
        self.layoutContentHandler = ^(UIView *contentView) {
            UILabel *titleLabel = [[UILabel alloc] initWithFrame:CGRectZero];
            UILabel *messageLabel = [[UILabel alloc] initWithFrame:CGRectZero];
            titleLabel.translatesAutoresizingMaskIntoConstraints =
            messageLabel.translatesAutoresizingMaskIntoConstraints = NO;
            titleLabel.textAlignment =
            messageLabel.textAlignment = NSTextAlignmentCenter;
            titleLabel.numberOfLines =
            messageLabel.numberOfLines = 0;
            titleLabel.preferredMaxLayoutWidth =
            messageLabel.preferredMaxLayoutWidth = NNScreenWidth - 60 - 30;
            titleLabel.lineBreakMode =
            messageLabel.lineBreakMode = NSLineBreakByWordWrapping;
            titleLabel.textColor = [UIColor blackColor];
            messageLabel.textColor = [UIColor blackColor];
            titleLabel.font = [UIFont fontWithName:@"AvenirNext-Regular" size:18];
            messageLabel.font = [UIFont fontWithName:@"AvenirNext-Regular" size:15];
            titleLabel.text = @"Welcome to use NNAlertView!";
            messageLabel.text = @"This is a custom view, it will appear when you didn't creat the alert content.";
            [contentView addSubview:titleLabel];
            [contentView addSubview:messageLabel];
            
            NSLayoutConstraint *titleCenterXConstraint = [NSLayoutConstraint constraintWithItem:titleLabel
                                                                                      attribute:NSLayoutAttributeCenterX
                                                                                      relatedBy:NSLayoutRelationEqual
                                                                                         toItem:contentView
                                                                                      attribute:NSLayoutAttributeCenterX
                                                                                     multiplier:1
                                                                                       constant:0];
            NSLayoutConstraint *titleTopConstraint = [NSLayoutConstraint constraintWithItem:titleLabel
                                                                                  attribute:NSLayoutAttributeTop
                                                                                  relatedBy:NSLayoutRelationEqual
                                                                                     toItem:contentView
                                                                                  attribute:NSLayoutAttributeTop
                                                                                 multiplier:1
                                                                                   constant:50];
            NSLayoutConstraint *labelMidConstraint = [NSLayoutConstraint constraintWithItem:titleLabel
                                                                                  attribute:NSLayoutAttributeBottom
                                                                                  relatedBy:NSLayoutRelationEqual
                                                                                     toItem:messageLabel
                                                                                  attribute:NSLayoutAttributeTop
                                                                                 multiplier:1
                                                                                   constant:-25];
            NSLayoutConstraint *messageCenterXConstraint = [NSLayoutConstraint constraintWithItem:messageLabel
                                                                                        attribute:NSLayoutAttributeCenterX
                                                                                        relatedBy:NSLayoutRelationEqual
                                                                                           toItem:contentView
                                                                                        attribute:NSLayoutAttributeCenterX
                                                                                       multiplier:1
                                                                                         constant:0];
            NSLayoutConstraint *messageBottomConstraint = [NSLayoutConstraint constraintWithItem:messageLabel
                                                                                       attribute:NSLayoutAttributeBottom
                                                                                       relatedBy:NSLayoutRelationEqual
                                                                                          toItem:contentView
                                                                                       attribute:NSLayoutAttributeBottom
                                                                                      multiplier:1
                                                                                        constant:-50];
            [contentView addConstraints:@[titleCenterXConstraint,
                                          titleTopConstraint,
                                          labelMidConstraint,
                                          messageCenterXConstraint,
                                          messageBottomConstraint]];
            
            NSLayoutConstraint *contentViewWidthConstraint = [NSLayoutConstraint constraintWithItem:contentView
                                                                                          attribute:NSLayoutAttributeWidth
                                                                                          relatedBy:NSLayoutRelationEqual
                                                                                             toItem:nil
                                                                                          attribute:NSLayoutAttributeWidth
                                                                                         multiplier:1
                                                                                           constant:NNScreenWidth - 60];
            [contentView addConstraint:contentViewWidthConstraint];
        };
        
        self.layoutContentHandler(self.contentView);
    }
    
    NSLayoutConstraint *shadowViewTopConstraint = [NSLayoutConstraint constraintWithItem:self.contentShadowView
                                                                               attribute:NSLayoutAttributeTop
                                                                               relatedBy:NSLayoutRelationEqual
                                                                                  toItem:self.contentView
                                                                               attribute:NSLayoutAttributeTop
                                                                              multiplier:1
                                                                                constant:0];
    NSLayoutConstraint *shadowViewLeftConstraint = [NSLayoutConstraint constraintWithItem:self.contentShadowView
                                                                                attribute:NSLayoutAttributeLeft
                                                                                relatedBy:NSLayoutRelationEqual
                                                                                   toItem:self.contentView
                                                                                attribute:NSLayoutAttributeLeft
                                                                               multiplier:1
                                                                                 constant:0];
    NSLayoutConstraint *shadowViewWidthConstraint = [NSLayoutConstraint constraintWithItem:self.contentShadowView
                                                                                 attribute:NSLayoutAttributeWidth
                                                                                 relatedBy:NSLayoutRelationEqual
                                                                                    toItem:self.contentView
                                                                                 attribute:NSLayoutAttributeWidth
                                                                                multiplier:1
                                                                                  constant:0];
    NSLayoutConstraint *shadowViewHeightConstraint = [NSLayoutConstraint constraintWithItem:self.contentShadowView
                                                                                  attribute:NSLayoutAttributeHeight
                                                                                  relatedBy:NSLayoutRelationEqual
                                                                                     toItem:self.contentView
                                                                                  attribute:NSLayoutAttributeHeight
                                                                                 multiplier:1
                                                                                   constant:0];
    [self.containerView addConstraints:@[shadowViewTopConstraint, shadowViewLeftConstraint, shadowViewWidthConstraint, shadowViewHeightConstraint]];
}

- (void)_backgroundTapped:(UIGestureRecognizer *)gestureRecognizer {
    if (self.touchBackgroundToDismiss) {
        [self dismiss];
    }
}

#pragma mark - Public

- (void)show {
    [self showWithAnimationType:NNAlertViewAnimationTypeRaise];
}

- (void)showWithAnimationType:(NNAlertViewAnimationType)animationType {
    [self showInView:NNKeyWindow animationType:animationType];
}

- (void)showInView:(UIView *)view animationType:(NNAlertViewAnimationType)animationType {
    if (self.displayed) {
        return;
    }
    
    [self _layoutContent];
    
    self.displayed = YES;
    self.animationType = animationType;
    
    [view addSubview:self];
    
    NSLayoutConstraint *topConstraint = [NSLayoutConstraint constraintWithItem:self
                                                                     attribute:NSLayoutAttributeTop
                                                                     relatedBy:NSLayoutRelationEqual
                                                                        toItem:view
                                                                     attribute:NSLayoutAttributeTop
                                                                    multiplier:1
                                                                      constant:0];
    NSLayoutConstraint *leftConstraint = [NSLayoutConstraint constraintWithItem:self
                                                                      attribute:NSLayoutAttributeLeft
                                                                      relatedBy:NSLayoutRelationEqual
                                                                         toItem:view
                                                                      attribute:NSLayoutAttributeLeft
                                                                     multiplier:1
                                                                       constant:0];
    NSLayoutConstraint *rightConstraint = [NSLayoutConstraint constraintWithItem:self
                                                                       attribute:NSLayoutAttributeRight
                                                                       relatedBy:NSLayoutRelationEqual
                                                                          toItem:view
                                                                       attribute:NSLayoutAttributeRight
                                                                      multiplier:1
                                                                        constant:0];
    NSLayoutConstraint *bottomConstraint = [NSLayoutConstraint constraintWithItem:self
                                                                        attribute:NSLayoutAttributeBottom
                                                                        relatedBy:NSLayoutRelationEqual
                                                                           toItem:view
                                                                        attribute:NSLayoutAttributeBottom
                                                                       multiplier:1
                                                                         constant:0];
    [view addConstraints:@[topConstraint, leftConstraint, rightConstraint, bottomConstraint]];
    
    [self layoutIfNeeded];
    
    self.contentShadowView.layer.shadowPath = [UIBezierPath bezierPathWithRoundedRect:self.contentShadowView.bounds
                                                                         cornerRadius:self.alertCornerRadius].CGPath;
    
    if ([self.delegate respondsToSelector:@selector(alertViewWillAppear:)]) {
        [self.delegate alertViewWillAppear:self];
    }
    
    self.backgroundView.alpha = 0;
    [UIView animateWithDuration:kNNAlertAniamtionDuration animations:^{
        self.backgroundView.alpha = 1;
    } completion:^(BOOL finished) {
        if ([self.delegate respondsToSelector:@selector(alertViewDidAppear:)]) {
            [self.delegate alertViewDidAppear:self];
        }
    }];
    
    switch (animationType) {
        case NNAlertViewAnimationTypeRaise: {
            self.containerViewCenterYConstraint.constant = view.frame.size.height / 2 + self.containerView.bounds.size.height / 2;
            [self layoutIfNeeded];
            self.containerViewCenterYConstraint.constant = 0;
            [UIView animateWithDuration:kNNAlertAniamtionDuration
                                  delay:0
                 usingSpringWithDamping:kNNAlertAnimationSpringDamping
                  initialSpringVelocity:kNNAlertAnimationSpringVelocity
                                options:UIViewAnimationOptionCurveLinear
                             animations:^{
                                 [self layoutIfNeeded];
                             }
                             completion:nil];
        }
            break;
        case NNAlertViewAnimationTypeDrop: {
            self.containerViewCenterYConstraint.constant = -view.frame.size.height / 2 - self.containerView.bounds.size.height / 2;
            [self layoutIfNeeded];
            self.containerViewCenterYConstraint.constant = 0;
            [UIView animateWithDuration:kNNAlertAniamtionDuration
                                  delay:0
                 usingSpringWithDamping:kNNAlertAnimationSpringDamping
                  initialSpringVelocity:kNNAlertAnimationSpringVelocity
                                options:UIViewAnimationOptionCurveLinear
                             animations:^{
                                 [self layoutIfNeeded];
                             }
                             completion:nil];
        }
            break;
        case NNAlertViewAnimationTypeZoom: {
            self.contentView.transform = CGAffineTransformScale(self.contentView.transform, 0.1, 0.1);
            self.contentShadowView.transform = CGAffineTransformScale(self.contentShadowView.transform, 0.1, 0.1);
            [UIView animateWithDuration:kNNAlertAniamtionDuration
                                  delay:0
                 usingSpringWithDamping:kNNAlertAnimationSpringDamping
                  initialSpringVelocity:kNNAlertAnimationSpringVelocity
                                options:UIViewAnimationOptionCurveLinear
                             animations:^{
                                 self.contentView.transform = CGAffineTransformScale(self.contentView.transform, 10, 10);
                                 self.contentShadowView.transform = CGAffineTransformScale(self.contentShadowView.transform, 10, 10);
                             }
                             completion:nil];
        }
            break;
        case NNAlertViewAnimationTypeSnap: {
            self.containerViewCenterYConstraint.constant = -view.frame.size.height / 2 - self.containerView.bounds.size.height / 2;
            [self layoutIfNeeded];
            
            self.dynamicAnimator = [[UIDynamicAnimator alloc] initWithReferenceView:self];
            self.snapBehavior = [[UISnapBehavior alloc] initWithItem:self.containerView snapToPoint:view.center];
            self.snapBehavior.damping = 0.5;
            [self.dynamicAnimator addBehavior:self.snapBehavior];
            
            self.containerViewCenterYConstraint.constant = 0;
            [self layoutIfNeeded];
        }
            break;
    }
}

- (void)dismiss {
    if (!self.displayed) {
        return;
    }
    
    if ([self.delegate respondsToSelector:@selector(alertViewWillDisappear:)]) {
        [self.delegate alertViewWillDisappear:self];
    }
    
    switch (self.animationType) {
        case NNAlertViewAnimationTypeZoom: {
            [UIView animateWithDuration:kNNAlertAniamtionDuration animations:^{
                self.containerView.transform = CGAffineTransformScale(self.containerView.transform, 0.01, 0.01);
            }];
        }
            break;
            
        default: {
            [self.dynamicAnimator removeAllBehaviors];
            self.containerViewCenterYConstraint.constant = self.superview.frame.size.height / 2 + self.containerView.bounds.size.height / 2;
            [UIView animateWithDuration:kNNAlertAniamtionDuration animations:^{
                [self layoutIfNeeded];
            }];
        }
            break;
    }
    
    [UIView animateWithDuration:kNNAlertAniamtionDuration animations:^{
        self.backgroundView.alpha = 0;
    } completion:^(BOOL finished) {
        if (finished) {
            if ([self.delegate respondsToSelector:@selector(alertViewDidDisapperar:)]) {
                [self.delegate alertViewDidDisapperar:self];
            }
            
            [self removeFromSuperview];
            self.displayed = NO;
        }
    }];
}

+ (void)dismissAlert {
    NNAlertView *alertView = [NNKeyWindow viewWithTag:kNNAlertViewTag];
    if (alertView) {
        [alertView dismiss];
    }
}

#pragma mark - Notification

- (void)_keyboardChanged:(NSNotification *)notification {
    if (notification.name == UIKeyboardWillShowNotification) {
        self.containerViewCenterYConstraint.constant = -100;
    } else {
        self.containerViewCenterYConstraint.constant = 0;
    }
    
    [UIView animateWithDuration:kNNAlertAniamtionDuration animations:^{
        [self layoutIfNeeded];
    }];
}

#pragma mark - Getter & Setter

- (void)setBackgroundViewColor:(UIColor *)backgroundViewColor {
    _backgroundViewColor = backgroundViewColor;
    self.backgroundView.backgroundColor = backgroundViewColor;
}

- (void)setAlertShadowHidden:(BOOL)alertShadowHidden {
    _alertShadowHidden = alertShadowHidden;
    self.contentShadowView.hidden = alertShadowHidden;
}

- (void)setAlertShadowColor:(UIColor *)alertShadowColor {
    _alertShadowColor = alertShadowColor;
    self.contentShadowView.layer.shadowColor = alertShadowColor.CGColor;
}

- (void)setAlertCornerRadius:(CGFloat)alertCornerRadius {
    _alertCornerRadius = alertCornerRadius;
    self.contentView.layer.cornerRadius = alertCornerRadius;
}

- (void)setAlertShadowOffset:(CGSize)alertShadowOffset {
    _alertShadowOffset = alertShadowOffset;
    self.contentShadowView.layer.shadowOffset = alertShadowOffset;
}

@end
