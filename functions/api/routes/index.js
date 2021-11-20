var express = require('express');
var router = express.Router();


router.use('/drink', require("./drink"));
router.use('/meal', require('./meal'));

module.exports = router;
