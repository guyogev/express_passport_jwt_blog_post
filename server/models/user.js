var bcrypt = require('bcrypt-nodejs');

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [1,255]
      }
    },
    active: DataTypes.BOOLEAN,
    password_digest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password_confirmation: {
      type: DataTypes.VIRTUAL
    }
  }, {
    indexes: [{unique: true, fields: ['email']}],
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  var hasSecurePassword = function(user, options, callback) {
    if (user.password != user.password_confirmation) {
      throw new Error("Password confirmation doesn't match Password");
    }
    bcrypt.hash(user.get('password'), null, null, function(err, hash) {
      if (err) {
        return callback(err);}
      user.set('password_digest', hash);
      return callback(null, options);
    });
  };

  User.beforeCreate(function(user, options, callback) {
    user.email = user.email.toLowerCase();
    if (user.password)
      hasSecurePassword(user, options, callback);
    else
      return callback(null, options);
  })
  User.beforeUpdate(function(user, options, callback) {
    user.email = user.email.toLowerCase();
    if (user.password)
      hasSecurePassword(user, options, callback);
    else
      return callback(null, options);
  })

  return User;
};