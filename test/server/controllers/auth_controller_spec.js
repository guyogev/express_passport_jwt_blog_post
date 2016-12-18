import * as authController from '../../../server/controllers/auth_controller';
const expect = require('chai').expect;

const expectJWT = () => {
  const res = {};
  res.json = (json) => {
    expect(json.token.split('.').length).to.eql(3)
  };
  return res;
}

describe('authController', () => {
  let res = {};
  let req = {};
  describe('authenticated', () => {
    it('should return jwt token', (done) => {
      req.user = {id: 342}
      res = expectJWT()
      authController.authenticated(req, res).then(done);
    });
  })
});
