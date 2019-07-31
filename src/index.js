import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './scss/app.scss';
import "antd/dist/antd.css";
import store from './redux/store';
import "regenerator-runtime/runtime";
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);