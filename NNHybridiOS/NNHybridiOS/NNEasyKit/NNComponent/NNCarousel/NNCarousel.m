//
//  NNCarousel.m
//  NNEasyKit
//
//  Created by NeroXie on 2019/5/16.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "NNCarousel.h"

#define MaxSectionCount 6
#define MinSectionCount 3

static inline NNIndexPath NNIndexPathMake(NSInteger item,
                                          NSInteger section) {
    NNIndexPath indexPath;
    indexPath.section = section;
    indexPath.item = item;
    
    return indexPath;
}

static inline BOOL NNIndexPathisEqual(NNIndexPath indexPath1,
                                      NNIndexPath indexPath2) {
    BOOL isEqual =
    indexPath1.item == indexPath2.item &&
    indexPath1.section == indexPath2.section;
    
    return isEqual;
}

static inline BOOL NNIndexPathisValid(NNIndexPath indexPath,
                                      NSInteger maxItem,
                                      NSInteger maxSection) {
    BOOL isValid =
    indexPath.item >= 0 &&
    indexPath.item < maxItem &&
    indexPath.section >= 0 &&
    indexPath.section < maxSection;
    
    return isValid;
}

@interface NNCarousel()
<UICollectionViewDataSource,
UICollectionViewDelegate,
UICollectionViewDelegateFlowLayout>

@property (nonatomic, strong) UICollectionView *collectionView;
@property (nonatomic, strong) NNCarouselLayout *layout;
@property (nonatomic, strong) NSTimer *timer;

@property (nonatomic, assign) NSInteger itemCount;

@property (nonatomic, assign) NSInteger dequeueSection;
@property (nonatomic, assign) NNIndexPath beginDragIndexPath;
@property (nonatomic, assign) NSInteger firstItem;
@property (nonatomic, assign) BOOL didReloadData;

@property (nonatomic, assign) NNIndexPath currentIndexPath;

@end

@implementation NNCarousel

#pragma mark - Init

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self _initializeSetup];
        [self _addCollectionView];
    }
    
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    if (self = [super initWithCoder:aDecoder]) {
        [self _initializeSetup];
        [self _addCollectionView];
    }
    
    return self;
}

- (void)dealloc {
    self.collectionView.delegate = nil;
    self.collectionView.dataSource = nil;
}

#pragma mark - Override

