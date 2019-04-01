import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { navMiddleware } from '../../navigator/AppNavigator';
import reducers from '../reducers';

const loggerMiddleware = store => next => action => {
    if (typeof action === 'function') {
        console.log('dispatching a function');
    } else {
        console.log('dispatching a ', action);
    }

    const result = next(action);
    console.log('nextState ', store.getState());
}

const middlewares = [
    navMiddleware,
    loggerMiddleware,
    thunkMiddleware,
];

export default createStore(reducers, applyMiddleware(...middlewares));