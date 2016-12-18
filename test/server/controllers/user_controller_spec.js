/* globals describe, it */
import * as userController from '../../../server/controllers/user_controller';
import db from '../../../server/models';

const expect = require('chai').expect;

const users = () => {
  let i;
  const users = [];
  for (i = 0; i < 10; i++) {
    users.push({ email: `email-${i}@domain.com` });
  }
  return users;
};

const expectUsers = () => {
  const res = {};
  res.json = (json) => {
    expect(json.length).to.eql(10);
  };
  return res;
};

describe('authController', () => {
  before((done) => {
    db.sequelize.sync({ force: true, logging: false }).then(() => { done(); });
  });
  before((done) => {
    db.User.bulkCreate(users()).then(() => { done(); });
  });

  let res = {};
  let req = {};

  describe('index', () => {
    it('should return users as json', (done) => {
      res = expectUsers();
      userController.index(req, res).then(done);
    });
  });
});