- (void)willMoveToSuperview:(UIView *)newSuperview {
    [self _removeTimer];
    
    if (newSuperview && self.autoScrollInterval > 0) {
        [self _addTimer];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    BOOL needUpdateLayout = !CGRectEqualToRect(self.collectionView.frame, self.bounds);
    self.collectionView.frame = self.bounds;
    
    if ((self.currentIndexPath.item < 0 || needUpdateLayout) &&
        (self.itemCount > 0 || self.didReloadData)) {
        [self.collectionView.collectionViewLayout invalidateLayout];
        [self _resetCarouselAtItem:MAX(self.currentIndexPath.item, 0)];
    }
}

#pragma mark - Private

- (void)_initializeSetup {
    _didReloadData = NO;
    _autoScrollInterval = 3.0;
    _infiniteLoop = NO;
    _firstItem = -1;
    _carouselScrollDirection = UICollectionViewScrollDirectionHorizontal;
    _timerSrollDirection = NNCarouselScrollDirectionLTR;
    
    _beginDragIndexPath.item = 0;
    _beginDragIndexPath.section = 0;
    
    _currentIndexPath.item = -1;
    _currentIndexPath.section = -1;
}

- (void)_addCollectionView {
    self.layout = [NNCarouselLayout new];
    self.collectionView = [[UICollectionView alloc]initWithFrame:CGRectZero
                                            collectionViewLayout:self.layout];
    self.collectionView.backgroundColor = [UIColor clearColor];
    self.collectionView.dataSource = self;
    self.collectionView.delegate = self;
    self.collectionView.pagingEnabled = NO;
    self.collectionView.decelerationRate = 1-0.0076;
    if (@available(iOS 10.0, *)) {
        self.collectionView.prefetchingEnabled = NO;
    }
    self.collectionView.showsHorizontalScrollIndicator = NO;
    self.collectionView.showsVerticalScrollIndicator = NO;
    [self addSubview:self.collectionView];
}

- (void)_resetCarouselAtItem:(NSInteger)item {
    if (self.firstItem >= 0) {
        item = self.firstItem;
        self.firstItem = -1;
    }
    
    if (item < 0) {
        return;
    }
    
    if (item >= self.itemCount) {
        item = 0;
    }
    
    NNIndexPath indexPath = NNIndexPathMake(item, self.infiniteLoop ? MaxSectionCount / 3 : 0);
    [self _scrollToItemAtIndexPath:indexPath animated:NO];
    
    if (!self.infiniteLoop && self.currentIndexPath.item < 0) {
        [self scrollViewDidScroll:self.collectionView];
    }
}

- (void)_carouselIfNeed {
    if (!self.infiniteLoop) {
        return;
    }
    
    NNIndexPath indexPath = self.currentIndexPath;
    
    if (indexPath.section > MaxSectionCount - MinSectionCount ||
        indexPath.section < MinSectionCount) {
        [self _resetCarouselAtItem:indexPath.item];
    }
}

- (void)_scrollToItemAtIndexPath:(NNIndexPath)indexPath animated:(BOOL)animated {
    if (self.itemCount <= 0 || !NNIndexPathisValid(indexPath, self.itemCount, MaxSectionCount)) {
        return;
    }
    
    CGPoint offset =
    self.carouselScrollDirection == UICollectionViewScrollDirectionHorizontal ?
    CGPointMake([self _offsetXAtIndexPath:indexPath],
                self.collectionView.contentOffset.y) :
    CGPointMake(self.collectionView.contentOffset.x,
                [self _offsetYAtIndexPath:indexPath]);
    
    [self.collectionView setContentOffset:offset animated:animated];
}

- (void)_scrollViewHorizontalWillEndDragging:(UIScrollView *)scrollView
                                withVelocity:(CGPoint)velocity
                         targetContentOffset:(CGPoint *)targetContentOffset {
    if (fabs(velocity.x) < 0.35 ||
        !NNIndexPathisEqual(self.beginDragIndexPath, self.currentIndexPath)) {
        targetContentOffset->x = [self _offsetXAtIndexPath:self.currentIndexPath];
        return;
    }
    
    NNCarouselScrollDirection direction = NNCarouselScrollDirectionLTR;
    
    if ((scrollView.contentOffset.x < 0 && targetContentOffset->x <= 0) ||
        (targetContentOffset->x < scrollView.contentOffset.x &&
         scrollView.contentOffset.x < scrollView.contentSize.width - scrollView.frame.size.width)) {
            direction = NNCarouselScrollDirectionRTL;
        }
    
    NNIndexPath indexPath = [self _nearlyIndexPathForCurrentIndexPath:self.currentIndexPath direction:direction];
    targetContentOffset->x = [self _offsetXAtIndexPath:indexPath];
}

- (void)_scrollViewVerticalWillEndDragging:(UIScrollView *)scrollView
                              withVelocity:(CGPoint)velocity
                       targetContentOffset:(CGPoint *)targetContentOffset {
    if (fabs(velocity.y) < 0.35 ||
        !NNIndexPathisEqual(self.beginDragIndexPath, self.currentIndexPath)) {
        targetContentOffset->y = [self _offsetYAtIndexPath:self.currentIndexPath];
        return;
    }
    
    NNCarouselScrollDirection direction = NNCarouselScrollDirectionBTT;
    
    if ((scrollView.contentOffset.y < 0 && targetContentOffset->y <= 0) ||
        (targetContentOffset->y < scrollView.contentOffset.y &&
         scrollView.contentOffset.y < scrollView.contentSize.height - scrollView.frame.size.height)) {
            direction = NNCarouselScrollDirectionTTB;
        }
    
    NNIndexPath indexPath = [self _nearlyIndexPathForCurrentIndexPath:self.currentIndexPath direction:direction];
    targetContentOffset->y = [self _offsetYAtIndexPath:indexPath];
}

#pragma mark - Public

- (void)scrollToItem:(NSInteger)item animated:(BOOL)animated {
    self.firstItem = self.didReloadData ? item : -1;
    
    if (!self.infiniteLoop) {
        [self _scrollToItemAtIndexPath:NNIndexPathMake(item, 0) animated:animated];
        return;
    }
    
    NSInteger section = self.currentIndexPath.section + (item > self.currentItem ? 0 : 1);
    [self _scrollToItemAtIndexPath:NNIndexPathMake(item, section) animated:animated];
}

- (void)scrollToNearlyItemAtDirection:(NNCarouselScrollDirection)direction animated:(BOOL)animated {
    NNIndexPath indexPath = [self _nearlyIndexPathForCurrentIndexPath:self.currentIndexPath
                                                            direction:direction];
    [self _scrollToItemAtIndexPath:indexPath animated:animated];
}

- (void)reloadData {
    self.didReloadData = YES;
    
    self.itemCount = [self.dataSource numberOfItemsInCarousel:self];
    [self.collectionView reloadData];
    
    [self _removeTimer];
    
    NSInteger item =
    self.currentIndexPath.item < 0 && !CGRectIsEmpty(self.collectionView.frame) ?
    0 :
    self.currentIndexPath.item;
    
    [self _resetCarouselAtItem:item];
    
    [self _addTimer];
}

- (UICollectionViewCell *)currentItemCell {
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:self.currentIndexPath.item
                                                 inSection:self.currentIndexPath.section];
    
    return [self.collectionView cellForItemAtIndexPath:indexPath];
}

