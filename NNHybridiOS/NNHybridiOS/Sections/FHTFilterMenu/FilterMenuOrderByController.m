//
//  FilterMenuOrderByController.m
//  MYRoom
//
//  Created by Snow on 2018/12/4.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import "FilterMenuOrderByController.h"
#import "FHTFilterMenu.h"
#import "BaseFilterCell.h"

@interface FilterMenuOrderByController ()

@property (nonatomic, strong) NSArray *items;

@end

static NSString *const keyOptionTitle = @"keyOptionTitle";
static NSString *const keyOptionParameter = @"keyOptionParameter";
static NSString *const keyOptionOrderBy = @"orderBy";
static NSString *const keyOptionSortType = @"sortType";

@implementation FilterMenuOrderByController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.tableView registerClass:[BaseFilterCell class]
            forCellReuseIdentifier:BaseFilterCell.nn_classString];
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.tableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];
    self.clearsSelectionOnViewWillAppear = NO;
    
    [self reset];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (CGFloat)heightForSubmenus {
    return 35 * [self.items count];
}

- (NSDictionary *)filterParameter {
    NSDictionary *item = self.items[self.tableView.indexPathForSelectedRow.row];
    return item[keyOptionParameter];
}

- (NSArray *)items {
    if (_items == nil) {
        _items = @[@{keyOptionTitle : @"默认排序", keyOptionParameter:@{ keyOptionOrderBy: @"", keyOptionSortType: @""}},
                   @{keyOptionTitle : @"租金从低到高", keyOptionParameter:@{ keyOptionOrderBy: @"minRentPrice", keyOptionSortType: @"asc"}},
                   @{keyOptionTitle : @"租金从高到低", keyOptionParameter:@{ keyOptionOrderBy: @"minRentPrice", keyOptionSortType: @"desc"}},
                   @{keyOptionTitle : @"面积从小到大", keyOptionParameter:@{keyOptionOrderBy: @"roomArea", keyOptionSortType: @"asc"}},
                   @{keyOptionTitle : @"面积从大到小", keyOptionParameter:@{keyOptionOrderBy: @"roomArea", keyOptionSortType: @"desc"}},
                   ];
    }
    return _items;
}

- (void)reset {
    [self.tableView selectRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
    [self.btnMenuItem setImage:[[UIImage imageNamed:@"menu_btn_sort_default"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate] forState:UIControlStateNormal];
    [self.btnMenuItem setImage:[[UIImage imageNamed:@"menu_btn_sort_default"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate] forState:UIControlStateSelected];
    [self.btnMenuItem setTintColor:APP_TEXT_BLACK_COLOR];
}

#pragma mark - Table view data source
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 35;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.items.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    BaseFilterCell *cell = [tableView dequeueReusableCellWithIdentifier:BaseFilterCell.nn_classString];
    NSDictionary *item = self.items[indexPath.row];
    cell.contentLabel.text = item[keyOptionTitle];

    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.row > 0) {
        [self.btnMenuItem setTintColor:APP_THEME_COLOR];
    }else {
        [self reset];
    }
    
    [self updateFilter];
    
//    [FHTTracker saveEventWithName:@"SortClick" data:[self filterParameter]];
}
@end
