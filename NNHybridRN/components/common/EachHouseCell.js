import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';

const cellHeight = 120;

export default class EachHouseCell extends Component {

    static propTypes = {
        house: PropTypes.object,
        apartment: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            house: {},
            apartment: {},
            imageUrl: '',
            title: '',
            subTitle: '',
            price: 0,
            allTagList: [],
            address: '',
            isOrgAuth: false,
            isVr: false
        }
    }

    // https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.house !== nextProps.house) {
            const { house } = nextProps;
            strings = [house.roomArea, house.houseType, house.roomDirection];

            return {
                house: house,
                imageUrl: house.imageUrl,
                title: house.name,
                subTitle: strings.join(' | '),
                price: parseInt(house.minRentPrice),
                address: house.distanceInfo,
                isOrgAuth: house.isOrgAuth,
            }
        }

        return null;
    }

    authImage = () => <Image
        style={styles.authIcon}
        source={require('../../resource/images/house_auth_icon.png')}
    />

    titleText = () => (
        <Text numberOfLines={1} style={styles.title}>
            {this.state.title}
        </Text>
    )

    subTitleText = () => (
        <Text numberOfLines={1} style={styles.subTitle}>
            {this.state.subTitle}
        </Text>
    )

    addressIcon = () => (
        <Image
            style={styles.addressIcon}
            source={require('../../resource/images/location.png')}
        />
    )

    priceText = () => (
        <Text style={styles.price}>
            {this.state.price}
            <Text style={{ ...styles.price, fontSize: 10 }}>/月</Text>
        </Text>
    );

    render() {
        const { imageUrl, title, isOrgAuth, address } = this.state;
        return (
            <View style={styles.container}>
                <Image style={styles.leftImage} source={{ url: imageUrl }} />
                <View style={styles.rightContent}>
                    <View style={{ flexDirection: 'row', height: 17 }}>
                        {isOrgAuth ? this.authImage() : null}
                        {this.titleText()}
                    </View >
                    <View style={styles.subTitleAndPrice}>
                        {this.subTitleText()}
                        {this.priceText()}
                    </View>
                    <View style={styles.addressContainer}>
                        <Image
                            style={styles.addressIcon}
                            source={require('../../resource/images/location.png')}
                        />
                        <Text style={styles.addressText}>{address}</Text>
                    </View>
                </View>
                <View style={styles.dividingLine} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: cellHeight,
        alignItems: 'center',
    },
    leftImage: {
        width: 120,
        height: 90,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4,
    },
    rightContent: {
        marginRight: 15,
        flex: 1,
        height: 90,
    },
    authIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    title: {
        color: AppUtil.app_black,
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    subTitleAndPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 10,
        height: 20,
    },
    subTitle: {
        color: AppUtil.app_gray,
        fontSize: 13,
    },
    price: {
        color: AppUtil.app_theme,
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 5,
    },
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 12
    },
    addressIcon: {
        width: 12,
        height: 12,
    },
    addressText: {
        color: AppUtil.app_gray,
        fontSize: 11,
    },
    dividingLine: {
        position: 'absolute',
        left: 15,
        right: 15,
        top: cellHeight - 0.5,
        height: 0.5,
        backgroundColor: AppUtil.app_dividing_line
    }
});
