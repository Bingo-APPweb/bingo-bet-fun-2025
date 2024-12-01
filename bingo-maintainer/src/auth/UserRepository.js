"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.TwoFactorAuth = exports.RateLimiter = exports.UserRepository = void 0;
// packages/maintainer/src/auth/UserRepository.ts
var pg_1 = require("pg");
var bcrypt_1 = require("bcrypt");
var config_1 = require("../utils/config");
var UserRepository = /** @class */ (function () {
    function UserRepository() {
        this.pool = new pg_1.Pool(config_1.config.database);
    }
    UserRepository.prototype.findByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      SELECT id, username, password_hash, permissions, two_factor_secret, last_login\n      FROM users\n      WHERE username = $1\n    ";
                        return [4 /*yield*/, this.pool.query(query, [username])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    UserRepository.prototype.updateLastLogin = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      UPDATE users\n      SET last_login = NOW()\n      WHERE id = $1\n    ";
                        return [4 /*yield*/, this.pool.query(query, [userId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.saveTwoFactorSecret = function (userId, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      UPDATE users\n      SET two_factor_secret = $2\n      WHERE id = $1\n    ";
                        return [4 /*yield*/, this.pool.query(query, [userId, secret])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserRepository;
}());
exports.UserRepository = UserRepository;
var redis_1 = require("../utils/redis");
var RateLimiter = /** @class */ (function () {
    function RateLimiter(config) {
        this.config = config;
    }
    RateLimiter.prototype.isRateLimited = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var now, windowKey, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Date.now();
                        windowKey = "ratelimit:".concat(key, ":").concat(Math.floor(now / this.config.windowMs));
                        return [4 /*yield*/, redis_1.redis.incr(windowKey)];
                    case 1:
                        count = _a.sent();
                        if (!(count === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, redis_1.redis.expire(windowKey, Math.ceil(this.config.windowMs / 1000))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, count > this.config.maxRequests];
                }
            });
        });
    };
    RateLimiter.prototype.blockKey = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var blockKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockKey = "ratelimit:blocked:".concat(key);
                        return [4 /*yield*/, redis_1.redis.setex(blockKey, Math.ceil(this.config.blockDuration / 1000), 'blocked')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RateLimiter.prototype.isBlocked = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var blockKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockKey = "ratelimit:blocked:".concat(key);
                        return [4 /*yield*/, redis_1.redis.exists(blockKey)];
                    case 1: return [2 /*return*/, (_a.sent()) === 1];
                }
            });
        });
    };
    return RateLimiter;
}());
exports.RateLimiter = RateLimiter;
// packages/maintainer/src/auth/TwoFactorAuth.ts
var otplib_1 = require("otplib");
var UserRepository_1 = require("./UserRepository");
Object.defineProperty(exports, "UserRepository", { enumerable: true, get: function () { return UserRepository_1.UserRepository; } });
var TwoFactorAuth = /** @class */ (function () {
    function TwoFactorAuth() {
        this.userRepo = new UserRepository_1.UserRepository();
    }
    TwoFactorAuth.prototype.setupTwoFactor = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var secret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        secret = otplib_1.authenticator.generateSecret();
                        return [4 /*yield*/, this.userRepo.saveTwoFactorSecret(userId, secret)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, secret];
                }
            });
        });
    };
    TwoFactorAuth.prototype.validateToken = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepo.findByUsername(userId)];
                    case 1:
                        user = _a.sent();
                        if (!(user === null || user === void 0 ? void 0 : user.twoFactorSecret))
                            return [2 /*return*/, false];
                        return [2 /*return*/, otplib_1.authenticator.verify({
                                token: token,
                                secret: user.twoFactorSecret,
                            })];
                }
            });
        });
    };
    return TwoFactorAuth;
}());
exports.TwoFactorAuth = TwoFactorAuth;
// packages/maintainer/src/auth/AuthService.ts (atualizado)
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.rateLimiter = new RateLimiter({
            windowMs: 15 * 60 * 1000, // 15 minutos
            maxRequests: 5,
            blockDuration: 60 * 60 * 1000, // 1 hora
        });
        this.twoFactorAuth = new TwoFactorAuth();
        this.userRepo = new UserRepository_1.UserRepository();
    }
    AuthService.prototype.authenticate = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var isLimited, user, _a, isValid, token, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.rateLimiter.isRateLimited(context.ipAddress)];
                    case 1:
                        isLimited = _b.sent();
                        if (!isLimited) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.rateLimiter.blockKey(context.ipAddress)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: 'Too many attempts. Please try again later.',
                            }];
                    case 3: return [4 /*yield*/, this.userRepo.findByUsername(request.username)];
                    case 4:
                        user = _b.sent();
                        _a = !user;
                        if (_a) return [3 /*break*/, 6];
                        return [4 /*yield*/, bcrypt_1.default.compare(request.password, user.passwordHash)];
                    case 5:
                        _a = !(_b.sent());
                        _b.label = 6;
                    case 6:
                        if (_a) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Invalid credentials',
                                }];
                        }
                        // 2FA se habilitado
                        if (user.twoFactorSecret && !request.twoFactorToken) {
                            return [2 /*return*/, {
                                    success: false,
                                    requiresTwoFactor: true,
                                    error: 'Two-factor authentication required',
                                }];
                        }
                        if (!(user.twoFactorSecret && request.twoFactorToken)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.twoFactorAuth.validateToken(user.id, request.twoFactorToken)];
                    case 7:
                        isValid = _b.sent();
                        if (!isValid) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Invalid two-factor token',
                                }];
                        }
                        _b.label = 8;
                    case 8: 
                    // Atualizar último login
                    return [4 /*yield*/, this.userRepo.updateLastLogin(user.id)];
                    case 9:
                        // Atualizar último login
                        _b.sent();
                        token = this.tokenManager.generateToken(user.id, user.permissions);
                        return [2 /*return*/, {
                                success: true,
                                token: token,
                                expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
                                permissions: user.permissions,
                            }];
                    case 10:
                        error_1 = _b.sent();
                        logger.error('Authentication error:', error_1);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Authentication failed',
                            }];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
// packages/maintainer/src/auth/__tests__/AuthService.test.ts
var AuthService_1 = require("../AuthService");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return AuthService_1.AuthService; } });
describe('AuthService', function () {
    var authService;
    beforeEach(function () {
        authService = new AuthService_1.AuthService();
    });
    test('should authenticate valid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, context, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        username: 'testuser',
                        password: 'password123',
                    };
                    context = {
                        ipAddress: '127.0.0.1',
                        userAgent: 'test-agent',
                        timestamp: new Date(),
                        resource: '/auth',
                        action: 'LOGIN',
                    };
                    return [4 /*yield*/, authService.authenticate(request, context)];
                case 1:
                    result = _a.sent();
                    expect(result.success).toBe(true);
                    expect(result.token).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    test('should handle rate limiting', function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, context, i, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        username: 'testuser',
                        password: 'wrong-password',
                    };
                    context = {
                        ipAddress: '127.0.0.1',
                        userAgent: 'test-agent',
                        timestamp: new Date(),
                        resource: '/auth',
                        action: 'LOGIN',
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 6)) return [3 /*break*/, 4];
                    return [4 /*yield*/, authService.authenticate(request, context)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, authService.authenticate(request, context)];
                case 5:
                    result = _a.sent();
                    expect(result.success).toBe(false);
                    expect(result.error).toContain('Too many attempts');
                    return [2 /*return*/];
            }
        });
    }); });
});
