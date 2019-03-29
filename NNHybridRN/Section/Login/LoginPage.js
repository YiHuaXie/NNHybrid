import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView, Image, TextInput, Animated, Easing } from 'react-native';
import AppDefine from '../../Define/AppDefine';
import NavigationBar from '../../Navigator/NavigationBar';
import Network from '../../Network';
import TextField from '../../Components/Common/TextField';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import StringUtil from './StringUtil';
import { ApiPath } from '../../Network/ApiService';

const LoginBy = {
  password: 'password',
  verifyCode: 'verifyCode',
};

export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      verifyCode: '',
      securePassword: true,
      loginBy: LoginBy.password,
      animatedValue: new Animated.Value(0),
    };

    this.animated = Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.in,
    });
  }

  _close = () => {

  }

  _closeHandler() {
    console.log('dsds');
  }

  _jumpToRegister = () => {

  }

  _registerHandler() {
    console.log('dsds');
  }

  _getVerifyCode = () => {

  }
  _verifyCodeHandler() {

  };

  _loginBySwith = () => {
    this.setState({
      loginBy: this.state.loginBy === LoginBy.password ?
        LoginBy.verifyCode :
        LoginBy.password
    });

    this.state.animatedValue.setValue(0);
    this.animated.start(() => {

    });
  }

  _loginHandler() {
    if (StringUtil.phoneValid(this.state.phone)) {
      console.log('有效');
    } else {
      console.log('无效');
    }

    if (StringUtil.passwordValid(this.state.password)) {

    }

    // 这里到时候要写到action里面
    let params = {
      username: this.state.phone,
      password: this.state.password,
    };

    Network
      .my_request(ApiPath.CUSTOMER, 'loginByPassword', '1.0', params)
      .then(response => {

      })
      .catch(error => {

      });
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

  _confirmButton() {
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

  _titleView() {
    return (
      <View style={styles.titleView}>
        <Text style={styles.title}>欢迎来到麦邻租房</Text>
      </View>
    );
  }

  _phoneTextField() {
    let leftView = <Image
      style={styles.image}
      source={require('../../resource/images/mobile_phone.png')}
    />

    let rightView =
      this.state.loginBy === LoginBy.password ?
        null :
        <Text
          style={{ fontSize: 16, color: AppDefine.app_black }}
          onPress={() => this._verifyCodeHandler()}
        >
          获取验证码
        </Text>

    let textInputWidth = styles.textField.width - (rightView ? 110 : 50);
    let textInput = <TextInput
      style={{ width: textInputWidth, fontSize: 16, color: AppDefine.app_black }}
      placeholderTextColor='#DDDDDD'
      keyboardType='number-pad'
      selectionColor={AppDefine.app_theme}
      onChangeText={text => this.setState({ phone: text })}
      placeholder='请输入手机号'
      clearButtonMode='while-editing'
      secureTextEntry={false}
      value={this.state.phone}
    />
    return (
      <TextField
        textFieldStyle={{ ...styles.textField, marginTop: 65 }}
        leftView={leftView}
        textInput={textInput}
        rightView={rightView}
      />
    );
  }

  _passwordTextField() {
    let leftImage = <Image
      style={styles.image}
      source={require('../../resource/images/lock.png')}
    />

    let rightImage = <TouchableOpacity onPress={() => {
      console.log('asdasdasdasd');
      this.setState({ securePassword: !this.state.securePassword });
    }}>
      <Image
        style={{ marginLeft: 2, width: 18, height: 30, resizeMode: 'contain' }}
        source={
          this.state.securePassword ?
            require('../../resource/images/password_invisible.png') :
            require('../../resource/images/password_visible.png')
        }
      />
    </TouchableOpacity>

    let textInput = <TextInput
      style={{ width: styles.textField.width - 50, fontSize: 16, color: AppDefine.app_black }}
      placeholderTextColor='#DDDDDD'
      secureTextEntry={this.state.securePassword}
      selectionColor={AppDefine.app_theme}
      onChangeText={text => this.setState({ password: text })}
      placeholder='请输入密码'
      clearButtonMode='while-editing'
      value={this.state.password}
    />
    return (
      <TextField
        textFieldStyle={{ ...styles.textField, marginTop: 30 }}
        leftView={leftImage}
        rightView={rightImage}
        textInput={textInput}
      />
    );
  }

  _verifyCodeTextField() {
    let leftImage = <Image
      style={styles.image}
      source={require('../../resource/images/verify_code.png')}
    />
    let textInput = <TextInput
      style={{ width: styles.textField.width - 50, fontSize: 16, color: AppDefine.app_black }}
      placeholderTextColor='#DDDDDD'
      selectionColor={AppDefine.app_theme}
      placeholder='请输入验证码'
      onChangeText={text => this.setState({ verifyCode: text })}
      value={this.state.verifyCode}
    />
    return (
      <TextField
        textFieldStyle={{ ...styles.textField, marginTop: 30 }}
        leftView={leftImage}
        textInput={textInput}
      />
    );
  }

  _loginBySwitchButton() {
    return (
      <TouchableWithoutFeedback onPress={this._loginBySwith}>
        <View style={{
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          height: 30,
        }}>
          <Image
            style={{ width: 16, height: 16, resizeMode: 'contain' }}
            source={require('../../resource/images/sort.png')}
          />
          <Text
            style={{ fontSize: 12, color: AppDefine.app_black, textAlign: 'left' }}
          >
            验证码登录
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _forgetPasswordButton() {
    if (this.state.loginBy !== LoginBy.password) return null;

    return (
      <TouchableWithoutFeedback onPress={this._loginBySwith}>
        <View style={{ height: 30, justifyContent: 'center' }}>
          <Text style={{
            fontSize: 12,
            color: AppDefine.app_black,
            textAlign: 'right'
          }}>
            忘记密码
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    let { animatedValue } = this.state;

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 1]
    });

    const marginTop = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 40, 0]
    });

    return (
      <View style={styles.container}>
        <NavigationBar
          backOrClose='close'
          rightButton={this._rightButton()}
          backOrCloseHandler={this._close}
        />
        <ScrollView
          style={{ marginTop: - AppDefine.navigationBarHeight }}
          keyboardDismissMode='on-drag'
        >
          {this._titleView()}
          <Animated.View style={{ marginTop: marginTop, opacity: opacity }}>
            {this._phoneTextField()}
            <View style={styles.line} />
            {this.state.loginBy === LoginBy.password ?
              this._passwordTextField() :
              this._verifyCodeTextField()
            }
            <View style={styles.line} />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
              marginLeft: 30,
              width: AppDefine.windowWidth - 60,
              height: 30
            }}>
              {this._loginBySwitchButton()}
              {this._forgetPasswordButton()}
            </View>

            {this._confirmButton()}
          </Animated.View>
        </ScrollView>
      </View >
    );
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

