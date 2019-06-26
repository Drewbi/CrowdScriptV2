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
    Segment.belongsTo(models.Episode, {
      foreignKey: 'episodeId',
      as: 'episodeSegments'
    });
    Segment.hasMany(models.Submission, {
      foreignKey: 'segmentId',
      as: 'segmentSubmissions'
    });
  };
  return Segment;
};