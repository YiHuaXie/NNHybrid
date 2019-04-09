//
//  NNBaseViewController.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNBaseViewController.h"

@interface NNBaseViewController ()

@property (nonatomic, assign) BOOL willFirstAppear;
@property (nonatomic, assign) BOOL didFirstAppear;

@end

@implementation NNBaseViewController

#pragma mark - Init

- (instancetype)init {
    if (self = [super init]) {
        _willFirstAppear = YES;
        _didFirstAppear = YES;
        _currentStatusBarStyle = UIStatusBarStyleDefault;
    }
    
    return self;
}

#pragma mark - Lifecycle

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    if (![self conformsToProtocol:@protocol(NNNavigationBarHidden)]) {
         [self setupNavigationItem];
    }
    [self setupNotification];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];

    BOOL hidden = [self conformsToProtocol:@protocol(NNNavigationBarHidden)];
    [self.navigationController setNavigationBarHidden:hidden
                                             animated:animated];

    if (self.willFirstAppear) {
        self.willFirstAppear = NO;
        [self viewWillFirstAppear:animated];
    }
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];

    if (self.didFirstAppear) {
        self.didFirstAppear = NO;
        [self viewDidFirstAppear:animated];
    }
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
}

- (void)dealloc {
    NNLog(@"%@ dealloc", self.class);
    nn_notificationRemoveObserver(self);
}

#pragma mark - Override

- (BOOL)shouldAutorotate {
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskPortrait;
}

- (BOOL)prefersStatusBarHidden {
    return NO;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
    return self.currentStatusBarStyle;
}

#pragma mark - Public

- (void)setupNavigationItem {
    // 自定义的返回按钮写在这里主要是为了方便无痕埋点
    if (![self.navigationController isKindOfClass:[UIImagePickerController class]] &&
        self.navigationItem.leftBarButtonItem == nil) {
        UIImage *image = nil;
        
        if (self.isPresented) image = NAVI_CLOSE_BLACK_IMAGE;
        
        if (self.navigationController.viewControllers.count > 1) {
            image = NAVI_BACK_BLACK_IMAGE;
        }
        
        if (!image) return;
        
        WEAK_SELF;
        
        UIBarButtonItem *buttonItem =
        [UIBarButtonItem navbarButtonItemWithImage:image actions:^(id sender) {
            [weakSelf backOrDismiss];
        }];
        
        self.navigationItem.leftBarButtonItem = buttonItem;
    }
}

- (void)viewControllerInitialize {
    //默认不做操作，由子类重载
}

- (void)setupNotification {
    //默认不做操作，由子类重载
}

- (void)viewWillFirstAppear:(BOOL)animated {
    //默认不做操作，由子类重载
}

- (void)viewDidFirstAppear:(BOOL)animated {
    //默认不做操作，由子类重载
}

- (void)backOrDismiss {
    if ([self.navigationController.viewControllers count] > 1) {
        [self.navigationController popViewControllerAnimated:YES];
    } else {
        [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
    }
}

#pragma mark - Getter & Setter

- (void)setCurrentStatusBarStyle:(UIStatusBarStyle)currentStatusBarStyle {
    if (_currentStatusBarStyle == currentStatusBarStyle) {
        return;
    }
    
    _currentStatusBarStyle = currentStatusBarStyle;
    [self setNeedsStatusBarAppearanceUpdate];
}

- (BOOL)isPresented {
    return ((self.presentingViewController) ||
            (self.navigationController && self.navigationController.presentingViewController &&
             self.navigationController.presentingViewController.presentedViewController == self.navigationController));
}

@end
