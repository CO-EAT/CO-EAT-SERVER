var express = require('express');
var router = express.Router();

router.use('/drink', require("./drink"));

module.exports = router;
