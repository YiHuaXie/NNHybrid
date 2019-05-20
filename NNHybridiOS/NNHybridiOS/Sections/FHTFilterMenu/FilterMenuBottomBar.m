//
//  FilterMenuBottomBar.m
//  MYRoom
//
//  Created by NeroXie on 2019/3/20.
//  Copyright © 2019 Perfect. All rights reserved.
//

#import "FilterMenuBottomBar.h"

@interface FilterMenuBottomBar()

@property (nonatomic, strong) UIButton *resetButton;
@property (nonatomic, strong) UIButton *confirmButton;

@end

@implementation FilterMenuBottomBar

#pragma mark - Init

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self _setup];
    }
    
    return self;
}

#pragma mark - Private

- (void)_setup {
    self.backgroundColor = UIColor.whiteColor;
    self.backgroundColor = [UIColor whiteColor];
    self.layer.shadowColor = [[UIColor grayColor] colorWithAlphaComponent:0.1].CGColor;
    self.layer.shadowOpacity = 1;
    self.layer.shadowRadius = 3.0;
    self.layer.shouldRasterize = YES;
    self.layer.rasterizationScale = [UIScreen mainScreen].scale;
    
    CGFloat w = (self.width - 50) / 13.0;
    
    self.resetButton = [[UIButton alloc] initWithFrame:CGRectZero];
    [self.resetButton setTitle:@"重置" forState:UIControlStateNormal];
    self.resetButton.titleLabel.font = nn_regularFontSize(14);
    [self.resetButton setTitleColor:APP_TEXT_GRAY_COLOR forState:UIControlStateNormal];
    self.resetButton.backgroundColor = nn_colorHex(0xF8F8F7);
    self.resetButton.layer.cornerRadius = 6;
    self.resetButton.clipsToBounds = YES;
    [self.resetButton addTarget:self
                         action:@selector(_didResetButtonPressed:)
               forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:self.resetButton];
    [self.resetButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.leading.equalTo(self).offset(20);
        make.centerY.equalTo(self);
        make.size.mas_equalTo(CGSizeMake(w * 4, 45));
    }];
    
    self.confirmButton = [[UIButton alloc] initWithFrame:CGRectZero];
    [self.confirmButton setTitle:@"确定" forState:UIControlStateNormal];
    self.confirmButton.titleLabel.font = nn_regularFontSize(14);
    [self.confirmButton setTitleColor:UIColor.whiteColor forState:UIControlStateNormal];
    self.confirmButton.backgroundColor = APP_THEME_COLOR;
    self.confirmButton.layer.cornerRadius = 6;
    self.confirmButton.clipsToBounds = YES;
    [self.confirmButton addTarget:self
                         action:@selector(_didConfirmButtonPressed:)
               forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:self.confirmButton];
    [self.confirmButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.trailing.equalTo(self).offset(-20);
        make.centerY.equalTo(self);
        make.size.mas_equalTo(CGSizeMake(w * 9.0, 45));
    }];
}

#pragma mark - Private

- (void)_didResetButtonPressed:(id)sender {
    BLOCK_EXEC(self.resetButtonPressedHandler);
}

- (void)_didConfirmButtonPressed:(id)sender {
    BLOCK_EXEC(self.confirmButtonPressedHandler);
}

@end
