const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { groupDB, userDB } = require('../../../db');

module.exports = async (req, res) => {
  const { inviteCode } = req.params;

  if (!inviteCode) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const findGroup = await groupDB.findGroupByInviteCode(client, inviteCode);
    if (findGroup.length === 0) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_FOUND_GROUP));
    const groupId = findGroup[0].id;

    // Result List
    const usersList = await userDB.getUsersByGroupId(client, groupId);
    const userIdList = usersList.map((o) => o.id);
    const coeatList = await userDB.getCoeatList(client, userIdList, groupId);
    const noeatList = await userDB.getNoeatList(client, userIdList, groupId);

    const resultList = usersList.map((item) => {
      item.likedMenu = [];
      item.unlikedMenu = [];
      return item;
    });
    coeatList.map((o) => {
      const item = resultList.find((e) => e.id === o.userId);
      item.likedMenu.push(o.menuName);
      return o;
    });
    noeatList.map((o) => {
      const item = resultList.find((e) => e.id === o.userId);
      item.unlikedMenu.push(o.menuName);
      return o;
    });
    const { count: peopleCount } = await userDB.getPeopleCount(client, groupId);

    try {
      // Most Coeat
      const { menuId: mostCoeatId, menuName: mostCoeatMenuName, menuImg: mostCoeatMenuImg, menuCnt: mostCoeatCount } = await userDB.getMostCoeatDataByGroupId(client, groupId);
      const temp = await userDB.getNoeatCountByMostCoeatId(client, groupId, mostCoeatId);
      let mostNoeatCount = 0;
      if (temp) {
        mostNoeatCount = temp.noeatCount;
      }

      // // Less Noeat
      const fiveCoeatMenu = await userDB.getFiveCoeatMenuIdByGroupId(client, groupId);
      const fiveCoeatMenuId = fiveCoeatMenu.map((o) => o.menuId);

      const fiveNoeatMenu = await userDB.getNoeatCountOfFiveMenu(client, groupId, fiveCoeatMenuId);
      const lessNoeatList = fiveNoeatMenu.sort(function (a, b) {
        return Number(a.noeatCnt) - Number(b.noeatCnt);
      });
      const lessNoeat = lessNoeatList[0];
      const lessCoeatCount = fiveCoeatMenu.filter((o) => o.menuId == lessNoeat.id)[0].coeatCnt;
      const lessNoeatCount = lessNoeat.noeatCnt;
      const { menuName: lessNoeatMenuName, menuImg: lessNoeatMenuImg } = await userDB.getLessNoeatDataByMenuId(client, lessNoeat.id);

      const groupResult = {
        mostCoeatMenuName: mostCoeatMenuName,
        mostCoeatMenuImg: mostCoeatMenuImg,
        mostCoeatCount: Number(mostCoeatCount),
        mostNoeatCount: Number(mostNoeatCount),
        lessNoeatMenuName: lessNoeatMenuName,
        lessNoeatMenuImg: lessNoeatMenuImg,
        lessCoeatCount: Number(lessCoeatCount),
        lessNoeatCount: Number(lessNoeatCount),
        resultList: resultList,
        peopleCount: Number(peopleCount),
      };

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_RESULT_SUCCESS, groupResult));
    } catch {
      const groupResult = {
        resultList: resultList,
        peopleCount: Number(peopleCount),
      };
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_EMPTY_RESULT_SUCCESS, groupResult));
    }
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
