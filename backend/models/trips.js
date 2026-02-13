const Sequelize = require("sequelize");
module.exports = class Trips extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        plan: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        score: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        // createdAt: {
        //   type: Sequelize.DATE,
        //   defaultValue: Sequelize.NOW,
        // },
        // updatedAt: {
        //   type: Sequelize.DATE,
        //   defaultValue: Sequelize.NOW,
        // },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Trip",
        tableName: "trips",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Trip.hasMany(db.Photo);

    db.Trip.belongsToMany(db.User,{through:'usertrip'});
  }
};

// dest: {
//   type: Sequelize.STRING(20),
//   allowNull: false,
// },
// thumnail: {
//   type: Sequelize.STRING(200),
//   allowNull: false,
// },
// category: {
//   type: Sequelize.STRING(50),
//   allowNull: false,
// },
// Transportation: {
//   type: Sequelize.ENUM,
//   values: ["Car", "Bus", "Taxi", "Train", "Airplane", "Bicycle"],
// },
// contents: {
//   type: Sequelize.TEXT,
//   allowNull: true,
// },
// costs: {
//   type: Sequelize.INTEGER,
//   defaultValue: 0,
// },
