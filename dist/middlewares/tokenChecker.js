"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenChecker = (req, res, next) => {
    const token = req.header('authorization');
    if (typeof token !== undefined && token === process.env.AUTH_TOKEN) {
        console.log('Authorized User');
        next();
    }
    else {
        console.log('Unauthorized User');
        res.status(401).json({
            ok: false,
            error: 'Unauthorized User',
        });
    }
};
exports.default = tokenChecker;
//# sourceMappingURL=tokenChecker.js.map