var express = require('express');
var router = express.Router();

router.use('/user', require('./user'));
router.use('/group', require('./group'));
router.use('/menu', require('./menu'));

module.exports = router;
