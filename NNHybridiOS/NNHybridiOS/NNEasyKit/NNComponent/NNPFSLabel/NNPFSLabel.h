//
//  NNPFSLabel.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

extern const NSInteger kNNPFSLabelTag;

@interface NNPFSLabel : UILabel

+ (void)showInView:(UIView *)view;

+ (void)dismissInView:(UIView *)view;

@end
