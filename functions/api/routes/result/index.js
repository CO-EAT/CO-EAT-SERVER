var express = require('express');
var router = express.Router();

router.get('/:inviteCode', require('./resultGET'));

module.exports = router;