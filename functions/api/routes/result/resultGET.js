const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { groupDB, userDB } = require('../../../db');
const { UserBuilder } = require('firebase-functions/v1/auth');

module.exports = async (req, res) => {
  const { inviteCode } = req.params;
  const { nickname } = req.body;

  if (!inviteCode || !nickname) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const findGroup = await groupDB.findGroupByInviteCode(client, inviteCode);
    const groupId = findGroup[0].id;

    const { menuId: mostCoeatId, menuName: mostCoeatMenuName, menuImg: mostCoeatMenuImg, menuCnt: mostCoeatCount } = (await userDB.getMostCoeatDataByGroupId(client, groupId))[0];
    const { noeatCount: mostNoeatCount } = await userDB.getNoeatCountByMostCoeatId(client, groupId, mostCoeatId);

    const fiveCoeatMenuId = await userDB.getFiveCoeatMenuIdByGroupId(client, groupId);
    var lessNoeatCount = 0xffff,
      lessCoeatCount = 0,
      lessNoeatMenuId = 0;
    for (const menu of fiveCoeatMenuId) {
      const menuId = menu.menuId;
      const coeatCnt = Number(menu.cnt);
      const lessNoeat = (await userDB.getLessNoeatIdWithinFiveMenu(client, groupId, menuId))[0];
      var lessNoeatCnt;
      if (lessNoeat !== undefined) lessNoeatCnt = lessNoeat.cnt;
      else lessNoeatCnt = 0;
      if (lessNoeatCount > lessNoeatCnt) {
        lessNoeatCount = lessNoeatCnt;
        lessNoeatMenuId = menuId;
        lessCoeatCount = coeatCnt;
      }
    }
    const { menuName: lessNoeatMenuName, menuImg: lessNoeatMenuImg } = (await userDB.getLessNoeatDataByMenuId(client, lessNoeatMenuId))[0];

    var resultList = [];
    const usersList = await userDB.getUsersByGroupId(client, groupId);
    for (const user of usersList) {
      const { id, nickname } = user;

      const coeatList = await userDB.getCoeatList(client, id);
      const noeatList = await userDB.getNoeatList(client, id);

      resultList.push({
        nickName: nickname,
        likedMenu: coeatList.map((coeatMenu) => coeatMenu.menuName),
        unlikedMenu: noeatList.map((noeatMenu) => noeatMenu.menuName),
      });
    }

    const { count: peopleCount } = (await userDB.getPeopleCount(client, groupId))[0];

    const groupResult = {
      mostCoeatMenuName: mostCoeatMenuName,
      mostCoeatMenuImg: mostCoeatMenuImg,
      mostCoeatCount: Number(mostCoeatCount),
      mostNoeatCount: Number(mostNoeatCount),
      lessNoeatMenuName: lessNoeatMenuName,
      lessNoeatMenuImg: lessNoeatMenuImg,
      lessCoeatCount: lessCoeatCount,
      lessNoeatCount: lessNoeatCount,
      resultList: resultList,
      peopleCount: Number(peopleCount),
    };

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_RESULT_SUCCESS, groupResult));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
