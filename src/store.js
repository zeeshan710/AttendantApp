import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import employeeReducer from './reducers/employeeReducer';
import thunk from 'redux-thunk';

const store = createStore(employeeReducer, applyMiddleware(logger, thunk));

export default store;