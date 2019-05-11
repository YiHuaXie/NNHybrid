import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HouseDetailSectionHeader from './HouseDetailSectionHeader';
import NNMapLocationView from '../../components/common/NNMapLocationView';
import AppUtil from '../../utils/AppUtil';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class HouseDetailLocationCell extends Component {

    state = { addressHeight: 15 };

    static defaultProps = {
        prefixAddress: '',
        suffixAddress: ''
    };

    _updateCellHeight(event) {
        this.setState({ addressHeight: event.nativeEvent.layout.height });
    }

    render() {
        const { prefixAddress, suffixAddress } = this.props;
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
                <TouchableWithoutFeedback onPress={() => this.props.mapViewDidTouched()}>
                    <NNMapLocationView
                        {... this.props}
                        style={styles.locationView}
                    />
                </TouchableWithoutFeedback>

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