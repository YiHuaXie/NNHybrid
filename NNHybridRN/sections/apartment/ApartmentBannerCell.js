import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';

const cellHeight = 280;

export default class ApartmentBannerCell extends Component {

    _renderBannerItems() {
        const { data } = this.props;
        const images = [];
        for (const i in data) {
            images.push(
                <Image
                    key={i}
                    style={{ ...styles.image }}
                    source={{ url: data[i] }}
                />
            );
        }

        return images;
    }

    render() {
        const { data } = this.props;
        if (AppUtil.isEmptyArray(data)) return null;

        return (
            <Swiper
                autoplay={true}
                autoplayTimeout={3.0}
                showsPagination={false}
                containerStyle={styles.swiper}
            >
                {this._renderBannerItems()}
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    swiper: {
        height: cellHeight,
        width: AppUtil.windowWidth
    },
    image: {
        width: AppUtil.windowWidth,
        height: cellHeight,
        resizeMode: 'cover'
    },
})