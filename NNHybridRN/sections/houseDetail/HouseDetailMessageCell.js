import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import StringUtil from '../../utils/StringUtil';

export default class HouseDetailMessageCell extends Component {

    _getMessages() {
        const { decentraliedHouse, centraliedHouse } = this.props;
        const messages = [];
        if (!AppUtil.isEmptyObject(decentraliedHouse)) {
            messages[0] = { title: '楼层 ', detail: `${decentraliedHouse.floorName}层` };
            messages[1] = { title: '装修 ', detail: StringUtil.decorationDegree(decentraliedHouse.decorationDegree) };
            messages[2] = { title: '朝向 ', detail: StringUtil.directionString(decentraliedHouse.roomDirection) };
            messages[3] = { title: '编号 ', detail: decentraliedHouse.roomCode };
        } else if (!AppUtil.isEmptyObject(centraliedHouse)) {
            messages[0] = { title: '楼层 ', detail: StringUtil.roomFloor(centraliedHouse.minFloorNum, centraliedHouse.maxFloorNum) };
            messages[1] = { title: '装修 ', detail: StringUtil.decorationDegree(centraliedHouse.decorationDegree) };
            messages[2] = { title: '朝向 ', detail: StringUtil.directionStrings(centraliedHouse.houseDirection) };
            messages[3] = { title: '房间数 ', detail: StringUtil.roomCount(centraliedHouse.totalRoomCount) };
        }

        return messages;
    }

    _renderMessages(data) {
        const messages = [];

        for (const i in data) {
            const dict = data[i];
            messages.push(
                <Text
                    key={i}
                    style={{
                        ...styles.messageTitle,
                        left: (i % 2) * (AppUtil.windowWidth / 2) + 15,
                        top: Math.floor(i / 2) * 30 + 10,
                        width: (AppUtil.windowWidth / 2) - 15,
                        height: 15
                    }}
                >
                    {dict.title}
                    <Text style={styles.messageDetail}>
                        {dict.detail}
                    </Text>
                </Text>
            );
        }

        return messages;
    }

    render() {
        const data = this._getMessages();
        if (!data.length) return null;

        return (
            <View style={styles.container}>
                {this._renderMessages(data)}
                <View style={styles.dividingLine} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 65,
    },
    messageTitle: {
        position: 'absolute',
        fontSize: 14,
        color: AppUtil.app_black
    },
    messageDetail: {
        fontSize: 14,
        color: AppUtil.app_gray
    },
    dividingLine: {
        position: 'absolute',
        left: 15,
        right: 15,
        height: 0.5,
        bottom: 0,
        backgroundColor: AppUtil.app_dividing_line
    }
});