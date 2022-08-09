'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Visit.init(
    {
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      PhoneNumber: DataTypes.STRING,
      Temperature: DataTypes.STRING,
      ProgramLocationId: DataTypes.INTEGER,
      TimeIn: DataTypes.STRING,
      TimeOut: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Visit',
    }
  );
  return Visit;
};
