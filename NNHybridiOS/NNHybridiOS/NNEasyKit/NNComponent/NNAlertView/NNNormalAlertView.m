//
//  NNNormalAlertView.m
//  NNAlertView
//
//  Created by 谢翼华 on 2018/3/21.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNNormalAlertView.h"

#define NNScreenWidth   [UIScreen mainScreen].bounds.size.width
#define NNScreenHeight  [UIScreen mainScreen].bounds.size.height
#define NNNormalAlertViewWidth  (NNScreenWidth - 96)

static const CGFloat kLineThickness = 0.5;
static const CGFloat kButtonHeight = 50.0;

@interface NNNormalAlertView ()

@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *messageLabel;
@property (nonatomic, strong) UIView *buttonContainerView;
@property (nonatomic, strong) UIButton *cancelButton;
@property (nonatomic, copy) NSArray *otherButtons;

@property (nonatomic, strong) NSLayoutConstraint *imageViewBottomConstraint;
@property (nonatomic, strong) NSLayoutConstraint *titleLabelBottomConstraint;
@property (nonatomic, strong) NSLayoutConstraint *messageLabelBottomConstraint;

@property (nonatomic, copy) NNNormalAlertViewButtonBlock buttonHandler;

@end

@implementation NNNormalAlertView

#pragma mark - Init

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle {
    return [self showAlertWithTitle:title
                            message:message
                  cancelButtonTitle:cancelButtonTitle
                      animationType:NNAlertViewAnimationTypeRaise];
}

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                     animationType:(NNAlertViewAnimationType)animationType {
    return [self showAlertWithTitle:title
                            message:message
                  cancelButtonTitle:cancelButtonTitle
                  otherButtonTitles:nil
                      animationType:animationType
                      buttonHandler:nil];
}

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler {
    return [self showAlertWithTitle:title
                            message:message
                  cancelButtonTitle:cancelButtonTitle
                  otherButtonTitles:otherButtonTitles
                      animationType:NNAlertViewAnimationTypeRaise
                      buttonHandler:buttonHandler];
}

+ (instancetype)showAlertWithTitle:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     animationType:(NNAlertViewAnimationType)animationType
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler {
    return [self showAlertWithImage:nil
                              title:title
                            message:message
                  cancelButtonTitle:cancelButtonTitle
                  otherButtonTitles:otherButtonTitles
                      animationType:animationType
                      buttonHandler:buttonHandler];
}

+ (instancetype)showAlertWithImage:(UIImage *)image
                             title:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler {
    return [self showAlertWithImage:image
                              title:title
                            message:message
                  cancelButtonTitle:cancelButtonTitle
                  otherButtonTitles:otherButtonTitles
                      animationType:NNAlertViewAnimationTypeRaise
                      buttonHandler:buttonHandler];
}

+ (instancetype)showAlertWithImage:(UIImage *)image
                             title:(NSString *)title
                           message:(NSString *)message
                 cancelButtonTitle:(NSString *)cancelButtonTitle
                 otherButtonTitles:(NSArray *)otherButtonTitles
                     animationType:(NNAlertViewAnimationType)animationType
                     buttonHandler:(NNNormalAlertViewButtonBlock)buttonHandler {
    if (title.length == 0 && message.length == 0) {
        title = @"No Content";
    }

    NNNormalAlertView *alertView = [[NNNormalAlertView alloc] init];
    alertView.imageView.image = image;
    alertView.titleLabel.text = title;
    alertView.messageLabel.text = message;

    if (cancelButtonTitle) {
        alertView.cancelButton = [UIButton buttonWithType:UIButtonTypeSystem];
        alertView.cancelButton.tag = 0;
        alertView.cancelButton.backgroundColor = [UIColor whiteColor];
        alertView.cancelButton.titleLabel.font = [UIFont fontWithName:@"AvenirNext-Medium" size:16];
        [alertView.cancelButton setTitleColor:[[UIColor redColor] colorWithAlphaComponent:0.6]
                                     forState:UIControlStateNormal];
        [alertView.cancelButton setTitle:cancelButtonTitle
                                forState:UIControlStateNormal];
        [alertView.cancelButton addTarget:alertView
                                   action:@selector(_didButtonPressed:)
                         forControlEvents:UIControlEventTouchUpInside];
    }

    if (otherButtonTitles.count > 0) {
        NSMutableArray *mutableArray = [NSMutableArray arrayWithCapacity:otherButtonTitles.count];
        for (NSInteger i = 0; i < otherButtonTitles.count; i++) {
            UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
            button.tag = i + 1;
            button.titleLabel.font = [UIFont fontWithName:@"AvenirNext-Regular" size:16];
            button.backgroundColor = [UIColor whiteColor];
            [button setTitleColor:[UIColor blackColor]
                         forState:UIControlStateNormal];
            [button setTitle:otherButtonTitles[i]
                    forState:UIControlStateNormal];

            [button addTarget:alertView
                       action:@selector(_didButtonPressed:)
             forControlEvents:UIControlEventTouchUpInside];

            [mutableArray addObject:button];
        }

        alertView.otherButtons = [mutableArray copy];
    }

    alertView.buttonHandler = buttonHandler;

    [alertView showWithAnimationType:animationType];

    return alertView;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self _setupContent];
    }

    return self;
}

