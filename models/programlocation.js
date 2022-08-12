'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgramLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProgramLocation.init(
    {
      LocationId: DataTypes.INTEGER,
      ProgramId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ProgramLocation',
    }
  );
  return ProgramLocation;
};
