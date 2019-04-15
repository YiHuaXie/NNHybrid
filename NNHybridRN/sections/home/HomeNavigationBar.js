import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import LinearGradient from 'react-native-linear-gradient';
import NavigationBar from '../../navigator/NavigationBar';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
            <TouchableWithoutFeedback
                onPress={() => this.props.cityViewTouched()}>
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
            </TouchableWithoutFeedback>
        );
    }

    _renderSearchView() {
        const { isTransparent } = this.props;

        const imageSource = isTransparent ?
            require('../../resource/images/magnifier_white.png') :
            require('../../resource/images/magnifier_gray.png');
        return (
            <View style={{
                ...styles.searchView,
                borderColor: isTransparent ? AppUtil.app_clear : AppUtil.app_gray,
                backgroundColor: isTransparent ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                shadowColor: isTransparent ? 'rgba(0, 0, 0, 0.5)' : AppUtil.app_clear,
            }}>
                <Image
                    style={{ marginLeft: 12, width: 15, height: 15, resizeMode: 'center', marginRight: 7 }}
                    source={imageSource}
                />
                <Text style={{
                    fontSize: 14,
                    color: isTransparent ? '#FFFFFF' : AppUtil.app_gray
                }}>
                    搜索你想住的区域或小区
                </Text>
            </View>
        );
    }

    render() {
        const { isTransparent } = this.props;
        return (
            <NavigationBar
                statusBar={{ barStyle: AppUtil.iOS && isTransparent ? 'light-content' : 'default' }}
                backgroundView={this._renderGradientView()}
                titleHidden={true}
                leftItem={this._renderCityView()}
                rightItem={this._renderSearchView()}
                rightItemStyle={{ marginLeft: 5, flex: 1 }}
                navBarStyle={{
                    position: 'absolute',
                    backgroundColor: isTransparent ? AppUtil.app_clear : '#FFFFFF'
                }}
                navContentStyle={{ justifyContent: 'flex-start' }}
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
        alignItems: 'center',
    },
    searchView: {
        flexDirection: 'row',
        height: 30,
        left: 0,
        right: 0,
        borderWidth: 0.5,
        borderRadius: 15,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
});