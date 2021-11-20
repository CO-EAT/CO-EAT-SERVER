const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllDrinks = async(client)=>{
    const{rows} = await client.query(
        `
        SELECT * FROM "Drink" d
        `,
    );
    return convertSnakeToCamel.keysToCamel(rows);
}

const getDrinkByName = async (client, drinkName) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "Drink" d
      WHERE name = $1
      `,
      [drinkName],
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
  };

 
  module.exports = { getAllDrinks, getDrinkByName};
  