#pragma mark - Public


#pragma mark - Private

- (void)_setupContent {
    self.imageView = [[UIImageView alloc] init];
    self.imageView.translatesAutoresizingMaskIntoConstraints = NO;
    self.imageView.contentMode = UIViewContentModeScaleAspectFill;
    self.imageView.clipsToBounds = YES;

    self.titleLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    self.messageLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    self.titleLabel.translatesAutoresizingMaskIntoConstraints =
            self.messageLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.titleLabel.textAlignment =
            self.messageLabel.textAlignment = NSTextAlignmentCenter;
    self.titleLabel.numberOfLines =
            self.messageLabel.numberOfLines = 0;
    self.titleLabel.preferredMaxLayoutWidth =
            self.messageLabel.preferredMaxLayoutWidth = NNNormalAlertViewWidth - 30;
    self.titleLabel.lineBreakMode =
            self.messageLabel.lineBreakMode = NSLineBreakByWordWrapping;
    self.titleLabel.textColor = [UIColor blackColor];
    self.messageLabel.textColor = [UIColor blackColor];
    self.titleLabel.font = [UIFont fontWithName:@"AvenirNext-Regular" size:18];
    self.messageLabel.font = [UIFont fontWithName:@"AvenirNext-Regular" size:15];

    self.buttonContainerView = [[UIView alloc] initWithFrame:CGRectZero];
    self.buttonContainerView.translatesAutoresizingMaskIntoConstraints = NO;
    self.buttonContainerView.backgroundColor = [[UIColor lightGrayColor] colorWithAlphaComponent:0.3];

    [self _layoutMessage];
}

