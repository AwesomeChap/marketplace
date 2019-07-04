import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers/reducer';
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";

const middlewares = [];

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));
export default store;