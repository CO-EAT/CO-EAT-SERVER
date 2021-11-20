const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');
  
  const saveDrink = async (client, userNickName, drinkName, iceFlag) => {
    const { rows } = await client.query(
      `
      INSERT INTO "SaveDrink"
      (user_nick_name, drink_name, ice_flag)
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
      [userNickName, drinkName, iceFlag],
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
  };
  
    
  const getDrinkResult = async (client) => {
    const { rows } = await client.query(
      `
      SELECT d.name, s.ice_flag, count(d.name) as cnt
      FROM "SaveDrink" s, "Drink" d
      WHERE s.drink_name = d.name
      GROUP BY d.name, s.ice_flag
      ORDER BY cnt desc;
      `,
    );
    return convertSnakeToCamel.keysToCamel(rows);
  };
  

  module.exports = { saveDrink, getDrinkResult };
  