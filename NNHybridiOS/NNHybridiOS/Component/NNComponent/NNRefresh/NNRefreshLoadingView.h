//
//  NNRefreshLoadingView.h
//  NNProject
//
//  Created by NeroXie on 2019/1/9.
//  Copyright © 2019 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

extern const CGFloat kIndicatorSize;

@interface NNRefreshLoadingView : UIView

- (void)startLoading;
- (void)endLoading;

@end

