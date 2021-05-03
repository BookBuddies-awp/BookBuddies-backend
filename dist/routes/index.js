"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bestsellersController_1 = __importDefault(require("../controllers/bestsellersController"));
const searchController_1 = __importDefault(require("../controllers/searchController"));
const bookController_1 = __importDefault(require("../controllers/bookController"));
const topSearched_1 = __importDefault(require("../controllers/topSearched"));
const downloadController_1 = __importDefault(require("../controllers/downloadController"));
const index_1 = __importDefault(require("../controllers/index"));
const router = express_1.Router();
/* GET homepage. */
router.get('/', index_1.default);
/* GET Recommended Books Endpoint*/
router.get('/api/bestsellers', bestsellersController_1.default);
/* GET Top Searched Books Endpoint*/
router.get('/api/top-searched', topSearched_1.default);
/* GET Search Endpoint */
router.get('/api/search', searchController_1.default);
/* GET Book Details Endpoint */
router.get('/api/book', bookController_1.default);
/* GET Download Info Endpoint */
router.get('/api/download', downloadController_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map