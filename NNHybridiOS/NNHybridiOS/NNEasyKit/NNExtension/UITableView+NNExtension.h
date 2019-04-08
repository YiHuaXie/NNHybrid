//
//  UITableView+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UITableView (NNExtension)

- (void)nn_registerNibCellsWithClasses:(NSArray<Class> *)classes;
- (void)nn_registerCellsWithClasses:(NSArray<Class> *)classes;

- (void)nn_registerNibHeaderFootersWithClasses:(NSArray<Class> *)classes;
- (void)nn_registerHeaderFootersWithClasses:(NSArray<Class> *)classes;

- (BOOL)nn_rowVisibleAtIndexPath:(NSIndexPath *)indexPath;

- (void)nn_deselectRowsWithAnimated:(BOOL)animated;

@end
