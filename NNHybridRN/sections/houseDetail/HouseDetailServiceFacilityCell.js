import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import HouseDetailSectionHeader from './HouseDetailSectionHeader';
import NNImage from '../../components/common/NNImage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const itemW = (AppUtil.windowWidth - 55) / 6;
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
    SERVICE_PRIVATE: 'SERVICE_PRIVATE',
    SERVICE_PUBLIC: 'SERVICE_PUBLIC',
    FACILITY_PRIVATE: 'FACILITY_PRIVATE',
    FACILITY_PUBLIC: 'FACILITY_PUBLIC',
};

export default class HouseDetailServiceFacilityCell extends Component {

    _getTitle(itemsType) {
        switch (itemsType) {
            case ItemsType.SERVICE_PRIVATE:
            case ItemsType.FACILITY_PRIVATE:
                return '房间设施'
            case ItemsType.SERVICE_PUBLIC:
                return '生活服务'
            case ItemsType.FACILITY_PUBLIC:
                return '公共设施'
            default:
                return ''
        }
    }

    _getImageSource(item, itemsType) {
        if (itemsType === ItemsType.SERVICE_PUBLIC ||
            itemsType === ItemsType.SERVICE_PRIVATE) {
            return imageSourceForCode[item.code.replace(/-/, '_')];
        } else {
            return imageSourceForType[item.type];
        }
    }

    _renderRecommendItem(item, index, itemsType) {

        return (
            <View style={{
                ...styles.item,
                marginLeft: index === 0 ? 15 : 5,
                marginRight: index < this.props.data.length - 1 ? 0 : 15
            }}>
                <NNImage style={styles.itemImage} source={this._getImageSource(item, itemsType)} />
                <Text style={styles.itemTitle}>{item.name}</Text>
            </View>
        );
    }

    _renderFacilityChangeButton(itemsType) {
        if (itemsType === ItemsType.SERVICE_PUBLIC ||
            itemsType === ItemsType.SERVICE_PRIVATE) {
            return null;
        }

        return (
            <View style={styles.facilityChangeButton}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.facilityChanged(itemsType)}
                >
                    <View style={{
                        width: 70,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}
                    >
                        <Text style={{ fontSize: 12, color: AppUtil.app_gray }}>
                            {itemsType === ItemsType.FACILITY_PRIVATE ? '公共设施' : '房间设施'}
                        </Text>
                        <NNImage
                            style={{ width: 18, height: 20, resizeMode: 'cover' }}
                            source={require('../../resource/images/arrow/right_gray_arrow.png')}
                        />
                    </View>
                </TouchableWithoutFeedback >
            </View>

        );
    }

    render() {
        const { data, itemsType } = this.props;

        if (AppUtil.isEmptyArray(data)) return null;

        return (
            <View style={styles.container}>
                <HouseDetailSectionHeader title={this._getTitle(itemsType)} />
                {this._renderFacilityChangeButton(itemsType)}
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    horizontal={true}
                    keyExtractor={item => `${item.name}`}
                    renderItem={({ item, index }) => this._renderRecommendItem(item, index, itemsType)}
                />
                <View style={styles.dividingLine} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 80 + itemW,
    },
    item: {
        width: itemW,
        height: 50,
        alignItems: 'center',
    },
    itemImage: {
        marginTop: 5,
        marginBottom: 5,
        width: 30,
        height: 30,
        resizeMode: 'cover'
    },
    itemTitle: {
        fontSize: 10,
        color: AppUtil.app_black,
    },
    facilityChangeButton: {
        position: 'absolute',
        top: 20,
        right: 10,
        width: 70,
        height: 20,
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