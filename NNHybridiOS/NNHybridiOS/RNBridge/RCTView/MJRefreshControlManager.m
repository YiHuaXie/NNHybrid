//
//  RefreshControlManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/4/10.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "MJRefreshControlManager.h"
#import "NNRefreshHeader.h"

@implementation MJRefreshControlManager

RCT_EXPORT_MODULE();

- (UIView *)view {
    UIView *view = [UIView new];
    view.backgroundColor = UIColor.redColor;
    
    return view;
//    return [NNRefreshHeader new];
}

//RCT_EXPORT_VIEW_PROPERTY(onRefresh, RCTDirectEventBlock)
//RCT_EXPORT_VIEW_PROPERTY(refreshing, BOOL)

@end
