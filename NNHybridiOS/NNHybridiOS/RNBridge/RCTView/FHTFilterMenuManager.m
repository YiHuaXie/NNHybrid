//
//  FHTFilterMenuManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/20.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "FHTFilterMenuManager.h"

#import "FHTFilterMenu.h"
#import "FilterMenuRentTypeController.h"
#import "FilterMenuGeographicController.h"
#import "FilterMenuOrderByController.h"
#import "FilterMenuMoreController.h"
#import "FilterMenuRentalController.h"

@implementation FHTFilterMenuManager

RCT_EXPORT_MODULE();

- (UIView *)view {
    FilterMenuRentTypeController *rentTypeVC = [[FilterMenuRentTypeController alloc] initWithStyle:UITableViewStylePlain];
    rentTypeVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
        
    };
    
    FilterMenuGeographicController *geographicVC = [FilterMenuGeographicController new];
    geographicVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {

    };
    
    FilterMenuRentalController *rentalVC = [[FilterMenuRentalController alloc] initWithStyle:UITableViewStylePlain];
    rentalVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {

    };
    
    FilterMenuMoreController *moreVC = [[FilterMenuMoreController alloc] init];
    moreVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
        
    };
    FilterMenuOrderByController *orderByVC = [[FilterMenuOrderByController alloc] initWithStyle:UITableViewStylePlain];
    orderByVC.didSetFilterHandler = ^(NSDictionary * _Nonnull params) {
    };
    
    FHTFilterMenu *filterMenu = [[FHTFilterMenu alloc] initWithFrame:CGRectMake(0, FULL_NAVIGATION_BAR_HEIGHT, SCREEN_WIDTH, 44)];
    filterMenu.filterControllers = @[rentTypeVC, geographicVC, rentalVC, moreVC, orderByVC];
    
    UINavigationController *nav = (UINavigationController *)SharedApplication.keyWindow.rootViewController;
    [filterMenu showFilterMenuOnView:nav.visibleViewController.view];
    [filterMenu dismissSubmenu:NO];
    [filterMenu resetFilter];
    
    filterMenu.filterDidChangedHandler = ^(FHTFilterMenu * _Nonnull filterMenu, id<FHTFilterController>  _Nonnull filterController) {
        
    };
    
    return filterMenu;
}

@end
