const Submission = require('../models').Submission;

module.exports = {
  list(req, res) {
    return Submission
    .findAll({
      attributes: ['text', 'userId']
    })
    .then(submissions => res.status(201).send(submissions))
    .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    return Submission
      .create({
        text: req.body.text
      })
      .then(submission => res.status(201).send(submission))
      .catch(error => res.status(400).send(error));
  },
};