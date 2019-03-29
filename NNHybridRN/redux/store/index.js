import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import { navMiddleware } from '../../navigator/AppNavigator';


/**
 * 自定义logger中间件
 * @param {*} store 
 */
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
    thunk,
];

/**
 * 创建store
 */
// export default createStore(appReducers, applyMiddleware(...middlewares));
export default createStore(reducers, applyMiddleware(...middlewares));