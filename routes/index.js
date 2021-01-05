const express = require('express');
const router = express.Router();

const homeController = require('../controllers');
const bestsellersController = require('../controllers/bestsellersController');

/* GET home page. */
router.get('/', homeController);

/* GET Recommended Books */
router.get('/api/bestsellers', bestsellersController);

module.exports = router;
