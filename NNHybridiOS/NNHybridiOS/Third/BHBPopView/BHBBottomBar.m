//
//  BHBBottomBar.m
//  BHBPopViewDemo
//
//  Created by 毕洪博 on 15/8/15.
//  Copyright (c) 2015年 毕洪博. All rights reserved.
//

#import "BHBBottomBar.h"
#import "UIImageView+BHBSetImage.h"
#import "UIButton+BHBSetImage.h"
#import "UIView+BHBAnimation.h"

@interface BHBBottomBar ()

@property (nonatomic,weak) UIImageView * background;
@property (nonatomic,weak) UIButton * closeBtn;
@property (nonatomic,weak) UIButton * backBtn;
@property (nonatomic,weak) UIButton * secondCloseBtn;

@end

@implementation BHBBottomBar

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        UIImageView * back = [[UIImageView alloc]initWithFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
        [back bhb_setImageWithResourcePath:@"images.bundle/tabbar_compose_below_background" AutoSize:NO];
        [self addSubview:back];
        self.background = back;
        
        UIButton * btn = [UIButton buttonWithType:UIButtonTypeCustom];
        btn.frame = CGRectMake(0, 0, BHBBOTTOMHEIGHT / 2, BHBBOTTOMHEIGHT / 2);
        btn.center = CGPointMake(frame.size.width / 2, frame.size.height / 2);
        [btn bhb_setImage:@"icon_share_close"];
        [btn addTarget:self action:@selector(close) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:btn];
        [btn RevolvingWithTime:.25 andDelta:0];
        self.closeBtn = btn;
    }
    return self;
}

- (void)close
{
    [self fadeOutWithTime:.25];
    [self btnResetPosition];
    if (self.closeClick) {
        self.closeClick();
    }
}

- (void)back:(UIButton *)btn{
    self.isMoreBar = NO;
    if (self.backClick) {
        self.backClick();
    }
}

- (void)setIsMoreBar:(BOOL)isMoreBar
{
    _isMoreBar = isMoreBar;
    if (isMoreBar) {
        [UIView animateWithDuration:.25 animations:^{
            self.closeBtn.alpha = 0;
            self.backBtn.alpha = 1;
            self.secondCloseBtn.alpha = 1;
            self.backBtn.userInteractionEnabled = YES;
            self.secondCloseBtn.userInteractionEnabled = YES;
        }];
    }else{
        [UIView animateWithDuration:.25 animations:^{
            self.closeBtn.alpha = 1;
            self.backBtn.alpha = 0;
            self.secondCloseBtn.alpha = 0;
            self.backBtn.userInteractionEnabled = NO;
            self.secondCloseBtn.userInteractionEnabled = NO;
        }];
    }
}

//恢复按钮位置
- (void)btnResetPosition{
    if (self.closeBtn) {
        [self.closeBtn RevolvingWithTime:.25 andDelta:0];
    }
}

- (void)dealloc{
    NSLog(@"BHBBottomBar");
}

@end
