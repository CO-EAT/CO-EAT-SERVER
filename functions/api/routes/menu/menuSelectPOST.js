const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { groupDB, userDB } = require('../../../db');

module.exports = async (req, res) => {
  const { inviteCode } = req.params;
  const { nickname } = req.query;
  const { likedMenu, unlikedMenu } = req.body;

  let client;

  if (!inviteCode || !nickname || !likedMenu || !unlikedMenu) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  try {
    client = await db.connect(req);

    const findGroup = await groupDB.findGroupByInviteCode(client, inviteCode);
    const groupId = findGroup[0].id;

    const findUser = await userDB.findUserByNickNameandGroupId(client, groupId, nickname);
    const userId = findUser[0].id;

    // 하나씩 저장
    for (let i = 0; i < likedMenu.length; i++) {
      await userDB.addLikeMenu(client, groupId, userId, likedMenu[i]);
    }

    for (let i = 0; i < unlikedMenu.length; i++) {
      await userDB.addUnlikeMenu(client, groupId, userId, unlikedMenu[i]);
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_SELETED_MENU_SUCCESS));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
