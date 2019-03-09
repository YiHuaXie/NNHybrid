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
}

- (IBAction)_didButtonPressed:(id)sender {
    [self presentViewController:[RNPageViewController new] animated:YES completion:nil];
}

@end
