module.exports = (sequelize, DataTypes) => {
  const Episode = sequelize.define('Episode', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
  Episode.associate = (models) => {
    Episode.hasMany(models.Segment, {
      foreignKey: 'episodeId',
      as: 'episodeSegments',
    });
  };
  return Episode;
};