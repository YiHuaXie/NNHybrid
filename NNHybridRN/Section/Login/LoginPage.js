import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppDefine from '../../Define/AppDefine';
import NavigationBar from '../../Components/Common/NavigationBar';
import Network, { handleUrl } from '../../Components/Network';

export default class LoginPage extends Component {

  _closeHandler() {
    console.log('dsds');
  }

  _registerHandler() {
    console.log('dsds');
  }

  _rightButton() {
    return (
      <View style={styles.registerButton}>
        <Text
          style={{ fontSize: 16, color: AppDefine.app_black }}
          onPress={() => this._registerHandler()}
        >
          注册
        </Text>
      </View>
    );
  }

  _addContentView() {
    let params = {
      v: '1.0',
      method: 'initCityData',
      reqId: 'abcd',
      appVersionNum: '3.7.3',
      equType: 'iPhone 7',
      manufacturerBrand: 'Apple',
      params: {}
    };

    let tmp1 = handleUrl('https://api.mdguanjia.com/myhome/api/estate', params);
    console.log(tmp1);


    Network.postRequest('https://api.mdguanjia.com/myhome/api/estate', params);
    return (
      <View style={styles.container}>
        <NavigationBar
          backOrClose='close'
          title='登录页面'
          rightButton={this._rightButton()}
          backOrCloseHandler={() => this._closeHandler()}
        />
        <View style={styles.titleView}>
          <Text style={styles.title}>欢迎来到麦邻租房</Text>
        </View>
      </View>
    );
  }

  render() {
    return this._addContentView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppDefine.app_background,
  },
  closeButton: {
    backgroundColor: 'red',
    marginLeft: 30,
    marginTop: AppDefine.statusBarHeight,
    height: 25,
    width: 60,
  },
  titleView: {
    marginLeft: 30,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    color: AppDefine.app_black
  },
});


