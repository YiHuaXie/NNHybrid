//
//  FilterSubmenuCell.h
//  MYRoom
//
//  Created by Snow on 2018/12/4.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface FilterSubmenuTextCell : UITableViewCell

@property (nonatomic, readonly, strong) UILabel *lblText;
@property (nonatomic, readonly, strong) UIImageView *imvMark;
@property (nonatomic, assign) BOOL hasSubItems;

+ (NSString *)reuseIdentifier;

@end

@interface FilterSubmenuCollectionHeadView : UICollectionReusableView

@property (nonatomic, strong) UILabel *titleLabel;

@end

@interface FilterSubmenuButtonCell : UICollectionViewCell

@property (nonatomic, readonly, strong) UILabel *titleLabel;

@end

NS_ASSUME_NONNULL_END
