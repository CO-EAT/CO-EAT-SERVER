var express = require('express');
var router = express.Router();

router.get('/', require('./mealGET'));
router.get('/search', require('./mealSearchGET'));
router.get('/result', require('./mealResultGET'));

router.post('/', require('./mealPOST'));

module.exports = router;
