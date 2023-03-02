module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProgramLocations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      LocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Locations',
          },
          key: 'id',
        },
      },
      ProgramId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Programs',
          },
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('ProgramLocations', {
      fields: ['LocationId', 'ProgramId'],
      unique: true,
    });
    await queryInterface.sequelize.query('ALTER SEQUENCE "ProgramLocations_id_seq" RESTART WITH 100;');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProgramLocations');
  },
};
