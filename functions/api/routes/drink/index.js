var express = require('express');
var router = express.Router();

router.get('/', require("./drinkGET"));
router.get('/search', require("./drinkSearchGET"));
router.get('/result', require("./drinkResultGET"));
router.post('/', require("./drinkPOST"));
module.exports = router;
