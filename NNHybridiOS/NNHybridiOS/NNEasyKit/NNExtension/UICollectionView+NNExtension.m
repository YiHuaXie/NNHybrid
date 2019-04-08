//
//  UICollectionView+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/8/15.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UICollectionView+NNExtension.h"
#import "NSObject+NNExtension.h"

@implementation UICollectionView (NNExtension)

- (void)nn_registerNibCellsWithClasses:(NSArray<Class> *)classes {
    [self nn_registerCellsWithClasses:classes isNib:YES];
}

- (void)nn_registerCellsWithClasses:(NSArray<Class> *)classes {
    [self nn_registerCellsWithClasses:classes isNib:NO];
}

- (void)nn_registerNibHeadersWithClasses:(NSArray<Class> *)classes {
    [self nn_registerClasses:classes forSupplementaryViewOfKind:UICollectionElementKindSectionHeader isNib:YES];
}

- (void)nn_registerHeadersWithClasses:(NSArray<Class> *)classes {
    [self nn_registerClasses:classes forSupplementaryViewOfKind:UICollectionElementKindSectionHeader isNib:NO];
}

- (void)nn_regiterNibFootersWithClasses:(NSArray<Class> *)classes {
    [self nn_registerClasses:classes forSupplementaryViewOfKind:UICollectionElementKindSectionFooter isNib:YES];
}

- (void)nn_registerFootersWithClasses:(NSArray<Class> *)classes {
    [self nn_registerClasses:classes forSupplementaryViewOfKind:UICollectionElementKindSectionFooter isNib:NO];
}

- (__kindof UICollectionReusableView *)nn_dequeueSectionHeaderViewWithReuseIdentifier:(NSString *)identifier
                                                                         forIndexPath:(NSIndexPath *)indexPath {
    return [self dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionHeader
                                    withReuseIdentifier:identifier
                                           forIndexPath:indexPath];
}

- (__kindof UICollectionReusableView *)nn_dequeueSectionFooterViewWithReuseIdentifier:(NSString *)identifier
                                                                         forIndexPath:(NSIndexPath *)indexPath {
    return [self dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionFooter
                                    withReuseIdentifier:identifier
                                           forIndexPath:indexPath];
}

- (BOOL)nn_itemVisibleAtIndexPath:(NSIndexPath *)indexPath {
    for (NSIndexPath *tmpIndexPath in self.indexPathsForVisibleItems) {
        if ([indexPath isEqual:tmpIndexPath]) {
            return YES;
        }
    }
    
    return NO;
}

- (void)nn_deselectItemsWithAnimated:(BOOL)animated {
    for (NSIndexPath *indexPath in self.indexPathsForSelectedItems) {
        [self deselectItemAtIndexPath:indexPath animated:animated];
    }
}

#pragma mark - Private

- (void)nn_registerCellsWithClasses:(NSArray<Class> *)classes isNib:(BOOL)isNib {
    for (Class aClass in classes) {
        NSString *classString = aClass.nn_classString;
        isNib == YES ?
        [self registerNib:[UINib nibWithNibName:classString bundle:nil] forCellWithReuseIdentifier:classString] :
        [self registerClass:aClass forCellWithReuseIdentifier:classString];
    }
}

- (void)nn_registerClasses:(NSArray<Class> *)classes forSupplementaryViewOfKind:(NSString *)elementKind isNib:(BOOL)isNib {
    for (Class aClass in classes) {
        NSString *classString = aClass.nn_classString;
        isNib == YES ?
        [self registerNib:[UINib nibWithNibName:classString bundle:nil] forSupplementaryViewOfKind:elementKind withReuseIdentifier:classString] :
        [self registerClass:aClass forSupplementaryViewOfKind:elementKind withReuseIdentifier:classString];
    }
}

@end
