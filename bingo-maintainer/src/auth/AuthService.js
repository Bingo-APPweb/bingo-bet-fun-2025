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
exports.AuthService = void 0;
// packages/maintainer/src/auth/AuthService.ts
var bcrypt_1 = require("bcrypt");
var auth_1 = require("../types/auth");
var TokenManager_1 = require("./TokenManager");
var SecurityValidator_1 = require("./SecurityValidator");
var logger_1 = require("../utils/logger");
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.tokenManager = new TokenManager_1.TokenManager();
        this.securityValidator = new SecurityValidator_1.SecurityValidator();
    }
    AuthService.getInstance = function () {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    };
    AuthService.prototype.authenticate = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var securityEvents, hasCriticalEvents, user, token, expiresAt, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.securityValidator.validateContext(context)];
                    case 1:
                        securityEvents = _a.sent();
                        hasCriticalEvents = securityEvents.some(function (event) { return event.severity === auth_1.SecuritySeverity.CRITICAL; });
                        if (hasCriticalEvents) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Authentication blocked due to security concerns',
                                }];
                        }
                        return [4 /*yield*/, this.validateCredentials(request)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Invalid credentials',
                                }];
                        }
                        token = this.tokenManager.generateToken(user.id, user.permissions);
                        expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
                        // Log do evento de autenticação
                        logger_1.logger.info('Authentication successful', {
                            userId: user.id,
                            context: context,
                        });
                        return [2 /*return*/, {
                                success: true,
                                token: token,
                                expiresAt: expiresAt,
                                permissions: user.permissions,
                            }];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.logger.error('Authentication error', error_1);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Authentication failed',
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.validateCredentials = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var mockUser, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = {
                            id: '1',
                            username: 'admin'
                        };
                        return [4 /*yield*/, bcrypt_1.default.hash('admin123', 10)];
                    case 1:
                        mockUser = (_b.passwordHash = _c.sent(),
                            _b.permissions = PermissionLevel.ADMIN,
                            _b);
                        _a = request.username === mockUser.username;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt_1.default.compare(request.password, mockUser.passwordHash)];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        if (_a) {
                            return [2 /*return*/, mockUser];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
