//
//  FilterMenuRentTypeController.m
//  MYRoom
//
//  Created by Snow on 2018/12/4.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import "FilterMenuRentTypeController.h"
#import "FHTFilterMenu.h"
#import "BaseFilterCell.h"

@interface FilterMenuRentTypeController ()

@property (nonatomic, strong) NSArray *items;

@end

static NSString *const keyOptionTitle = @"keyOptionTitle";
static NSString *const keyOptionParameter = @"keyOptionParameter";

@implementation FilterMenuRentTypeController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.tableView registerClass:BaseFilterCell.class
           forCellReuseIdentifier:BaseFilterCell.nn_classString];
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.tableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];
    self.clearsSelectionOnViewWillAppear = NO;
    
    [self reset];
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
        _items = @[@{keyOptionTitle: @"不限", keyOptionParameter:@{@"houseRentType" : @""}},
                   @{keyOptionTitle: @"整租", keyOptionParameter:@{@"houseRentType" : @"1"}},
                   @{keyOptionTitle: @"合租", keyOptionParameter:@{@"houseRentType" : @"2"}},
                   ];
    }
    return _items;
}

- (void)presetWithOptionTitles:(NSArray<NSString *> *)titles {
    if ([titles count] > 0) {
        [titles enumerateObjectsUsingBlock:^(NSString * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            for (NSInteger i=1; i < [self.items count]; i++) {
                NSDictionary *item = self.items[i];
                if ([obj isEqualToString:item[keyOptionTitle]]) {
                    [self.tableView selectRowAtIndexPath:[NSIndexPath indexPathForRow:i inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
        }];
        [self.btnMenuItem setTitle:@"类型" forState:UIControlStateNormal];
        [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
        
        [self updateFilter];
    }
}

- (void)reset {
    [self.tableView selectRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
    [self.btnMenuItem setTitle:@"类型" forState:UIControlStateNormal];
    [self.btnMenuItem setTitleColor:APP_TEXT_BLACK_COLOR forState:UIControlStateNormal];
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
//        NSDictionary *item = self.items[indexPath.row];
        [self.btnMenuItem setTitle:@"类型" forState:UIControlStateNormal];
        [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
    }else {
        [self reset];
    }
    
    [self updateFilter];
    
//    [FHTTracker saveEventWithName:@"TypeClick" data:[self filterParameter]];
}



@end
