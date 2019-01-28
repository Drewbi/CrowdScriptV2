// Initializes the `submission` service on path `/submission`
const createService = require('feathers-mongodb');
const hooks = require('./submission.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/submission', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('submission');

  mongoClient.then(db => {
    service.Model = db.collection('submission');
  });

  service.hooks(hooks);
};
