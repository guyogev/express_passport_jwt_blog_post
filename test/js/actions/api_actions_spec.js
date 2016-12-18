/* global describe, it */
import { expect } from 'chai';
import * as ApiActions from '../../../client/js/actions/api_actions.js';

describe('ApiActions', () => {
  describe('csrfTest', () => {
    it('should retrun action with type `timer.start`', () => {
      const action = ApiActions.csrfTest();
      expect(action.type).to.eql('API');
      expect(action.request.method).to.eql('post');
      expect(action.request.url).to.eql('/csrf_test');
    });
  });
});
