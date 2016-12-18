/*globals describe, it, beforeEach*/

const db = require('../../../server/models/index.js');
const expect = require('chai').expect;

describe("User", () => {
  // clean the db before each test
  beforeEach((done) => {
    db.sequelize.sync({ force: true, logging: false }).then(() => { done(); });
  });

  it('should be defined', () => {
    expect(db.User).to.be.ok;
  });

  describe('create', () => {
    describe('when params are valid', () => {
      it('should insert to db', async () => {
        const args = { email: 'Some@email.COM', password: '123456', password_confirmation: '123456' };
        await db.User.create(args);
        const users = await db.User.findAll({where: {email: 'some@email.com'}});
        expect(users.length).to.eql(1);
      });
    });
  });
});
