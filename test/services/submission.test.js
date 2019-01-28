const app = require('../../src/app');

describe('\'submission\' service', () => {
  it('registered the service', () => {
    const service = app.service('submission');
    expect(service).toBeTruthy();
  });
});
