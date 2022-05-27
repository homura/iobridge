/* eslint-disable */
require('ts-node/register');
const path = require('path');

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.join(__dirname, '/migrations'),
  },
};
