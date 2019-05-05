import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import HouseDetailSectionHeader from './HouseDetailSectionHeader';
import NNImage from '../../components/common/NNImage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class HouseDetailRecommendCell extends Component {

    _renderRecommendItem(item, index) {
        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.recommendItemClick(index)}
            >
                <View style={{
                    ...styles.item,
                    marginLeft: 15,
                    marginRight: index < this.props.data.length - 1 ? 0 : 15
                }}>
                    <NNImage style={styles.itemImage} source={{ uri: item.imageUrl }} />
                    <Text style={styles.itemPrice}>{parseInt(item.minRentPrice)}</Text>
                    <Text style={styles.itemAddress}>{item.address}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const { data } = this.props;

        if (AppUtil.isEmptyArray(data)) return null;

        return (
            <View style={styles.container}>
                <HouseDetailSectionHeader title='为你推荐' />
                <FlatList
                    style={{ backgroundColor: 'yellow' }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    horizontal={true}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item, index }) => this._renderRecommendItem(item, index)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 345
    },
    item: {
        width: 280,
        height: 280,
    },
    itemImage: {
        width: 280,
        height: 210,
        resizeMode: 'cover'
    },
    itemPrice: {
        marginTop: 10,
        fontSize: 16,
        color: AppUtil.app_black,
    },
    itemAddress: {
        marginTop: 10,
        fontSize: 14,
        color: AppUtil.app_gray,
    }
});