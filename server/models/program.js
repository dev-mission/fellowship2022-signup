const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Program.belongsToMany(models.Location, { through: models.ProgramLocation });
    }
  }
  Program.init(
    {
      Name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Program',
    }
  );
  return Program;
};
