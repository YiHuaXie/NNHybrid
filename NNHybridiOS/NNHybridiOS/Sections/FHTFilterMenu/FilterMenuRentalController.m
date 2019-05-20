//
//  FilterMenuRentalController.m
//  MYRoom
//
//  Created by Snow on 2018/12/5.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import "FilterMenuRentalController.h"
#import "FHTFilterMenu.h"
#import "BaseFilterCell.h"
#import "ConditionFilterPriceSlider.h"
#import "FilterMenuBottomBar.h"

@interface FilterMenuRentalController ()

@property (nonatomic, strong) NSArray *items;
@property (nonatomic, strong) ConditionFilterPriceSlider *slider;
@property (nonatomic, strong) FilterMenuBottomBar *bottomBar;

@property (nonatomic, copy) NSString *minPrice;
@property (nonatomic, copy) NSString *maxPrice;

@property (nonatomic, copy) NSString *tempMinPrice;
@property (nonatomic, copy) NSString *tempMaxPrice;

@end

static NSString *const keyOptionTitle = @"keyOptionTitle";
static NSString *const keyOptionParameter = @"keyOptionParameter";

@implementation FilterMenuRentalController

- (void)viewDidLoad {
    [super viewDidLoad];

    [self.tableView nn_registerCellsWithClasses:@[BaseFilterCell.class]];
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.tableView.tableFooterView = [self setupFooterView];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    self.tempMinPrice = self.minPrice;
    self.tempMaxPrice = self.maxPrice;
    [self setPriceSlicerWithMin:self.tempMinPrice andMax:self.tempMaxPrice];
}

- (UIView *)setupFooterView
{
    const CGFloat heightOfSlider = 54;
    const CGFloat heightOfButtonBar = 75;
    UIView *resultView = [[UIView alloc] initWithFrame:(CGRect){CGPointZero, {CGRectGetWidth(self.view.bounds), heightOfSlider + heightOfButtonBar}}];
    
    self.slider = [[ConditionFilterPriceSlider alloc] initWithFrame:(CGRect){CGPointZero, {CGRectGetWidth(self.view.bounds), heightOfSlider}}];
    self.slider.labelFont = nn_mediumFontSize(14);
    [self.slider addTarget:self
                    action:@selector(_didPriceSliderValueChanged:)
          forControlEvents:UIControlEventValueChanged];
    [resultView addSubview:self.slider];
    
    self.bottomBar = [[FilterMenuBottomBar alloc] initWithFrame:(CGRect){{0, heightOfSlider+ 20}, {CGRectGetWidth(self.view.bounds), 75}}];
    [resultView addSubview:self.bottomBar];
    
    WEAK_SELF;
    
    self.bottomBar.resetButtonPressedHandler = ^{
        [weakSelf resetAction];
    };
    
    self.bottomBar.confirmButtonPressedHandler = ^{
        [weakSelf confirmAction];
    };
    
    return resultView;
}

- (CGFloat)heightForSubmenus {
    return 35 * [self.items count] + 54 + 20+ 75;
}

- (NSDictionary *)filterParameter {
    NSMutableDictionary *resultDic = [NSMutableDictionary dictionary];
    if ([self.minPrice length] > 0) {
        resultDic[@"minPrice"] = self.minPrice;
    }
    
    if ([self.maxPrice length] > 0) {
        resultDic[@"maxPrice"] = self.maxPrice;
    }
    
    return resultDic;
}

- (NSArray *)items {
    if (_items == nil) {
        _items = @[@{keyOptionTitle: @"不限", keyOptionParameter:@{@"minPrice": @"", @"maxPrice": @""}},
                   @{keyOptionTitle: @"1500以下", keyOptionParameter:@{@"minPrice": @"", @"maxPrice": @"1500"}},
                   @{keyOptionTitle: @"1500-2000", keyOptionParameter:@{@"minPrice": @"1500", @"maxPrice": @"2000"}},
                   @{keyOptionTitle: @"2000-3000", keyOptionParameter:@{@"minPrice": @"2000", @"maxPrice": @"3000"}},
                   @{keyOptionTitle: @"3000-4000", keyOptionParameter:@{@"minPrice": @"3000", @"maxPrice": @"4000"}},
                   @{keyOptionTitle: @"4000以上", keyOptionParameter:@{@"minPrice": @"4000", @"maxPrice": @""}}
                   ];;
    }
    return _items;
}

- (void)presetWithOptionTitles:(NSArray<NSString *> *)titles {
    if ([titles count] > 0) {
        [titles enumerateObjectsUsingBlock:^(NSString * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            for (NSInteger i=1; i < [self.items count]; i++) {
                NSDictionary *item = self.items[i];
                if ([obj isEqualToString:item[keyOptionTitle]]) {
                    self.tempMinPrice = item[keyOptionParameter][@"minPrice"];
                    self.tempMaxPrice = item[keyOptionParameter][@"maxPrice"];
                }
            }
        }];
        [self.btnMenuItem setTitle:@"租金" forState:UIControlStateNormal];
        [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
        
        [self confirmAction];
    }
}

- (void)reset {
    self.tempMinPrice = @"";
    self.tempMaxPrice = @"";
    self.minPrice = self.tempMinPrice;
    self.maxPrice = self.tempMaxPrice;
    [self setPriceSlicerWithMin:self.tempMinPrice andMax:self.tempMaxPrice];
    [self.btnMenuItem setTitle:@"租金" forState:UIControlStateNormal];
    [self.btnMenuItem setTitleColor:APP_TEXT_BLACK_COLOR forState:UIControlStateNormal];
}

- (void)resetAction {
    self.tempMinPrice = @"";
    self.tempMaxPrice = @"";
    [self setPriceSlicerWithMin:self.tempMinPrice andMax:self.tempMaxPrice];
}

- (void)confirmAction {
    [self setPriceSlicerWithMin:self.tempMinPrice andMax:self.tempMaxPrice];
    self.minPrice = self.tempMinPrice;
    self.maxPrice = self.tempMaxPrice;
    
    [self.btnMenuItem setTitleColor:[self.minPrice isEqualToString:@""] && [self.maxPrice isEqualToString:@""] ? APP_TEXT_BLACK_COLOR : APP_THEME_COLOR forState:UIControlStateNormal];
    
    [self updateFilter];
    
//    [FHTTracker saveEventWithName:@"RentClick" data:[self filterParameter]];
}

- (void)setPriceSlicerWithMin:(NSString *)min andMax:(NSString *)max {
    NSString *tempMin = [min length] == 0 ? @"" : min;
    NSString *tempMax = [max length] == 0 ? @"10000" : max;
    
    [self.slider updateMinPrice:tempMin maxPrice:tempMax];
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
        NSDictionary *item = self.items[indexPath.row];
        [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
        
        self.tempMinPrice = item[keyOptionParameter][@"minPrice"];
        self.tempMaxPrice = item[keyOptionParameter][@"maxPrice"];
    }else {
        [self reset];
    }
    
    [self confirmAction];
}


- (void)_didPriceSliderValueChanged:(ConditionFilterPriceSlider *)slider {
    self.tempMinPrice = [slider.minPrice isEqualToString:@"0"] || [slider.minPrice length] == 0 ? @"" : slider.minPrice;
    self.tempMaxPrice = [slider.maxPrice isEqualToString:@"10000"] || [slider.maxPrice length] == 0 ? @"" : slider.maxPrice;
}

@end
