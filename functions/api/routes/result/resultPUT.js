const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { groupDB } = require('../../../db');

module.exports = async (req, res) => {
  const { inviteCode } = req.params;
  const { nickname } = req.body;

  if (!inviteCode || !nickname) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const findGroup = await groupDB.findGroupByInviteCode(client, inviteCode);
    const groupId = findGroup[0].id;
    const isHost = await groupDB.checkHost(client, groupId, nickname);
    if(!isHost){
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.IS_NOT_HOST)); 
    }
    const completeResult = await groupDB.completeGroup(client, groupId, nickname);

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.COMPLETE_RESULT_SUCCESS, completeResult));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};