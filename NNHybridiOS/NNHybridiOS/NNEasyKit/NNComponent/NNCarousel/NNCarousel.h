//
//  NNCarousel.h
//  NNCarousel
//
//  Created by NeroXie on 2019/2/17.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "NNCarouselLayout.h"

typedef struct {
    NSInteger item;
    NSInteger section;
} NNIndexPath;

// scrolling direction
typedef NS_ENUM(NSUInteger, NNCarouselScrollDirection) {
    NNCarouselScrollDirectionLTR,
    NNCarouselScrollDirectionRTL,
    NNCarouselScrollDirectionBTT,
    NNCarouselScrollDirectionTTB
};

@class NNCarousel;

@protocol NNCarouselScrollDelegate <NSObject>

@optional

- (void)carouselDidScroll:(NNCarousel *)carousel;

- (void)carouselWillBeginDragging:(NNCarousel *)carousel;

- (void)carouselDidEndDragging:(NNCarousel *)carousel willDecelerate:(BOOL)decelerate;

- (void)carouselWillBeginDecelerating:(NNCarousel *)carousel;

- (void)carouselDidEndDecelerating:(NNCarousel *)carousel;

@end

@protocol NNCarouselDataSource <NSObject>

@required

- (NSInteger)numberOfItemsInCarousel:(NNCarousel *)carousel;

- (__kindof UICollectionViewCell *)carousel:(NNCarousel *)carousel cellForItem:(NSInteger)item;

@end

@protocol NNCarouselDelegate <NNCarouselScrollDelegate>

@optional

- (void)carousel:(NNCarousel *)carousel didScrollFromIndex:(NSInteger)fromIndex toIndex:(NSInteger)toIndex;
- (void)carousel:(NNCarousel *)carousel didSelectedItem:(NSInteger)item;

@end

@interface NNCarousel : UIView

@property (nonatomic, weak) id<NNCarouselDataSource> dataSource;
@property (nonatomic, weak) id<NNCarouselDelegate> delegate;

@property (nonatomic, readonly, strong) UICollectionView *collectionView;
@property (nonatomic, readonly, strong) NNCarouselLayout *layout;

@property (nonatomic, assign) CGFloat autoScrollInterval;

@property (nonatomic, assign) NNCarouselScrollDirection timerSrollDirection;
@property (nonatomic, assign) UICollectionViewScrollDirection carouselScrollDirection;

/**
 * Infinite loop, default is YES
 */
@property (nonatomic, assign) BOOL infiniteLoop;

// 当不是不限循环的时候，第一项或者最后一项是否需要居中
@property (nonatomic, assign) BOOL firstOrLastItemCenterWhenNotInfiniteLoop;

/**
 current page index
 */
@property (nonatomic, readonly, assign) NNIndexPath currentIndexPath;
@property (nonatomic, readonly, assign) NSInteger currentItem;


/**
 * Scroll to the item you need
 */
- (void)scrollToItem:(NSInteger)item animated:(BOOL)animated;

/**
 * Scroll to the next item in the current item
 */
- (void)scrollToNearlyItemAtDirection:(NNCarouselScrollDirection)direction animated:(BOOL)animated;

- (void)reloadData;

- (__kindof UICollectionViewCell * _Nullable)currentItemCell;
- (NSArray<__kindof UICollectionViewCell *> *_Nullable)visibleCells;
- (NSArray *)itemsForVisibleItems;

- (void)registerClass:(Class)Class forCellWithReuseIdentifier:(NSString *)identifier;
- (void)registerNib:(UINib *)nib forCellWithReuseIdentifier:(NSString *)identifier;
- (__kindof UICollectionViewCell *)dequeueReusableCellWithReuseIdentifier:(NSString *)identifier forIndex:(NSInteger)index;

@end


