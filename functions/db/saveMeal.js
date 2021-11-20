const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllSavedMeals = async (client) => {
  const { rows } = await client.query(
    `
      SELECT * FROM "SaveMeal"
      `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const addSaveMeal = async (client, userNickName, likeMealList, unlikeMealList) => {
  const { rows } = await client.query(
    `
    INSERT INTO "SaveMeal"
    (user_nick_name, like_meal_list, unlike_meal_list)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `,
    [userNickName, likeMealList, unlikeMealList],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { getAllSavedMeals, addSaveMeal };
