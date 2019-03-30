import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import { navMiddleware } from '../../navigator/AppNavigator';

const middlewares = [
    navMiddleware,
    thunk,
];

export default createStore(reducers, applyMiddleware(...middlewares));