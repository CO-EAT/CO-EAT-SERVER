var express = require('express');
var router = express.Router();

router.post('/', require('./groupPOST'));

module.exports = router;
