var express = require('express');
var router = express.Router();

router.post('/:inviteCode', require('./userPOST'));

module.exports = router;
