//
//  HouseDetailTitleCell.h
//  MYRoom
//
//  Created by NeroXie on 2019/3/18.
//  Copyright © 2019 Perfect. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CentraliedHouse.h"
#import "DecentraliedHouse.h"

@interface HouseDetailTitleCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *houseTitleLabel;
@property (weak, nonatomic) IBOutlet UICollectionView *tagCollectionView;
@property (weak, nonatomic) IBOutlet UILabel *priceLabel;
@property (weak, nonatomic) IBOutlet UILabel *roomTypeLabel;
@property (weak, nonatomic) IBOutlet UILabel *areaLabel;
@property (weak, nonatomic) IBOutlet UIButton *questionMarkButton;

@property (nonatomic, copy) void (^viewPaymentWayHandler)(void);

- (void)bindCentraliedHouse:(CentraliedHouse *)house;
- (void)bindDecentraliedHouse:(DecentraliedHouse *)house;

@end

