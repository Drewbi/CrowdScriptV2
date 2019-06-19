module.exports = (sequelize, DataTypes) => {
  const Episode = sequelize.define('Episode', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
  Episode.associate = (models) => {
    Episode.hasMany(models.Segment, {
      foreignKey: 'episodeID',
      as: 'segments',
    });
  };
  return Episode;
};