//
//  NNCarouselLayout.m
//  NNCarousel
//
//  Created by NeroXie on 2019/2/17.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NNCarouselLayout.h"

@implementation NNCarouselLayout

#pragma mark - Init

- (instancetype)init {
    if (self = [super init]) {
        self.scrollDirection = UICollectionViewScrollDirectionHorizontal;
        _itemSpacing = -100;
    }
    
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    if (self = [super initWithCoder:aDecoder]) {
        self.scrollDirection = UICollectionViewScrollDirectionHorizontal;
        _itemSpacing = -100;
    }
    return self;
}

#pragma mark - Override

- (CGFloat)minimumLineSpacing {
    if (self.itemSpacing < 0) {
        return [super minimumLineSpacing];
    }
    
    return self.itemSpacing;
}

- (CGFloat)minimumInteritemSpacing {
    if (self.itemSpacing < 0) {
        return [super minimumInteritemSpacing];
    }
    
    return self.itemSpacing;
}
@end
