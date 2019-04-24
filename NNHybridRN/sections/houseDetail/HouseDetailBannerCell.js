import React, { Component } from 'react';
import { StyleSheet, View, Image, NativeModules } from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';
import NNImage from '../../components/common/NNImage';

const cellSize = {
    width: AppUtil.windowWidth,
    height: AppUtil.windowWidth * 0.6
};

export default class ApartmentBannerCell extends Component {

    _renderVRItem(uri) {
        return (
            <NNImage key={0} style={styles.image} source={{ uri }}>
                <View>
                    <Image />
                </View>
            </NNImage>
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
})