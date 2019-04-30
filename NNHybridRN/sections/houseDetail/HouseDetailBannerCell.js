import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';
import NNImage from '../../components/common/NNImage';
import NNParallaxView from '../../components/common/NNParallaxView';

const cellSize = {
    width: AppUtil.windowWidth,
    height: AppUtil.windowWidth * 0.6
};

export default class HouseDetailBannerCell extends Component {

    _renderVRItem(url) {
        const vrIconSource = require('../../resource/images/house_detail_720.png');
        return (
            <NNParallaxView cornerRadius={0} style={styles.image} imageUrl={url}>
                <View style={styles.mask}>
                    <Image style={styles.vrIcon} source={vrIconSource}/>
                </View>
            </NNParallaxView>
        );
    }

    _renderBannerItems(data, hasVR) {
        const images = [];

        if (hasVR) {
            images.push(this._renderVRItem(data[0]));
        }

        for (const i in data) {
            images.push(<NNImage key={i} style={styles.image} source={{ uri: data[i] }} />);
        }

        return images;
    }

    render() {
        const { data } = this.props;
        const hasVR = true;
        if (AppUtil.isEmptyArray(data)) return null;

        return (
            <Swiper
                autoplay={hasVR ? false : true}
                autoplayTimeout={3.0}
                showsPagination={false}
                containerStyle={styles.swiper}
            >
                {this._renderBannerItems(data, hasVR)}
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    swiper: {
        height: cellSize.height,
        width: cellSize.width
    },
    image: {
        width: cellSize.width,
        height: cellSize.height,
        resizeMode: 'cover'
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vrIcon: {
        width: 55,
        height: 55,
        resizeMode: 'cover'
    }
})