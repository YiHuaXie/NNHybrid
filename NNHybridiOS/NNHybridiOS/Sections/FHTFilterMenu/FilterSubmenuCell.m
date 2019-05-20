//
//  FilterSubmenuCell.m
//  MYRoom
//
//  Created by Snow on 2018/12/4.
//  Copyright © 2018 Perfect. All rights reserved.
//

#import "FilterSubmenuCell.h"

@interface FilterSubmenuTextCell ()

@property (nonatomic, readwrite, strong) UILabel *lblText;
@property (nonatomic, readwrite, strong) UIImageView *imvMark;

@end

@implementation FilterSubmenuTextCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.selectionStyle = UITableViewCellSelectionStyleNone;
        self.backgroundColor = [UIColor clearColor];
        
        self.lblText = [[UILabel alloc] init];
        [self.contentView addSubview:self.lblText];
        self.lblText.font = nn_regularFontSize(12);
        self.lblText.textAlignment = NSTextAlignmentCenter;
        
        self.imvMark = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"house_accessory_selected"]];
        [self.contentView addSubview:self.imvMark];
        
        [self.lblText mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(self.contentView);
            make.left.equalTo(@(30));
        }];
        
        [self.imvMark mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.contentView);
            make.right.equalTo(@(-30));
        }];
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
    self.imvMark.hidden = self.hasSubItems || !selected;
    self.lblText.textColor = selected ? APP_THEME_COLOR : APP_TEXT_BLACK_COLOR;
    self.backgroundColor = selected ? [UIColor colorWithWhite:0.95 alpha:1.0] : [UIColor whiteColor];
}

- (void)prepareForReuse {
    [super prepareForReuse];
    self.lblText.text = nil;
    self.lblText.textColor = APP_TEXT_BLACK_COLOR;
    self.imvMark.hidden = YES;
    self.hasSubItems = NO;
    self.backgroundColor = [UIColor whiteColor];
}

+ (NSString *)reuseIdentifier {
    return [self nn_classString];
}

@end

@implementation FilterSubmenuCollectionHeadView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self createUI];
        [self layoutSubviews];
    }
    return self;
}

- (void)createUI
{
    _titleLabel = [UILabel new];
    _titleLabel.font = nn_mediumFontSize(15);
    _titleLabel.textColor = UIColor.blackColor;
    [self addSubview:_titleLabel];
}

- (void)layoutSubviews
{
    [_titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(20);
        make.centerY.equalTo(self);
    }];
}

@end

@interface FilterSubmenuButtonCell ()

@property (nonatomic, readwrite, strong) UILabel *titleLabel;

@end

@implementation FilterSubmenuButtonCell

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self createUI];
        [self layoutSubviews];
    }
    return self;
}

- (void)createUI
{
    self.backgroundColor = nn_colorHex(0xF8F8F7);
    self.layer.cornerRadius = 15;
    self.layer.masksToBounds = YES;
    
    _titleLabel = [UILabel new];
    _titleLabel.font = [UIFont systemFontOfSize:12];
    _titleLabel.textAlignment = NSTextAlignmentCenter;
    _titleLabel.textColor = nn_colorHex(0x444444) ;
    [self.contentView addSubview:_titleLabel];
}

- (void)layoutSubviews
{
    [_titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));
    }];
}

- (void)setSelected:(BOOL)selected
{
    [super setSelected:selected];
    if (selected) {
        _titleLabel.backgroundColor = nn_colorHex(0xFFF3E5);
        _titleLabel.textColor = APP_THEME_COLOR;
    }else {
        _titleLabel.backgroundColor =nn_colorHex(0xF8F8F7);
        _titleLabel.textColor = nn_colorHex(0x444444);
    }
}

@end
