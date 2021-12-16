const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addUser = async (client, nickname, groupId) => {
  const { rows } = await client.query(
    `
    INSERT INTO "user"
    (group_id, nickname)
    VALUES
    ($1, $2)
    RETURNING *
    `,
    [groupId, nickname],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { addUser };
