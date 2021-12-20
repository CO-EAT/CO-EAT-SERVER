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

const getMostCoeatDataByGroupId = async (client, groupId) => {
  const { rows } = await client.query(
    `
    SELECT id as menu_id, menu_name, menu_img, mm.max_menu_cnt as menu_cnt
    FROM menu, (SELECT m.menu_id as max_menu_id, m.cnt as max_menu_cnt
                FROM (SELECT menu_id, COUNT(*) cnt
                      FROM like_menu
                      WHERE group_id = $1
                      GROUP BY menu_id
                      ORDER BY cnt DESC
                      LIMIT 1) m) mm
    WHERE menu.id = mm.max_menu_id;    
  `,
    [groupId],
  );

  return convertSnakeToCamel.keysToCamel(rows);
};

const getNoeatCountByMostCoeatId = async (client, groupId, coeatId) => {
  const { rows } = await client.query(
    `
    SELECT count(menu_id) over() as noeat_count
    FROM "unlike_menu" c
    WHERE group_id = $1
    and menu_id = $2;
    `,
    [groupId, coeatId],
  );

  return convertSnakeToCamel.keysToCamel(rows);
};

const getFiveCoeatMenuIdByGroupId = async (client, groupId) => {
  const { rows } = await client.query(
    `
    SELECT menu_id, COUNT(*) cnt
    FROM like_menu
    WHERE group_id = $1
    GROUP BY menu_id
    ORDER BY COUNT(*) DESC
    LIMIT 5;    
  `,
    [groupId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getLessNoeatIdWithinFiveMenu = async (client, groupId, menuId) => {
  const { rows } = await client.query(
    `
    SELECT COUNT(*) cnt
    FROM unlike_menu
    WHERE group_id = $1
    and menu_id = $2
    GROUP BY menu_id;
  `,
    [groupId, menuId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getLessNoeatDataByMenuId = async (client, menuId) => {
  const { rows } = await client.query(
    `
    SELECT menu_name, menu_img
    FROM "menu" m
    WHERE id = $1
  `,
    [menuId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getUsersByGroupId = async (client, groupId) => {
  const { rows } = await client.query(
    `
      SELECT id, nickname
      FROM "user" u
      WHERE u.group_id = $1
    `,
    [groupId],
  );

  return convertSnakeToCamel.keysToCamel(rows);
};

const getCoeatList = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT m.menu_name
    FROM "like_menu" c JOIN "menu" m
    ON c.menu_id = m.id
    WHERE c.user_id = $1
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getNoeatList = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT m.menu_name
    FROM "unlike_menu" n JOIN "menu" m
    ON n.menu_id = m.id
    WHERE n.user_id = $1
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPeopleCount = async (client, groupId) => {
  const { rows } = await client.query(
    `
    SELECT count(u.id) over()
    FROM "user" u 
    WHERE group_id = $1
    LIMIT 1;
    `,
    [groupId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {
  addUser,
  getMostCoeatDataByGroupId,
  getNoeatCountByMostCoeatId,
  getFiveCoeatMenuIdByGroupId,
  getLessNoeatIdWithinFiveMenu,
  getLessNoeatDataByMenuId,
  getCoeatList,
  getNoeatList,
  getPeopleCount,
  getUsersByGroupId,
};
