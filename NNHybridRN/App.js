import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './Navigator/AppNavigator';
import store from './Redux/AppStore';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return <Provider store={store}>
      <AppNavigator />
    </Provider>
  }
}