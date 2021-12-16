const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { groupDB, userDB } = require('../../../db');
const generateCode = require('./utils');

module.exports = async (req, res) => {
  const { hostName } = req.body;

  let client;

  try {
    client = await db.connect(req);
    let inviteCode = generateCode(); // 무작위로 참여 코드 생성
    let group = await groupDB.findGroupByInviteCode(client, inviteCode);
    while (group.length) {
      inviteCode = generateCode();
      group = await groupDB.findGroupByInviteCode(client, inviteCode);
    }
    const newGroup = await groupDB.addGroup(client, hostName, inviteCode);
    const groupInviteCode = newGroup[0].inviteCode;
    const newUser = await userDB.addUser(client, hostName, newGroup[0].id);
    //console.log(newUser);

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_ONE_POST_SUCCESS, [{ inviteCode: groupInviteCode }]));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
