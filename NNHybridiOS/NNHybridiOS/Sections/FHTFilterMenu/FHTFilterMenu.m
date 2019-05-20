//
//  FHTFilterMenu.m
//  MYRoom
//
//  Created by Snow on 2018/12/4.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import "FHTFilterMenu.h"

@interface UIViewController ()
@property(nullable, nonatomic, readwrite, weak) FHTFilterMenu *filterMenu;
@end
const void * _Nonnull keyBtnMenuItem = @"keyBtnMenuItem";
const void * _Nonnull keyFilterMenu = @"keyFilterMenu";
const void * _Nonnull keyDidSetFilterHandler = @"didSetFilterHandler";
@implementation UIViewController (FHTFilterMenuItem)

- (void)setBtnMenuItem:(UIButton *)btnMenuItem {
    objc_setAssociatedObject(self, keyBtnMenuItem, btnMenuItem, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (UIButton *)btnMenuItem {
    if (objc_getAssociatedObject(self, keyBtnMenuItem) == nil) {
        FHTFilterMenuButton *button = [FHTFilterMenuButton buttonWithType:UIButtonTypeCustom];
        [button.titleLabel setFont:[UIFont systemFontOfSize:12]];
        [button setTitleColor:APP_TEXT_BLACK_COLOR forState:UIControlStateNormal];
        [button setTitleColor:APP_THEME_COLOR forState:UIControlStateSelected];
        [button setImage:[UIImage imageNamed:@"dorp_menu_down"] forState:UIControlStateNormal];
        [button setImage:[UIImage imageNamed:@"dorp_menu_up"] forState:UIControlStateSelected];
        button.titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        
        objc_setAssociatedObject(self, keyBtnMenuItem, button, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return objc_getAssociatedObject(self, keyBtnMenuItem);
}

- (void)setFilterMenu:(FHTFilterMenu * _Nullable)filterMenu {
    objc_setAssociatedObject(self, keyFilterMenu, filterMenu, OBJC_ASSOCIATION_ASSIGN);
}

- (FHTFilterMenu *)filterMenu {
    return objc_getAssociatedObject(self, keyFilterMenu);
}

- (void)setDidSetFilterHandler:(void (^)(NSDictionary * _Nullable))didSetFilterHandler {
    objc_setAssociatedObject(self, keyDidSetFilterHandler, didSetFilterHandler, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (void (^)(NSDictionary * _Nonnull))didSetFilterHandler {
    return objc_getAssociatedObject(self, keyDidSetFilterHandler);
}

- (void)updateFilter {
    [self.filterMenu changeFilterByFilterController:self];
}

@end

@interface FHTFilterMenu ()

@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, readonly, strong) UIView *maskingView;
@property (nonatomic, readonly, strong) UIView *contentView;

@property (nonatomic, weak) UIView *embedInView;
@property (nonatomic, assign) CGFloat maxHeightForSubmenu;

//@property (nonatomic, copy) void (^handler)(NSDictionary *params);

@end

@implementation FHTFilterMenu
@synthesize maskingView=_maskingView, contentView=_contentView;


- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.maxHeightForSubmenu = 395;
        [self createViewHierarchy];
    }
    return self;
}

- (void)createViewHierarchy {
    self.containerView = [[UIView alloc] initWithFrame:CGRectZero];
    UIButton *btnQuitMask = [UIButton buttonWithType:UIButtonTypeCustom];
    [btnQuitMask addTarget:self action:@selector(buttonQuitMaskOnClicked:) forControlEvents:UIControlEventTouchUpInside];
    [self.containerView addSubview:btnQuitMask];
    [btnQuitMask mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.left.bottom.right.equalTo(self.containerView);
    }];
    
    self.containerView.backgroundColor = [UIColor colorWithWhite:0 alpha:0.7];
    [self.containerView addSubview:self.contentView];
}

- (UIView *)contentView {
    if (_contentView == nil) {
        _contentView = [[UIView alloc] initWithFrame:(CGRect){CGPointZero, {CGRectGetWidth(self.bounds), 0}}];
        _contentView.backgroundColor = [UIColor whiteColor];
        _contentView.clipsToBounds = YES;
    }
    return _contentView;
}

- (NSDictionary *)filterParameters {
    NSMutableDictionary *params = [NSMutableDictionary dictionary];
    [self.filterControllers enumerateObjectsUsingBlock:^(__kindof UIViewController<FHTFilterController> * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [params setValuesForKeysWithDictionary:obj.filterParameter];
    }];

    return params;
}

- (void)setFilterControllers:(NSArray<__kindof UIViewController<FHTFilterController> *> *)filterControllers {
    [_filterControllers enumerateObjectsUsingBlock:^(__kindof UIViewController * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        obj.filterMenu = nil;
        [obj.btnMenuItem removeFromSuperview];
    }];
    
    _filterControllers = [filterControllers copy];
    [_filterControllers enumerateObjectsUsingBlock:^(__kindof UIViewController * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        obj.filterMenu = self;
        obj.btnMenuItem.tag = idx;
        [self addSubview:obj.btnMenuItem];
        [obj.btnMenuItem addTarget:self action:@selector(buttonMenuItemOnClicked:) forControlEvents:UIControlEventTouchUpInside];
    }];
    
    [self setNeedsLayout];
    [self layoutIfNeeded];
}

- (void)layoutSubviews {
    [super layoutSubviews];

    // 布局子视图
    NSInteger count = [self.filterControllers count];
    CGFloat btnX = 0;
    CGFloat btnY = 0;
    CGFloat btnW = self.bounds.size.width / count;
    CGFloat btnH = self.bounds.size.height;
    
    for (NSInteger i = 0; i < count; i++) {
        // 设置按钮位置
        UIButton *btn = self.filterControllers[i].btnMenuItem;
        btnX = i * btnW;
        btn.frame = CGRectMake(btnX, btnY, btnW, btnH);
    }
    // 设置底部View位置
//    CGFloat bottomH = 1;
//    CGFloat bottomY = btnH - bottomH;
//    _bottomLine.frame = CGRectMake(0, bottomY, self.bounds.size.width, bottomH);
}

- (void)showFilterMenuOnView:(UIView *)embedInView {
    self.embedInView = embedInView;
    [embedInView addSubview:self];
    [embedInView insertSubview:self.containerView belowSubview:self];
    
    CGRect containerFrame = CGRectZero;
    containerFrame.origin = (CGPoint){CGRectGetMinX(self.frame), CGRectGetMaxY(self.frame)};
    containerFrame.size = (CGSize){CGRectGetWidth(self.frame), CGRectGetHeight(embedInView.frame) - CGRectGetMaxY(self.frame)};
    self.containerView.frame = containerFrame;
}

- (void)buttonQuitMaskOnClicked:(UIButton *)button {
    [self dismissSubmenu:YES];
}

- (void)buttonMenuItemOnClicked:(UIButton *)button {
    if (button.selected) {
        [self dismissSubmenu:YES];
    }else {
        [self showSubMenuForIndex:button.tag];
    }
}

- (void)showSubMenuForIndex:(NSInteger)index {
    [self.filterControllers enumerateObjectsUsingBlock:^(__kindof UIViewController * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        obj.btnMenuItem.selected = index == idx;
    }];
    
    [[self.contentView.subviews lastObject] removeFromSuperview];
    self.containerView.hidden = NO;
    [self.embedInView bringSubviewToFront:self.containerView];
    
    UIViewController *selectedVC = self.filterControllers[index];
    [self.contentView addSubview:selectedVC.view];
    
    CGFloat height = MIN(self.maxHeightForSubmenu, [selectedVC heightForSubmenus]);
    selectedVC.view.frame = (CGRect){CGPointZero, {CGRectGetWidth(self.contentView.bounds), height}};
    
    CGRect originFrame = self.contentView.frame;
    CGRect fromFrame = (CGRect){originFrame.origin, {CGRectGetWidth(originFrame), 0}};
    CGRect toFrame = (CGRect){originFrame.origin, {CGRectGetWidth(originFrame), height}};
    self.contentView.frame = fromFrame;
    [UIView animateWithDuration:0.25 animations:^{
        self.contentView.frame = toFrame;
    }];
}

- (void)dismissSubmenu:(BOOL)animated {
    [self.filterControllers enumerateObjectsUsingBlock:^(__kindof UIViewController * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        obj.btnMenuItem.selected = NO;
    }];
    
    self.containerView.hidden = YES;
    [[self.contentView.subviews lastObject] removeFromSuperview];
}

- (void)resetFilter { 
    [self.filterControllers enumerateObjectsUsingBlock:^(__kindof UIViewController * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj respondsToSelector:@selector(reset)]) {
            [obj reset];
        }
    }];
}

- (void)changeFilterByFilterController:(id<FHTFilterController>)filterController {
    [self dismissSubmenu:YES];
    if (filterController.didSetFilterHandler != nil) {
        filterController.didSetFilterHandler(filterController.filterParameter);
    }
    
    if (self.filterDidChangedHandler != nil) {
        self.filterDidChangedHandler(self, filterController);
    }
}

@end

@implementation FHTFilterMenuButton

- (void)layoutSubviews
{
    [super layoutSubviews];
    if ([self.titleLabel.text length] == 0) {
        return;
    }
    
    if (self.imageView.x < self.titleLabel.x) {
        self.titleLabel.x = self.imageView.x;
        self.imageView.x =  CGRectGetMaxX(self.titleLabel.frame) + 5;
    }
}

@end
