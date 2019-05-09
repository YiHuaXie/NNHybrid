//
//  NNLabelStyleLayout.h
//  NNProject
//
//  Created by 谢翼华 on 2018/9/22.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef CGSize (^SizeForItem) (NSInteger row);

@protocol NNLabelStyleLayoutDelegate <NSObject>

- (CGSize)labelStyleLayout:(UICollectionView *)collectionView sizeForItemAtIndex:(NSUInteger)index;

@end

/**
 标签样式排布
 */
@interface NNLabelStyleLayout : UICollectionViewLayout

@property (nonatomic, weak) id<NNLabelStyleLayoutDelegate> delegate;

@property (nonatomic, assign) CGFloat lineSpacing;//行与行间距：column
@property (nonatomic, assign) CGFloat interitemSpacing;//行内间距：row
@property (nonatomic, assign) UIEdgeInsets contentInset;

+ (CGFloat)heightForCollectionViewWithCount:(NSInteger)count
                               contentInset:(UIEdgeInsets)contentInset
                            contentMAXWidth:(CGFloat)maxWidth
                                lineSpacing:(CGFloat)lineSpacing
                           interitemSpacing:(CGFloat)interitemSpacing
                                sizeForItem:(SizeForItem)sizeForItem;

@end
