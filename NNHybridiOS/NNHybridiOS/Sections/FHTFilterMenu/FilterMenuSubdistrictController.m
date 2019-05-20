//
//  FilterMenuSubdistrictController.m
//  MYRoom
//
//  Created by Snow on 2018/12/5.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import "FilterMenuSubdistrictController.h"
#import "FHTFilterMenu.h"
#import "FilterSubmenuCell.h"
//#import "MYLocation.h"
//#import "FHTLocationManager.h"
#import "LocationManager.h"

@interface FilterMenuSubdistrictController () <UITableViewDataSource, UITableViewDelegate>

@property (nonatomic, strong) UITableView *districtTableView;
@property (nonatomic, strong) UITableView *subdistrictTableView;

@property (nonatomic, copy) NSArray *districtArray;
@property (nonatomic, copy) NSArray *subdistrictArray;

@property (nonatomic, assign) NSInteger districtIndex;
@property (nonatomic, assign) NSInteger subdistrictIndex;

@end

@implementation FilterMenuSubdistrictController

- (void)loadView {
    self.view = [[UIView alloc] init];
    
    [self loadDistrictTableView];
    [self loadSubDistrictTableView];
    [self loadSeparatorLine];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    [self loadData:[SharedLocationManager.selectedCityId integerValue]];
    
    [self reset];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    NSIndexPath *districtIndexPath = [NSIndexPath indexPathForItem:self.districtIndex inSection:0];
    NSIndexPath *subdistrictIndexPath = [NSIndexPath indexPathForItem:self.subdistrictIndex inSection:0];
    [self.districtTableView selectRowAtIndexPath:districtIndexPath animated:NO scrollPosition:UITableViewScrollPositionNone];
    NSMutableArray *subdistrictArray = [NSMutableArray array];
    [subdistrictArray addObject:@{@"name": @"全部", @"id": @""}];
    NSArray *rawSubdistricts = self.districtArray[districtIndexPath.row][@"children"];
    if (rawSubdistricts != nil) {
        [subdistrictArray addObjectsFromArray:rawSubdistricts];
    }
    self.subdistrictArray = subdistrictArray;
    [self.subdistrictTableView reloadData];
    [self.subdistrictTableView selectRowAtIndexPath:subdistrictIndexPath animated:NO scrollPosition:UITableViewScrollPositionNone];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)loadDistrictTableView {
    self.districtTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
    self.districtTableView.showsVerticalScrollIndicator = NO;
    self.districtTableView.dataSource = self;
    self.districtTableView.delegate = self;
    self.districtTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.districtTableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.districtTableView registerClass:[FilterSubmenuTextCell class] forCellReuseIdentifier:[FilterSubmenuTextCell reuseIdentifier]];
    
    [self.view addSubview:self.districtTableView];
    [self.districtTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.left.bottom.equalTo(self.view);
        make.width.equalTo(self.view).multipliedBy(0.5);
    }];
}

- (void)loadSubDistrictTableView {
    self.subdistrictTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
    self.subdistrictTableView.showsVerticalScrollIndicator = NO;
    self.subdistrictTableView.dataSource = self;
    self.subdistrictTableView.delegate = self;
    self.subdistrictTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.subdistrictTableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.subdistrictTableView registerClass:[FilterSubmenuTextCell class] forCellReuseIdentifier:[FilterSubmenuTextCell reuseIdentifier]];
    
    [self.view addSubview:self.subdistrictTableView];
    [self.subdistrictTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.right.bottom.equalTo(self.view);
        make.width.equalTo(self.view).multipliedBy(0.5);
    }];
}

- (void)loadSeparatorLine {
    UIView *lineView = [[UIView alloc] initWithFrame:CGRectZero];
    lineView.backgroundColor = APP_LINE_COLOR;
    [self.view addSubview:lineView];
    
    [lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(self.view);
        make.height.equalTo(self.view);
        make.width.equalTo(@(0.5));
    }];
}

- (void)loadData:(NSInteger)cityId
{
    self.districtIndex = 0;
    self.subdistrictIndex = 0;
    
    NSMutableArray *districtArray = [NSMutableArray array];
    [districtArray addObject:@{@"name": @"全部", @"id": @"", @"children": @[]}];
    NSArray *rawDistricts =  [MYUtil getCityRegion:cityId];
    if (rawDistricts != nil) {
        [districtArray addObjectsFromArray:rawDistricts];
    }
    self.districtArray = districtArray;
    
    NSMutableArray *subdistrictArray = [NSMutableArray array];
    [subdistrictArray addObject:@{@"name": @"全部", @"id": @""}];
    self.subdistrictArray = subdistrictArray;
    
    [self.districtTableView reloadData];
    [self.subdistrictTableView reloadData];
}

