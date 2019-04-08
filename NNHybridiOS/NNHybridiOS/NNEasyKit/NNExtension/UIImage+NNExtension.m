//
//  UIImage+NNExtension.m
//  NNProject
//
//  Created by 谢翼华 on 2018/8/17.
//  Copyright © 2018年 谢翼华. All rights reserved.
//

#import "UIImage+NNExtension.h"

static NSCache *colorImageCache = NULL;
static CGColorSpaceRef rgbColorSpace = NULL;

@implementation UIImage (NNExtension)

#pragma mark - Lifecycle

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        colorImageCache = [NSCache new];
    });
}

#pragma mark - Public

+ (instancetype)nn_imageWithColor:(UIColor *)color {
    UIImage *image = [colorImageCache objectForKey:color];
    
    if (image) {
        return image;
    }
    
    UIImage *colorImage = [self nn_imageWithColor:color size:CGSizeMake(1, 1)];
    [colorImageCache setObject:colorImage forKey:color];
    
    return colorImage;
}

+ (instancetype)nn_imageWithColor:(UIColor *)color size:(CGSize)size {
    if (color == nil ||
        color == [UIColor clearColor] ||
        CGSizeEqualToSize(size, CGSizeZero)) {
        return nil;
    }
    
    CGRect rect = CGRectMake(0, 0, size.width, size.height);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);
    
    UIImage *colorImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return colorImage;
}

- (UIImage *)nn_cropToSize:(CGSize)newSize usingMode:(NNCropMode)cropMode {
    CGSize size = self.size;
    CGFloat x, y;

    switch (cropMode) {
        case NNCropModeTopLeft:
            x = y = 0.0f;
            break;
        case NNCropModeTopCenter:
            x = (size.width - newSize.width) * 0.5f;
            y = 0.0f;
            break;
        case NNCropModeTopRight:
            x = size.width - newSize.width;
            y = 0.0f;
            break;
        case NNCropModeBottomLeft:
            x = 0.0f;
            y = size.height - newSize.height;
            break;
        case NNCropModeBottomCenter:
            x = (size.width - newSize.width) * 0.5f;
            y = size.height - newSize.height;
            break;
        case NNCropModeBottomRight:
            x = size.width - newSize.width;
            y = size.height - newSize.height;
            break;
        case NNCropModeLeftCenter:
            x = 0.0f;
            y = (size.height - newSize.height) * 0.5f;
            break;
        case NNCropModeRightCenter:
            x = size.width - newSize.width;
            y = (size.height - newSize.height) * 0.5f;
            break;
        case NNCropModeCenter:
            x = (size.width - newSize.width) * 0.5f;
            y = (size.height - newSize.height) * 0.5f;
            break;
        default: // Default to top left
            x = y = 0.0f;
            break;
    }

    if (self.imageOrientation == UIImageOrientationLeft ||
        self.imageOrientation == UIImageOrientationLeftMirrored ||
        self.imageOrientation == UIImageOrientationRight ||
        self.imageOrientation == UIImageOrientationRightMirrored) {
        CGFloat temp = x;
        x = y;
        y = temp;

        temp = newSize.width;
        newSize.width = newSize.height;
        newSize.height = temp;
    }

    CGRect cropRect = CGRectMake(x * self.scale,
                                 y * self.scale,
                                 newSize.width * self.scale,
                                 newSize.height * self.scale);

    CGImageRef croppedImageRef = CGImageCreateWithImageInRect(self.CGImage, cropRect);
    UIImage *cropped = [UIImage imageWithCGImage:croppedImageRef
                                           scale:self.scale
                                     orientation:self.imageOrientation];

    CGImageRelease(croppedImageRef);

    return cropped;
}

- (UIImage *)nn_cropToSize:(CGSize)newSize {
    return [self nn_cropToSize:newSize usingMode:NNCropModeTopLeft];
}

