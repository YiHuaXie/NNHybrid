//
//  AddressOnMapViewController.h
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/10.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NNBaseViewController.h"

@interface AddressOnMapViewController : NNBaseViewController

@property (nonatomic, copy) NSString *name;
@property (nonatomic, copy) NSString *address;
@property (nonatomic, assign) double latitude;
@property (nonatomic, assign) double longitude;

@end

