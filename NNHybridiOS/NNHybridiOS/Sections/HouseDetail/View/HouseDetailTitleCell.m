//
//  HouseDetailTitleCell.m
//  MYRoom
//
//  Created by NeroXie on 2019/3/18.
//  Copyright © 2019 Perfect. All rights reserved.
//

#import "HouseDetailTitleCell.h"
#import "NNLabelStyleLayout.h"
#import "NNEasyKit.h"
#import "TagModel.h"

static ConstString kContentLabel = @"ContentLabel";
static ConstString kContentImageView = @"ContentImageView";

@interface HouseDetailTitleCell()
<NNLabelStyleLayoutDelegate,
UICollectionViewDataSource,
UICollectionViewDelegate>

@property (nonatomic, copy) NSArray *tagList;

@end

@implementation HouseDetailTitleCell

#pragma mark - Init

- (void)awakeFromNib {
    [super awakeFromNib];
    [self _setup];
}

#pragma mark - Private

- (void)_setup {
    self.separatorInset = UIEdgeInsetsMake(0, SCREEN_WIDTH, 0, 0);
    
    self.questionMarkButton.nn_enlargedEdgeInsets = UIEdgeInsetsMake(5, 5, 5, 5);
    
    NNLabelStyleLayout *layout = [[NNLabelStyleLayout alloc] init];
    layout.interitemSpacing = 10;
    layout.delegate = self;
    
    self.tagCollectionView.collectionViewLayout = layout;
    self.tagCollectionView.dataSource = self;
    self.tagCollectionView.delegate = self;
    [self.tagCollectionView nn_registerCellsWithClasses:@[UICollectionViewCell.class]];
}

- (NSAttributedString *)_priceAttributedStringFromPrice:(NSString *)price {
    if (!price.length) return nil;
    
    NSString *tmp = [NSString stringWithFormat:@"¥%.0lf/月", price.doubleValue];
    NSDictionary *attributes = @{NSFontAttributeName:nn_mediumFontSize(20),
                                 NSForegroundColorAttributeName:APP_THEME_COLOR};
    NSMutableAttributedString *tmpAttributed = [[NSMutableAttributedString alloc] initWithString:tmp
                                                                                attributes:attributes];
    NSRange range = [tmp rangeOfString:@"/月"];
    [tmpAttributed addAttribute:NSFontAttributeName value:nn_mediumFontSize(10) range:range];
    
    return [tmpAttributed copy];
}

- (NSString *)_concentrativeRoomTypeStringWithMinChamber:(int)minChamber
                                              MaxChamber:(int)maxChamber {
    NSString *tmp = nil;
    if (minChamber) {
        if (maxChamber > minChamber) {
            tmp = FormatString(@"%d~%d室", minChamber, maxChamber);
        } else if (maxChamber == minChamber) {
            tmp = FormatString(@"%d室", minChamber);
        } else {
            tmp = FormatString(@"%d~%d室", maxChamber, minChamber);
        }
    } else {
        if (maxChamber) {
            tmp = FormatString(@"%d室", maxChamber);
        } else {
            tmp = @"暂无数据";
        }
    }
    
    return tmp;
}

- (IBAction)_didQuestionMarkButtonPressed:(id)sender {
    BLOCK_EXEC(self.viewPaymentWayHandler);
}

#pragma mark - Public

- (void)bindCentraliedHouse:(CentraliedHouse *)house {
    self.houseTitleLabel.text = FormatString(@"%@·%@", house.estateName, house.styleName);
    self.priceLabel.attributedText = [self _priceAttributedStringFromPrice:house.rentPrice];
    self.roomTypeLabel.text = [self _concentrativeRoomTypeStringWithMinChamber:house.minChamber
                                                                    MaxChamber:house.maxChamber];
    
    NSString *areaString = house.minRoomArea <= 0.0 ? @"暂无数据" : FormatString(@"%.0lf㎡", house.minRoomArea);
    self.areaLabel.text = areaString;
    self.questionMarkButton.hidden = YES;
    self.tagList = house.showTagList;
    self.tagCollectionView.hidden = house.showTagList.count < 1;
    [self.tagCollectionView reloadData];
}

- (void)bindDecentraliedHouse:(DecentraliedHouse *)house {
    self.houseTitleLabel.text = house.houseName;
    self.questionMarkButton.hidden = YES;
    self.priceLabel.attributedText = [self _priceAttributedStringFromPrice:house.price];
    self.roomTypeLabel.text = house.houseType;
    self.areaLabel.text = FormatString(@"%.0lf㎡", house.houseArea);
    self.tagList = house.showTagList;
    self.tagCollectionView.hidden = house.showTagList.count < 1;
    [self.tagCollectionView reloadData];
}

#pragma mark - UICollectionViewDataSource

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.tagList.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    UICollectionViewCell *cell =
    [collectionView dequeueReusableCellWithReuseIdentifier:UICollectionViewCell.nn_classString forIndexPath:indexPath];
    
    UILabel *contentLabel = (UILabel *) [cell.contentView nn_viewWithStringTag:kContentLabel];
    if (!contentLabel) {
        contentLabel = [[UILabel alloc] init];
        contentLabel.textAlignment = NSTextAlignmentCenter;
        contentLabel.nn_stringTag = kContentLabel;
        contentLabel.layer.cornerRadius = 3;
        contentLabel.layer.borderWidth = 0.5;
        contentLabel.font = nn_regularFontSize(13);
        [cell.contentView addSubview:contentLabel];
        [contentLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(cell.contentView);
        }];
    }
    
    UIImageView *contentImageView =(UIImageView *) [cell.contentView nn_viewWithStringTag:kContentImageView];
    if (!contentImageView) {
        contentImageView = [[UIImageView alloc] init];
        contentImageView.nn_stringTag = kContentImageView;
        [cell.contentView addSubview:contentImageView];
        [contentImageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(cell.contentView);
        }];
    }
    
    TagModel *tag = self.tagList[indexPath.item];
    if (tag.tagIcon.length == 0) {//认为是文本标签
        contentImageView.hidden = YES;
        contentLabel.hidden = NO;
        contentLabel.layer.borderColor = nn_colorHexString(tag.borderColor).CGColor;
        contentLabel.layer.backgroundColor = nn_colorHexString(tag.backgroundColor).CGColor;
        contentLabel.textColor = nn_colorHexString(tag.tagColor);
        contentLabel.text = tag.tagName;
    } else {
        contentLabel.hidden = YES;
        contentImageView.hidden = NO;
        [contentImageView sd_setAnimationImageWithURL:[NSURL URLWithString:tag.tagIcon]];
    }
    
    return cell;
}

#pragma mark - FHTLabelStyleLayoutDelegate

- (CGSize)labelStyleLayout:(UICollectionView *)collectionView sizeForItemAtIndex:(NSUInteger)index {
    TagModel *tag = self.tagList[index];
    if (tag.iconWidth == 0 && tag.iconHeight == 0) {
        CGFloat width = [NSString nn_widthWithString:tag.tagName
                                            maxHeight:16
                                           attributes:@{NSFontAttributeName: nn_regularFontSize(13)}] + 20;
        width = width < 46 ? 46 : width;
        width = width > 65 ? 65 : width;
        
        return CGSizeMake(width, 20);
    }
    
    return CGSizeMake(tag.iconWidth, tag.iconHeight);
}

@end
