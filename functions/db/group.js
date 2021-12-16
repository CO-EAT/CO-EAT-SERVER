const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const findGroupByInviteCode = async (client, inviteCode) => {
  const { rows } = await client.query(
    `
      SELECT * FROM "group"
      WHERE invite_code = $1
      `,
    [inviteCode],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const addGroup = async (client, hostName, inviteCode) => {
  const { rows } = await client.query(
    `
    INSERT INTO "group"
    (host_name, invite_code)
    VALUES
    ($1, $2)
    RETURNING *
    `,
    [hostName, inviteCode],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { findGroupByInviteCode, addGroup };
