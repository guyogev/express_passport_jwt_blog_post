export const CSRF_TEST = '/csrf_test';
export const CSRF_TEST_SUCCESS = '/csrf_test_SUCCESS';
export const CSRF_TEST_ERROR = '/csrf_test_ERROR';
export function csrfTest() {
  return {
    type: 'API',
    request: {
      method: 'post',
      url: '/csrf_test',
    },
  };
}
