const express = require('express');
const router = express.Router();

const homeController = require('../controllers');

/* GET home page. */
router.get('/', homeController.home);

module.exports = router;
