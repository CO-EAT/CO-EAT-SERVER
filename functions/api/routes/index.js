var express = require('express');
var router = express.Router();

router.use('/meal', require('./meal'));

module.exports = router;
