import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import HouseDetailSectionHeader from './HouseDetailSectionHeader';
import NNImage from '../../components/common/NNImage';

const imageNameForType = [
    'more',
    'bed',
    'washer',
    'air_condition',
    'freezer',
    'tv',
    'wlan',
    'sofa',
    'coffee_table',
    'dining_table',
    'i_washroom',
    'chest'
];

// const imageNameForCode = {
//     freezer,
//     bed,
//     tv,
//     collect_expression,
//     take_out,
//     dry_cleaner,
//     air_condition,
//     i_cookhouse,
//     i_washroom,
//     i_veranda,
//     p_cookhouse,
//     p_washroom,
//     sofa,
//     digital_tv,
//     microwave_oven,
//     wlan,
//     desk,
//     contract_sign,
//     housekeeping,
//     move_house,
//     maintenance_service,
//     aptitude_control,
//     washer,
//     chest,
//     feedback
// };

export const ItemsType = {
    Service: 'service',
    Facility: 'facility'
};

export default class HouseDetailServiceFacilitiesCell extends Component {

    _getImageName(itemType, item) {
        // if (itemType === ItemsType.Facility) {
            const key = item.type.replace(/-/, '_');
            const value = imageNameForCode[key];
    
            return `${value.replace(/_/, '-')}.png`;
        // } else {
        //     const value = imageNameForType[item.code];

        //     return `${value.replace(/_/, '-')}.png`;
        // }
    }

    _renderRecommendItem(item, index, itemType) {

        const imageName = this._getImageName(itemType, item);
        console.log(imageName);
        // const imageSource = require('../../resource/images/' + imageName);
        return (
            <View style={{
                ...styles.item,
                marginLeft: 15,
                marginRight: index < this.props.data.length - 1 ? 0 : 15
            }}>
                {/* <NNImage style={styles.itemImage} source={imageSource}/> */}
                <Text style={styles.itemTitle}>sadasdas</Text>
            </View>
        );
    }

    render() {
        const { data, title, itemType } = this.props;

        if (AppUtil.isEmptyArray(data)) return null;

        return (
            <View style={styles.container}>
                <HouseDetailSectionHeader title={title} />
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    horizontal={true}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item, index }) => this._renderRecommendItem(item, index, itemType)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 120,
    },
    item: {
        width: 50,
        height: 60,
        backgroundColor: 'yellow'
    },
    itemImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover'
    },
    itemTitle: {
        fontSize: 10,
        color: AppUtil.app_theme,
    },
});