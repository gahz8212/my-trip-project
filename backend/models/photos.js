const Sequelize = require("sequelize");
module.exports = class Photos extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        photo: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Photo",
        tableName: "photos",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Photo.belongsTo(db.User);
    db.Photo.belongsTo(db.Trip);
  }
};
