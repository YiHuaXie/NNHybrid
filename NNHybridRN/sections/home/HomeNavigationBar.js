import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import LinearGradient from 'react-native-linear-gradient';
import NavigationBar from '../../navigator/NavigationBar';

export default class HomeNavigationBar extends Component {

    _renderGradientView() {
        const { isTransparent } = this.props;
        if (isTransparent) {
            return (
                <LinearGradient
                    locations={[0, 1.0]}
                    colors={['rgba(0,0,0,0.3)', 'rgba(255,255,255,0)']}
                    style={styles.gradientView}
                />
            );
        }
    }

    _renderCityView() {
        const { isTransparent, cityName } = this.props;
        const arrowSource = isTransparent ?
            require('../../resource/images/arrow/down_solid_white_small_arrow.png') :
            require('../../resource/images/arrow/down_solid_black_small_arrow.png');

        return (
            <View style={styles.cityView}>
                <Text style={{
                    fontSize: 14,
                    color: isTransparent ? '#FFFFFF' : AppUtil.app_black
                }}>
                    {cityName}
                </Text>
                <Image
                    style={{ width: 16, height: 16, resizeMode: 'contain' }}
                    source={arrowSource}
                />
            </View>
        );
    }

    _renderSearchView() {
        return (
            <View style={styles.searchView}></View>
        );
    }

    render() {
        const { isTransparent } = this.props;
        return (
            <NavigationBar
                backgroundView={this._renderGradientView()}
                titleHidden={true}
                leftItem={this._renderCityView()}
                rightItem={this._renderSearchView()}
                rightItemStyle={{marginLeft: 5}}
                navBarStyle={{
                    position: 'absolute',
                    width: AppUtil.windowWidth,
                    backgroundColor: isTransparent ? AppUtil.app_clear : '#FFFFFF'
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: AppUtil.fullNavigationBarHeight
    },
    gradientView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    cityView: {
        width: 80,
        height: 30,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center',
    },
    searchView: {
        height: 30,
        backgroundColor: 'red'
    }
});