import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HouseDetailSectionHeader from './HouseDetailSectionHeader';
import NNMapLocationView from '../../components/common/NNMapLocationView';
import AppUtil from '../../utils/AppUtil';

export default class HouseDetailLocationCell extends Component {

    state = { addressHeight: 15 };

    _updateCellHeight(event) {
        this.setState({ addressHeight: event.nativeEvent.layout.height });
    }

    render() {
        const { prefixAddress, suffixAddress, longitude, latitude } = this.props;
        return (
            <View style={{ height: 225 + this.state.addressHeight }}>
                <HouseDetailSectionHeader title='地理位置' />
                <Text
                    style={styles.title}
                    numberOfLines={0}
                    onLayout={e => this._updateCellHeight(e)}
                >
                    {prefixAddress + suffixAddress}
               </Text>
                <NNMapLocationView
                    style={styles.locationView}
                    coordinate={{
                        address: suffixAddress,
                        longitude,
                        latitude
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        color: AppUtil.app_black,
        marginLeft: 15,
        marginRight: 15,
    },
    locationView: {
        marginTop: 15,
        height: 150,
    }
});