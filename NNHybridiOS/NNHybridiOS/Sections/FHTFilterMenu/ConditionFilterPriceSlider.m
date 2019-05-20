//
//  ConditionFilterPriceSlider.m
//  MYRoom
//
//  Created by 谢翼华 on 2018/8/3.
//  Copyright © 2018年 Perfect. All rights reserved.
//

#import "ConditionFilterPriceSlider.h"

static const CGFloat horizontalSpacing = 26.0;
@interface ConditionFilterPriceSlider()

@property (nonatomic, strong) CAGradientLayer *line;
@property (nonatomic, strong) CAShapeLayer *leftLine;
@property (nonatomic, strong) CAShapeLayer *rightLine;
@property (nonatomic, strong) CAGradientLayer *fillLine;
@property (nonatomic, strong) CATextLayer *leftLabel;
@property (nonatomic, strong) CATextLayer *rightLabel;
@property (nonatomic, strong) CALayer *aPoint;
@property (nonatomic, strong) CALayer *bPoint;
@property (nonatomic, weak) CALayer *movePoint;

@property (nonatomic, copy) NSString *minPrice;
@property (nonatomic, copy) NSString *maxPrice;

@end

@implementation ConditionFilterPriceSlider

#pragma mark - Init

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self _setupView];
    }
    
    return self;
}

#pragma mark - Override

- (void)layoutSubviews {
    [super layoutSubviews];
    
    CGFloat leftLineW = 0.0;
    CGFloat rightLineW = 0.0;
    
    CGFloat aLeftOffset = fabs(self.aPoint.position.x - horizontalSpacing);
    CGFloat bLeftOffset = fabs(self.bPoint.position.x - horizontalSpacing);
    
    if (aLeftOffset <= bLeftOffset) {
        leftLineW = aLeftOffset;
        rightLineW = fabs(SCREEN_WIDTH - horizontalSpacing - self.bPoint.position.x);
    } else {
        leftLineW = bLeftOffset;
        rightLineW = fabs(SCREEN_WIDTH - horizontalSpacing - self.aPoint.position.x);
    }
    
    self.leftLine.frame = CGRectMake(horizontalSpacing, 37, leftLineW, 4);
    self.rightLine.frame = CGRectMake(SCREEN_WIDTH - horizontalSpacing - rightLineW, 37, rightLineW, 4);
    
    double leftNumber = leftLineW / (SCREEN_WIDTH - horizontalSpacing * 2) * 100.0;
    NSString *leftString = FormatString(@"%0.lf", leftNumber);
    self.minPrice = leftNumber == 100 ? nil : FormatString(@"%d", leftString.intValue * 100);
    self.leftLabel.string = leftNumber == 100 ? @"不限 " : FormatString(@"%d", leftString.intValue * 100);
    self.leftLabel.frame = CGRectMake(SCREEN_WIDTH * 0.5 - 100, leftNumber == 100 ? 10 : 11, 95, 15);
    
    double rightNumber = (SCREEN_WIDTH - horizontalSpacing * 2 - rightLineW) / (SCREEN_WIDTH - horizontalSpacing * 2) * 100.0;
    NSString *rightString = FormatString(@"%0.lf", rightNumber);
    self.maxPrice = rightNumber == 100 ? nil : FormatString(@"%d", rightString.intValue * 100);
    self.rightLabel.string = rightNumber == 100 ? @"- 不限" : FormatString(@"- %d", rightString.intValue * 100);
    self.rightLabel.frame = CGRectMake(SCREEN_WIDTH * 0.5 - 5, rightNumber == 100 ? 10 : 11, 100, 15);
}

#pragma mark - Private

- (void)_setupView {
    self.backgroundColor = [UIColor whiteColor];
    [self _addLayers];
}

