const express = require('express');
const router = express.Router();

const homeController = require('../controllers');
const bestsellersController = require('../controllers/bestsellersController');
const searchController = require('../controllers/searchController');
const bookController = require('../controllers/bookController');

/* GET homepage. */
router.get('/', homeController);

/* GET Recommended Books Endpoint*/
router.get('/api/bestsellers', bestsellersController);

/* GET Search Endpoint */
router.get('/api/search', searchController);

/* GET Book Details Endpoint */
router.get('/api/book', bookController);

module.exports = router;