- (NSArray<UICollectionViewCell *> *)visibleCells {
    return self.collectionView.visibleCells;
}

- (NSArray *)itemsForVisibleItems {
    NSMutableArray *items = [NSMutableArray array];
    
    for (NSIndexPath *indexPath in self.collectionView.indexPathsForVisibleItems) {
        [items addObject:@(indexPath.item)];
    }
    
    return [items copy];
}

- (void)registerClass:(Class)Class forCellWithReuseIdentifier:(NSString *)identifier {
    [self.collectionView registerClass:Class forCellWithReuseIdentifier:identifier];
}

- (void)registerNib:(UINib *)nib forCellWithReuseIdentifier:(NSString *)identifier {
    [self.collectionView registerNib:nib forCellWithReuseIdentifier:identifier];
}

- (__kindof UICollectionViewCell *)dequeueReusableCellWithReuseIdentifier:(NSString *)identifier
                                                                 forIndex:(NSInteger)index {
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index
                                                 inSection:self.dequeueSection];
    
    return [self.collectionView dequeueReusableCellWithReuseIdentifier:identifier
                                                          forIndexPath:indexPath];
}

#pragma mark - NSTimer

- (void)_addTimer {
    if (self.timer || self.autoScrollInterval <= 0) {
        return;
    }
    
    self.timer = [NSTimer timerWithTimeInterval:self.autoScrollInterval
                                         target:self
                                       selector:@selector(_timerFired:)
                                       userInfo:nil
                                        repeats:YES];
    [[NSRunLoop mainRunLoop] addTimer:self.timer
                              forMode:NSRunLoopCommonModes];
}

- (void)_removeTimer {
    if (!self.timer) {
        return;
    }
    
    [self.timer invalidate];
    self.timer = nil;
}

- (void)_timerFired:(NSTimer *)timer {
    if (!self.superview ||
        !self.window ||
        self.itemCount == 0 ||
        self.collectionView.tracking) {
        return;
    }
    
    [self scrollToNearlyItemAtDirection:self.timerSrollDirection
                               animated:YES];
}

