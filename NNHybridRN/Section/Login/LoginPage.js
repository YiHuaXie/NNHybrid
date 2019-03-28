import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView, Image } from 'react-native';
import AppDefine from '../../Define/AppDefine';
import NavigationBar from '../../Navigator/NavigationBar';
import Network, { HttpMethod } from '../../Network';
import TextField from '../../Components/Common/TextField';
// import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { ApiPath } from '../../Network/ApiService';
// import DeviceInfo from 'react-native-device-info';


let phoneIcon = <FontAwesome5
  name={'mobile'}
  size={30}
  style={{ color: AppDefine.app_theme }}
/>

let lockIcon = <FontAwesome
  name={'lock'}
  size={30}
  style={{ color: AppDefine.app_theme }}
/>

export default class LoginPage extends Component {

  _closeHandler() {
    console.log('dsds');
  }

  _registerHandler() {
    console.log('dsds');
  }

  _loginHandler() {
    console.log('dsds');
  };

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

  _addConfirmButton() {
    return (
      <View style={btnStyles.container}>
        <TouchableHighlight
          underlayColor={'rgba(0, 0, 0, 0.3)'}
          onPress={() => this._loginHandler()}
          style={btnStyles.button}
        >
          <Text style={btnStyles.text}>登录</Text>
        </TouchableHighlight>
      </View>
    );
  }

  _addTitleView() {
    return (
      <View style={styles.titleView}>
        <Text style={styles.title}>欢迎来到麦邻租房</Text>
      </View>
    );
  }

  _addPhoneTextField() {
    let image = <Image
      style={styles.image}
      source={require('../../resource/images/mobile_phone.png')}
    />
    return (
      <TextField
        textFieldStyle={[styles.textField, { marginTop: 65 }]}
        leftView={image}
        textInputStyle={{ width: styles.textField.width - 50 }}
      />
    );
  }

  _addPassWordTextField() {
    let leftImage = <Image
      style={styles.image}
      source={require('../../resource/images/lock.png')}
    />
    let rightImage = <Image
      style={{ marginLeft: 2, width: 18, height: 30, resizeMode: 'contain' }}
      source={require('../../resource/images/password_invisible.png')}
    />
    return (
      <TextField
        textFieldStyle={[styles.textField, { marginTop: 30 }]}
        leftView={leftImage}
        rightView={rightImage}
        textInputStyle={{ width: styles.textField.width - 50 }}
      />
    );
  }

  _addContentView() {
    // Network
    //   .my_request(ApiPath.ESTATE, 'initCityData', '1.0')
    //   .then(response => console.log(response))
    //   .catch(error => console.error(error));

    // let phoneIcon = <FontAwesome5
    //   name={'mobile'}
    //   size={30}
    //   style={{ color: AppDefine.app_theme }}
    // />

    // let lockIcon = <FontAwesome
    //   name={'lock'}
    //   size={30}
    //   style={{ color: AppDefine.app_theme }}
    // />
    return (
      <View style={styles.container}>
        <NavigationBar
          navBarStyle={{ backgroundColor: AppDefine.app_clear }}
          backOrClose='close'
          rightButton={this._rightButton()}
          backOrCloseHandler={() => this._closeHandler()}
        />
        <ScrollView style={{ marginTop: - AppDefine.navigationBarHeight }}>
          {this._addTitleView()}
          {this._addPhoneTextField()}
          <View style={styles.line}/>
          {this._addPassWordTextField()}
          <View style={styles.line}/>

          <View style={{
            backgroundColor: 'red',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginLeft: 30,
            width: AppDefine.windowWidth - 60,
            height: 30
          }}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: AppDefine.app_black, textAlign: 'left' }}
                onPress={() => {
                  console.log('验证码登录');
                }}>验证码登录</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: AppDefine.app_black, textAlign: 'right' }}
                onPress={() => {
                  console.log('忘记密码');
                }}>忘记密码</Text>
            </View>
          </View>

          {this._addConfirmButton()}
        </ScrollView>
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
    marginTop: 30 + AppDefine.navigationBarHeight,
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    color: AppDefine.app_black
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'center'
  },
  textField: {
    width: AppDefine.windowWidth - 60,
    height: 30,
    marginLeft: 30,
  },
  line: {
    width: AppDefine.windowWidth - 60,
    marginLeft: 30,
    marginTop: 5,
    height: 1,
    backgroundColor: '#DDDDDD',
  }
  // phoneTextField: {

  //   marginTop: 65
  // },
  // passWordTextField: {
  //   width: AppDefine.windowWidth - 60,
  //   height: 30,
  //   marginLeft: 30,
  //   marginTop: 30
  // }

});

const btnStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: AppDefine.app_theme,
    borderRadius: 20,
    marginTop: 40,
    height: 44,
    width: AppDefine.windowWidth - 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    //Text控件文字要想水平和垂直居中，需要在包裹它的那层View中设置
    //alignItems和justifyContent,否则justifyContent会无效，textAlign仅支持水平居中
    fontSize: 18,
    color: '#FFFFFF',
  },
});
