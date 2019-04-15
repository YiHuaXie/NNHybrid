import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';
import NNImage from './NNImage';

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
            allTags: [],
            address: '',
            isOrgAuth: false,
            isVr: false
        }
    }

    // https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
    static getDerivedStateFromProps(nextProps, prevState) {
        if (!AppUtil.isEmptyObject(nextProps.house) &&
            prevState.house !== nextProps.house) {
            const { house } = nextProps;
            const strings = [house.roomArea, house.houseType, house.roomDirection];
            const allTags = house.showIconList.concat(house.showTagList);

            return {
                house: house,
                imageUrl: house.imageUrl,
                title: house.name,
                subTitle: strings.join(' | '),
                price: parseInt(house.minRentPrice),
                address: house.distanceInfo,
                isOrgAuth: house.isOrgAuth,
                allTags: allTags
            }
        } else if (!AppUtil.isEmptyObject(nextProps.apartment)
            && prevState.apartment !== nextProps.apartment) {
            const { apartment } = nextProps;
            const strings = [apartment.roomArea, apartment.houseType];
            const allTags = apartment.showIconList.concat(apartment.showTagList);

            return {
                apartment,
                allTags,
                imageUrl: apartment.imageUrl,
                title: apartment.typeName,
                subTitle: strings.join(' | '),
                price: parseInt(apartment.price),
                address: apartment.distanceInfo,
                isOrgAuth: apartment.isOrgAuth,
            }
        }

        return null;
    }

    addressIcon = () => (
        <Image
            style={styles.addressIcon}
            source={require('../../resource/images/location.png')}
        />
    )

    _renderAuthImageAndTitle() {
        const { isOrgAuth, title } = this.state;
        const imageSource = require('../../resource/images/house_auth_icon.png');

        return (
            <View style={{ flexDirection: 'row', height: 17 }}>
                {isOrgAuth ? <Image style={styles.authIcon} source={imageSource} /> : null}
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
            </View >
        );
    }

    _renderSubTitleAndPrice() {
        const { subTitle, price } = this.state;
        return (
            <View style={styles.subTitleAndPrice}>
                <Text numberOfLines={1} style={styles.subTitle}>{subTitle}</Text>
                <Text style={styles.price}>
                    {price}
                    <Text style={{ ...styles.price, fontSize: 10 }}>/月</Text>
                </Text>
            </View>
        );
    }

    _renderAddress() {
        return (
            <View style={styles.addressContainer}>
                <Image
                    style={styles.addressIcon}
                    source={require('../../resource/images/location.png')}
                />
                <Text style={styles.addressText}>{this.state.address}</Text>
            </View>
        );
    }

    // _renderTags() {
    //     const {allTags} = this.state;
    //     tmpTags = [];

    //     for (const i in allTags) {
    //         const obj = allTags[i]
    //         if (obj.tagIcon) {
    //             tmpTags.push(
    //                 <Image key={i}
    //                     style={{ width: obj.iconWidth, height: 16, marginRight: 5 }}
    //                     source={{ url: obj.tagIcon }}
    //                 />
    //             );
    //         } else {
    //             tmpTags.push(
    //                 <Text style={{
    //                     ...styles.tagText,
    //                     color: obj.tagColor,
    //                     backgroundColor: obj.backgroundColor,
    //                     borderColor: obj.borderColor
    //                 }}
    //                 key={i}
    //                 >
    //                     {obj.tagName}
    //                 </Text>
    //             );
    //         }
    //     }

    //     return (
    //         <View style={styles.tagsContainer}>
    //             {tmpTags}
    //         </View>
    //     );
    // }

    render() {
        const { imageUrl } = this.state;
        return (
            <View style={styles.container}>
                <NNImage style={styles.leftImage} source={{ uri: imageUrl }} />
                <View style={styles.rightContent}>
                    {this._renderAuthImageAndTitle()}
                    {this._renderSubTitleAndPrice()}
                    {this._renderAddress()}
                    {/* {this._renderTags()} */}
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
        height: 12,
        marginTop: 5
    },
    addressIcon: {
        width: 12,
        height: 12,
    },
    addressText: {
        color: AppUtil.app_gray,
        fontSize: 11,
    },
    tagsContainer: {
        height: 16,
        marginTop: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagText: {
        fontSize: 10,
        borderRadius: 3,
        borderWidth: 0.5,
        marginRight: 5,
        paddingLeft: 6,
        paddingRight: 6,
        height: 16,
        textAlign: 'center'
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
