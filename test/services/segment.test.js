const app = require('../../src/app');

describe('\'segment\' service', () => {
  it('registered the service', () => {
    const service = app.service('segment');
    expect(service).toBeTruthy();
  });
});
