var express = require('express');
const menuGET = require('./menuGET');
var router = express.Router();

router.get('/', menuGET);

module.exports = router;