// export default class LoginPage extends Component {

//   constructor(props) {
//     super(props)

//     this.state = {
//       animatedValue: new Animated.Value(0),
//     }

//     this.rotateAnimated = Animated.timing(
//       this.state.animatedValue,
//       {
//         toValue: 1,
//         duration: 3000,
//         easing: Easing.in,
//       }
//     );
//   }

//   _startAnimated() {
//     this.state.animatedValue.setValue(0);
//     this.rotateAnimated.start(() => this._startAnimated());
//   }

//   render() {

//     // const rotateZ = this.state.animatedValue.interpolate({
//     //   inputRange: [0, 1],
//     //   outputRange: ['0deg', '360deg']
//     // });

//     // const opacity = this.state.animatedValue.interpolate({
//     //   inputRange: [0, 0.5, 1],
//     //   outputRange: [0, 1, 0]
//     // });

//     // const rotateX = this.state.animatedValue.interpolate({
//     //   inputRange: [0, 0.5, 1],
//     //   outputRange: ['0deg', '180deg', '0deg']
//     // });

//     // const textSize = this.state.animatedValue.interpolate({
//     //   inputRange: [0, 0.5, 1],
//     //   outputRange: [18, 32, 18]
//     // });

//     const marginLeft = this.state.animatedValue.interpolate({
//       inputRange: [0, 0.5, 1],
//       outputRange: [0, 200, 0]
//     });

//     return (
//       <View style={{ flex: 1, flexDirection: 'column' }}>

//         {/* <Animated.View
//           style={{
//             marginTop: 10,
//             width: 100,
//             height: 100,
//             transform: [
//               { rotateZ: rotateZ },
//             ]
//           }}
//         >
//           <Image style={{ width: 100, height: 100 }}
//             source={{ uri: 'out_loading_image.png' }}>
//           </Image>
//         </Animated.View>

//         <Animated.View
//           style={{
//             marginTop: 10,
//             width: 100,
//             height: 100,
//             opacity: opacity,
//             backgroundColor: 'red',
//           }}
//         />

//         <Animated.Text
//           style={{
//             marginTop: 10,
//             width: 100,
//             fontSize: 18,
//             color: 'white',
//             backgroundColor: 'red',
//             transform: [
//               { rotateX: rotateX },
//             ]
//           }}
//         >
//           窗外风好大，我没有穿褂。
//               </Animated.Text>

//         <Animated.Text
//           style={{
//             marginTop: 10,
//             height: 100,
//             lineHeight: 100,
//             fontSize: textSize,
//             color: 'red'
//           }}
//         >
//           IAMCJ嘿嘿嘿
//               </Animated.Text> */}

//         <Animated.View
//           style={{
//             marginTop: 10,
//             width: 100,
//             height: 100,
//             marginLeft: marginLeft,
//             backgroundColor: 'red',
//           }}
//         />

//         <TouchableOpacity onPress={this._startAnimated.bind(this)}>
//           <Text style={{ width: 200, height: 100, textAlign: 'center', lineHeight: 100 }}>点击开始动画</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }