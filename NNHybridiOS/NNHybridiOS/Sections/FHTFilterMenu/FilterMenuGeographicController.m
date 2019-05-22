//
//  FilterMenuGeographicController.m
//  MYRoom
//
//  Created by Snow on 2019/3/13.
//  Copyright © 2019 Perfect. All rights reserved.
//

#import "FilterMenuGeographicController.h"
#import "BaseFilterCell.h"
#import "MenuAreaModel.h"
#import "CityManager.h"
#import "LocationManager.h"
#import "FilterMenuBottomBar.h"
#import "FHTFilterMenu.h"

static NSArray *_filterStrings = nil;

static ConstString kDistanceKey = @"kDistanceKey";
static ConstString kDistanceValue = @"kDistanceValue";

static ConstString kSelectedFirstLayerIndex = @"kSelectedFirstLayerIndex";
static ConstString kSelectedSecondLayerIndex = @"kSelectedSecondLayerIndex";
static ConstString kSelectedThirdLayerIndexs = @"kSelectedThirdLayerIndexs";

typedef NS_ENUM(NSInteger, DataType) {
    DataTypeArea,
    DataTypeSubway,
    DataTypeDistance,
};

typedef NS_ENUM(NSInteger, AnimationType) {
    AnimationTypeToLeft,
    AnimationTypeToRight,
    AnimationTypeStill,
};

@interface FilterMenuGeographicController () <UITableViewDataSource, UITableViewDelegate, FHTFilterController>

@property (nonatomic, strong) FilterMenuBottomBar *bottomBar;
@property (nonatomic, strong) UITableView *firstLayerTableView;
@property (nonatomic, strong) UITableView *secondLayerTableView;
@property (nonatomic, strong) UITableView *thirdLayerTableView;

@property (nonatomic, copy) NSArray *firstLayerData;
@property (nonatomic, copy) NSArray *secondLayerData;
@property (nonatomic, copy) NSArray *thirdLayerData;

@property (nonatomic, assign) NSInteger firstLayerIndex;
@property (nonatomic, assign) NSInteger secondLayerIndex;
@property (nonatomic, copy) NSArray *thirdLayerIndexs;
@property (nonatomic, copy) NSDictionary *allIndexs;

@property (nonatomic, copy) NSArray *areaData;
@property (nonatomic, copy) NSArray *subwayData;
@property (nonatomic, copy) NSArray *distanceData;

@end

@implementation FilterMenuGeographicController

#pragma mark - Lifecycle

- (instancetype)init {
    if (self = [super init]) {
        self.cityId = SharedCityManager.selectedCityId;
    }
    
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];

    _filterStrings = @[@"不限", @"市辖区", @"1km", @"2km", @"3km"];
    self.allIndexs = @{};

    [self _setupSubViews];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];

    NSNumber *firstLayerIndex = self.allIndexs[kSelectedFirstLayerIndex];
    NSNumber *secondLayerIndex = self.allIndexs[kSelectedSecondLayerIndex];
    NSArray *thirdLayerIndexs = self.allIndexs[kSelectedThirdLayerIndexs];

    [self _updateAllTableViewDataWithFirstLayerIndex:firstLayerIndex.integerValue
                                    secondLayerIndex:secondLayerIndex.integerValue
                                    thirdLayerIndexs:thirdLayerIndexs];
    
    [self _updateAllTableViewFrameWithAnimated:NO];

    [self.btnMenuItem setTitleColor:APP_THEME_COLOR forState:UIControlStateNormal];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    
    NSNumber *firstLayerIndex = self.allIndexs[kSelectedFirstLayerIndex];
    NSNumber *secondLayerIndex = self.allIndexs[kSelectedSecondLayerIndex];
    
    UIColor *color = firstLayerIndex.integerValue == 0 && secondLayerIndex.integerValue == 0 ? APP_TEXT_BLACK_COLOR : APP_THEME_COLOR;
    [self.btnMenuItem setTitleColor:color forState:UIControlStateNormal];
}

#pragma mark - Private

