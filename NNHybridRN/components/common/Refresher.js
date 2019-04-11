import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import AppUtil from '../../utils/AppUtil';

export default class Refresher {
    static header(refreshing, onRefresh) {
        return (
            <RefreshControl
                title={'Loading'}
                titleColor={AppUtil.app_theme}
                colors={[AppUtil.app_theme]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={AppUtil.app_theme}
            />
        );
    }

    static footer() {
        return (
            <View style={{ alignItems: 'center' }}>
                <ActivityIndicator
                    style={{ margin: 10 }}
                    color={AppUtil.app_theme}
                />
                <Text style={{ color: AppUtil.app_theme, margin: 10 }}>
                    Loading More Data
                </Text>
            </View>
        );
    }
}