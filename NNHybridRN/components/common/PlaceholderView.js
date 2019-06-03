import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';
import NNImage from './NNImage';

export default class PlaceholderView extends Component {

    static propTypes = {
        height: PropTypes.number,
        imageSource: PropTypes.any,
        tipText: PropTypes.string,
        infoText: PropTypes.string,
        spacing: PropTypes.number,
        needReload: PropTypes.bool,
        reloadHandler: PropTypes.func
    }

    static defaultProps = {
        height: AppUtil.windowHeight,
        hasError: false,
        tipText: '',
        infoText: '',
        spacing: 10,
        needReload: false,
        reloadHandler: null
    }

    renderImage = imageSource => {
        return imageSource ? (
            <NNImage style={styles.image} enableAdaptation={true} source={imageSource} />
        ) : null;
    }

    renderTipText = tipText => {
        return !AppUtil.isEmptyString(tipText) ? (
            <Text style={styles.tipText}>{tipText}</Text>
        ) : null;
    }

    renderInfoText = infoText => {
        return !AppUtil.isEmptyString(infoText) ? (
            <Text style={styles.infoText}>{infoText}</Text>
        ) : null;
    }

    renderReloadButton = (needReload, reloadHandler) => {
        return needReload ? (
            <TouchableOpacity onPress={() => {
                if (reloadHandler) {
                    reloadHandler();
                }
            }}>
                <View style={styles.reloadButton}>
                    <Text style={styles.reloadButtonText}>重新加载</Text>
                </View>
            </TouchableOpacity>
        ) : null;
    }

    render() {
        const {
            height,
            imageSource,
            tipText,
            infoText,
            needReload,
            reloadHandler,
        } = this.props;

        return (
            <View style={{ ...styles.container, height }}>
                {this.renderImage(imageSource)}
                {this.renderTipText(tipText)}
                {this.renderInfoText(infoText)}
                {this.renderReloadButton(needReload, reloadHandler)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        marginBottom: 10,
    },
    tipText: {
        fontSize: 18,
        color: 'rgb(153,153,153)',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 12,
        color: 'rgb(200,200,200)',
        marginBottom: 10,
    },
    reloadButton: {
        width: 120,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: AppUtil.app_theme
    },
    reloadButtonText: {
        color: '#FFFFFF',
        fontSize: 13,

    }
});