- (void)_setupSubViews {
    self.firstLayerTableView = [self _createTableView];
    self.firstLayerTableView.backgroundColor = UIColor.whiteColor;
    self.secondLayerTableView = [self _createTableView];
    self.secondLayerTableView.backgroundColor = nn_colorHex(0xF8F8F7);
    self.thirdLayerTableView = [self _createTableView];
    self.thirdLayerTableView.backgroundColor = nn_colorHex(0xF4F4F4);
    self.thirdLayerTableView.allowsMultipleSelection = YES;

    [self.view addSubview:self.firstLayerTableView];
    [self.view addSubview:self.secondLayerTableView];
    [self.view addSubview:self.thirdLayerTableView];

    CGFloat tableW = self.view.width / 2.0;
    CGFloat tableH = [self heightForSubmenus] - 75;
    self.firstLayerTableView.frame = CGRectMake(0, 0, tableW, tableH);
    self.secondLayerTableView.frame = CGRectMake(tableW, 0, tableW, tableH);
    self.thirdLayerTableView.frame = CGRectMake(SCREEN_WIDTH, 0, SCREEN_WIDTH / 3.0, tableH);

    self.bottomBar = [[FilterMenuBottomBar alloc] initWithFrame:CGRectMake(0, tableH, SCREEN_WIDTH, 75)];
    [self.view addSubview:self.bottomBar];

    WEAK_SELF;

    self.bottomBar.resetButtonPressedHandler = ^{
        [weakSelf _updateAllTableViewDataWithFirstLayerIndex:0 secondLayerIndex:0 thirdLayerIndexs:nil];
        [weakSelf _updateAllTableViewFrameWithAnimated:YES];
        [weakSelf.btnMenuItem setTitle:@"区域" forState:UIControlStateNormal];
        [weakSelf.btnMenuItem setTitleColor:APP_TEXT_BLACK_COLOR forState:UIControlStateNormal];
    };

    self.bottomBar.confirmButtonPressedHandler = ^{
        [weakSelf _confirmAction];
    };
}

- (UITableView *)_createTableView {
    UITableView *tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
    tableView.dataSource = self;
    tableView.delegate = self;
    tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    tableView.showsHorizontalScrollIndicator = NO;
    tableView.showsVerticalScrollIndicator = NO;
    tableView.rowHeight = 45.0;
    [tableView nn_registerCellsWithClasses:@[BaseFilterCell.class]];

    return tableView;
}

- (void)_updateAllTableViewDataWithFirstLayerIndex:(NSInteger)firstLayerIndex
                                  secondLayerIndex:(NSInteger)secondLayerIndex
                                  thirdLayerIndexs:(NSArray *)thirdLayerIndexs {
    self.firstLayerIndex = firstLayerIndex;
    self.secondLayerIndex = secondLayerIndex;
    self.thirdLayerIndexs = nn_makeSureArray(thirdLayerIndexs);

    self.firstLayerData =
    [SharedLocationManager locationAuthorizedDenied] ?
    @[@"区域", @"地铁"] :
    @[@"区域", @"地铁", @"周边"];
    self.secondLayerData = [self _nextLayerDataWithCurrentLayerTableView:self.firstLayerTableView
                                                             atIndexPath:[NSIndexPath indexPathForRow:firstLayerIndex inSection:0]];
    self.thirdLayerData = [self _nextLayerDataWithCurrentLayerTableView:self.secondLayerTableView
                                                            atIndexPath:[NSIndexPath indexPathForRow:secondLayerIndex inSection:0]];

    [self.firstLayerTableView reloadData];
    [self.secondLayerTableView reloadData];
    [self.thirdLayerTableView reloadData];

    NSArray *firstLayerIndexs = self.firstLayerData.count > 0 ? @[@(firstLayerIndex)] : nil;
    [self _tableView:self.firstLayerTableView selectRowsAtIndexs:firstLayerIndexs
      scrollPosition:UITableViewScrollPositionMiddle];

    NSArray *secondLayerIndexs = self.secondLayerData.count > 0 ? @[@(secondLayerIndex)] : nil;
    [self _tableView:self.secondLayerTableView selectRowsAtIndexs:secondLayerIndexs
      scrollPosition:UITableViewScrollPositionMiddle];

    [self _tableView:self.thirdLayerTableView selectRowsAtIndexs:thirdLayerIndexs
      scrollPosition:UITableViewScrollPositionMiddle];
}

- (void)_tableView:(UITableView *)tableView selectRowsAtIndexs:(NSArray *)indexs
    scrollPosition:(UITableViewScrollPosition)posotion {
    for (NSNumber *number in indexs) {
        NSIndexPath *indexPath = [NSIndexPath indexPathForRow:number.integerValue inSection:0];
        [tableView selectRowAtIndexPath:indexPath
                               animated:NO
                         scrollPosition:posotion];
    }
}

/**
 * 获取元素对应的文字
 */
