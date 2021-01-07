const express = require('express');
const router = express.Router();

const homeController = require('../controllers');
const bestsellersController = require('../controllers/bestsellersController');
const searchController = require('../controllers/searchController');
const bookController = require('../controllers/bookController');
const topSearchedController = require('../controllers/topSearched');

/* GET homepage. */
router.get('/', homeController);

/* GET Recommended Books Endpoint*/
router.get('/api/bestsellers', bestsellersController);

/* GET Top Searched Books Endpoint*/
router.get('/api/top-searched', topSearchedController);

/* GET Search Endpoint */
router.get('/api/search', searchController);

/* GET Book Details Endpoint */
router.get('/api/book', bookController);

module.exports = router;
