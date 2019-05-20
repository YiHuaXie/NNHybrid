//
//  FilterMenuMoreController.m
//  MYRoom
//
//  Created by Snow on 2018/12/5.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import "FilterMenuMoreController.h"
#import "FHTFilterMenu.h"
#import "FilterMenuBottomBar.h"
#import "FilterSubmenuCell.h"

static NSString *const kMenuMoreViewCellID = @"menuMoreViewCellID";
static NSString *const kMenuMoreHeadViewID = @"menuMoreHeadViewID";

static NSString *const keyOptionTitle = @"keyOptionTitle";
static NSString *const keyOptionParameter = @"keyOptionParameter";

@interface FilterMenuMoreController () <UICollectionViewDataSource,UICollectionViewDelegate, UICollectionViewDelegateFlowLayout>

@property (nonatomic, strong) FilterMenuBottomBar *bottomBar;
@property (nonatomic, strong) NSArray<NSIndexPath *> *selectedItems; // 记录选中
@property (nonatomic, strong) UICollectionView *collectionView;
@property (nonatomic, strong) NSArray *dataArray;

@end

@implementation FilterMenuMoreController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];

    self.collectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(0, 0, self.view.width, 320)
                                             collectionViewLayout:[UICollectionViewFlowLayout new]];
    self.collectionView.backgroundColor = [UIColor whiteColor];
    self.collectionView.allowsMultipleSelection = YES;
    self.collectionView.delegate = self;
    self.collectionView.dataSource = self;
    [self.view addSubview:self.collectionView];
    
    [self.collectionView registerClass:[FilterSubmenuButtonCell class]
            forCellWithReuseIdentifier:kMenuMoreViewCellID];
    [self.collectionView registerClass:[FilterSubmenuCollectionHeadView class]
            forSupplementaryViewOfKind:UICollectionElementKindSectionHeader
                   withReuseIdentifier:kMenuMoreHeadViewID];

    [self.collectionView reloadData];
    
    [self createFooterView];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    // 获取界面选中的IndexPath
    NSArray *selectedItems = [self.collectionView indexPathsForSelectedItems];
    // 清空原界面选中项
    for (NSIndexPath *oldIndexPath in selectedItems) {
        [self.collectionView deselectItemAtIndexPath:oldIndexPath animated:NO];
    }
    // 选中数据需选中的IndexPath
    for (NSIndexPath *newIndexPath in self.selectedItems) {
        [self.collectionView selectItemAtIndexPath:newIndexPath animated:NO scrollPosition:UICollectionViewScrollPositionNone];
    }
}

- (NSArray *)dataArray {
    if (_dataArray == nil) {
        NSArray *highlightArray = @[@{keyOptionTitle : @"独卫",  keyOptionParameter : @"独卫"},
//                                    @{keyOptionTitle : @"电梯房",  keyOptionParameter : @"电梯房"},
                                    @{keyOptionTitle : @"独立厨房",  keyOptionParameter : @"独立厨房"},
                                    @{keyOptionTitle : @"朝南",  keyOptionParameter : @"朝南"},
//                                    @{keyOptionTitle : @"新上",  keyOptionParameter : @"新上"},
                                    @{keyOptionTitle : @"近地铁",  keyOptionParameter : @"近地铁"},
                                    @{keyOptionTitle : @"月付",  keyOptionParameter : @"月付"},
                                    @{keyOptionTitle : @"VR",  keyOptionParameter : @"VR"},
                                    @{keyOptionTitle : @"限时优惠",  keyOptionParameter : @"限时优惠"}];
        
        NSArray *chamberArray = @[@{keyOptionTitle : @"一室", keyOptionParameter : @{@"min" : @"1", @"max" : @"1"}},
                                  @{keyOptionTitle : @"二室", keyOptionParameter : @{@"min" : @"2", @"max" : @"2"}},
                                  @{keyOptionTitle : @"三室", keyOptionParameter : @{@"min" : @"3", @"max" : @"3"}},
                                  @{keyOptionTitle : @"四室及以上", keyOptionParameter : @{@"min" : @"4", @"max" : @""}}];

        NSArray *houseTypeArray = @[@{keyOptionTitle: @"小区房", keyOptionParameter: @{@"type" : @"2"}},
                                    @{keyOptionTitle: @"独栋公寓", keyOptionParameter: @{@"type" : @"1"}}];
        
        _dataArray = @[highlightArray, chamberArray, houseTypeArray];
    }

    return _dataArray;
}

- (void)createFooterView
{
    self.bottomBar = [[FilterMenuBottomBar alloc] initWithFrame:CGRectMake(0, 320, self.view.width, 75)];
    [self.view addSubview:self.bottomBar];

    WEAK_SELF;

    self.bottomBar.resetButtonPressedHandler = ^{
        [weakSelf resetAction];
    };

    self.bottomBar.confirmButtonPressedHandler = ^{
        [weakSelf confirmAction];
    };
}