- (NSString *)_stringFromElement:(id)element {
    if ([element isKindOfClass:MenuAreaModel.class]) {
        return ((MenuAreaModel *)element).name;
    } else if ([element isKindOfClass:MenuZoneModel.class]) {
        return ((MenuZoneModel *)element).name;
    } else if ([element isKindOfClass:MenuSubwayRouteModel.class]) {
         return ((MenuSubwayRouteModel *)element).subwayRouteName;
    } else if ([element isKindOfClass:MenuSubwayStationModel.class]) {
        return ((MenuSubwayStationModel *)element).stationName;
    } else if ([element isKindOfClass:NSDictionary.class]) {
        return ((NSDictionary *)element)[kDistanceKey];
    }else if ([element isKindOfClass:NSString.class]) {
        return element;
    } else {
        return nil;
    }
}

/**
 * 列表对应的数据
 */
- (NSArray *)_dataInTableView:(UITableView *)tableView {
    if (tableView == self.firstLayerTableView) {
        return self.firstLayerData;
    } else if (tableView == self.secondLayerTableView) {
        return self.secondLayerData;
    } else {
        return self.thirdLayerData;
    }
}

/**
 * 获取当前列表选择cell对应的下一层数据
 * @param tableView 当前列表
 * @param indexPath 选择cell的位置
 */
- (NSArray *)_nextLayerDataWithCurrentLayerTableView:(UITableView *)tableView atIndexPath:(NSIndexPath *)indexPath {
    if (tableView == self.firstLayerTableView) {
        switch ([self currentDataType]) {
            case DataTypeArea:
                return self.areaData;
            case DataTypeSubway:
                return self.subwayData;
            case DataTypeDistance:
                return self.distanceData;
            default:
                return nil;
        }
    } else if (tableView == self.secondLayerTableView) {
        NSMutableArray *tmp = [NSMutableArray array];
        switch ([self currentDataType]) {
            case DataTypeArea: {
                MenuAreaModel *area = self.areaData[indexPath.row];
                if (![self _needFilterWithString:area.name]) {
                    MenuZoneModel *zone = [MenuZoneModel new];
                    zone.name = @"不限";
                    zone.zoneId = @"";
                    [tmp addObject:zone];
                }
                [tmp addObjectsFromArray:area.children];

                return [tmp copy];
            }
            case DataTypeSubway: {
                MenuSubwayRouteModel *route = self.subwayData[indexPath.row];
                if (![self _needFilterWithString:route.subwayRouteName]) {
                    MenuSubwayStationModel *station = [MenuSubwayStationModel new];
                    station.stationName = @"不限";
                    station.stationCode = @"";
                    [tmp addObject:station];
                }
                [tmp addObjectsFromArray:route.subwayStationInfo];

                return [tmp copy];
            }
            case DataTypeDistance:
            default:
                return nil;
        }
    }

    return nil;
}

/**
 * 是否为需要过滤的文字
 */
- (BOOL)_needFilterWithString:(NSString *)string {
    if (string.length) {
        return [_filterStrings containsObject:string];
    }

    return NO;
}

/**
 * 更新所有列表的frame
 * @param animated 是否需要动画
 */
- (void)_updateAllTableViewFrameWithAnimated:(BOOL)animated {
    AnimationType type = AnimationTypeStill;

    if (self.thirdLayerTableView.x >= SCREEN_WIDTH && self.thirdLayerData.count > 0) {
        type = AnimationTypeToLeft;
    } else if (self.thirdLayerTableView.x < SCREEN_WIDTH && self.thirdLayerData.count <=0) {
        type = AnimationTypeToRight;
    }

    if (type != AnimationTypeStill) {
        CGFloat tableW = SCREEN_WIDTH / (type == AnimationTypeToLeft ? 3.0 : 2.0);
        [UIView animateKeyframesWithDuration:animated ? 0.3 : 0.0
                                       delay:0.f
                                     options:UIViewKeyframeAnimationOptionLayoutSubviews
                                  animations:^{
                                      self.firstLayerTableView.width = tableW;
                                      self.secondLayerTableView.x = tableW;
                                      self.secondLayerTableView.width = tableW;
                                      self.thirdLayerTableView.x = tableW * 2;
                                  }
                                  completion:nil];
    }
}

- (void)_confirmAction {
    self.allIndexs = @{kSelectedFirstLayerIndex: @(self.firstLayerIndex),
                       kSelectedSecondLayerIndex: @(self.secondLayerIndex),
                       kSelectedThirdLayerIndexs: nn_makeSureArray(self.thirdLayerIndexs)};
    [self updateFilter];
    
//    [FHTTracker saveEventWithName:@"AreaClick" data:[self filterParameter]];
}

