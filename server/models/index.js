'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const basename  = path.basename(module.filename);
const env       = process.env.NODE_ENV || 'development';
const db_config = require(__dirname + '/../config/db.json')[env];
let db          = {};

let sequelize = null;

if (db_config.use_env_variable) {
  sequelize = new Sequelize(process.env[db_config.use_env_variable]);
} else {
  sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, db_config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
