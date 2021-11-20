const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllMeals = async (client) => {
  const { rows } = await client.query(
    `
      SELECT * FROM "Meal"
      `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getMealByMealName = async (client, mealName) => {
  const { rows } = await client.query(
    `
      SELECT * FROM "Meal"
      WHERE name = $1
      `,
    [mealName],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { getAllMeals, getMealByMealName };
