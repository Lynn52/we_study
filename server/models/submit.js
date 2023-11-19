'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submit extends Model { // 클래스 이름 모델 이름으로 바꿔 줘야함
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Submit.belongsTo(models.Work, { foreignKey: 'workId' });
      Submit.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Submit.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    workId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    filePath: {
      type: DataTypes.STRING,
    },
    downloadPath: {
      type: DataTypes.STRING,
    }

  }, {
    sequelize,
    modelName: 'Submit', // 모델 이름 바꿔줘야함
    timestamps: true,
    underscored: true,
    tableName: 'submits', // 테이블 이름 바꿔줘야함
  });
  return Submit; // return 할때 모델 이름으로 바꿔줘야함
};