- (void)_layoutMessage {
    __weak NNNormalAlertView *weakSelf = self;
    self.layoutContentHandler = ^(UIView *contentView) {
        [contentView addSubview:weakSelf.imageView];
        [contentView addSubview:weakSelf.titleLabel];
        [contentView addSubview:weakSelf.messageLabel];
        [contentView addSubview:weakSelf.buttonContainerView];

        NSLayoutConstraint *imageViewCenterXConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.imageView
                                                                                      attribute:NSLayoutAttributeCenterX
                                                                                      relatedBy:NSLayoutRelationEqual
                                                                                         toItem:contentView
                                                                                      attribute:NSLayoutAttributeCenterX
                                                                                     multiplier:1
                                                                                       constant:0];
        NSLayoutConstraint *titleCenterXConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.titleLabel
                                                                                  attribute:NSLayoutAttributeCenterX
                                                                                  relatedBy:NSLayoutRelationEqual
                                                                                     toItem:contentView
                                                                                  attribute:NSLayoutAttributeCenterX
                                                                                 multiplier:1
                                                                                   constant:0];
        NSLayoutConstraint *messageCenterXConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.messageLabel
                                                                                    attribute:NSLayoutAttributeCenterX
                                                                                    relatedBy:NSLayoutRelationEqual
                                                                                       toItem:contentView
                                                                                    attribute:NSLayoutAttributeCenterX
                                                                                   multiplier:1
                                                                                     constant:0];
        NSLayoutConstraint *imageViewTopConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.imageView
                                                                                  attribute:NSLayoutAttributeTop
                                                                                  relatedBy:NSLayoutRelationEqual
                                                                                     toItem:contentView
                                                                                  attribute:NSLayoutAttributeTop
                                                                                 multiplier:1
                                                                                   constant:30];

        CGFloat imageBottomConstant = weakSelf.imageView.image.size.height == 0 ? 0 : -15;
        CGFloat titleBottomConstant = weakSelf.titleLabel.text.length == 0 ? 0 : -10;
        CGFloat messageBottomConstant = weakSelf.messageLabel.text.length == 0 ? 0 : -30;

        weakSelf.imageViewBottomConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.imageView
                                                                          attribute:NSLayoutAttributeBottom
                                                                          relatedBy:NSLayoutRelationEqual
                                                                             toItem:weakSelf.titleLabel
                                                                          attribute:NSLayoutAttributeTop
                                                                         multiplier:1
                                                                           constant:imageBottomConstant];
        weakSelf.titleLabelBottomConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.titleLabel
                                                                           attribute:NSLayoutAttributeBottom
                                                                           relatedBy:NSLayoutRelationEqual
                                                                              toItem:weakSelf.messageLabel
                                                                           attribute:NSLayoutAttributeTop
                                                                          multiplier:1
                                                                            constant:titleBottomConstant];
        weakSelf.messageLabelBottomConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.messageLabel
                                                                             attribute:NSLayoutAttributeBottom
                                                                             relatedBy:NSLayoutRelationEqual
                                                                                toItem:weakSelf.buttonContainerView
                                                                             attribute:NSLayoutAttributeTop
                                                                            multiplier:1
                                                                              constant:messageBottomConstant];

        NSLayoutConstraint *buttonContainerLeftConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.buttonContainerView
                                                                                         attribute:NSLayoutAttributeLeft
                                                                                         relatedBy:NSLayoutRelationEqual
                                                                                            toItem:contentView
                                                                                         attribute:NSLayoutAttributeLeft
                                                                                        multiplier:1
                                                                                          constant:0];
        NSLayoutConstraint *buttonContainerRightConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.buttonContainerView
                                                                                          attribute:NSLayoutAttributeRight
                                                                                          relatedBy:NSLayoutRelationEqual
                                                                                             toItem:contentView
                                                                                          attribute:NSLayoutAttributeRight
                                                                                         multiplier:1
                                                                                           constant:0];
        NSLayoutConstraint *buttonContainerBottmConstraint = [NSLayoutConstraint constraintWithItem:weakSelf.buttonContainerView
                                                                                          attribute:NSLayoutAttributeBottom
                                                                                          relatedBy:NSLayoutRelationEqual
                                                                                             toItem:contentView
                                                                                          attribute:NSLayoutAttributeBottom
                                                                                         multiplier:1
                                                                                           constant:0];

        NSLayoutConstraint *contentViewWidthConsraint = [NSLayoutConstraint constraintWithItem:contentView
                                                                                     attribute:NSLayoutAttributeWidth
                                                                                     relatedBy:NSLayoutRelationEqual
                                                                                        toItem:nil
                                                                                     attribute:NSLayoutAttributeWidth
                                                                                    multiplier:1
                                                                                      constant:NNNormalAlertViewWidth];

        [contentView addConstraints:@[imageViewCenterXConstraint,
                imageViewTopConstraint,
                weakSelf.imageViewBottomConstraint,
                titleCenterXConstraint,
                weakSelf.titleLabelBottomConstraint,
                messageCenterXConstraint,
                weakSelf.messageLabelBottomConstraint,
                buttonContainerLeftConstraint,
                buttonContainerRightConstraint,
                buttonContainerBottmConstraint,
                contentViewWidthConsraint]];

        [weakSelf _layoutButtons];
    };
}

