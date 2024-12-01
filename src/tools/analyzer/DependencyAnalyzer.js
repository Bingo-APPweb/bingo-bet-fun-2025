"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyAnalyzer = void 0;
var promises_1 = require("fs/promises");
var path_1 = require("path");
var DependencyAnalyzer = /** @class */ (function () {
    function DependencyAnalyzer(projectPath) {
        this.packageJson = null;
        this.projectPath = projectPath;
    }
    DependencyAnalyzer.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var packageJsonPath, content, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        packageJsonPath = (0, path_1.resolve)(this.projectPath, 'package.json');
                        return [4 /*yield*/, (0, promises_1.readFile)(packageJsonPath, 'utf-8')];
                    case 1:
                        content = _a.sent();
                        this.packageJson = JSON.parse(content);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Erro ao ler package.json: ".concat(error_1.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DependencyAnalyzer.prototype.analyze = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.packageJson) {
                            throw new Error('Analisador não inicializado. Execute initialize() primeiro.');
                        }
                        _a = {};
                        return [4 /*yield*/, this.findCircularDependencies()];
                    case 1:
                        _a.circular = _b.sent();
                        return [4 /*yield*/, this.checkOutdatedDependencies()];
                    case 2:
                        _a.outdated = _b.sent();
                        return [4 /*yield*/, this.findMissingDependencies()];
                    case 3:
                        _a.missing = _b.sent();
                        return [4 /*yield*/, this.findUnusedDependencies()];
                    case 4: return [2 /*return*/, (_a.unused = _b.sent(),
                            _a)];
                }
            });
        });
    };
    DependencyAnalyzer.prototype.findCircularDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var circles, visited, path, detectCircle, allDeps, _i, _a, pkg;
            var _this = this;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        circles = [];
                        visited = new Set();
                        path = [];
                        detectCircle = function (pkg) { return __awaiter(_this, void 0, void 0, function () {
                            var circle, deps, _i, _a, dep;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (path.includes(pkg)) {
                                            circle = path.slice(path.indexOf(pkg));
                                            circles.push(__spreadArray(__spreadArray([], circle, true), [pkg], false));
                                            return [2 /*return*/];
                                        }
                                        if (visited.has(pkg))
                                            return [2 /*return*/];
                                        visited.add(pkg);
                                        path.push(pkg);
                                        deps = ((_b = this.packageJson) === null || _b === void 0 ? void 0 : _b.dependencies[pkg]) || {};
                                        _i = 0, _a = Object.keys(deps);
                                        _c.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                        dep = _a[_i];
                                        return [4 /*yield*/, detectCircle(dep)];
                                    case 2:
                                        _c.sent();
                                        _c.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4:
                                        path.pop();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        allDeps = __assign(__assign({}, (_b = this.packageJson) === null || _b === void 0 ? void 0 : _b.dependencies), (_c = this.packageJson) === null || _c === void 0 ? void 0 : _c.devDependencies);
                        _i = 0, _a = Object.keys(allDeps);
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        pkg = _a[_i];
                        return [4 /*yield*/, detectCircle(pkg)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, circles];
                }
            });
        });
    };
    DependencyAnalyzer.prototype.checkOutdatedDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var outdated, allDeps, _i, _a, _b, name_1, version, response, data, latest, error_2;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        outdated = [];
                        allDeps = __assign(__assign({}, (_c = this.packageJson) === null || _c === void 0 ? void 0 : _c.dependencies), (_d = this.packageJson) === null || _d === void 0 ? void 0 : _d.devDependencies);
                        _i = 0, _a = Object.entries(allDeps);
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        _b = _a[_i], name_1 = _b[0], version = _b[1];
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fetch("https://registry.npmjs.org/".concat(name_1))];
                    case 3:
                        response = _f.sent();
                        return [4 /*yield*/, response.json()];
                    case 4:
                        data = _f.sent();
                        latest = (_e = data['dist-tags']) === null || _e === void 0 ? void 0 : _e.latest;
                        if (latest && latest !== version) {
                            outdated.push({ name: name_1, current: version, latest: latest });
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _f.sent();
                        console.warn("Erro ao verificar vers\u00E3o de ".concat(name_1, ": ").concat(error_2.message));
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, outdated];
                }
            });
        });
    };
    DependencyAnalyzer.prototype.findMissingDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var missing;
            return __generator(this, function (_a) {
                missing = [];
                // Implementar lógica para encontrar imports no código que não estão no package.json
                // Isso requer análise estática do código
                return [2 /*return*/, missing];
            });
        });
    };
    DependencyAnalyzer.prototype.findUnusedDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unused;
            return __generator(this, function (_a) {
                unused = [];
                // Implementar lógica para encontrar dependências listadas mas não utilizadas
                // Isso requer análise estática do código
                return [2 /*return*/, unused];
            });
        });
    };
    return DependencyAnalyzer;
}());
exports.DependencyAnalyzer = DependencyAnalyzer;
