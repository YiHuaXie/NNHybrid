//
//  UITableView+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UITableView+NNExtension.h"
#import "NSObject+NNExtension.h"

@implementation UITableView (NNExtension)

#pragma mark - Public

- (void)nn_registerNibCellsWithClasses:(NSArray<Class> *)classes {
    [self nn_registerCellsWithClasses:classes isNib:YES];
}

- (void)nn_registerCellsWithClasses:(NSArray<Class> *)classes {
    [self nn_registerCellsWithClasses:classes isNib:NO];
}

- (void)nn_registerNibHeaderFootersWithClasses:(NSArray<Class> *)classes {
    [self nn_registerHeaderFootersWithClasses:classes isNib:YES];
}

- (void)nn_registerHeaderFootersWithClasses:(NSArray<Class> *)classes {
    [self nn_registerHeaderFootersWithClasses:classes isNib:NO];
}

- (BOOL)nn_rowVisibleAtIndexPath:(NSIndexPath *)indexPath {
    for (NSIndexPath *tmpIndexPath in self.indexPathsForVisibleRows) {
        if ([indexPath isEqual:tmpIndexPath]) {
            return YES;
        }
    }
    
    return NO;
}

- (void)nn_deselectRowsWithAnimated:(BOOL)animated {
    for (NSIndexPath *indexPath in self.indexPathsForSelectedRows) {
        [self deselectRowAtIndexPath:indexPath animated:animated];
    }
}

#pragma mark - Private

- (void)nn_registerCellsWithClasses:(NSArray<Class> *)classes isNib:(BOOL)isNib {
    for (Class cellClass in classes) {
        NSString *classString = cellClass.nn_classString;
        isNib == YES ?
        [self registerNib:[UINib nibWithNibName:classString bundle:nil] forCellReuseIdentifier:classString] :
        [self registerClass:cellClass forCellReuseIdentifier:classString];
    }
}

- (void)nn_registerHeaderFootersWithClasses:(NSArray<Class> *)classes isNib:(BOOL)isNib {
    for (Class headerFooterClass in classes) {
        NSString *classString = headerFooterClass.nn_classString;
        isNib == YES ?
        [self registerNib:[UINib nibWithNibName:classString bundle:nil] forHeaderFooterViewReuseIdentifier:classString] :
        [self registerClass:headerFooterClass forHeaderFooterViewReuseIdentifier:classString];
    }
}

@end
