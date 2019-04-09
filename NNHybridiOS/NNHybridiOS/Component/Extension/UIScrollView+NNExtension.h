//
//  UIScrollView+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/9/17.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MJRefresh.h"

@interface UIScrollView (NNExtension)

/**
 下拉刷新，上拉加载更多的简写方式
 */
@property (nonatomic, copy) NNVoidBlock refreshHandler;//based on MJRefreshNormalHeader
@property (nonatomic, copy) NNVoidBlock loadMoreHandler;//based on MJRefreshAutoNormalFooter, footer is hidden when created

/**
 * 下拉刷新
 */
- (void)beginRefresh;

/**
 * 结束下拉刷新
 */
- (void)endRefresh;

- (void)endLoadMore;
- (void)endLoadMoreWithNoMoreData;
- (void)endLoadMoreHasNextPage:(BOOL)hasNextPage;

- (void)footerIsHidden:(BOOL)hidden;

- (BOOL)headerIsRefreshing;
- (BOOL)footerIsRefreshing;

@end
