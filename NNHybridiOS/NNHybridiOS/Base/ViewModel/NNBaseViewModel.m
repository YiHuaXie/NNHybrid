//
//  NNBaseViewModel.m
//  NNProject
//
//  Created by NeroXie on 2018/12/11.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "NNBaseViewModel.h"

@interface NNBaseViewModel()

@property (nonatomic, weak) UITableView *tableView;
@property (nonatomic, weak) UICollectionView *collectionView;

@property (nonatomic, assign) BOOL tab_didSelected;
@property (nonatomic, assign) BOOL tab_sectionHeader;
@property (nonatomic, assign) BOOL tab_sectionFooter;

@property (nonatomic, assign) BOOL col_didSelected;
@property (nonatomic, assign) BOOL col_sectionHeader;
@property (nonatomic, assign) BOOL col_sectionFooter;

@end

@implementation NNBaseViewModel

#pragma mark - Public

- (void)associateTableView:(UITableView *)tableView inObject:(id<NNBaseViewModelTableProtocol>)object {
    self.tableView = tableView;
    
    tableView.dataSource = self;
    tableView.delegate = self;
    
    self.tableProtocol = object;
}

- (void)associateCollectioView:(UICollectionView *)collectionView inObject:(id<NNBaseViewModelCollectionProtocol>)object {
    self.collectionView = collectionView;
    
    collectionView.dataSource = self;
    collectionView.delegate = self;
    
    self.collectionProtocol = object;
}

- (NSString *)tab_headerTitleForSection:(NSInteger)section {
    return @"";
}

- (NSString *)tab_footerTitleForSection:(NSInteger)section {
    return @"";
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if ([self.tableProtocol respondsToSelector:@selector(nn_scrollViewDidScroll:)]) {
        [self.tableProtocol nn_scrollViewDidScroll:scrollView];
    }
    
    if ([self.collectionProtocol respondsToSelector:@selector(nn_scrollViewDidScroll:)]) {
        [self.collectionProtocol nn_scrollViewDidScroll:scrollView];
    }
}

#pragma mark - UITableViewDataSource

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    return [self.tableProtocol nn_tableView:tableView cellForRowAtIndexPath:indexPath];
}

#pragma mark - UITableViewDelegate

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section {
    if (self.tab_sectionHeader) {
        return [self.tableProtocol nn_tableView:tableView viewForHeaderInSection:section];
    }
    
    return nil;
}

- (UIView *)tableView:(UITableView *)tableView viewForFooterInSection:(NSInteger)section {
    if (self.tab_sectionFooter) {
        [self.tableProtocol nn_tableView:tableView viewForFooterInSection:section];
    }
    
    return nil;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (self.tab_didSelected) {
        [self.tableProtocol nn_tableView:tableView didSelectRowAtIndexPath:indexPath];
    }
}

#pragma mark - UICollectionViewDataSource

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return 0;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    return [self.collectionProtocol nn_collectionView:collectionView
                               cellForItemAtIndexPath:indexPath];
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath {
    if (kind == UICollectionElementKindSectionHeader && self.col_sectionHeader) {
        return [self.collectionProtocol nn_collectionView:collectionView sectionHeaderViewAtIndexPath:indexPath];
    } else if (kind == UICollectionElementKindSectionFooter && self.col_sectionFooter) {
        return [self.collectionProtocol nn_collectionView:collectionView sectionFooterViewAtIndexPath:indexPath];
    } else {
        return nil;
    }
}

#pragma mark - UICollectionViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    if (self.col_didSelected) {
        [self.collectionProtocol nn_collectionView:collectionView didSelectItemAtIndexPath:indexPath];
    }
}

#pragma mark - Setter

- (void)setTableProtocol:(id<NNBaseViewModelTableProtocol>)tableProtocol {
    _tableProtocol = tableProtocol;
    
    self.tab_didSelected = [tableProtocol respondsToSelector:@selector(nn_tableView:didSelectRowAtIndexPath:)];
    
    self.tab_sectionHeader = [tableProtocol respondsToSelector:@selector(nn_tableView:viewForHeaderInSection:)];
    
    self.tab_sectionFooter = [tableProtocol respondsToSelector:@selector(nn_tableView:viewForFooterInSection:)];
}

- (void)setCollectionProtocol:(id<NNBaseViewModelCollectionProtocol>)collectionProtocol {
    _collectionProtocol = collectionProtocol;
    
    self.col_didSelected =
    [collectionProtocol respondsToSelector:@selector(nn_collectionView:didSelectItemAtIndexPath:)];
    
    self.col_sectionHeader =
    [collectionProtocol respondsToSelector:@selector(nn_collectionView:sectionHeaderViewAtIndexPath:)];
    
    self.col_sectionFooter =
    [collectionProtocol respondsToSelector:@selector(nn_collectionView:sectionFooterViewAtIndexPath:)];
}

@end