- (void)_addLayers {
    self.line = [CAGradientLayer layer];
    self.line.frame = CGRectMake(horizontalSpacing, 37, SCREEN_WIDTH - horizontalSpacing * 2, 4);
    self.line.colors = @[(id)nn_colorHex(0xFFC011).CGColor,
                             (id)nn_colorHex(0xFF8C07).CGColor];
    self.line.locations = @[@(0.0),@(1.0)];
    self.line.startPoint = CGPointZero;
    self.line.endPoint = CGPointMake(1, 0);
    [self.layer addSublayer:self.line];
    
    self.leftLine = [CAShapeLayer layer];
    self.leftLine.backgroundColor = nn_colorHex(0xE9E9E9).CGColor;
    [self.layer addSublayer:self.leftLine];
    
    self.rightLine = [CAShapeLayer layer];
    self.rightLine.backgroundColor = nn_colorHex(0xE9E9E9).CGColor;
    [self.layer addSublayer:self.rightLine];
    
    UIFont *labelFont = nn_regularFontSize(12);
    CFStringRef fontName = (__bridge CFStringRef)labelFont.fontName;
    CGFontRef fontRef = CGFontCreateWithFontName(fontName);
    
    self.leftLabel = [CATextLayer layer];
    self.leftLabel.frame = CGRectMake(SCREEN_WIDTH * 0.5 - 100, 11, 95, 15);
    self.leftLabel.contentsScale = [UIScreen mainScreen].scale;
    self.leftLabel.foregroundColor = nn_colorHex(0x333333).CGColor;
    self.leftLabel.font = fontRef;
    self.leftLabel.fontSize = labelFont.pointSize;
    self.leftLabel.string = nil;
    self.leftLabel.alignmentMode = kCAAlignmentRight;
    [self.layer addSublayer:self.leftLabel];
    
    self.rightLabel = [CATextLayer layer];
    self.rightLabel.frame = CGRectMake(SCREEN_WIDTH * 0.5 - 5, 11, 100, 15);
    self.rightLabel.contentsScale = [UIScreen mainScreen].scale;
    self.rightLabel.foregroundColor = nn_colorHex(0x333333).CGColor;
    self.rightLabel.font = fontRef;
    self.rightLabel.fontSize = labelFont.pointSize;
    self.rightLabel.alignmentMode = kCAAlignmentNatural;
    CGFontRelease(fontRef);
    [self.layer addSublayer:self.rightLabel];
    
    self.aPoint = [CALayer layer];
    self.aPoint.contents = (__bridge id _Nullable)([UIImage imageNamed:@"price_slider_track"].CGImage);
    self.aPoint.frame = CGRectMake(0, 0, 30, 30);
    self.aPoint.position = CGPointMake(horizontalSpacing, 39);
    [self.layer addSublayer:self.aPoint];
    
    self.bPoint = [CALayer layer];
    self.bPoint.contents = (__bridge id _Nullable)([UIImage imageNamed:@"price_slider_track"].CGImage);
    self.bPoint.frame = CGRectMake(0, 0, 30, 30);
    self.bPoint.position = CGPointMake(SCREEN_WIDTH - horizontalSpacing, 39);
    [self.layer addSublayer:self.bPoint];
}

- (BOOL)_filterPosition:(CGPoint)position {
    if (position.y <= 0 || position.y >= 100) {
        return YES;
    }
    
    return NO;
}

- (void)_updateMovePoint:(CGPoint)point {
    double aOffset = fabs(point.x - self.aPoint.position.x);
    double bOffset = fabs(point.x - self.bPoint.position.x);
    
    self.movePoint = aOffset <= bOffset ? self.aPoint : self.bPoint;
}

#pragma mark - Public

- (void)updateMinPrice:(NSString *)minPrice maxPrice:(NSString *)maxPrice {
    NSLog(@"minPrice = %@ maxPrice = %@", minPrice, maxPrice);
    
    minPrice = [minPrice isEqualToString:@"不限"] ? @"10000" : minPrice;
    maxPrice = [maxPrice isEqualToString:@"不限"] ? @"10000" : maxPrice;
    CGFloat minOffset = horizontalSpacing + (minPrice.doubleValue / 10000) * (SCREEN_WIDTH - horizontalSpacing * 2);
    CGFloat maxOffset = horizontalSpacing + (maxPrice.doubleValue / 10000) * (SCREEN_WIDTH - horizontalSpacing * 2);
    self.aPoint.position = CGPointMake(minOffset, 39);
    self.bPoint.position = CGPointMake(maxOffset, 39);
    
    [self setNeedsLayout];
}

#pragma mark - Touch Event

- (BOOL)beginTrackingWithTouch:(UITouch *)touch withEvent:(UIEvent *)event {
    CGPoint position = [touch locationInView:self];
    if ([self _filterPosition:position]) {
        return NO;
    }
    
    [self _updateMovePoint:position];
    CGFloat positionX = position.x <= horizontalSpacing ? horizontalSpacing : position.x;
    positionX = position.x >= SCREEN_WIDTH - horizontalSpacing ? SCREEN_WIDTH - horizontalSpacing : positionX;
    self.movePoint.position = CGPointMake(positionX, 39);
    [self setNeedsLayout];
    
    return YES;
}

- (BOOL)continueTrackingWithTouch:(UITouch *)touch withEvent:(UIEvent *)event {
    CGPoint position = [touch locationInView:self];
    if ([self _filterPosition:position]) {
        [self endTrackingWithTouch:touch withEvent:event];
        
        return NO;
    }
    
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    CGFloat positionX = position.x <= horizontalSpacing ? horizontalSpacing : position.x;
    positionX = position.x >= SCREEN_WIDTH - horizontalSpacing ? SCREEN_WIDTH - horizontalSpacing : positionX;
    self.movePoint.position = CGPointMake(positionX, 39);
    [self setNeedsLayout];
    [CATransaction commit];
    
    return YES;
}

- (void)endTrackingWithTouch:(UITouch *)touch withEvent:(UIEvent *)event {
    [self sendActionsForControlEvents:UIControlEventValueChanged];
}

#pragma mark - Setter

- (void)setLabelFont:(UIFont *)labelFont {
    _labelFont = labelFont;
    
    CFStringRef fontName = (__bridge CFStringRef)labelFont.fontName;
    CGFontRef fontRef = CGFontCreateWithFontName(fontName);
    self.leftLabel.font = fontRef;
    self.rightLabel.font = fontRef;
    CGFontRelease(fontRef);
}

@end
