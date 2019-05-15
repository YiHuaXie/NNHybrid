import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';
import AppUtil from '../../utils/AppUtil';
import NNParallaxView from '../../components/common/NNParallaxView';
import NNImage from '../../components/common/NNImage';

const cellHeight = 120 * (AppUtil.windowWidth - 30) / 345.0 + 15;

export default class HomeVRCell extends Component {
    render() {
        const { vr } = this.props;
        if (!vr) return null;

        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => {

                    }}>
                    <NNParallaxView
                        style={styles.parallax}
                        cornerRadius={8}
                        imageUrl={vr.vrUrl}
                    >
                        <NNImage
                            style={styles.image}
                            source={require('../../resource/images/home_vr.png')}
                        />
                        <Text style={styles.text}>{vr.content}</Text>
                    </NNParallaxView>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: cellHeight,
    },
    parallax: {
        flex: 1,
        marginTop: 0,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        borderRadius: 8,
    },
    image: {
        position: 'absolute',
        width: 80,
        height: 26,
        resizeMode: 'contain',
        left: 25,
        bottom: 35,
    },
    text: {
        position: 'absolute',
        fontSize: 14,
        color: '#FFFFFF',
        left: 25,
        bottom: 10,
    }

});