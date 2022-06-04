const dayjs = require('dayjs');
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

const checkGroupFinished = async (client, groupId) => {
  const { rows } = await client.query(
    `
      SELECT is_deleted FROM "group"
      WHERE id = $1
      `,
    [groupId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const addGroup = async (client, hostName, inviteCode) => {
  const now = dayjs().add(9, 'hour');
  const { rows } = await client.query(
    `
    INSERT INTO "group"
    (host_name, invite_code, created_at, updated_at)
    VALUES
    ($1, $2, $3, $3)
    RETURNING *
    `,
    [hostName, inviteCode, now],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const checkHost = async (client, groupId, nickname) => {
  const { rows } = await client.query(
    `
    SELECT * from "group" g
    WHERE id = $1 and host_name = $2
    `,
    [groupId, nickname],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const completeGroup = async (client, groupId, nickname) => {
  const now = dayjs().add(9, 'hour');
  const { rows } = await client.query(
    `
    UPDATE "group" g
    SET is_deleted = TRUE, updated_at = $3
    WHERE id = $1 and host_name = $2
    RETURNING is_deleted
    `,
    [groupId, nickname, now],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { findGroupByInviteCode, checkGroupFinished, addGroup, checkHost, completeGroup };
