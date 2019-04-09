//
//  UIImageView+AnimationSDWebImage.m
//  NNProject
//
//  Created by 谢翼华 on 2018/7/25.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UIImageView+AnimationSDWebImage.h"

@implementation UIImageView (AnimationSDWebImage)

#pragma mark - Public

- (void)sd_setAnimationImageWithURL:(NSURL *)url {
    [self sd_setAnimationImageWithURL:url placeholderImage:nil options:0 progress:nil completed:nil];
}

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder {
    [self sd_setAnimationImageWithURL:url placeholderImage:placeholder options:0 progress:nil completed:nil];
}

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                            options:(SDWebImageOptions)options {
    [self sd_setAnimationImageWithURL:url placeholderImage:placeholder options:options progress:nil completed:nil];
}

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                          completed:(SDExternalCompletionBlock)completedBlock {
    [self sd_setAnimationImageWithURL:url placeholderImage:nil options:0 progress:nil completed:completedBlock];
}

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                          completed:(SDExternalCompletionBlock)completedBlock {
    [self sd_setAnimationImageWithURL:url placeholderImage:placeholder options:0 progress:nil completed:completedBlock];
}

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                            options:(SDWebImageOptions)options
                          completed:(SDExternalCompletionBlock)completedBlock {
    [self sd_setAnimationImageWithURL:url placeholderImage:placeholder options:options progress:nil completed:completedBlock];
}

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                            options:(SDWebImageOptions)options
                           progress:(SDWebImageDownloaderProgressBlock)progressBlock
                          completed:(SDExternalCompletionBlock)completedBlock {
    WEAK_SELF;
    
    [self sd_setImageWithURL:url placeholderImage:placeholder options:options progress:progressBlock completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
        if (cacheType == SDImageCacheTypeNone && image) {
            weakSelf.image = placeholder;
            
            [UIView transitionWithView:weakSelf
                              duration:0.35
                               options:UIViewAnimationOptionTransitionCrossDissolve
                            animations:^{
                                weakSelf.image = image;
                            }
                            completion:nil];
        }
        
        BLOCK_EXEC(completedBlock, image, error, cacheType, imageURL);
    }];
}

@end
