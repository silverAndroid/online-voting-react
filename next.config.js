const { parsed: env } = require('dotenv').config();

module.exports = {
  env: env || {},
};
