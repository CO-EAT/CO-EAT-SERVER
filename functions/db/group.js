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

const checkHost = async (client, groupId, nickname)=>{
  const { rows } = await client.query(
    `
    SELECT * from "group" g
    WHERE id = $1 and host_name = $2
    `,
    [groupId, nickname],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const completeGroup = async (client, groupId, nickname)=>{
  const { rows } = await client.query(
    `
    UPDATE "group" g
    SET is_deleted = TRUE, updated_at = now()
    WHERE id = $1 and host_name = $2
    RETURNING is_deleted
    `,
    [groupId, nickname],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { findGroupByInviteCode, addGroup, checkHost, completeGroup };
