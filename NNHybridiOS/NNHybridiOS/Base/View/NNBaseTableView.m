//
//  NNBaseTableView.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNBaseTableView.h"

@implementation NNBaseTableView

#pragma mark - Init

- (void)awakeFromNib {
    [super awakeFromNib];
    
    [self _setupTableView];
}

- (instancetype)initWithFrame:(CGRect)frame style:(UITableViewStyle)style {
    if (self = [super initWithFrame:frame style:style]) {
        [self _setupTableView];
    }
    
    return self;
}

#pragma mark - Private

- (void)_setupTableView {
    if NN_IOS_AVAILABLE(11.0) {
        self.estimatedRowHeight =
        self.estimatedSectionHeaderHeight =
        self.estimatedSectionFooterHeight = 0;
    }
}

@end
