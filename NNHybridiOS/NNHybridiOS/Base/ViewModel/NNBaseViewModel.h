//
//  NNBaseViewModel.h
//  NNProject
//
//  Created by NeroXie on 2018/12/11.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol NNBaseViewModelScrollProtocol <NSObject>

@optional

- (void)nn_scrollViewDidScroll:(UIScrollView *)scrollView;

@end

@protocol NNBaseViewModelTableProtocol <NNBaseViewModelScrollProtocol>

@required

- (UITableViewCell *)nn_tableView:(UITableView *)tableView
            cellForRowAtIndexPath:(NSIndexPath *)indexPath;

@optional

- (UIView *)nn_tableView:(UITableView *)tableView
  viewForHeaderInSection:(NSInteger)section;

- (UIView *)nn_tableView:(UITableView *)tableView
  viewForFooterInSection:(NSInteger)section;

- (void)nn_tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath;

@end

@protocol NNBaseViewModelCollectionProtocol <NNBaseViewModelScrollProtocol>

@required

- (UICollectionViewCell *)nn_collectionView:(UICollectionView *)collectionView
                     cellForItemAtIndexPath:(NSIndexPath *)indexPath;

@optional

- (UICollectionReusableView *)nn_collectionView:(UICollectionView *)collectionView
                   sectionHeaderViewAtIndexPath:(NSIndexPath *)indexPath;

- (UICollectionReusableView *)nn_collectionView:(UICollectionView *)collectionView
                   sectionFooterViewAtIndexPath:(NSIndexPath *)indexPath;

- (void)nn_collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath;

@end

@interface NNBaseViewModel : NSObject
<UITableViewDataSource,
UITableViewDelegate,
UICollectionViewDataSource,
UICollectionViewDelegate,
UICollectionViewDelegateFlowLayout>

@property (nonatomic, readonly, weak) UITableView *tableView;

@property (nonatomic, readonly, weak) UICollectionView *collectionView;

@property (nonatomic, weak) id<NNBaseViewModelTableProtocol> tableProtocol;

@property (nonatomic, weak) id<NNBaseViewModelCollectionProtocol> collectionProtocol;

- (void)associateTableView:(UITableView *)tableView
                  inObject:(id<NNBaseViewModelTableProtocol>)object;

- (void)associateCollectioView:(UICollectionView *)collectionView
                      inObject:(id<NNBaseViewModelCollectionProtocol>)object;

- (NSString *)tab_headerTitleForSection:(NSInteger)section;
- (NSString *)tab_footerTitleForSection:(NSInteger)section;

@end
