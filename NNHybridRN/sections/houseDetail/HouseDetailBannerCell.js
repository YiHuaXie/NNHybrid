import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    NativeModules,
    requireNativeComponent,
} from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';
import NNImage from '../../components/common/NNImage';

const cellSize = {
    width: AppUtil.windowWidth,
    height: AppUtil.windowWidth * 0.6
};

// const ParallaxView = requireNativeComponent('ParallaxView', HouseDetailBannerCell);
// const ParallaxViewManager = NativeModules.ParallaxViewManager;

export default class HouseDetailBannerCell extends Component {

    // _renderVRItem(uri) {
    //     ParallaxViewManager.loadImageWithUrl(uri);

    //     return (
    //         <ParallaxView style={styles.image}>
    //             <View style={styles.mask}>
    //                 <Image
    //                     style={styles.vrIcon}
    //                     source={require('../../resource/images/house_detail_720.png')}
    //                 />
    //             </View>
    //         </ParallaxView>
    //     );
    // }

    _renderBannerItems(data, hasVR) {
        const images = [];

        // if (hasVR) {
        //     images.push(this._renderBannerItems());
        // }

        for (const i in data) {
            images.push(<NNImage key={i} style={styles.image} source={{ uri: data[i] }} />);
        }

        return images;
    }

    render() {
        const { data, hasVR } = this.props;
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
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    vrIcon: {
        width: 55,
        height: 55,
        resizeMode: 'cover'
    }
})