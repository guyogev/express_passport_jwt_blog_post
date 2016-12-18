/*globals describe, it, beforeEach*/

const db = require('../../../server/models/index.js');
const expect = require('chai').expect;

describe("Setting", () => {
  // clean the db before each test
  beforeEach((done) => {
    db.sequelize.sync({ force: true, logging: false }).then(() => { done(); });
  });

  it('should be defined', () => {
    expect(db.Setting).to.be.ok;
  });

  describe('create', () => {
    describe('when params are valid', () => {
      it('should insert to db', async () => {
        const settings_params = { key: 'key', value: 'value' };
        await db.Setting.create(settings_params);
        const all_settings = await db.Setting.findAll();
        expect(all_settings.length).to.equal(1);
        expect(all_settings[0].dataValues.key).to.equal(settings_params.key);
        expect(all_settings[0].dataValues.value).to.equal(settings_params.value);
      });
    });
  });
});
