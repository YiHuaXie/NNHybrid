import React, { Component } from 'react';
import { StyleSheet, View, Image, NativeModules } from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';
import NNImage from '../../components/common/NNImage';

const cellSize = {
    width: AppUtil.windowWidth,
    height: AppUtil.windowWidth * 0.6
};

const ParallaxView = requireNativeComponent('ParallaxView', HomeVRCell);
const ParallaxViewManager = NativeModules.ParallaxViewManager;

export default class ApartmentBannerCell extends Component {

    _renderVRItem(uri) {
        ParallaxViewManager.loadImageWithUrl(uri);

        return (
            <ParallaxView style={styles.image}>
                <View style={styles.mask}>
                    <Image
                        style={styles.vrIcon}
                        source={require('../../resource/images/house_detail_720.png')}
                    />
                </View>
            </ParallaxView>
        );
    }

    _renderBannerItems(data, isVR) {
        const images = [];

        if (isVR) {
            images.push(this._renderBannerItems());
        }

        for (const i in data) {
            images.push(<NNImage key={i} style={styles.image} source={{ uri: data[i] }} />);
        }

        return images;
    }

    render() {
        const { data, isVR } = this.props;
        if (AppUtil.isEmptyArray(data)) return null;

        return (
            <Swiper
                autoplay={isVR ? false : true}
                autoplayTimeout={3.0}
                showsPagination={false}
                containerStyle={styles.swiper}
            >
                {this._renderBannerItems(data, isVR)}
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
        width: AppUtil.windowWidth,
        height: cellHeight,
        resizeMode: 'cover'
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    vrIcon: {
        width: 55,
        height: 55,
        resizeMode: 'cover'
    }
})