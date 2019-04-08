//
// CADisplayLink+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <QuartzCore/QuartzCore.h>

@interface CADisplayLink (NNExtension)

+ (CADisplayLink *)nn_displayLinkWithWeakTarget:(id)weakTarget selector:(SEL)sel;

@end
