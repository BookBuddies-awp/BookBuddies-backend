const express = require('express');
const router = express.Router();

const homeController = require('../controllers');
const bestsellersController = require('../controllers/bestsellersController');
const searchController = require('../controllers/searchController');

/* GET homepage. */
router.get('/', homeController);

/* GET Recommended Books */
router.get('/api/bestsellers', bestsellersController);

/* GET Search Endpoint */
router.get('/api/search', searchController)

module.exports = router;
