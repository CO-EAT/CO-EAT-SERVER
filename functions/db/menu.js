const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const findAllMenu = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM menu ORDER BY updated_at DESC
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { findAllMenu };
