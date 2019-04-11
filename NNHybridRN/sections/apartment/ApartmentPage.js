import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
// import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ApartmentNavigationBar from './ApartmentNavigationBar';
import NavigationUtil from '../../utils/NavigationUtil';

export default class ApartmentPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isTransparent: true,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <ParallaxScrollView>

                </ParallaxScrollView> */}
                <ApartmentNavigationBar
                    isTransparent={this.state.isTransparent}
                    backHandler={() => NavigationUtil.goBack()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF00'
    }
});