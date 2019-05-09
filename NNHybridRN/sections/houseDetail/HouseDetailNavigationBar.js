import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import AppUtil from '../../utils/AppUtil';
import NavigationBar from '../../navigator/NavigationBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ApartmentNavigationBar extends Component {

    render() {
        const { isTransparent, title } = this.props;

        const leftItem = (
            <TouchableWithoutFeedback onPress={() => this.props.backHandler()}>
                <Ionicons
                    name='ios-arrow-round-back'
                    size={44}
                    style={{ color: isTransparent ? '#FFFFFF' : AppUtil.app_black }}
                />
            </TouchableWithoutFeedback>
        );

        const rightItem = (
            <TouchableWithoutFeedback onPress={() => this.props.shareHandler()}>
                <Ionicons
                    name='md-share'
                    size={25}
                    style={{ color: isTransparent ? '#FFFFFF' : AppUtil.app_black }}
                />
            </TouchableWithoutFeedback>
        );

        return (
            <NavigationBar
                statusBar={{ barStyle: AppUtil.iOS && isTransparent ? 'light-content' : 'default' }}
                title={isTransparent ? '' : title}
                titleColor='#FFFFFF'
                leftItem={leftItem}
                rightItem={rightItem}
                showDividingLine={isTransparent ? false : true}
                navBarStyle={{
                    position: 'absolute',
                    backgroundColor: isTransparent ? AppUtil.app_clear : '#FFFFFF'
                }}
            />
        );
    }
}