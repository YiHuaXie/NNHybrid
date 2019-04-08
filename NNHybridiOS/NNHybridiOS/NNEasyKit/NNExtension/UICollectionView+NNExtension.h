//
//  UICollectionView+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/8/15.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UICollectionView (NNExtension)

- (void)nn_registerCellsWithClasses:(NSArray <Class>*)classes;
- (void)nn_registerNibCellsWithClasses:(NSArray <Class>*)classes;

- (void)nn_registerNibHeadersWithClasses:(NSArray<Class> *)classes;
- (void)nn_registerHeadersWithClasses:(NSArray<Class> *)classes;

- (void)nn_regiterNibFootersWithClasses:(NSArray<Class> *)classes;
- (void)nn_registerFootersWithClasses:(NSArray<Class> *)classes;

- (__kindof UICollectionReusableView *)nn_dequeueSectionHeaderViewWithReuseIdentifier:(NSString *)identifier
                                                                         forIndexPath:(NSIndexPath *)indexPath;
- (__kindof UICollectionReusableView *)nn_dequeueSectionFooterViewWithReuseIdentifier:(NSString *)identifier
                                                                         forIndexPath:(NSIndexPath *)indexPath;

- (BOOL)nn_itemVisibleAtIndexPath:(NSIndexPath *)indexPath;

- (void)nn_deselectItemsWithAnimated:(BOOL)animated;

@end
