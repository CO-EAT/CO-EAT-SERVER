const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const findAllMenu = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM menu ORDER BY desc
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { findAllMenu };
