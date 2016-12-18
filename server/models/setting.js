'use strict';
export default (sequelize, DataTypes) => {
  var Setting = sequelize.define('Setting', {
    key: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Setting;
};