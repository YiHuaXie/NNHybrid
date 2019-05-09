//
//  HouseDetailTitleCellManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/9.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "HouseDetailTitleCellManager.h"
#import "HouseDetailTitleCell.h"

@interface HouseDetailTitleCell(NNExtension)

@end

@implementation HouseDetailTitleCell(NNExtension)

- (void)setCentraliedHouse:(NSDictionary *)centraliedHouse {
    if (!centraliedHouse.allKeys.count) {
        return;
    }
    
    CentraliedHouse *house =  [[CentraliedHouse alloc] initWithDictionary:centraliedHouse error:nil];
    
    [self bindCentraliedHouse:house];
}

- (void)setDecentraliedHouse:(NSDictionary *)decentraliedHouse {
    if (!decentraliedHouse.allKeys.count) {
        return;
    }
    
    DecentraliedHouse *house = [[DecentraliedHouse alloc] initWithDictionary:decentraliedHouse error:nil];
    
    [self bindDecentraliedHouse:house];
}

@end

@implementation HouseDetailTitleCellManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(centraliedHouse, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(decentraliedHouse, NSDictionary);

- (UIView *)view {
    HouseDetailTitleCell *cell = [HouseDetailTitleCell nn_createWithNib];
    cell.houseTitleLabel.hidden = YES;
    
    return cell;
}


@end
