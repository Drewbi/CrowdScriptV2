var pgp = require('pg-promise')(/* options */)
const password = process.env.DBPASS;
exports.db = pgp(`postgres://admin:${password}@localhost:5432/crowdscript`)
