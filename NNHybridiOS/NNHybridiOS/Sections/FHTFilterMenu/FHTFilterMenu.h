//
//  FHTFilterMenu.h
//  MYRoom
//
//  Created by Snow on 2018/12/4.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol FHTFilterController;

@interface FHTFilterMenu : UIView

@property (nonatomic, readonly, strong) NSDictionary *filterParameters;

@property (nullable, nonatomic, copy) NSArray<__kindof UIViewController<FHTFilterController> *> *filterControllers;

- (void)resetFilter;

- (void)dismissSubmenu:(BOOL)animated;

- (void)showFilterMenuOnView:(UIView *)embedInView;

- (void)changeFilterByFilterController:(id<FHTFilterController>)filterController;

@property (nonatomic, copy) void (^filterDidChangedHandler)(FHTFilterMenu *filterMenu, id<FHTFilterController> filterController);

@end

@protocol FHTFilterController <NSObject>

@optional
@property(nonatomic, strong) UIButton *btnMenuItem;
@property(nonatomic, copy) void (^didSetFilterHandler)(NSDictionary *params);

@property(nullable, nonatomic, readonly, weak) FHTFilterMenu *filterMenu;

/**
 * 子菜单高度
 * @return
 */
- (CGFloat)heightForSubmenus;
/**
 *
 * @return
 */
- (NSDictionary *)filterParameter;

- (void)presetWithOptionTitles:(NSArray<NSString *> *)titles;

- (void)reset;

- (void)updateFilter;

@end

@interface UIViewController (FHTFilterMenuItem)<FHTFilterController>

@end

@interface FHTFilterMenuButton : UIButton

@end



NS_ASSUME_NONNULL_END
