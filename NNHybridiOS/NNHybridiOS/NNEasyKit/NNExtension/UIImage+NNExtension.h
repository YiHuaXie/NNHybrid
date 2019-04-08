//
//  UIImage+NNExtension.h
//  NNProject
//
//  Created by 谢翼华 on 2018/8/17.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, NNCropMode) {
    NNCropModeTopLeft,
    NNCropModeTopCenter,
    NNCropModeTopRight,
    NNCropModeBottomLeft,
    NNCropModeBottomCenter,
    NNCropModeBottomRight,
    NNCropModeLeftCenter,
    NNCropModeRightCenter,
    NNCropModeCenter
};

@interface UIImage (NNExtension)

/**
 * Create an UIImage based on color and size
 */
+ (instancetype)nn_imageWithColor:(UIColor *)color size:(CGSize)size;

/**
 * Create an UIImage based on color
 */
+ (instancetype)nn_imageWithColor:(UIColor *)color;

/*
 * Get cropped image
 */
- (UIImage *)nn_cropToSize:(CGSize)newSize usingMode:(NNCropMode)cropMode;

/**
 * Get cropped image with NNCropModeTopLeft
 */
- (UIImage *)nn_cropToSize:(CGSize)newSize;

/*
 * Same as 'scale to fill' in IB.
 * The closer the newSize is to the original image size, the clearer the image
 */
- (UIImage *)nn_scaleToFillSize:(CGSize)newSize;

/**
 * Same as 'aspect fit' in IB.
 */
- (UIImage *)nn_aspectFitSize:(CGSize)newSize;

/**
 * Same as 'aspect fill' in IB.
 */
- (UIImage *)nn_aspectFillSize:(CGSize)newSize;

/**
 * Get zoomed images
 */
- (UIImage *)nn_scaleByFactor:(CGFloat)scaleFactor;

@end