- (void)resetAction
{
    NSArray *selectedItems = [self.collectionView indexPathsForSelectedItems];
    for (NSIndexPath *indexPath in selectedItems) {
        [self.collectionView deselectItemAtIndexPath:indexPath animated:NO];
    }
}

- (void)confirmAction {
    self.selectedItems = [self.collectionView indexPathsForSelectedItems];
    [self.btnMenuItem setTitleColor:[self.selectedItems count] == 0 ? APP_TEXT_BLACK_COLOR : APP_THEME_COLOR forState:UIControlStateNormal];
    [self updateFilter];

//    [FHTTracker saveEventWithName:@"MoreClick" data:[self filterParameter]];
}

#pragma mark -
- (CGFloat)heightForSubmenus {
    return 475.0;
}

- (NSDictionary *)filterParameter {
    NSMutableArray *highlightArray = [NSMutableArray array];
    NSMutableArray *chamberArray = [NSMutableArray array];
    NSMutableArray *typeArray = [NSMutableArray array];

    
    for (NSIndexPath *indexPath in self.selectedItems) {
        if (indexPath.section == 0) {
            NSDictionary *oneItem = self.dataArray[indexPath.section][indexPath.row];
            [highlightArray addObject:oneItem[keyOptionParameter]];
        }else if (indexPath.section == 1) {
            NSDictionary *oneItem = self.dataArray[indexPath.section][indexPath.row];
            [chamberArray addObject:oneItem[keyOptionParameter]];
        } else if (indexPath.section == 2) {
            NSDictionary *oneItem = self.dataArray[indexPath.section][indexPath.row];
            [typeArray addObject:oneItem[keyOptionParameter]];
        }
    }
    
    return @{@"highlightArray":highlightArray, @"chamberArray":chamberArray, @"typeArray":typeArray};
}

- (void)presetWithOptionTitles:(NSArray<NSString *> *)titles {
    if ([titles count] > 0) {
        [titles enumerateObjectsUsingBlock:^(NSString * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            NSArray *tempComponent = [obj componentsSeparatedByString:@"/"];
            if ([[tempComponent firstObject] isEqualToString:@"房源亮点"]) {
                for (NSInteger i=0; i < [self.dataArray[0] count]; i++) {
                    NSDictionary *item = self.dataArray[0][i];
                    if ([[tempComponent lastObject] isEqualToString:item[keyOptionTitle]]) {
                        self.selectedItems = @[[NSIndexPath indexPathForRow:i inSection:0]];
                    }
                }
            }else if ([[tempComponent firstObject] isEqualToString:@"房源类型"]) {
                for (NSInteger i=0; i < [self.dataArray[2] count]; i++) {
                    NSDictionary *item = self.dataArray[2][i];
                    if ([[tempComponent lastObject] isEqualToString:item[keyOptionTitle]]) {
                        self.selectedItems = @[[NSIndexPath indexPathForRow:i inSection:2]];
                    }
                }
            }
        }];
        [self.btnMenuItem setTitle:@"更多" forState:UIControlStateNormal];
        [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
        
        [self updateFilter];
    }
}

- (void)reset {
    [self.collectionView.indexPathsForSelectedItems enumerateObjectsUsingBlock:^(NSIndexPath * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [self.collectionView deselectItemAtIndexPath:obj animated:NO];
    }];
    self.selectedItems = self.collectionView.indexPathsForSelectedItems;
    [self.btnMenuItem setTitle:@"更多" forState:UIControlStateNormal];
    [self.btnMenuItem setTitleColor:APP_TEXT_BLACK_COLOR forState:UIControlStateNormal];
}


#pragma mark - UICollectionViewDataSource

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return self.dataArray.count;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return [(NSArray *)self.dataArray[section] count];
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    FilterSubmenuButtonCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:kMenuMoreViewCellID forIndexPath:indexPath];
    NSDictionary *item = self.dataArray[indexPath.section][indexPath.row];
    cell.titleLabel.text = item[keyOptionTitle];
    
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView
                  layout:(UICollectionViewLayout*)collectionViewLayout
  sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    return CGSizeMake((self.view.width - 70) / 4, 30);
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView
                        layout:(UICollectionViewLayout *)collectionViewLayout
        insetForSectionAtIndex:(NSInteger)section {
    return UIEdgeInsetsMake(10, 20, 25, 20);
}

- (CGSize)collectionView:(UICollectionView *)collectionView
                  layout:(UICollectionViewLayout *)collectionViewLayout
referenceSizeForHeaderInSection:(NSInteger)section {
    return CGSizeMake(self.view.width,30);
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath {
    if (kind == UICollectionElementKindSectionHeader) {
        NSArray *titleArray = @[@"房源亮点", @"户型", @"房源类型"];
        FilterSubmenuCollectionHeadView *headerView = [collectionView dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:kMenuMoreHeadViewID forIndexPath:indexPath];
        headerView.titleLabel.text = titleArray[indexPath.section];
        return headerView;
    }

    return nil;
}

@end
