const segment = require('./segment/segment.service.js');
const submission = require('./submission/submission.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(segment);
  app.configure(submission);
};
