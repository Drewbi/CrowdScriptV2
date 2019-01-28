// Initializes the `segment` service on path `/segment`
const createService = require('feathers-mongodb');
const hooks = require('./segment.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/segment', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('segment');

  mongoClient.then(db => {
    service.Model = db.collection('segment');
  });

  service.hooks(hooks);
};
