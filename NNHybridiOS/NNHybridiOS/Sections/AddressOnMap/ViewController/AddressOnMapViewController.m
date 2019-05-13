//
//  AddressOnMapViewController.m
//  NNHybridiOS
//
//  Created by NeroXie on 2019/5/10.
//  Copyright © 2019 NeroXie. All rights reserved.
//

#import "AddressOnMapViewController.h"
#import "LocationManager.h"

#import <MapKit/MapKit.h>
#import <MAMapKit/MAMapKit.h>
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapSearchKit/AMapSearchKit.h>

@interface AddressOnMapViewController () <MAMapViewDelegate>

@property (nonatomic, strong) MAMapView *mapView;
@property (nonatomic, strong) UIView *bottomContainerView;
@property (nonatomic, copy) NSArray *installedMapApp;

@end

@implementation AddressOnMapViewController

#pragma mark - Lifecycle

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.title = @"地理位置";
    
    [self _addMapView];
    [self _addBottomContainerView];
    [self _addResetLocationButton];
}

#pragma mark - Private

- (void)_addMapView {
    self.mapView = [[MAMapView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:self.mapView];
    self.mapView.delegate = self;
    self.mapView.rotateEnabled = NO;
    self.mapView.rotateCameraEnabled = NO;
    self.mapView.showsCompass = NO;
    self.mapView.showsUserLocation = YES;
    self.mapView.zoomLevel = 15;
    
    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(self.latitude, self.longitude);
    MAPointAnnotation *annotation = [[MAPointAnnotation alloc] init];
    annotation.coordinate = coordinate;
    [self.mapView addAnnotation:annotation];
    self.mapView.centerCoordinate = coordinate;
}

- (void)_addBottomContainerView {
    self.bottomContainerView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.view addSubview:self.bottomContainerView];
    self.bottomContainerView.backgroundColor = [UIColor whiteColor];
    self.bottomContainerView.layer.shadowOffset = (CGSize){0, 4};
    self.bottomContainerView.layer.shadowOpacity = 0.15;
    self.bottomContainerView.layer.shadowColor = [UIColor blackColor].CGColor;
    self.bottomContainerView.layer.shadowRadius = 8;
    self.bottomContainerView.layer.cornerRadius = 4;
    [self.bottomContainerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.view).offset(15);
        make.centerX.equalTo(self.view);
        make.height.mas_equalTo(140);
        make.bottom.equalTo(self.view).offset(-30 - SAFE_AREA_HEIGHT);
    }];
    
    UILabel *nameLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 15, self.view.nn_width - 40, 20)];
    [self.bottomContainerView addSubview:nameLabel];
    nameLabel.font = nn_mediumFontSize(15);
    nameLabel.textColor = nn_rgb(51, 51, 51);
    nameLabel.text = self.name;
    
    UIImageView *icon = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"location_icon"]];
    icon.frame = CGRectMake(20, CGRectGetMaxY(nameLabel.frame) + 12, 15, 15);
    [self.bottomContainerView addSubview:icon];
    
    UILabel *addressLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    [self.bottomContainerView addSubview:addressLabel];
    addressLabel.font = nn_regularFontSize(12);
    addressLabel.textColor = nn_rgb(153, 153, 153);
    addressLabel.text = self.address;
    [addressLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(icon);
        make.height.mas_equalTo(17);
        make.left.equalTo(icon.mas_right);
        make.right.mas_equalTo(self.bottomContainerView).offset(-20);
    }];
    
    UIButton *naviButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [self.bottomContainerView addSubview:naviButton];
    [naviButton addTarget:self action:@selector(_didNaviButtonPressed:) forControlEvents:UIControlEventTouchUpInside];
    [naviButton setTitleColor:nn_rgb(51, 51, 51) forState:UIControlStateNormal];
    naviButton.titleLabel.font = nn_regularFontSize(14);
    naviButton.layer.cornerRadius = 6;
    naviButton.clipsToBounds = YES;
    naviButton.layer.borderColor = nn_rgb(197, 197, 197).CGColor;
    naviButton.layer.borderWidth = 1;
    [naviButton setTitle:@"查看路线" forState:UIControlStateNormal];
    [naviButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(addressLabel.mas_bottom).offset(15);
        make.left.equalTo(self.bottomContainerView).offset(20);
        make.centerX.equalTo(self.bottomContainerView);
        make.height.mas_equalTo(44);
    }];
}

