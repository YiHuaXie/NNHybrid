import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import AppUtil from '../../utils/AppUtil';
import NNParallaxView from '../../components/common/NNParallaxView';

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
                        />
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
    }
});