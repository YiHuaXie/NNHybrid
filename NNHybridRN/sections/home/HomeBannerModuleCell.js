import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, ListView } from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';
import LinearGradient from 'react-native-linear-gradient';

const viewHeight = AppUtil.windowWidth * 82.0 / 75.0;
const viewWidth = AppUtil.windowWidth;

export default class HomeBannerModuleCell extends Component {

    _renderBannerItems() {
        const { banner } = this.props;

        images = [];
        for (var i = 0; i < banner.length; i++) {
            let image =
                <TouchableWithoutFeedback
                    key={i}
                    onPress={() => {

                    }}>
                    <Image style={styles.image} source={{ url: banner[i].picUrl }} />
                </TouchableWithoutFeedback>;
            images.push(image);
        }

        if (!images.length) {
            let defaultBanner = <Image
                key={0}
                style={styles.image}
                source={require('../../resource/images/banner_default.jpg')}
            />;
            let defaultBanner2 = <Image
                key={0}
                style={styles.image}
                source={require('../../resource/images/banner_default.jpg')}
            />;

            images.push(defaultBanner);
            images.push(defaultBanner2);
        }

        return images;
    }

    _moduleView() {
        return (
            <ListView dataSource={this.state.dataSource}>

            </ListView>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Swiper
                    autoplay={true}
                    autoplayTimeout={3.0}
                    autoplayDirection={true}
                    // showsPagination={true}
                    // paginationStyle={{ top: (AppUtil.windowWidth - 30) * 0.55 + 10, height: 30 }}
                // loop={banner.length > 1}
                // onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                // dot={<View style={styles.dotStyle} />}
                // activeDot={<View style={styles.activeDot} />}
                // paginationStyle={{
                //     bottom: -23, left: null, right: 10
                // }}
                >
                    {this._renderBannerItems()}
                </Swiper>
                <LinearGradient
                    locations={[0, 0.7, 1.0]}
                    colors={['rgba(255,255,255,0)','rgba(255,255,255,0.7)', '#FFFFFF']}
                    style={styles.gradientLayer}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: viewHeight,
        width: viewWidth,
    },
    image: {
        height: viewHeight,
        width: viewWidth,
        resizeMode: 'contain'
    },
    dotStyle: {
        backgroundColor: 'rgba(0,0,0,.2)',
        width: 5,
        height: 5,
        borderRadius: 4,
    },
    activeDot: {
        backgroundColor: '#000',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    gradientLayer: {
        position: 'absolute',
        top: viewWidth * 0.625,
        left: 0,
        right: 0,
        bottom: 0
    }
});
