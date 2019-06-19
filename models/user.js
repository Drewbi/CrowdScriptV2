module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Submission, {
      foreignKey: 'userId',
      as: 'userSubmissions'
    });
  };
  return User;
};