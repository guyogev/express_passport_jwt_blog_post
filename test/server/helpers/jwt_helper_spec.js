/*globals describe, it, beforeEach*/

import jwtHelper from '../../../server/helpers/jwt_helper';
const expect = require('chai').expect;

describe("jwtHelper", () => {

  it('should be defined', () => {
    expect(jwtHelper).to.be.ok;
  });

  describe('getJwtSecret', () => {
    describe('when JWT_SECRET is not set', () => {
      it('should return `JWT_SECRET`', () => {
        expect(jwtHelper.getJwtSecret()).to.eql('JWT_SECRET');
      });
      it('should return null in production', () => {
        process.env.NODE_ENV = 'production';
        expect(jwtHelper.getJwtSecret()).to.eql(null);
        process.env.NODE_ENV = 'test';
      });
    });
    xdescribe('when JWT_SECRET is set', () => {
      it('should return JWT_SECRET value', () => {
        process.env.JWT_SECRET = 'some value'
        expect(jwtHelper.getJwtSecret()).to.eql('some value');
      });
    });
  });

  describe('generateJwt', () => {
    it('should return a jwt token', () => {
      const user = {id: 534};
      const res = jwtHelper.generateJwt(user)
      expect(res.split('.').length).to.eql(3)
    });
  });
});
