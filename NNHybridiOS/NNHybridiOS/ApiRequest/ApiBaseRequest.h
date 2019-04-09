//
//  NNBaseDataRequest.h
//  NNProject
//
//  Created by NeroXie on 2018/12/11.
//  Copyright © 2018 谢翼华. All rights reserved.
//

#import "NNNetworkRequest.h"

typedef NS_ENUM(NSInteger, MYRoomCode) {
    MYRoomCodeSucess = 0,           // 操作成功
    MYRoomCodeApiKeyError = 1,      // 密钥错误
    MYRoomCodeInfoError = 4,        // 信息不完整
    MYRoomCodeThirdFailed = 1006,   // 依赖外部接口失败
    MYRoomCodeOtherDevice = 1015,   // 其他设备登录
    MYRoomCodeSessionPast = 1016,   // session已过期
    MYRoomCodeAuthfaild = 1007      // 用户认证失败
};

@interface ApiBaseRequest : NNNetworkRequest

@property (nonatomic, copy) NSString *apiVersion;
@property (nonatomic, copy) NSString *apiMethod;

/** 需要sessionId，默认为NO */
@property (nonatomic, assign) BOOL needSessionId;

/** 考虑数组的位置，可能直接返回数组，也可能是字典里的一个字段（只考虑一层），默认为nil */
@property (nonatomic, copy) NSString *dataField;
@property (nonatomic, strong) Class dataClass;

- (void)nn_send:(void(^)(id data, NSError *error))completionHander;

@end

