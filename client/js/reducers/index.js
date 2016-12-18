import { combineReducers } from 'redux';
import api from './api_reducer';

const rootReducer = combineReducers({
  api,
});

export default rootReducer;
