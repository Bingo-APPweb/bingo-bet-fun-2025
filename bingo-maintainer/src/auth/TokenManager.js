"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
// packages/maintainer/src/auth/TokenManager.ts
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../utils/config");
var TokenManager = /** @class */ (function () {
    function TokenManager() {
        this.secret = config_1.config.auth.jwtSecret;
        this.tokenExpiration = config_1.config.auth.tokenExpiration || '8h';
    }
    TokenManager.prototype.generateToken = function (userId, permissions) {
        return jsonwebtoken_1.default.sign({ userId: userId, permissions: permissions }, this.secret, { expiresIn: this.tokenExpiration });
    };
    TokenManager.prototype.verifyToken = function (token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            return null;
        }
    };
    return TokenManager;
}());
exports.TokenManager = TokenManager;
