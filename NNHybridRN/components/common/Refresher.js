import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    RefreshControl,
    StyleSheet
} from 'react-native';
import AppUtil from '../../utils/AppUtil';

export default class Refresher {
    static header({ title, refreshing, onRefresh }) {
        return (
            <RefreshControl
                title={title}
                titleColor={AppUtil.app_theme}
                colors={[AppUtil.app_theme]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={AppUtil.app_theme}
            />
        );
    }

    static footer(title) {
        return (
            <View style={styles.footerContainer} >
                <ActivityIndicator size="small" color={AppUtil.app_theme} />
                <Text style={[styles.footerText, { marginLeft: 7 }]}>
                    {title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 44,
    },
    footerText: {
        fontSize: 14,
        color: AppUtil.app_theme
    }
});