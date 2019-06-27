const userController = require('../controllers/users');
const submissionController = require('../controllers/submissions');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  app.get('/api/user', userController.list);

  app.post('/api/user', userController.create);

  app.get('/api/submission', submissionController.list);

  app.post('/api/submission', submissionController.create);
};