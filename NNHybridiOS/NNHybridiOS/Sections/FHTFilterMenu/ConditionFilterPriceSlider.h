//
//  ConditionFilterPriceSlider.h
//  MYRoom
//
//  Created by 谢翼华 on 2018/8/3.
//  Copyright © 2018年 Perfect. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ConditionFilterPriceSlider : UIControl

@property (nonatomic, readonly, copy) NSString *minPrice;
@property (nonatomic, readonly, copy) NSString *maxPrice;

@property (nonatomic, strong) UIFont *labelFont;

- (void)updateMinPrice:(NSString *)minPrice maxPrice:(NSString *)maxPrice;

@end
