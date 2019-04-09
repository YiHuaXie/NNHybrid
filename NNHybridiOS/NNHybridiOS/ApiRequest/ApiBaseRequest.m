//
//  ApiBaseRequest.m
//  NNProject
//
//  Created by NeroXie on 2018/12/11.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "ApiBaseRequest.h"
#import "ApiBaseResponse.h"
#import <AdSupport/AdSupport.h>
#import "JSONModel.h"

@implementation ApiBaseRequest

- (instancetype)init {
    if (self = [super init]) {
        self.netService = [self _defaultNetworkService];
        self.responseClass = ApiBaseResponse.class;
        self.apiHost = MY_BASE_URL;
        self.httpMethod = NNHTTPMethodPOST;
        self.needSessionId = NO;
    }

    return self;
}

#pragma mark - Override

- (NSDictionary *)finalParameters {
    NSMutableDictionary *tmp = [NSMutableDictionary dictionaryWithDictionary:self.apiParameters];
    tmp[@"devId"] = @"c8f86f9072844197891e4c04a73e2a1e";
    //    if (self.needSessionId && [UserAccount instance].sessionid) tmp[kUserSessionid] = [UserAccount instance].sessionid;

    return @{@"v": self.apiVersion,
             @"method": self.apiMethod,
             @"reqId": @"abcd",
             @"timestamp": self.timestamp,
             @"appVersionNum": nn_appVersion(),
             @"equType": @"iPhone 7",
             @"sysVersionNum": nn_systemVersion(),
             @"manufacturerBrand": @"Apple",
             @"params": [tmp copy]};
}

#pragma mark - Private

- (NNNetworkService *)_defaultNetworkService {
    static NNNetworkService *service = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        service = [NNNetworkService new];
    });

    return service;
}

#pragma mark - Public

- (void)nn_send:(void (^)(id data, NSError *error))completionHander {
    WEAK_SELF;
    
    [self send:^(NSURLSessionDataTask *dataTask, NNNetworkResponse *response, NSError *error) {
        ApiBaseResponse *res = (ApiBaseResponse *)response;
        if (res.code == 1011) res.code = 0; // 1011也是成功的标志
        if (error && completionHander) completionHander(nil, error); //请求失败
        if (!error && completionHander) {
            NSInteger code = res.code;
            if (code == MYRoomCodeSucess) {
                // 数据模型化处理
                id tmp = nn_makeSureString(self.dataField).length > 0 ? res.data[self.dataField] : res.data;
                res.data = [weakSelf modelsWithData:tmp dataClass:self.dataClass];
                completionHander(res.data, nil);
            } else if (code == MYRoomCodeOtherDevice || code == MYRoomCodeSessionPast || code == MYRoomCodeAuthfaild) {
                nn_notificationPostOnMainThread(NotificationHaveLogout, nil, nil);
            } else {
                NSError *error = nn_errorMake(@"ServiceFailureDomain", code, res.message);
                completionHander(nil, error);
            }
        }
    }];
}

#pragma mark - Private

- (id)modelsWithData:(id)data dataClass:(Class)dataClass {
    if (!data || data == [NSNull null]) return nil;
    if (!dataClass) return data;
    
    BOOL isJsonModel = [dataClass isSubclassOfClass:JSONModel.class];
    if (!isJsonModel) return data;
    
    BOOL isDictionary = [data isKindOfClass:NSDictionary.class];
    if (isDictionary) return [[dataClass alloc] initWithDictionary:data error:nil];

    BOOL isArray = [data isKindOfClass:NSArray.class];
    if (isArray) return [dataClass arrayOfModelsFromDictionaries:data error:nil];
    
    return nil;
}

#pragma mark - Getter

- (NSString *)timestamp {
    NSDate *date = [NSDate date];
    NSTimeInterval timeInterval = [date timeIntervalSince1970];

    return [NSString stringWithFormat:@"%.0f", timeInterval];
}


@end
