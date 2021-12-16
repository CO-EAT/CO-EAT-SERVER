const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { groupDB, userDB } = require('../../../db');

module.exports = async (req, res) => {
  const { inviteCode } = req.params;
  const { nickname } = req.body;

  let client;

  try {
    client = await db.connect(req);

    const findGroup = await groupDB.findGroupByInviteCode(client, inviteCode);
    //console.log(findGroup);
    const groupId = findGroup[0].id;
    const newUser = await userDB.addUser(client, nickname, groupId);

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_USER_SUCCESS, newUser));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
