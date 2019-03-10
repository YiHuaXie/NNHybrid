//
//  ViewController.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/3/8.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "ViewController.h"
#import "RNPageViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    self.view.backgroundColor = [UIColor yellowColor];
    
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
    btn.frame = CGRectMake(100, 100, 60, 30);
    [btn setTitle:@"jump to MomentsPage" forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(_didButtonPressed:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
}

- (void)_didButtonPressed:(id)sender {
    [self presentViewController:[RNPageViewController new] animated:YES completion:nil];
}

@end
