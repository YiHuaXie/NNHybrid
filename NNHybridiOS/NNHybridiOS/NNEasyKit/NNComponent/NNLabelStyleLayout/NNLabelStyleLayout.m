//
//  NNLabelStyleLayout.m
//  NNProject
//
//  Created by 谢翼华 on 2018/9/22.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNLabelStyleLayout.h"

static const CGFloat defaultLineSpacing = 5;
static const CGFloat defaultInterItemSpacing = 5;

@interface NNLabelStyleLayout()

@property (nonatomic, strong) NSMutableArray* allAttributes;
@property (nonatomic, assign) CGFloat contentHeight;

@end

@implementation NNLabelStyleLayout

#pragma mark - Init

- (instancetype)init {
    if (self = [super init]) {
        self.lineSpacing = defaultLineSpacing;
        self.interitemSpacing = defaultInterItemSpacing;
        self.contentInset = UIEdgeInsetsZero;
    }
    
    return self;
}

#pragma mark - Lifecycle

- (void)prepareLayout {
    [super prepareLayout];
    
    self.allAttributes = [NSMutableArray array];
    self.contentHeight = self.contentInset.top;
    
    UICollectionViewLayoutAttributes *lastAttributes = nil;
    NSInteger count = [self.collectionView numberOfItemsInSection:0];
    for (int i = 0; i < count; i++) {
        UICollectionViewLayoutAttributes *attributes = [UICollectionViewLayoutAttributes layoutAttributesForCellWithIndexPath:[NSIndexPath indexPathForRow:i inSection:0]];
        CGSize currentSize = [self.delegate labelStyleLayout:self.collectionView sizeForItemAtIndex:i];
        if (i == 0) {
            attributes.frame = CGRectMake(self.contentInset.left, self.contentHeight, currentSize.width, currentSize.height);
        } else {
            CGFloat leftUsedWidth = CGRectGetMaxX(lastAttributes.frame) + self.interitemSpacing;
            if (self.collectionView.width - leftUsedWidth - self.contentInset.right >= currentSize.width) {
                attributes.frame = CGRectMake(leftUsedWidth, lastAttributes.frame.origin.y, currentSize.width, currentSize.height);
            } else {
                attributes.frame = CGRectMake(self.contentInset.left,  CGRectGetMaxY(lastAttributes.frame) + self.lineSpacing, currentSize.width, currentSize.height);
            }
        }
        
        lastAttributes = attributes;
        [self.allAttributes addObject:attributes];
    }
    
    self.contentHeight = CGRectGetMaxY(lastAttributes.frame) + self.contentInset.bottom;
}

- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
    NSMutableArray* tmparr = [NSMutableArray array];
    for (UICollectionViewLayoutAttributes *attribute in self.allAttributes) {
        if (CGRectIntersectsRect(rect, attribute.frame)) {
            [tmparr addObject:attribute];
        }
    }
    
    return tmparr;
}

- (UICollectionViewLayoutAttributes*)layoutAttributesForItemAtIndexPath:(NSIndexPath*)indexPath {
    return self.allAttributes[indexPath.section][indexPath.row];
}

- (CGSize)collectionViewContentSize {
    return CGSizeMake(self.collectionView.frame.size.width, self.contentHeight);
}

#pragma mark - Public

+ (CGFloat)heightForCollectionViewWithCount:(NSInteger)count
                               contentInset:(UIEdgeInsets)contentInset
                            contentMAXWidth:(CGFloat)maxWidth
                                lineSpacing:(CGFloat)lineSpacing
                           interitemSpacing:(CGFloat)interitemSpacing
                                sizeForItem:(SizeForItem)sizeForItem {
    if (count == 0) {
        return 0;
    }
    
    CGFloat height = 0.0;
    CGFloat leftUsedWidth = 0.0;
    CGSize currentSize;
    for (int i = 0; i < count; i++) {
        currentSize = sizeForItem(i);
        if (i == 0) {
            leftUsedWidth = contentInset.left + contentInset.right + currentSize.width + interitemSpacing;
            height = contentInset.top + contentInset.bottom + currentSize.height + lineSpacing;
        } else {
            if (maxWidth - leftUsedWidth >= currentSize.width) {
                leftUsedWidth += currentSize.width + interitemSpacing;
            } else {
                leftUsedWidth = contentInset.left + contentInset.right + currentSize.width + interitemSpacing;
                height += currentSize.height + lineSpacing;
            }
        }
    }
    
    return height - lineSpacing;
}

@end
