import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import HouseDetailSectionHeader from './HouseDetailSectionHeader';
import NNImage from '../../components/common/NNImage';

const imageSourceForType = [
    require('../../resource/images/houseDetail/more.png'),
    require('../../resource/images/houseDetail/bed.png'),
    require('../../resource/images/houseDetail/washer.png'),
    require('../../resource/images/houseDetail/air_condition.png'),
    require('../../resource/images/houseDetail/freezer.png'),
    require('../../resource/images/houseDetail/tv.png'),
    require('../../resource/images/houseDetail/wlan.png'),
    require('../../resource/images/houseDetail/sofa.png'),
    require('../../resource/images/houseDetail/coffee_table.png'),
    require('../../resource/images/houseDetail/dining_table.png'),
    require('../../resource/images/houseDetail/i_washroom.png'),
    require('../../resource/images/houseDetail/chest.png'),
];

const imageSourceForCode = {
    freezer: require('../../resource/images/houseDetail/freezer.png'),
    bed: require('../../resource/images/houseDetail/bed.png'),
    tv: require('../../resource/images/houseDetail/tv.png'),
    collect_express: require('../../resource/images/houseDetail/collect_express.png'),
    take_out: require('../../resource/images/houseDetail/take_out.png'),
    dry_cleaner: require('../../resource/images/houseDetail/dry_cleaner.png'),
    air_condition: require('../../resource/images/houseDetail/air_condition.png'),
    i_cookhouse: require('../../resource/images/houseDetail/i_cookhouse.png'),
    i_washroom: require('../../resource/images/houseDetail/i_washroom.png'),
    i_veranda: require('../../resource/images/houseDetail/i_veranda.png'),
    p_cookhouse: require('../../resource/images/houseDetail/p_cookhouse.png'),
    p_washroom: require('../../resource/images/houseDetail/p_washroom.png'),
    sofa: require('../../resource/images/houseDetail/sofa.png'),
    digital_tv: require('../../resource/images/houseDetail/digital_tv.png'),
    microwave_oven: require('../../resource/images/houseDetail/microwave_oven.png'),
    wlan: require('../../resource/images/houseDetail/wlan.png'),
    desk: require('../../resource/images/houseDetail/desk.png'),
    contract_sign: require('../../resource/images/houseDetail/contract_sign.png'),
    housekeeping: require('../../resource/images/houseDetail/housekeeping.png'),
    move_house: require('../../resource/images/houseDetail/move_house.png'),
    maintenance_service: require('../../resource/images/houseDetail/maintenance_service.png'),
    aptitude_control: require('../../resource/images/houseDetail/aptitude_control.png'),
    washer: require('../../resource/images/houseDetail/washer.png'),
    chest: require('../../resource/images/houseDetail/chest.png'),
    feedback: require('../../resource/images/houseDetail/feedback.png')
};

export const ItemsType = {
    Service: 'service',
    Facility: 'facility'
};

export default class HouseDetailServiceFacilityCell extends Component {

    _getImageSource(item, itemType) {
        if (itemType === ItemsType.Service) {
            return imageSourceForCode[item.code.replace(/-/, '_')];
        } else {
            return imageSourceForType[item.type];
        }
    }

    _renderRecommendItem(item, index, itemType) {

        return (
            <View style={{
                ...styles.item,
                marginLeft: 15,
                marginRight: index < this.props.data.length - 1 ? 0 : 15
            }}>
                <NNImage style={styles.itemImage} source={this._getImageSource(item, itemType)} />
                <Text style={styles.itemTitle}>{item.name}</Text>
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