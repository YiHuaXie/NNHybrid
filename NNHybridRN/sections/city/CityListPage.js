import React, { Component } from 'react';
import { View, Text } from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import CityManager from './CityManager';
import PinYinUtil from '../../utils/PinYinUtil';

const adjustCityNames = {
    '长沙市': '厂沙市',
    '长春市': '厂春市',
    '长治市': '厂治市',
    '厦门市': '下门市',
    '重庆市': '虫庆市',
};

export default class CityListPage extends Component {


    _arrayWithFirstLetter(cities) {

    }

    render() {
        // console.log(PinYinUtil.quanPin('你好'));
        // console.log(PinYinUtil.quanPin('string'));
        // console.log(PinYinUtil.quanPin('@你好'));

        console.log(PinYinUtil.firstLetter(null));
        console.log(PinYinUtil.firstLetter(''));
        console.log(PinYinUtil.firstLetter('你好'));
        console.log(PinYinUtil.firstLetter('M你好'));
        console.log(PinYinUtil.firstLetter('string'));
        console.log(PinYinUtil.firstLetter('@你好'));
        console.log(PinYinUtil.firstLetter('      @你好'));
        console.log(PinYinUtil.firstLetter('      n你好'));
        console.log(PinYinUtil.firstLetter('sssn你好ssss'));



        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Text
                    style={{ fontSize: 20, textAlign: 'center', margin: 10 }}
                    onPress={() => {
                    }}
                >
                    CityListPage
                </Text>
                <NavigationBar
                    backOrClose='close'
                    title='选择城市'
                    showDividingLine={true}
                    navBarStyle={{ position: 'absolute' }}
                />
            </View>
        );
    }
}