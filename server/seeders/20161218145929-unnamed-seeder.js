'use strict';

const db = require('../models/index');

const users = [
  {
    active: true,
    email: 'guy@spectory.com',
    password: 'qwe123qwe',
    password_confirmation: 'qwe123qwe',
  },
];

db.User.destroy({ where: {} }).then(() => {
  db.User.create(users[0]);
});