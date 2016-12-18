import * as API from '../actions/api_actions';
import initialState from './initialState';

export default function (state = initialState.api, action) {
  switch (action.type) {
    case API.CSRF_TEST:
      return Object.assign({}, state, { csrf_test_result: 'in progress' });
    case API.CSRF_TEST_SUCCESS:
      return Object.assign({}, state, { csrf_test_result: 'pass' });
    case API.CSRF_TEST_ERROR:
      return Object.assign({}, state, { csrf_test_result: 'fail' });
    default:
      return state;
  }
}