- (UIImage *)nn_scaleToFillSize:(CGSize)newSize {
    size_t destWidth = (size_t)(newSize.width * self.scale);
    size_t destHeight = (size_t)(newSize.height * self.scale);
    if (self.imageOrientation == UIImageOrientationLeft ||
        self.imageOrientation == UIImageOrientationLeftMirrored ||
        self.imageOrientation == UIImageOrientationRight ||
        self.imageOrientation == UIImageOrientationRightMirrored) {
        size_t temp = destWidth;
        destWidth = destHeight;
        destHeight = temp;
    }
    
    CGContextRef bmContext = CreateARGBBitmapContext(destWidth,
                                                     destHeight,
                                                     destWidth * 4,
                                                     ImageHasAlpha(self.CGImage));
    if (!bmContext)
        return nil;
    
    CGContextSetShouldAntialias(bmContext, true);
    CGContextSetAllowsAntialiasing(bmContext, true);
    CGContextSetInterpolationQuality(bmContext, kCGInterpolationHigh);

    UIGraphicsPushContext(bmContext);
    CGContextDrawImage(bmContext, CGRectMake(0.0f, 0.0f, destWidth, destHeight), self.CGImage);
    UIGraphicsPopContext();
    
    CGImageRef scaledImageRef = CGBitmapContextCreateImage(bmContext);
    UIImage *scaled = [UIImage imageWithCGImage:scaledImageRef
                                          scale:self.scale
                                    orientation:self.imageOrientation];

    CGImageRelease(scaledImageRef);
    CGContextRelease(bmContext);
    
    return scaled;
}

- (UIImage *)nn_aspectFitSize:(CGSize)newSize {
    size_t destWidth, destHeight;
    if (self.size.width > self.size.height) {
        destWidth = (size_t)newSize.width;
        destHeight = (size_t)(self.size.height * newSize.width / self.size.width);
    } else {
        destHeight = (size_t)newSize.height;
        destWidth = (size_t)(self.size.width * newSize.height / self.size.height);
    }
    
    if (destWidth > newSize.width) {
        destWidth = (size_t)newSize.width;
        destHeight = (size_t)(self.size.height * newSize.width / self.size.width);
    }
    
    if (destHeight > newSize.height) {
        destHeight = (size_t)newSize.height;
        destWidth = (size_t)(self.size.width * newSize.height / self.size.height);
    }
    
    return [self nn_scaleToFillSize:CGSizeMake(destWidth, destHeight)];
}

- (UIImage *)nn_aspectFillSize:(CGSize)newSize {
    size_t destWidth, destHeight;
    CGFloat widthRatio = newSize.width / self.size.width;
    CGFloat heightRatio = newSize.height / self.size.height;
    
    if (heightRatio > widthRatio) {
        destHeight = (size_t)newSize.height;
        destWidth = (size_t)(self.size.width * newSize.height / self.size.height);
    } else {
        destWidth = (size_t)newSize.width;
        destHeight = (size_t)(self.size.height * newSize.width / self.size.width);
    }
    
    return [self nn_scaleToFillSize:CGSizeMake(destWidth, destHeight)];
}

- (UIImage *)nn_scaleByFactor:(CGFloat)scaleFactor {
    CGSize scaledSize = CGSizeMake(self.size.width * scaleFactor,
                                   self.size.height * scaleFactor);
    
    return [self nn_scaleToFillSize:scaledSize];
}

#pragma mark - CGImage Helper

static inline CGContextRef CreateARGBBitmapContext(size_t width,
                                     size_t height,
                                     size_t bytesPerRow,
                                     BOOL withAlpha) {
    CGImageAlphaInfo alphaInfo = (withAlpha ? kCGImageAlphaPremultipliedFirst : kCGImageAlphaNoneSkipFirst);
    if (!rgbColorSpace){
        rgbColorSpace = CGColorSpaceCreateDeviceRGB();
    }
    CGContextRef context = CGBitmapContextCreate(NULL,
                                                   width,
                                                   height,
                                                   8,
                                                   bytesPerRow,
                                                   rgbColorSpace,
                                                   kCGBitmapByteOrderDefault | alphaInfo);
    
    return context;
}

static inline BOOL ImageHasAlpha(CGImageRef imageRef) {
    CGImageAlphaInfo alpha = CGImageGetAlphaInfo(imageRef);
    return (alpha == kCGImageAlphaFirst ||
            alpha == kCGImageAlphaLast ||
            alpha == kCGImageAlphaPremultipliedFirst ||
            alpha == kCGImageAlphaPremultipliedLast);
}

@end
