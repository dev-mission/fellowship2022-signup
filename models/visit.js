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
      Visit.belongsTo(models.Program);
      Visit.belongsTo(models.Location);
    }
  }
  Visit.init(
    {
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      PhoneNumber: DataTypes.STRING,
      Temperature: DataTypes.STRING,
      TimeIn: DataTypes.DATE,
      TimeOut: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Visit',
    }
  );
  return Visit;
};
