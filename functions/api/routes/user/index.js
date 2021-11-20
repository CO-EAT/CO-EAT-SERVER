var express = require('express');
var router = express.Router();

router.use('/list', require("./userListGET"));

module.exports = router;
