/* globals describe, before, it */
import request from 'supertest';
import server from '../../../server/server';
import db from '../../../server/models';

describe('authentication', () => {
  describe('POST /authenticate', () => {
    const user_params = {
      email: 'some@email.com',
      password: 'password',
      password_confirmation: 'password',
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

    describe('when email and password are valid', () => {
      it('responds with status 200 and valid JWT token', (done) => {
        request(server)
          .post('/authenticate')
          .send({ email: user_params.email, password: user_params.password })
          .expect(200)
          .expect((res) => {
            expectJwtTokenOn(res.body);
          })
          .end(done);
      });
    });

    describe('when email and password are invalid', () => {
      it('responds with 401 Unauthorized', (done) => {
        request(server)
          .post('/authenticate')
          .send({ email: 'other@email.com', password: user_params.password })
          .expect(401)
          .end(done);
      });
    });
  });
});