#pragma mark - UICollectionViewDataSource

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return self.infiniteLoop ? MaxSectionCount : 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView
     numberOfItemsInSection:(NSInteger)section {
    self.itemCount = [self.dataSource numberOfItemsInCarousel:self];
    
    return self.itemCount;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView
                  cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    self.dequeueSection = indexPath.section;
    
    return [self.dataSource carousel:self cellForItem:indexPath.item];
}

#pragma mark - UICollectionViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    if ([self.delegate respondsToSelector:@selector(carousel:didSelectedItem:)]) {
        [self.delegate carousel:self didSelectedItem:indexPath.item];
    }
}

#pragma mark - UICollectionViewDelegateFlowLayout

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView
                        layout:(UICollectionViewLayout *)collectionViewLayout
        insetForSectionAtIndex:(NSInteger)section {
    if (!self.infiniteLoop) {
        return [self _onlyOneSectionInset];
    }
    
    if (section == 0) {
        return [self _firstSectionInset];
    } else if (section == MaxSectionCount - 1) {
        return [self _lastSectionInset];
    } else {
        return [self _middleSectionInset];
    }
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if (self.didReloadData == NO) {
        return;
    }
    
    NNIndexPath toIndexPath =
    self.carouselScrollDirection == UICollectionViewScrollDirectionHorizontal ?
    [self _indexPathForContentOffsetX:scrollView.contentOffset.x] :
    [self _indexPathForContentOffsetY:scrollView.contentOffset.y];
    
    if (self.itemCount <= 0 || !NNIndexPathisValid(toIndexPath, self.itemCount, MaxSectionCount)) {
        return;
    }
    
    NNIndexPath fromIndexPath = self.currentIndexPath;
    self.currentIndexPath = toIndexPath;
    
    if ([self.delegate respondsToSelector:@selector(carouselDidScroll:)]) {
        [self.delegate carouselDidScroll:self];
    }
    
    if ([self.delegate respondsToSelector:@selector(carousel:didScrollFromIndex:toIndex:)]&&
        !NNIndexPathisEqual(fromIndexPath, toIndexPath)) {
        [self.delegate carousel:self didScrollFromIndex:fromIndexPath.item toIndex:toIndexPath.item];
    }
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
    if (self.autoScrollInterval > 0) {
        [self _removeTimer];
    }
    
    
    self.beginDragIndexPath =
    self.carouselScrollDirection == UICollectionViewScrollDirectionHorizontal ?
    [self _indexPathForContentOffsetX:scrollView.contentOffset.x] :
    [self _indexPathForContentOffsetY:scrollView.contentOffset.y];
    
    if ([self.delegate respondsToSelector:@selector(carouselWillBeginDragging:)]) {
        [self.delegate carouselWillBeginDragging:self];
    }
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView
                     withVelocity:(CGPoint)velocity
              targetContentOffset:(inout CGPoint *)targetContentOffset {
    if (self.carouselScrollDirection == UICollectionViewScrollDirectionHorizontal) {
        [self _scrollViewHorizontalWillEndDragging:scrollView
                                      withVelocity:velocity
                               targetContentOffset:targetContentOffset];
    } else {
        [self _scrollViewVerticalWillEndDragging:scrollView
                                    withVelocity:velocity
                             targetContentOffset:targetContentOffset];
    }
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    if (self.autoScrollInterval > 0) {
        [self _addTimer];
    }
    
    if ([self.delegate respondsToSelector:@selector(carouselDidEndDragging:willDecelerate:)]) {
        [self.delegate carouselDidEndDragging:self willDecelerate:decelerate];
    }
}

- (void)scrollViewWillBeginDecelerating:(UIScrollView *)scrollView {
    if ([self.delegate respondsToSelector:@selector(carouselWillBeginDecelerating:)]) {
        [self.delegate carouselWillBeginDecelerating:self];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    [self _carouselIfNeed];
    
    if ([self.delegate respondsToSelector:@selector(carouselDidEndDecelerating:)]) {
        [self.delegate carouselDidEndDecelerating:self];
    }
}

#pragma mark - Helper

- (NNIndexPath)_nearlyIndexPathForCurrentIndexPath:(NNIndexPath)indexPath
                                         direction:(NNCarouselScrollDirection)direction {
    // 临界区
    if (indexPath.item < 0 || indexPath.item >= self.itemCount) {
        return indexPath;
    }
    
    // 非无限循环
    if (!self.infiniteLoop) {
        // 左到右或下到上
        if (direction == NNCarouselScrollDirectionLTR ||
            direction == NNCarouselScrollDirectionBTT) {
            if (indexPath.item == self.itemCount - 1) {
                // 从第一项开始继续滚动
                return self.autoScrollInterval > 0 ? NNIndexPathMake(0, 0) : indexPath;
            } else {
                return NNIndexPathMake(indexPath.item + 1, 0);
            }
        }
        // 右到左或上到下
        if (indexPath.item == 0) {
            // 从最后一项开始滚动
            return self.autoScrollInterval > 0 ? NNIndexPathMake(self.itemCount - 1, 0) : indexPath;
        }
        
        return NNIndexPathMake(indexPath.item - 1, 0);
    }
    
    // 左到右或下到上
    if (direction == NNCarouselScrollDirectionLTR ||
        direction ==  NNCarouselScrollDirectionBTT) {
        if (indexPath.item < self.itemCount - 1) {
            return NNIndexPathMake(indexPath.item + 1, indexPath.section);
        }
        
        if (indexPath.section >= MaxSectionCount - 1) {
            return NNIndexPathMake(indexPath.item, MaxSectionCount - 1);
        }
        
        return NNIndexPathMake(0, indexPath.section + 1);
    }
    
    // 右到左或上到下
    if (indexPath.item > 0) {
        return NNIndexPathMake(indexPath.item - 1, indexPath.section);
    }
    
    if (indexPath.section <= 0) {
        return NNIndexPathMake(indexPath.item, 0);
    }
    
    return NNIndexPathMake(self.itemCount - 1, indexPath.section - 1);
}

- (CGFloat)_offsetXAtIndexPath:(NNIndexPath)indexPath {
    if (self.itemCount == 0) {
        return 0.0;
    }
    
    UIEdgeInsets edge =
    self.infiniteLoop ?
    self.layout.sectionInset :
    [self _onlyOneSectionInset];
    
    CGFloat left = edge.left;
    CGFloat right = edge.right;
    CGFloat width = CGRectGetWidth(self.collectionView.frame);
    CGFloat itemWidth = self.layout.itemSize.width + self.layout.minimumInteritemSpacing;
    
    CGFloat offsetX = 0;
    if (!self.infiniteLoop &&
        !self.firstOrLastItemCenterWhenNotInfiniteLoop &&
        indexPath.item == self.itemCount - 1) {
        offsetX = left + itemWidth * (indexPath.item + indexPath.section * self.itemCount) - (width - itemWidth) -  self.layout.minimumInteritemSpacing + right;
    } else {
        offsetX = left + itemWidth * (indexPath.item + indexPath.section * self.itemCount) - self.layout.minimumInteritemSpacing / 2 - (width - itemWidth) / 2;
    }
    
    return MAX(offsetX, 0);
}

- (CGFloat)_offsetYAtIndexPath:(NNIndexPath)indexPath {
    if (self.itemCount == 0) {
        return 0.0;
    }
    
    UIEdgeInsets edge = self.infiniteLoop ? self.layout.sectionInset : [self _onlyOneSectionInset];
    CGFloat top = edge.top;
    CGFloat bottom = edge.bottom;
    CGFloat height = CGRectGetHeight(self.collectionView.frame);
    CGFloat itemHeight = self.layout.itemSize.height + self.layout.minimumInteritemSpacing;
    
    CGFloat offsetY = 0;
    if (!self.infiniteLoop &&
        !self.firstOrLastItemCenterWhenNotInfiniteLoop &&
        indexPath.item == self.itemCount - 1) {
        offsetY = top + itemHeight * (indexPath.item + indexPath.section * self.itemCount) - (height - itemHeight) -  self.layout.minimumInteritemSpacing + bottom;
    } else {
        offsetY = top + itemHeight * (indexPath.item + indexPath.section * self.itemCount) - self.layout.minimumInteritemSpacing / 2 - (height - itemHeight) / 2;
    }
    
    return MAX(offsetY, 0);
}

- (NNIndexPath)_indexPathForContentOffsetX:(CGFloat)offsetX {
    if (self.itemCount == 0) {
        return NNIndexPathMake(0, 0);
    }
    
    UIEdgeInsets edge = self.infiniteLoop ? self.layout.sectionInset : [self _onlyOneSectionInset];
    CGFloat left = edge.left;
    CGFloat width = CGRectGetWidth(self.collectionView.frame);
    CGFloat middleOffset = offsetX + width / 2;
    CGFloat itemWidth = self.layout.itemSize.width + self.layout.minimumInteritemSpacing;
    
    NSInteger currentItem = 0;
    NSInteger currentSection = 0;
    
    if (middleOffset - left >= 0) {
        NSInteger item = (middleOffset - left + self.layout.minimumInteritemSpacing / 2) / itemWidth;
        if (item < 0) {
            item = 0;
        } else if (item >= self.itemCount * MaxSectionCount) {
            item = self.itemCount * MaxSectionCount - 1;
        }
        
        currentItem = item % self.itemCount;
        currentSection = item / self.itemCount;
    }
    
    return NNIndexPathMake(currentItem, currentSection);
}

- (NNIndexPath)_indexPathForContentOffsetY:(CGFloat)offsetY {
    if (self.itemCount == 0) {
        return NNIndexPathMake(0, 0);
    }
    
    UIEdgeInsets sectionInset = self.infiniteLoop ? self.layout.sectionInset : [self _onlyOneSectionInset];
    CGFloat top = sectionInset.top;
    CGFloat height = CGRectGetHeight(self.collectionView.frame);
    CGFloat middleOffset = offsetY + height / 2;
    CGFloat itemHeight = self.layout.itemSize.height + self.layout.minimumInteritemSpacing;
    
    NSInteger currentItem = 0;
    NSInteger currentSection = 0;
    
    if (middleOffset - top >= 0) {
        NSInteger item = (middleOffset - top + self.layout.minimumInteritemSpacing / 2) / itemHeight;
        if (item < 0) {
            item = 0;
        } else if (item >= self.itemCount * MaxSectionCount) {
            item = self.itemCount * MaxSectionCount - 1;
        }
        
        currentItem = item % self.itemCount;
        currentSection = item / self.itemCount;
    }
    
    return NNIndexPathMake(currentItem, currentSection);
}

- (UIEdgeInsets)_onlyOneSectionInset {
    NSAssert(!self.infiniteLoop, @"Carousel's infiniteLoop must be NO");
    
    CGFloat verticalSpace = (CGRectGetHeight(self.collectionView.frame) - self.layout.itemSize.height) / 2.0;
    CGFloat horizontalSpace = (CGRectGetWidth(self.collectionView.frame) - self.layout.itemSize.width) / 2.0;
    
    UIEdgeInsets sectionInset =
    self.firstOrLastItemCenterWhenNotInfiniteLoop ?
    UIEdgeInsetsMake(verticalSpace, horizontalSpace, verticalSpace, horizontalSpace) :
    self.layout.sectionInset;
    
    return sectionInset;
}

- (UIEdgeInsets)_firstSectionInset {
    NSAssert(self.infiniteLoop, @"Carousel's infiniteLoop must be YES");
    
    CGFloat verticalSpace = (CGRectGetHeight(self.collectionView.frame) - self.layout.itemSize.height) / 2;
    CGFloat horizontalSpace = (CGRectGetWidth(self.collectionView.frame) - self.layout.itemSize.width) / 2.0;
    
    UIEdgeInsets sectionInset =
    self.carouselScrollDirection == UICollectionViewScrollDirectionHorizontal ?
    UIEdgeInsetsMake(verticalSpace,
                     self.layout.sectionInset.left,
                     verticalSpace,
                     self.layout.itemSpacing) :
    UIEdgeInsetsMake(self.layout.sectionInset.top,
                     horizontalSpace,
                     self.layout.itemSpacing,
                     horizontalSpace);
    
    return sectionInset;
}

- (UIEdgeInsets)_lastSectionInset {
    NSAssert(self.infiniteLoop, @"Carousel's infiniteLoop must be YES");
    
    CGFloat verticalSpace = (CGRectGetHeight(self.collectionView.frame) - self.layout.itemSize.height) / 2;
    CGFloat horizontalSpace = (CGRectGetWidth(self.collectionView.frame) - self.layout.itemSize.width) / 2.0;
    
    UIEdgeInsets sectionInset =
    self.carouselScrollDirection == UICollectionViewScrollDirectionHorizontal ?
    UIEdgeInsetsMake(verticalSpace,
                     0.0,
                     verticalSpace,
                     self.layout.sectionInset.right) :
    UIEdgeInsetsMake(0.0,
                     horizontalSpace,
                     self.layout.sectionInset.bottom,
                     horizontalSpace);
    
    return sectionInset;
}

- (UIEdgeInsets)_middleSectionInset {
    NSAssert(self.infiniteLoop, @"Carousel's infiniteLoop must be YES");
    
    CGFloat verticalSpace = (CGRectGetHeight(self.collectionView.frame) - self.layout.itemSize.height) / 2;
    CGFloat horizontalSpace = (CGRectGetWidth(self.collectionView.frame) - self.layout.itemSize.width) / 2.0;
    
    UIEdgeInsets sectionInset =
    self.carouselScrollDirection == UICollectionViewScrollDirectionHorizontal ?
    UIEdgeInsetsMake(verticalSpace,
                     0,
                     verticalSpace,
                     self.layout.itemSpacing) :
    UIEdgeInsetsMake(0.0,
                     horizontalSpace,
                     self.layout.itemSpacing,
                     horizontalSpace);
    
    return sectionInset;
}

#pragma mark - Setter

- (void)setAutoScrollInterval:(CGFloat)autoScrollInterval {
    _autoScrollInterval = autoScrollInterval;
    
    [self _removeTimer];
    
    if (autoScrollInterval > 0 && self.superview) {
        [self _addTimer];
    }
}

- (void)setTimerSrollDirection:(NNCarouselScrollDirection)timerSrollDirection {
    _timerSrollDirection = timerSrollDirection;
    
    _carouselScrollDirection =
    timerSrollDirection == NNCarouselScrollDirectionLTR ||
    timerSrollDirection == NNCarouselScrollDirectionRTL ?
    UICollectionViewScrollDirectionHorizontal :
    UICollectionViewScrollDirectionVertical;
    
    self.layout.scrollDirection = _carouselScrollDirection;
}

- (void)setCarouselScrollDirection:(UICollectionViewScrollDirection)carouselScrollDirection {
    _carouselScrollDirection = carouselScrollDirection;
    
    self.layout.scrollDirection = carouselScrollDirection;
    
    _timerSrollDirection =
    carouselScrollDirection == UICollectionViewScrollDirectionHorizontal ?
    NNCarouselScrollDirectionLTR :
    NNCarouselScrollDirectionBTT;
}

#pragma mark - Getter

- (NSInteger)currentItem {
    return _currentIndexPath.item;
}

@end
