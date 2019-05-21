//
//  FHTFilterMenuManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/20.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "FHTFilterMenuManager.h"
#import <objc/runtime.h>

#import "FHTFilterMenu.h"
#import "FilterMenuRentTypeController.h"
#import "FilterMenuGeographicController.h"
#import "FilterMenuOrderByController.h"
#import "FilterMenuMoreController.h"
#import "FilterMenuRentalController.h"

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

- (UIView *)view {
    FilterMenuRentTypeController *rentTypeVC = [[FilterMenuRentTypeController alloc] initWithStyle:UITableViewStylePlain];
    FilterMenuGeographicController *geographicVC = [FilterMenuGeographicController new];
    FilterMenuRentalController *rentalVC = [[FilterMenuRentalController alloc] initWithStyle:UITableViewStylePlain];
    FilterMenuMoreController *moreVC = [FilterMenuMoreController new];
    FilterMenuOrderByController *orderByVC = [[FilterMenuOrderByController alloc] initWithStyle:UITableViewStylePlain];
    
    FHTFilterMenu *filterMenu = [[FHTFilterMenu alloc] initWithFrame:CGRectMake(0, FULL_NAVIGATION_BAR_HEIGHT, SCREEN_WIDTH, 44)];
    filterMenu.filterControllers = @[rentTypeVC, geographicVC, rentalVC, moreVC, orderByVC];
    
    UINavigationController *nav = (UINavigationController *)SharedApplication.keyWindow.rootViewController;
    [filterMenu showFilterMenuOnView:nav.visibleViewController.view];
    [filterMenu dismissSubmenu:NO];
    [filterMenu resetFilter];
    
    __weak FHTFilterMenu *weakFilterMenu = filterMenu;
    
    NNSenderBlock didSetFilterHandler =  ^(NSDictionary *params) {
        NSDictionary *dict = @{@"filterParams": nn_makeSureDictionary(params)};
        BLOCK_EXEC(weakFilterMenu.onUpdateParameters, dict);
    };
    
    rentTypeVC.didSetFilterHandler = [didSetFilterHandler copy];
    geographicVC.didSetFilterHandler = [didSetFilterHandler copy];
    rentalVC.didSetFilterHandler = [didSetFilterHandler copy];
    moreVC.didSetFilterHandler = [didSetFilterHandler copy];
    orderByVC.didSetFilterHandler = [didSetFilterHandler copy];
    
    filterMenu.filterDidChangedHandler = ^(FHTFilterMenu * _Nonnull filterMenu, id<FHTFilterController>  _Nonnull filterController) {
        BLOCK_EXEC(weakFilterMenu.onChangeParameters, nil);
    };
    
    return filterMenu;
}

@end
