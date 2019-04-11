//
//  RefreshControlManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/4/10.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "RefreshControlManager.h"
#import "NNRefreshHeader.h"

@implementation RefreshControlManager

RCT_EXPORT_MODULE();

- (UIView *)view {
    return [NNRefreshHeader new];
}

//RCT_EXPORT_VIEW_PROPERTY(onRefresh, RCTDirectEventBlock)
//RCT_EXPORT_VIEW_PROPERTY(refreshing, BOOL)

@end
