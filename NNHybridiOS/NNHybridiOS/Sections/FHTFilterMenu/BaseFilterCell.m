//
// Created by NeroXie on 2019/3/19.
// Copyright (c) 2019 Perfect. All rights reserved.
//

#import "BaseFilterCell.h"

@interface BaseFilterCell()

@property (nonatomic, strong) UILabel *contentLabel;
@property (nonatomic, strong) UIView *cursorView;

@end

@implementation BaseFilterCell

- (void)awakeFromNib {
    [super awakeFromNib];
    [self _setup];
}

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(nullable NSString *)reuseIdentifier {
    if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
        [self _setup];
    }

    return self;
}

#pragma mark - Private

- (void)_setup {
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    self.backgroundColor = UIColor.clearColor;
    
    self.contentLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    self.contentLabel.textAlignment = NSTextAlignmentCenter;
    [self.contentView addSubview:self.contentLabel];
    [self.contentLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(self.contentView);
    }];

    self.cursorView = [[UIView alloc] initWithFrame:CGRectZero];
    self.cursorView.backgroundColor = APP_THEME_COLOR;
    self.cursorView.layer.cornerRadius = 2;
    self.cursorView.clipsToBounds = YES;
    [self.contentView addSubview:self.cursorView];
    [self.cursorView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.trailing.equalTo(self.contentView);
        make.size.mas_equalTo(CGSizeMake(3, 18));
    }];
}

#pragma mark - Setter

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
    self.cursorView.hidden = !selected;
    self.contentLabel.textColor = selected ? APP_TEXT_BLACK_COLOR : APP_TEXT_GRAY_COLOR;
    self.contentLabel.font = selected ? nn_mediumFontSize(14) : nn_regularFontSize(14);
}

@end
