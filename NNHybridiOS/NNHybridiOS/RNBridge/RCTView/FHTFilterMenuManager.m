//
//  FHTFilterMenuManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/20.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "FHTFilterMenuManager.h"
#import <React/RCTUIManager.h>
#import <objc/runtime.h>

#import "FHTFilterMenu.h"
#import "FilterMenuRentTypeController.h"
#import "FilterMenuGeographicController.h"
#import "FilterMenuOrderByController.h"
#import "FilterMenuMoreController.h"
#import "FilterMenuRentalController.h"

static ConstString kFilterParams = @"filterParams";

@interface FHTFilterMenu (RNBridge)

@property (nonatomic, copy) RCTBubblingEventBlock onUpdateParameters;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeParameters;

@end

@implementation FHTFilterMenu (RNBridge)

#pragma mark - Setter & Getter

- (void)setOnUpdateParameters:(RCTBubblingEventBlock)onUpdateParameters {
    objc_setAssociatedObject(self,
                             @selector(onUpdateParameters),
                             onUpdateParameters,
                             OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (RCTBubblingEventBlock)onUpdateParameters {
    return objc_getAssociatedObject(self, @selector(onUpdateParameters));
}

- (void)setOnChangeParameters:(RCTBubblingEventBlock)onChangeParameters {
    objc_setAssociatedObject(self,
                             @selector(onChangeParameters),
                             onChangeParameters,
                             OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (RCTBubblingEventBlock)onChangeParameters {
    return objc_getAssociatedObject(self, @selector(onChangeParameters));
}

@end

@implementation FHTFilterMenuManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(onUpdateParameters, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onChangeParameters, RCTBubblingEventBlock);

RCT_CUSTOM_VIEW_PROPERTY(cityId, NSString, FHTFilterMenu) {
    FilterMenuGeographicController *vc = view.filterControllers[1];
    vc.cityId = (NSString *)json;
};

RCT_CUSTOM_VIEW_PROPERTY(subwayData, NSArray, FHTFilterMenu) {
    FilterMenuGeographicController *vc = view.filterControllers[1];
    vc.originalSubwayData = (NSArray *)json;
};


RCT_EXPORT_METHOD(showFilterMenuOnView:(nonnull NSNumber *)containerTag filterMenuTag:(nonnull NSNumber *)filterMenuTag) {
    RCTUIManager *uiManager = self.bridge.uiManager;
    dispatch_async(uiManager.methodQueue, ^{
        [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
            UIView *view = viewRegistry[containerTag];
            FHTFilterMenu *filterMenu = (FHTFilterMenu *)viewRegistry[filterMenuTag];
            [filterMenu showFilterMenuOnView:view];
        }];
    });
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (UIView *)view {
    FilterMenuRentTypeController *rentTypeVC =
    [[FilterMenuRentTypeController alloc] initWithStyle:UITableViewStylePlain];
    FilterMenuGeographicController *geographicVC = [FilterMenuGeographicController new];
    FilterMenuRentalController *rentalVC =
    [[FilterMenuRentalController alloc] initWithStyle:UITableViewStylePlain];
    FilterMenuMoreController *moreVC = [FilterMenuMoreController new];
    FilterMenuOrderByController *orderByVC =
    [[FilterMenuOrderByController alloc] initWithStyle:UITableViewStylePlain];
    
    CGRect frame = CGRectMake(0, FULL_NAVIGATION_BAR_HEIGHT, SCREEN_WIDTH, 44);
    FHTFilterMenu *filterMenu = [[FHTFilterMenu alloc] initWithFrame:frame];
    filterMenu.filterControllers = @[rentTypeVC, geographicVC, rentalVC, moreVC, orderByVC];
    [filterMenu dismissSubmenu:NO];
    [filterMenu resetFilter];
    
    __weak FHTFilterMenu *weakFilterMenu = filterMenu;

    rentTypeVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
        BLOCK_EXEC(weakFilterMenu.onUpdateParameters, @{kFilterParams: params});
    };
    
    geographicVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
        NSMutableDictionary *tmpParams = [@{@"regionId": nn_makeSureString(params[@"regionId"]),
                                            @"zoneIds": nn_makeSureArray(params[@"zoneIds"]),
                                            @"subwayRouteId": nn_makeSureString(params[@"subwayRouteId"]),
                                            @"subwayStationCodes": nn_makeSureArray(params[@"subwayStationCodes"])} mutableCopy];
        
        BLOCK_EXEC(weakFilterMenu.onUpdateParameters, @{kFilterParams: [tmpParams copy]});
    };
    

    rentalVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
        NSDictionary *tmpParams = @{@"minPrice": nn_makeSureString(params[@"minPirce"]),
                                    @"maxPrice": nn_makeSureString(params[@"maxPrice"])};
        BLOCK_EXEC(weakFilterMenu.onUpdateParameters, @{kFilterParams: tmpParams});
    };
    
    moreVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
        NSArray *typeArray = params[@"typeArray"];
        NSString *type = typeArray.count == 1 ? (typeArray.lastObject)[@"type"] : @"";
        
        NSDictionary *tmpParams = @{@"roomAttributeTags": params[@"highlightArray"],
                                    @"chamberCounts": params[@"chamberArray"],
                                    @"type": type};
        
        BLOCK_EXEC(weakFilterMenu.onUpdateParameters, @{kFilterParams: tmpParams});
    };
    
    orderByVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
        BLOCK_EXEC(weakFilterMenu.onUpdateParameters, @{kFilterParams: params});
    };
    
    filterMenu.filterDidChangedHandler = ^(FHTFilterMenu * _Nonnull filterMenu, id<FHTFilterController>  _Nonnull filterController) {
        BLOCK_EXEC(weakFilterMenu.onChangeParameters, nil);
    };
    
    return filterMenu;
}

@end
