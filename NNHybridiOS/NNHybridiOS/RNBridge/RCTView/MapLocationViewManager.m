//
//  MapLocationViewManager.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/7.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "MapLocationViewManager.h"
#import <MAMapKit/MAMapKit.h>
#import <React/RCTComponent.h>

@interface MapLocationView: UIView <MAMapViewDelegate>

@property (nonatomic, strong) MAMapView *mapView;
@property (nonatomic, copy) NSDictionary *coordinate;

@end

@implementation MapLocationView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.mapView = [[MAMapView alloc]init];
        self.mapView.delegate = self;
        self.mapView.showsScale = NO;
        self.mapView.showsCompass = NO;
        self.mapView.userInteractionEnabled = NO;
        [self.mapView setMapType:MAMapTypeStandard];
        self.mapView.zoomLevel = 17;

        [self addSubview:self.mapView];
        [self.mapView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
    }

    return self;
}

#pragma mark - Override

- (void)removeFromSuperview {
    self.mapView.delegate = nil;

    [super removeFromSuperview];
}

#pragma mark - MAMapViewDelegate

- (MAAnnotationView *)mapView:(MAMapView *)mapView viewForAnnotation:(id<MAAnnotation>)annotation {
    if ([annotation isKindOfClass:[MAPointAnnotation class]]) {
        static NSString *pointReuseIndentifier = @"pointReuseIndentifier";
        MAPinAnnotationView *annotationView =
        (MAPinAnnotationView*)[mapView dequeueReusableAnnotationViewWithIdentifier:pointReuseIndentifier];
        if (annotationView == nil) {
            annotationView = [[MAPinAnnotationView alloc] initWithAnnotation:annotation
                                                             reuseIdentifier:pointReuseIndentifier];
        }
        annotationView.animatesDrop = YES;
        annotationView.pinColor = MAPinAnnotationColorPurple;

        return annotationView;
    }

    return nil;
}

#pragma mark - Setter

- (void)setCoordinate:(NSDictionary *)coordinate {
    _coordinate = coordinate;

    CLLocationCoordinate2D coor;
    coor.latitude = [coordinate[@"latitude"] doubleValue];
    coor.longitude = [coordinate[@"longitude"] doubleValue];

    MAPointAnnotation *annotation = [[MAPointAnnotation alloc]init];
    annotation.coordinate = coor;
    annotation.title = coordinate[@"address"];

    self.mapView.centerCoordinate = coor;
    [self.mapView addAnnotation:annotation];
    [self.mapView showAnnotations:@[annotation] animated:YES];
}

@end

@implementation MapLocationViewManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(coordinate, NSDictionary);

- (UIView *)view {
    return [[MapLocationView alloc] initWithFrame:CGRectZero];
}

@end