/**
 * 第三个列表多选的处理逻辑：
 * 1. 判断是否选中的是需要过滤字段，是进行网络请求，否则进入2；
 * 2. 选择item为0的s时候，点亮第一个，item数量大于1的时候，列表第0条即不限取消选中，进入3；
 * 3. 更新thirdLayerIndexs
 */
- (void)_thirdLayerTableViewDidSelectOrDeselectRowAtIndexPath:(nonnull NSIndexPath *)indexPath {
    NSString *string = [self _stringFromElement:self.thirdLayerData[indexPath.row]];
    if ([self _needFilterWithString:string]) {
        self.thirdLayerIndexs = [@[@0] mutableCopy];
        [self _confirmAction];
    }
    
    NSArray *indexPaths = [self.thirdLayerTableView indexPathsForSelectedRows];
    if (indexPaths.count == 0) {
        self.thirdLayerIndexs = [@[@0] mutableCopy];
        [self _tableView:self.thirdLayerTableView selectRowsAtIndexs:self.thirdLayerIndexs
          scrollPosition:UITableViewScrollPositionNone];
    } else if (indexPaths.count > 1) {
        [self.thirdLayerTableView deselectRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] animated:NO];
    }
    
    NSMutableArray *indexs = [NSMutableArray array];
    for (NSIndexPath *indexPath in [self.thirdLayerTableView indexPathsForSelectedRows]) {
        [indexs addObject:@(indexPath.row)];
    }
    
    self.thirdLayerIndexs = [indexs copy];
}

#pragma mark - UITableViewDataSource

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self _dataInTableView:tableView].count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    BaseFilterCell *cell = [tableView dequeueReusableCellWithIdentifier:BaseFilterCell.nn_classString];
    NSArray *data = [self _dataInTableView:tableView];
    cell.contentLabel.text = [self _stringFromElement:data[indexPath.row]];

    return cell;
}

#pragma mark - UITableViewDelegate

- (void)tableView:(UITableView *)tableView didDeselectRowAtIndexPath:(nonnull NSIndexPath *)indexPath {
    if (tableView == self.thirdLayerTableView) {
        [self _thirdLayerTableViewDidSelectOrDeselectRowAtIndexPath:indexPath];
    }
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (tableView == self.firstLayerTableView) {
        if (self.firstLayerIndex == indexPath.row) {
            return;
        }
        
        // do first layer
        self.firstLayerIndex = indexPath.row;
        // do second layer
        self.secondLayerData = [self _nextLayerDataWithCurrentLayerTableView:tableView
                                                                atIndexPath:indexPath];
        self.secondLayerIndex = 0;
        [self.secondLayerTableView reloadData];
        NSArray *secondLayerIndexs = self.secondLayerData.count ? @[@(self.secondLayerIndex)] : nil;
        [self _tableView:self.secondLayerTableView selectRowsAtIndexs:secondLayerIndexs
          scrollPosition:UITableViewScrollPositionNone];
        
        // do third layer
        self.thirdLayerData = nil;
        self.thirdLayerIndexs = nil;
        [self.thirdLayerTableView reloadData];

        [self _updateAllTableViewFrameWithAnimated:YES];
    } else if (tableView == self.secondLayerTableView) {
        NSString *string = [self _stringFromElement:self.secondLayerData[indexPath.row]];
        if ([self _needFilterWithString:string]) {
            self.secondLayerIndex = indexPath.row;
            self.thirdLayerIndexs = nil;
            [self _confirmAction];

            return;
        }

        if (self.secondLayerIndex == indexPath.row) {
            return;
        }
        
        // do second layer
        self.secondLayerIndex = indexPath.row;
        // do third layer
        self.thirdLayerData = [self _nextLayerDataWithCurrentLayerTableView:tableView
                                                                 atIndexPath:indexPath];
        NSArray *thirdLayerIndexs = self.thirdLayerData.count ? @[@0] : nil;
        self.thirdLayerIndexs = thirdLayerIndexs;
        [self.thirdLayerTableView reloadData];
        [self _tableView:self.thirdLayerTableView selectRowsAtIndexs:self.thirdLayerIndexs
          scrollPosition:UITableViewScrollPositionMiddle];
        
        [self _updateAllTableViewFrameWithAnimated:YES];
    } else {
        [self _thirdLayerTableViewDidSelectOrDeselectRowAtIndexPath:indexPath];
    }
}

#pragma mark - FHTFilterController

