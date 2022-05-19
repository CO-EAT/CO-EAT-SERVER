var express = require('express');
var router = express.Router();

router.get('/:inviteCode', require('./groupGET'));

router.post('/', require('./groupPOST'));

module.exports = router;
