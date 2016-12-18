import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import ApiMiddleware from '../middlewares/api_middleware';
import { USE_REDUX_LOGGER } from '../configs';
import rootReducer from '../reducers';


const middlewares = [thunk, ApiMiddleware];

if (USE_REDUX_LOGGER) {
  const logger = createLogger();
  middlewares.push(logger);
}

export default function configureStore() {
  return createStore(
    rootReducer,
    applyMiddleware(...middlewares)
  );
}
