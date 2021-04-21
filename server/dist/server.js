"use strict";
// Express is a NPM Package (Nodejs Library) that helps in making web application development process easier
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Before running the app, do `npm install` in the command prompt
// To start the app use `npm start` in the command prompt and go to `localhost:3000` on the browser
// const express = require('express');// Import Express
const express_1 = __importStar(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const tokenChecker_1 = __importDefault(require("./middlewares/tokenChecker"));
const app = express_1.default(); // Create an Express App
app.use(cors_1.default());
app.use(express_1.urlencoded({ extended: false }));
app.use(express_1.json());
app.use(helmet_1.default());
app.use(tokenChecker_1.default);
app.use(index_1.default);
const PORT = process.env.PORT || '8080';
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
//# sourceMappingURL=server.js.map