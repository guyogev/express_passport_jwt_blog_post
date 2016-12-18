/* global document*/

import React from 'react';
import { List, Map } from 'immutable';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import CsrfTestComponent from './components/CsrfTestComponent';
import configureStore from './store/configureStore';

/* create Store */
const store = configureStore();

/* Render App */
render(
  <Provider store={store}>
    <CsrfTestComponent />
  </Provider>,
  document.getElementById('app')
);
