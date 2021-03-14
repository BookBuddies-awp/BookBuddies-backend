import { Router } from 'express';

import bestsellersController from '../controllers/bestsellersController';
import searchController from '../controllers/searchController';
import bookController from '../controllers/bookController';
import topSearchedController from '../controllers/topSearched';
import downloadController from '../controllers/downloadController';
import homeController from '../controllers/index';

const router: Router = Router();

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

/* GET Download Info Endpoint */
router.get('/api/download', downloadController);

export default router;
