import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/root-reducer';

const loggerMiddleware = createLogger();
const configureStore = () =>
                        createStore(rootReducer,
                                    applyMiddleware(thunkMiddleware, loggerMiddleware));

export default configureStore;
