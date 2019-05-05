import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';
import NNImage from '../../components/common/NNImage';
import NNParallaxView from '../../components/common/NNParallaxView';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const cellSize = {
    width: AppUtil.windowWidth,
    height: AppUtil.windowWidth * 0.6
};

export default class HouseDetailBannerCell extends Component {

    _renderVRItem(url) {
        const vrIconSource = require('../../resource/images/house_detail_720.png');
        return (
            <TouchableWithoutFeedback
                key={0}
                onPress={() => this.props.bannerItemClicked()}
            >
                <NNParallaxView cornerRadius={0} style={styles.image} imageUrl={url}>
                    <View style={styles.mask}>
                        <Image style={styles.vrIcon} source={vrIconSource} />
                    </View>
                </NNParallaxView>
            </TouchableWithoutFeedback>
        );
    }

    _renderBannerItems(data, hasVR) {
        const images = [];

        if (hasVR) {
            images.push(this._renderVRItem(data[0]));
        }

        for (const i in data) {
            images.push(
                <TouchableWithoutFeedback
                    key={hasVR ? i : i + 1}
                    onPress={() => this.props.bannerItemClicked()}
                >
                    <NNImage style={styles.image} source={{ uri: data[i] }} />
                </TouchableWithoutFeedback>
            );
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
                showsPagination={true}
                containerStyle={styles.swiper}
                renderPagination={(index, total) => (
                    <Text style={styles.indexLabel}>
                        {`${index + 1}/${total}`}
                    </Text>
                )}
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
    indexLabel: {
        right: 10,
        bottom: 10,
        height: 15,
        position: 'absolute',
        fontSize: 15,
        color: '#FFFFFF',
        textAlign: 'right',
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