import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    requireNativeComponent,
    NativeModules,
} from 'react-native';
import AppUtil from '../../utils/AppUtil';

const cellHeight = 120 * (AppUtil.windowWidth - 30) / 345.0 + 15;
const ParallaxView = requireNativeComponent('ParallaxView', HomeVRCell);
const ParallaxViewManager = NativeModules.ParallaxViewManager

export default class HomeVRCell extends Component {
    render() {
        const { vr } = this.props;
        if (!vr) return null;

        ParallaxViewManager.loadImageWithUrl(vr.vrUrl);
        
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        
                    }}>
                    <View style={styles.content}>
                        <ParallaxView style={styles.parallax}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: cellHeight,
    },
    content: {
        flex: 1,
        marginTop: 0,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        borderRadius: 8,
    },
    parallax: {
        flex: 1,
    }
});