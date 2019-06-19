module.exports = (sequelize, DataTypes) => {
  const Segment = sequelize.define('Segment', {
    length: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passes: {
      type: DataTypes.STRING,
      defaultValue: 0,
    }
  });
  Segment.associate = (models) => {
    Segment.hasMany(models.Submission, {
      foreignKey: 'segmentId',
      as: 'segmentSubmissions',
    });
  };
  return Segment;
};