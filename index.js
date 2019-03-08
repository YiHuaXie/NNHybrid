/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import App from './App';
import App2 from './App2';
import { name as appName } from './app.json';

AppRegistry.registerComponent('App1', () => App);
AppRegistry.registerComponent('App2', () => App2);
