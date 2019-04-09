//
//  UIImageView+AnimationSDWebImage.h
//  NNProject
//
//  Created by 谢翼华 on 2018/7/25.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <SDWebImage/UIImageView+WebCache.h>

@interface UIImageView (AnimationSDWebImage)

- (void)sd_setAnimationImageWithURL:(NSURL *)url;

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder;

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                            options:(SDWebImageOptions)options;

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                          completed:(SDExternalCompletionBlock)completedBlock;

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                          completed:(SDExternalCompletionBlock)completedBlock;

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                            options:(SDWebImageOptions)options
                          completed:(SDExternalCompletionBlock)completedBlock;

- (void)sd_setAnimationImageWithURL:(NSURL *)url
                   placeholderImage:(UIImage *)placeholder
                            options:(SDWebImageOptions)options
                           progress:(SDWebImageDownloaderProgressBlock)progressBlock
                          completed:(SDExternalCompletionBlock)completedBlock;

@end
