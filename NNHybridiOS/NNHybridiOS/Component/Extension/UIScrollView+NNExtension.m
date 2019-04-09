//
//  UIScrollView+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/9/17.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UIScrollView+NNExtension.h"
#import "NNRefreshHeader.h"
#import "NNRefreshFooter.h"
#import <objc/runtime.h>

static ConstString kRefreshHandlerPropertyKey = @"kRefreshHandlerPropertyKey";
static ConstString kLoadMoreHandlerPropertyKey = @"kLoadMoreHandlerPropertyKey";

@implementation UIScrollView (NNExtension)

#pragma mark - Setter & Getter

- (void)setRefreshHandler:(NNVoidBlock)refreshHandler {
    if (!refreshHandler) {
        objc_setAssociatedObject(self,
                                 &kRefreshHandlerPropertyKey,
                                 nil,
                                 OBJC_ASSOCIATION_COPY_NONATOMIC);
        [self.mj_header endRefreshing];
        self.mj_header = nil;
        
        return;
    }
    
    objc_setAssociatedObject(self,
                             &kRefreshHandlerPropertyKey,
                             refreshHandler,
                             OBJC_ASSOCIATION_COPY_NONATOMIC);
    
    WEAK_SELF;
    
    if (!self.mj_header) {
        NNRefreshHeader *header = [NNRefreshHeader headerWithRefreshingBlock:^{
            BLOCK_EXEC(weakSelf.refreshHandler);
        }];
//        header.lastUpdatedTimeLabel.hidden = YES;
//        [header setTitle:@"快放手，我要刷新了^-^" forState:MJRefreshStatePulling];
//        [header setTitle:@"努力刷新中 -_-!!" forState:MJRefreshStateRefreshing];
//        [header setTitle:@"OK" forState:MJRefreshStateIdle];
        
        self.mj_header = header;
    } else {
        self.mj_header.refreshingBlock = weakSelf.refreshHandler;
    }
}

- (NNVoidBlock)refreshHandler {
    id value = objc_getAssociatedObject(self, &kRefreshHandlerPropertyKey);
    if (!value) {
        return nil;
    }

    return value;
}

- (void)setLoadMoreHandler:(NNVoidBlock)loadMoreHandler {
    if (!loadMoreHandler) {
        objc_setAssociatedObject(self,
                                 &kLoadMoreHandlerPropertyKey,
                                 nil,
                                 OBJC_ASSOCIATION_COPY_NONATOMIC);
        [self.mj_footer endRefreshing];
        self.mj_footer = nil;

        return;
    }

    objc_setAssociatedObject(self,
                             &kLoadMoreHandlerPropertyKey,
                             loadMoreHandler,
                             OBJC_ASSOCIATION_COPY_NONATOMIC);

    WEAK_SELF;

    if (!self.mj_footer) {
        NNRefreshFooter *footer = [NNRefreshFooter footerWithRefreshingBlock:^{
            BLOCK_EXEC(weakSelf.loadMoreHandler);
        }];
//        [footer setTitle:@"" forState:MJRefreshStateIdle];
//        [footer setTitle:@"" forState:MJRefreshStateRefreshing];
//        [footer setTitle:@"—— 底线到了 ——" forState:MJRefreshStateNoMoreData];
        footer.hidden = YES;

        self.mj_footer = footer;
    } else {
        self.mj_footer.refreshingBlock = weakSelf.loadMoreHandler;
    }
}

- (NNVoidBlock)loadMoreHandler {
    id value = objc_getAssociatedObject(self, &kLoadMoreHandlerPropertyKey);
    if (!value) {
        return nil;
    }

    return value;
}

#pragma mark - Public

- (void)beginRefresh {
    if (!self.mj_header) {
        return;
    }

    [self.mj_header beginRefreshing];
}

- (void)endRefresh {
    if (!self.mj_header) {
        return;
    }

    [self.mj_header endRefreshing];
}

- (void)endLoadMore {
    if (!self.mj_footer) {
        return;
    }

    [self.mj_footer endRefreshing];
}

- (void)endLoadMoreWithNoMoreData {
    if (!self.mj_footer) {
        return;
    }

    [self.mj_footer endRefreshingWithNoMoreData];
}

- (void)endLoadMoreHasNextPage:(BOOL)hasNextPage {
    if (self.loadMoreHandler) {
        self.mj_footer.hidden = NO;
    }

    hasNextPage ? [self endLoadMore] : [self endLoadMoreWithNoMoreData];
}

- (void)footerIsHidden:(BOOL)hidden {
    if (!self.loadMoreHandler) {
        return;
    }

    self.mj_footer.hidden = hidden;
}

- (BOOL)headerIsRefreshing {
    return self.mj_header.isRefreshing;
}

- (BOOL)footerIsRefreshing {
    return self.mj_footer.isRefreshing;
}

@end
