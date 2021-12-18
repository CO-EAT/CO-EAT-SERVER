var express = require('express');
var router = express.Router();

router.get('/:inviteCode', require('./resultGET'));
router.put('/:inviteCode/complete', require('./resultPUT'));
module.exports = router;
