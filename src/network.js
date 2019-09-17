const request = require('superagent-use')(require('superagent'));
const prefix = require('superagent-prefix');

request.use(prefix(process.env.REACT_APP_PROD_URL));

module.exports = request;
