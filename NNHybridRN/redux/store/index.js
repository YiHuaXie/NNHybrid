import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { navMiddleware } from '../../navigator/AppNavigator';
import reducers from '../reducers';

const middlewares = [
    navMiddleware,
    thunkMiddleware,
];

export default createStore(reducers, applyMiddleware(...middlewares));