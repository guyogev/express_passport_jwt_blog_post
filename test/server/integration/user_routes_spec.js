/* globals describe, before, it */
import request from 'supertest';
import server from '../../../server/server';
import db from '../../../server/models';
import jwtHelper from '../../../server/helpers/jwt_helper';

describe('user routes', () => {
  describe('GET /user/index', () => {
    const user_params = {
      email: 'some@email.com',
      password: 'password',
      password_confirmation: 'password',
      active: true,
    };

    const expectJwtTokenOn = (body) => {
      if (!body.token) { throw new Error('missing token'); }
      if (body.token.split('.').length !== 3) { throw new Error('invalid JWT'); }
    };

    before((done) => {
      db.sequelize.sync({ force: true, logging: false }).then(() => { done(); });
    });
    before((done) => {
      db.User.create(user_params).then(() => { done(); });
    });

    describe('when jwt is missing', () => {
      it('responds with status 200 and valid JWT token', (done) => {
        request(server)
          .get('/user/index')
          .expect(401)
          .end(done);
      });
    });

    describe('when jwt in header', () => {
      let jwt_token = null;
      before((done) => {
        db.User.findOne({ where: { email: user_params.email } })
          .then((user) => {
            jwt_token = jwtHelper.generateJwt(user);
            done();
          });
      });
      it('responds with status 200', (done) => {
        request(server)
          .get('/user/index')
          .set('Authorization', `JWT ${jwt_token}`)
          .expect(200)
          .end(done);
      });
      it('responds with status 200', (done) => {
        request(server)
          .get('/user/index')
          .set('Cookie', [`jwt_token=${jwt_token}`])
          .expect(200)
          .end(done);
      });
    });
  });
});