- (void)reset {
    [self _updateAllTableViewDataWithFirstLayerIndex:0 secondLayerIndex:0 thirdLayerIndexs:nil];
    self.allIndexs = @{};
    [self.btnMenuItem setTitle:@"区域" forState:UIControlStateNormal];
    [self.btnMenuItem setTitleColor:APP_TEXT_BLACK_COLOR forState:UIControlStateNormal];
}

- (CGFloat)heightForSubmenus {
    return 395;
}

- (NSDictionary *)filterParameter {
    switch ([self currentDataType]) {
        case DataTypeArea: {
            NSMutableDictionary *tmpDict = [NSMutableDictionary dictionary];
            MenuAreaModel *area = self.secondLayerData[self.secondLayerIndex];
            tmpDict[@"regionId"] = nn_makeSureString(area.regionId);

            NSMutableArray *tmpArray = [NSMutableArray array];
            for (NSNumber *number in self.thirdLayerIndexs) {
                MenuZoneModel *zone = self.thirdLayerData[number.integerValue];
                if (zone.zoneId.length) {
                    [tmpArray addObject:nn_makeSureString(zone.zoneId)];
                }
            }
            tmpDict[@"zoneIds"] = [tmpArray copy];

            return [tmpDict copy];
        }
        case DataTypeSubway: {
            NSMutableDictionary *tmpDict = [NSMutableDictionary dictionary];
            MenuSubwayRouteModel *route = self.secondLayerData[self.secondLayerIndex];
            tmpDict[@"subwayRouteId"] = nn_makeSureString(route.routeCode);

            NSMutableArray *tmpArray = [NSMutableArray array];
            for (NSNumber *number in self.thirdLayerIndexs) {
                MenuSubwayStationModel *station = self.thirdLayerData[number.integerValue];
                if (station.stationCode.length) {
                    [tmpArray addObject:nn_makeSureString(station.stationCode)];
                }
            }
            tmpDict[@"subwayStationCodes"] = [tmpArray copy];

            return [tmpDict copy];
        }
        case DataTypeDistance: {
            NSMutableDictionary *tmpDict = [NSMutableDictionary dictionary];
            NSDictionary *distance = self.secondLayerData[self.secondLayerIndex];
            tmpDict[@"distanceKey"] = distance[kDistanceValue];

            return [tmpDict copy];
        }
        default:
            return @{};
    }
}

- (void)presetWithOptionTitles:(NSArray<NSString *> *)titles {

}

#pragma mark - Setter

- (void)setCityId:(NSString *)cityId {
    if (![cityId isEqualToString:_cityId]) {
        _areaData = nil;
    }
    
    _cityId = cityId;
}

- (void)setOriginalSubwayData:(NSArray *)originalSubwayData {
    _originalSubwayData = originalSubwayData;
    _subwayData = nil;
}

#pragma mark - Getter

- (NSArray *)areaData {
    if (!_areaData) {
        NSMutableArray *tmp = [NSMutableArray array];
        MenuAreaModel *model = [MenuAreaModel new];
        model.name = @"不限";
        model.regionId = @"";
        model.children = @[];
        [tmp addObject:model];
        
        for (NSDictionary *dict in [SharedCityManager getCityRegionListWithCityId:self.cityId]) {
            [MenuAreaModel mj_setupObjectClassInArray:^NSDictionary *{
                return @{@"children" : @"MenuZoneModel"};
            }];
            MenuAreaModel *model = [MenuAreaModel mj_objectWithKeyValues:dict];
            [tmp addObject:model];
        }
        _areaData = tmp;
    }
    
    return _areaData;
}

- (NSArray *)subwayData {
    if (!_subwayData) {
        NSMutableArray *tmp = [NSMutableArray array];
        MenuSubwayRouteModel *model = [MenuSubwayRouteModel new];
        model.subwayRouteName = @"不限";
        model.routeCode = @"";
        model.subwayStationInfo = @[];
        [tmp addObject:model];
        
        [tmp addObjectsFromArray:[MenuSubwayRouteModel mj_objectArrayWithKeyValuesArray:self.originalSubwayData]];
        
        _subwayData = [tmp copy];
    }
    
    return _subwayData;
}

- (NSArray *)distanceData {
    if (!_distanceData) {
        _distanceData = @[@{kDistanceKey: @"不限", kDistanceValue: @0},
                          @{kDistanceKey: @"1km", kDistanceValue: @1},
                          @{kDistanceKey: @"2km", kDistanceValue: @2},
                          @{kDistanceKey: @"3km", kDistanceValue: @3}];
    }
    
    return _distanceData;
}

- (DataType)currentDataType {
    return self.firstLayerIndex;
}

@end
