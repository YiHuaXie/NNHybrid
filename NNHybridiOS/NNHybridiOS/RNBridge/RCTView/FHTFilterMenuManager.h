//
//  FHTFilterMenuManager.h
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/20.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import <React/RCTViewManager.h>
#import "FHTFilterMenu.h"

@interface FHTFilterMenu (RNBridge)

@property (nonatomic, copy) RCTBubblingEventBlock onUpdateParameters;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeParameters;

@end

@interface RCTConvert (FHTFilterMenu)

@end

@interface FHTFilterMenuManager : RCTViewManager <RCTBridgeModule>

@end