- (void)_layoutButtons {
    CGFloat buttonContainerHeight = kButtonHeight + kLineThickness;
    if (self.cancelButton) {
        if (self.otherButtons.count <= 1) {
            UIButton *leftButton = self.cancelButton;
            UIButton *rightButton = self.otherButtons.firstObject;
            BOOL hasRightButton = rightButton != nil;
            CGFloat buttonWidth = hasRightButton ? (NNNormalAlertViewWidth - kLineThickness) / 2 : NNNormalAlertViewWidth;
            leftButton.frame = CGRectMake(0, kLineThickness, buttonWidth, kButtonHeight);
            [self.buttonContainerView addSubview:leftButton];

            if (hasRightButton) {
                rightButton.frame = CGRectMake(leftButton.bounds.size.width + kLineThickness, kLineThickness, buttonWidth, kButtonHeight);
                [self.buttonContainerView addSubview:rightButton];
            }
        } else {
            buttonContainerHeight = (self.otherButtons.count + 1) * (kButtonHeight + kLineThickness);
            for (NSInteger i = 0; i < self.otherButtons.count; i++) {
                UIButton *button = self.otherButtons[i];
                button.frame = CGRectMake(0, i * kButtonHeight + kLineThickness * (i + 1), NNNormalAlertViewWidth, kButtonHeight);
                [self.buttonContainerView addSubview:button];
            }
            self.cancelButton.frame = CGRectMake(0, (kButtonHeight + kLineThickness) * self.otherButtons.count + kLineThickness, NNNormalAlertViewWidth, kButtonHeight);
            [self.buttonContainerView addSubview:self.cancelButton];
        }
    } else {
        if (self.otherButtons.count > 2 || self.otherButtons.count == 1) {
            buttonContainerHeight = self.otherButtons.count * (kButtonHeight + kLineThickness);
            for (NSInteger i = 0; i < self.otherButtons.count; i++) {
                UIButton *button = self.otherButtons[i];
                button.frame = CGRectMake(0, i * kButtonHeight + kLineThickness * (i + 1), NNNormalAlertViewWidth, kButtonHeight);
                [self.buttonContainerView addSubview:button];
            }
        } else if (self.otherButtons.count == 2) {
            UIButton *leftButton = self.otherButtons.firstObject;
            UIButton *rightButton = self.otherButtons.lastObject;
            CGFloat buttonWith = (NNNormalAlertViewWidth - kLineThickness) / 2;
            leftButton.frame = CGRectMake(0, kLineThickness, buttonWith, kButtonHeight);
            rightButton.frame = CGRectMake(leftButton.bounds.size.width + kLineThickness, kLineThickness, buttonWith, kButtonHeight);
            [self.buttonContainerView addSubview:leftButton];
            [self.buttonContainerView addSubview:rightButton];
        }
    }

    NSLayoutConstraint *buttonContainerViewHeightConstraint = [NSLayoutConstraint constraintWithItem:self.buttonContainerView
                                                                                           attribute:NSLayoutAttributeHeight
                                                                                           relatedBy:NSLayoutRelationEqual
                                                                                              toItem:nil
                                                                                           attribute:NSLayoutAttributeHeight
                                                                                          multiplier:1
                                                                                            constant:buttonContainerHeight];
    [self.buttonContainerView addConstraint:buttonContainerViewHeightConstraint];
}

- (void)_didButtonPressed:(id)sender {
    UIButton *button = sender;

    if (self.buttonHandler) {
        self.buttonHandler(button.tag);
    }

    [self dismiss];
}

#pragma mark - Getter & Setter

- (void)setTitleFont:(UIFont *)titleFont {
    _titleFont = titleFont;
    self.titleLabel.font = titleFont;
}

- (void)setTitleColor:(UIColor *)titleColor {
    _titleColor = titleColor;
    self.titleLabel.textColor = titleColor;
}

- (void)setMessageFont:(UIFont *)messageFont {
    _messageFont = messageFont;
    self.messageLabel.font = messageFont;
}

- (void)setMessageColor:(UIColor *)messageColor {
    _messageColor = messageColor;
    self.messageLabel.textColor = messageColor;
}

- (void)setCancelButtonFont:(UIFont *)cancelButtonFont {
    _cancelButtonFont = cancelButtonFont;
    self.cancelButton.titleLabel.font = cancelButtonFont;
}

- (void)setOtherButtonsFont:(UIFont *)otherButtonsFont {
    _otherButtonsFont = otherButtonsFont;

    for (UIButton *button in self.otherButtons) {
        button.titleLabel.font = otherButtonsFont;
    }
}

- (void)setCancelButtonTitleColor:(UIColor *)cancelButtonTitleColor {
    _cancelButtonTitleColor = cancelButtonTitleColor;
    [self.cancelButton setTitleColor:cancelButtonTitleColor
                            forState:UIControlStateNormal];
}

- (void)setOtherButtonTitleColor:(UIColor *)otherButtonTitleColor {
    _otherButtonTitleColor = otherButtonTitleColor;
    for (UIButton *button in self.otherButtons) {
        [button setTitleColor:otherButtonTitleColor
                     forState:UIControlStateNormal];
    }
}

@end



