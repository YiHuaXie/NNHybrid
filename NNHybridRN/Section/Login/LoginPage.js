import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppDefine from '../../Define/AppDefine';

export default class LoginPage extends Component {

  _closeHandler() {

  }

  _registerHandler() {

  }

  _addContentView() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this._closeHandler()}
          underlayColor={'transparent'}
        >
          <View style={styles.closeButton}>
            <Text style={{ fontSize: 16, color: AppDefine.app_black }}>关闭</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this._registerHandler()}
          underlayColor={'transparent'}
        >
          <View style={styles.registerButton}>
            <Text style={{ fontSize: 16, color: AppDefine.app_black }}>注册</Text>
          </View>
        </TouchableOpacity>

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
    marginTop: AppDefine.status_bar_height,
    height: 25,
    width: 60,
  },
  registerButton: {
    backgroundColor: 'red',
    marginRight: 30,
    marginTop: AppDefine.status_bar_height,
    height: 25,
    width: 60,
  },
  titleView: {
    marginLeft: 30,
    marginTop: 30 + AppDefine.full_navigation_bar_height,
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    color: AppDefine.app_black
  },
});


