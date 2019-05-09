import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import HouseDetailSectionHeader from './HouseDetailSectionHeader';

export default class HouseDetailAuthCell extends Component {

    state = { descriptionHeight: 0 };

    _updateCellHeight(event) {
        this.setState({
            descriptionHeight: event.nativeEvent.layout.height
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <HouseDetailSectionHeader title='房间描述' />
                <Text
                    style={styles.description}
                    numberOfLines={this.state.textNumberOfLines}
                    onLayout={e => this._updateCellHeight(e)}
                >
                {this.props.description}
                </Text>
                <View style={styles.dividingLine} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 35,
        backgroundColor: '#F8F8F7'
    },
    description: {
        fontSize: 15,
        color: AppUtil.app_black,
        marginLeft: 15,
        marginRight: 15
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