- (CGFloat)heightForSubmenus {
    return 315;
}

- (NSDictionary *)filterParameter {
    NSDictionary *districtDic = self.districtArray[self.districtTableView.indexPathForSelectedRow.row];
    NSDictionary *subdistrictDic = self.subdistrictArray[self.subdistrictTableView.indexPathForSelectedRow.row];
    
    NSMutableDictionary *parameters = [NSMutableDictionary dictionary];
    if (districtDic != nil) {
        if ([districtDic[@"id"] isKindOfClass:[NSString class]]) {
            [parameters setObject:districtDic[@"id"] forKey:@"regionId"];
        }else if ([districtDic[@"id"] isKindOfClass:[NSNumber class]]) {
            [parameters setObject:[districtDic[@"id"] stringValue] forKey:@"regionId"];
        }
    }
    if (subdistrictDic != nil) {
        if ([subdistrictDic[@"id"] isKindOfClass:[NSString class]]) {
            [parameters setObject:subdistrictDic[@"id"] forKey:@"zoneId"];
        }else if ([subdistrictDic[@"id"] isKindOfClass:[NSNumber class]]) {
            [parameters setObject:[subdistrictDic[@"id"] stringValue] forKey:@"zoneId"];
        }
    }
    return parameters;
}

- (void)reset {
    [self.districtTableView selectRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
    [self.subdistrictTableView selectRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
    [self.btnMenuItem setTitle:@"区域" forState:UIControlStateNormal];
    [self.btnMenuItem setTitleColor:APP_TEXT_BLACK_COLOR forState:UIControlStateNormal];
}

#pragma mark - Table view data source
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 35;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    if (tableView == self.districtTableView) {
        return [self.districtArray count];
    }else if (tableView == self.subdistrictTableView) {
        return [self.subdistrictArray count];
    }
    
    return 0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (tableView == self.districtTableView) {
        FilterSubmenuTextCell *cell = [tableView dequeueReusableCellWithIdentifier:[FilterSubmenuTextCell reuseIdentifier] forIndexPath:indexPath];
        NSDictionary *districtItem = self.districtArray[indexPath.row];
        cell.lblText.text = districtItem[@"name"];
        cell.lblText.textAlignment = NSTextAlignmentLeft;
        cell.hasSubItems = YES;
        return cell;
    }else if (tableView == self.subdistrictTableView) {
        FilterSubmenuTextCell *cell = [tableView dequeueReusableCellWithIdentifier:[FilterSubmenuTextCell reuseIdentifier] forIndexPath:indexPath];
        NSDictionary *subdistrictItem = self.subdistrictArray[indexPath.row];
        cell.lblText.text = subdistrictItem[@"name"];
        cell.lblText.textAlignment = NSTextAlignmentLeft;
        return cell;
    }
    
    return [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:nil];
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (tableView == self.districtTableView) {
        NSMutableArray *subdistrictArray = [NSMutableArray array];
        [subdistrictArray addObject:@{@"name": @"全部", @"id": @""}];
        NSArray *rawSubdistricts = self.districtArray[indexPath.row][@"children"];
        if (rawSubdistricts != nil) {
            [subdistrictArray addObjectsFromArray:rawSubdistricts];
        }
        self.subdistrictArray = subdistrictArray;
        [self.subdistrictTableView reloadData];
    }else if (tableView == self.subdistrictTableView) {
        self.districtIndex = self.districtTableView.indexPathForSelectedRow.row;
        self.subdistrictIndex = indexPath.row;
        
        if (indexPath.row > 0) {
            NSDictionary *subdistictItem = self.subdistrictArray[indexPath.row];
            [self.btnMenuItem setTitle:subdistictItem[@"name"] forState:UIControlStateNormal];
            [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
        }else if (self.districtTableView.indexPathForSelectedRow.row > 0) {
            NSDictionary *districtItem = self.districtArray[self.districtTableView.indexPathForSelectedRow.row];
            [self.btnMenuItem setTitle:districtItem[@"name"] forState:UIControlStateNormal];
            [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
        }else {
            [self reset];
        }
        
        [self updateFilter];
        
//        [FHTTracker saveEventWithName:@"RentClick" data:[self filterParameter]];
    }
}

@end
