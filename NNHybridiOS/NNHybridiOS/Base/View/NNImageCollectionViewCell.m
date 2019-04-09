//
//  NNImageCollectionViewCell.m
//  NNProject
//
//  Created by NeroXie on 2018/12/12.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "NNImageCollectionViewCell.h"

@implementation NNImageCollectionViewCell

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.imageView = [[UIImageView alloc] init];
        self.imageView.contentMode = UIViewContentModeScaleAspectFill;
        self.imageView.clipsToBounds = YES;
        [self.contentView addSubview:self.imageView];
    }
    
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(self.contentView.x + self.imageContentInset.left,
                                      self.contentView.y + self.imageContentInset.top,
                                      self.contentView.width + self.imageContentInset.left + self.imageContentInset.right,
                                      self.contentView.height + self.imageContentInset.top + self.imageContentInset.bottom);
}

@end
