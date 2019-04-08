//
//  NNPFSLabel.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/24.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "NNPFSLabel.h"
#import "CADisplayLink+NNExtension.h"

const NSInteger kNNPFSLabelTag = 918171;
static const CGSize DefaultSize = {55, 20};

@interface NNPFSLabel()

@property (nonatomic, strong) CADisplayLink *link;
@property (nonatomic, assign) NSUInteger count;
@property (nonatomic, assign) NSTimeInterval lastTime;

@property (nonatomic, strong) UIFont *subFont;
@property (nonatomic, strong) UIColor *subColor;

@end

@implementation NNPFSLabel

#pragma mark - Init

- (instancetype)init {
    if (self = [super init]) {
        [self _setup];
    }
    
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (frame.size.width == 0 && frame.size.height == 0) {
        frame.size = DefaultSize;
    }
    
    if (self = [super initWithFrame:frame]) {
        [self _setup];
    }
    
    return self;
}

#pragma mark - Override

- (CGSize)sizeThatFits:(CGSize)size {
    return DefaultSize;
}

#pragma mark - Public

+ (void)showInView:(UIView *)view {
#if DEBUG
    if (!view) return;
    
    NNPFSLabel *label = [[NNPFSLabel alloc] initWithFrame:CGRectMake(250, 100, 50, 30)];
    label.tag = kNNPFSLabelTag;
    [view addSubview:label];
#endif
}

+ (void)dismissInView:(UIView *)view {
#if DEBUG
    if (!view) return;
    
    NNPFSLabel *label = [view viewWithTag:kNNPFSLabelTag];
    if (label) {
        [label removeFromSuperview];
    }
#endif
}

#pragma mark - Private

- (void)_setup {
    self.layer.cornerRadius = 5;
    self.clipsToBounds = YES;
    self.textAlignment = NSTextAlignmentCenter;
    self.userInteractionEnabled = NO;
    self.backgroundColor = [UIColor colorWithWhite:0.000 alpha:0.700];
    self.font = [UIFont systemFontOfSize:14];
    self.subFont = [UIFont systemFontOfSize:4];
    self.subColor = [UIColor whiteColor];
    [self sizeToFit];
    
    self.link = [CADisplayLink nn_displayLinkWithWeakTarget:self selector:@selector(linkTick:)];
    [self.link addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)linkTick:(CADisplayLink *)link {
    if (self.lastTime == 0) {
        self.lastTime = link.timestamp;
        return;
    }
    
    self.count++;
    NSTimeInterval delta = link.timestamp - self.lastTime;
    if (delta < 1) return;
    self.lastTime = link.timestamp;
    float fps = self.count / delta;
    self.count = 0;
    
    CGFloat progress = fps / 60.0;
    UIColor *color = [UIColor colorWithHue:0.27 * (progress - 0.2) saturation:1 brightness:0.9 alpha:1];
    
    NSMutableAttributedString *text = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%d FPS",(int)round(fps)]];
    [text addAttribute:NSForegroundColorAttributeName value:color range:NSMakeRange(0, text.length - 3)];
    [text addAttribute:NSForegroundColorAttributeName value:self.subColor range:NSMakeRange(text.length - 3, 3)];
    [text addAttribute:NSFontAttributeName value:self.font range:NSMakeRange(0, text.length)];
    [text addAttribute:NSFontAttributeName value:self.subFont range:NSMakeRange(text.length - 4, 1)];
    self.attributedText = text;
}

@end
