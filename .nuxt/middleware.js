const middleware = {}

middleware['adminOnly'] = require('../middleware/adminOnly.js')
middleware['adminOnly'] = middleware['adminOnly'].default || middleware['adminOnly']

middleware['authenticated'] = require('../middleware/authenticated.js')
middleware['authenticated'] = middleware['authenticated'].default || middleware['authenticated']

middleware['notAuthenticated'] = require('../middleware/notAuthenticated.js')
middleware['notAuthenticated'] = middleware['notAuthenticated'].default || middleware['notAuthenticated']

middleware['setAuth'] = require('../middleware/setAuth.js')
middleware['setAuth'] = middleware['setAuth'].default || middleware['setAuth']

export default middleware
