var express = require('express');
const menuGET = require('./menuGET');
var router = express.Router();

router.get('/', menuGET);
router.post('/:inviteCode/select', require('./menuSelectPOST'));

module.exports = router;