- (void)_addResetLocationButton {
    UIButton *resetLocationButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [resetLocationButton setImage:[UIImage imageNamed:@"reset_location_icon"] forState:UIControlStateNormal];
    [self.view addSubview:resetLocationButton];
    [resetLocationButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.view).offset(15);
        make.bottom.equalTo(self.bottomContainerView.mas_top).offset(-15);
        make.height.width.mas_equalTo(50);
    }];
    
    WEAK_SELF;
    
    [resetLocationButton nn_addEventHandler:^(id sender) {
        [SharedLocationManager locationWithCompletion:^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error) {
            if (!error) {
                [weakSelf.mapView setCenterCoordinate:location.coordinate animated:YES];
            }
        }];
    } forControlEvents:UIControlEventTouchUpInside];
}

- (void)_didNaviButtonPressed:(id)sender {
    WEAK_SELF;
    
    UIAlertController *alertVC =
    [UIAlertController nn_alertControllerWithTitle:nil
                                           message:nil
                                    preferredStyle:UIAlertControllerStyleActionSheet
                                 cancelButtonTitle:@"取消"
                            destructiveButtonTitle:nil
                                 otherButtonTitles:self.installedMapApp
                                 completionHandler:^(UIAlertController *controller, UIAlertAction *action, NSInteger buttonIndex) {
                                     [weakSelf _jumpToMapAppWithTitle:action.title];
                                 }];
    
    [self presentViewController:alertVC animated:YES completion:nil] ;
}

- (void)_jumpToMapAppWithTitle:(NSString *)title {
    NSCharacterSet *characterSet = [NSCharacterSet URLQueryAllowedCharacterSet];
    
    if ([title isEqualToString:@"苹果地图"]) {
        MKPlacemark *toPlacemark =
        [[MKPlacemark alloc] initWithCoordinate:CLLocationCoordinate2DMake(self.latitude, self.longitude)
                              addressDictionary:nil];
        MKMapItem *toLocation = [[MKMapItem alloc] initWithPlacemark:toPlacemark];
        toLocation.name = self.address;
        
        [MKMapItem openMapsWithItems:@[toLocation]
                       launchOptions:@{MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeTransit,
                                       MKLaunchOptionsShowsTrafficKey: [NSNumber numberWithBool:YES]}];
    } else if ([title isEqualToString:@"高德地图"]) {
        NSString *urlString =
        FormatString(@"iosamap://path?sourceApplication=NNHybridiOS&sid=BGVIS1&&did=BGVIS2&dlat=%lf&dlon=%lf&dname=%@&dev=0&t=%@", self.latitude, self.longitude, self.address, @"1");
        urlString = [urlString stringByAddingPercentEncodingWithAllowedCharacters:characterSet];
        [SharedApplication openURL:[NSURL URLWithString:urlString]];
    } else if ([title isEqualToString:@"百度地图"]) {
        NSString *urlString =
        FormatString(@"baidumap://map/direction?region=0&destination=name:%@|latlng:%lf,%lf&mode=%@&coord_type=gcj02", self.address, self.latitude, self.longitude, @"transit");
        urlString = [urlString stringByAddingPercentEncodingWithAllowedCharacters:characterSet];
        [SharedApplication openURL:[NSURL URLWithString:urlString]];
    }
}

#pragma mark - MAMapViewDelegate

- (MAAnnotationView *)mapView:(MAMapView *)mapView viewForAnnotation:(id<MAAnnotation>)annotation {
    if ([annotation isKindOfClass:[MAPointAnnotation class]]) {
        MAPinAnnotationView *newAnnotationView = [[MAPinAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:@"myAnnotation"];
        newAnnotationView.pinColor = MAPinAnnotationColorPurple;
        newAnnotationView.animatesDrop = YES;
    }
    
    return nil;
}

#pragma mark - Getter

- (NSArray *)installedMapApp {
    if (!_installedMapApp) {
        NSArray *mapSchemes = @[@{@"title": @"高德地图", @"scheme": @"iosamap://navi"},
                                @{@"title": @"百度地图", @"scheme": @"baidumap://map/"}];
        NSMutableArray *tmp = [NSMutableArray arrayWithObject:@"苹果地图"];
        for (int i = 0; i < mapSchemes.count; i++) {
            NSURL *url = [NSURL URLWithString:mapSchemes[i][@"scheme"]];
            if ([SharedApplication canOpenURL:url]) {
                [tmp addObject:mapSchemes[i][@"title"]];
            }
        }
        
        _installedMapApp = [tmp copy];
    }
    
    return _installedMapApp;
}

@end
