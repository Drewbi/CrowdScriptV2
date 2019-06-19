module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
  Submission.associate = (models) => {
    Submission.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Submission.belongsTo(models.Segment, {
      foreignKey: 'segmentId',
      onDelete: 'CASCADE'
    });
  };
  return Submission;
};