import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';
import AppUtil from '../../utils/AppUtil';

const headerViewHeight = 30;

export default class HomeSectioHeader extends Component {

    render() {
        const { title, showMore } = this.props;
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLine} />
                <Text style={styles.headerTitle}>{title}</Text>
                {showMore ?
                    <TouchableWithoutFeedback>
                        <Text style={styles.headerMore}>查看更多</Text>
                    </TouchableWithoutFeedback>
                    : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: headerViewHeight,
        alignItems: 'flex-end',
    },
    headerLine: {
        backgroundColor: AppUtil.app_theme,
        width: 3,
        height: 17,
        marginLeft: 15,
    },
    headerTitle: {
        width: AppUtil.windowWidth - 95,
        color: AppUtil.app_black,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    headerMore: {
        color: AppUtil.app_gray,
        fontSize: 12,
        marginRight: 15
    },
});