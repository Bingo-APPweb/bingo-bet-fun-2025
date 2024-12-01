"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.IntegratedAnalyzer = void 0;
// src/core/analyzers/IntegratedAnalyzer.ts
var CodeComplexityAnalyzer_1 = require("./CodeComplexityAnalyzer");
var events_1 = require("events");
var parser = require("@babel/parser");
var traverse_1 = require("@babel/traverse");
var t = require("@babel/types");
var IntegratedAnalyzer = /** @class */ (function (_super) {
    __extends(IntegratedAnalyzer, _super);
    function IntegratedAnalyzer(config) {
        var _this = _super.call(this) || this;
        _this.fixes = new Map();
        _this.config = config;
        _this.complexityAnalyzer = new CodeComplexityAnalyzer_1.CodeComplexityAnalyzer(config);
        return _this;
    }
    IntegratedAnalyzer.prototype.analyzeAndFix = function (filePath, code) {
        return __awaiter(this, void 0, void 0, function () {
            var analysis, fixes, fixedCode, reanalysis, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.runAllAnalysis(filePath, code)];
                    case 1:
                        analysis = _a.sent();
                        fixes = this.determineFixes(analysis);
                        if (!(this.config.autoFix && fixes.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.applyFixes(code, fixes)];
                    case 2:
                        fixedCode = _a.sent();
                        return [4 /*yield*/, this.runAllAnalysis(filePath, fixedCode)];
                    case 3:
                        reanalysis = _a.sent();
                        return [2 /*return*/, {
                                original: analysis,
                                fixes: fixes,
                                fixed: fixedCode,
                                reanalysis: reanalysis,
                            }];
                    case 4: return [2 /*return*/, { original: analysis, fixes: [] }];
                    case 5:
                        error_1 = _a.sent();
                        this.emit('analysis-error', { filePath: filePath, error: error_1 });
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    IntegratedAnalyzer.prototype.runAllAnalysis = function (filePath, code) {
        return __awaiter(this, void 0, void 0, function () {
            var analysis;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.complexityAnalyzer.analyze(filePath, code)];
                    case 1:
                        _a.complexity = _b.sent();
                        return [4 /*yield*/, this.analyzePatterns(code)];
                    case 2:
                        _a.patterns = _b.sent();
                        return [4 /*yield*/, this.analyzePerformance(code)];
                    case 3:
                        _a.performance = _b.sent();
                        return [4 /*yield*/, this.analyzeSecurity(code)];
                    case 4:
                        _a.security = _b.sent();
                        return [4 /*yield*/, this.analyzeStyle(code)];
                    case 5:
                        analysis = (_a.style = _b.sent(),
                            _a);
                        return [2 /*return*/, analysis];
                }
            });
        });
    };
    IntegratedAnalyzer.prototype.analyzePatterns = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var ast, patterns;
            return __generator(this, function (_a) {
                ast = parser.parse(code, {
                    sourceType: 'module',
                    plugins: ['typescript', 'jsx'],
                });
                patterns = {
                    antiPatterns: [],
                    recommendations: [],
                };
                (0, traverse_1.default)(ast, {
                    // Detecta uso de setState com props
                    CallExpression: function (path) {
                        if (t.isMemberExpression(path.node.callee) &&
                            t.isIdentifier(path.node.callee.property, { name: 'setState' })) {
                            var argument = path.node.arguments[0];
                            if (t.isObjectExpression(argument)) {
                                // Verifica uso de props dentro do setState
                                path.traverse({
                                    MemberExpression: function (innerPath) {
                                        if (t.isIdentifier(innerPath.node.object, { name: 'props' }) &&
                                            !path.scope.hasBinding('props')) {
                                            patterns.antiPatterns.push('Using props directly in setState can cause issues with updates');
                                        }
                                    },
                                });
                            }
                        }
                    },
                    // Detecta componentes sem memo
                    FunctionDeclaration: function (path) {
                        if (path.node.id && /[A-Z]/.test(path.node.id.name[0])) {
                            var hasMemo_1 = false;
                            path.parentPath.traverse({
                                CallExpression: function (memoPath) {
                                    if (t.isIdentifier(memoPath.node.callee, { name: 'memo' }) &&
                                        t.isIdentifier(memoPath.node.arguments[0], { name: path.node.id.name })) {
                                        hasMemo_1 = true;
                                    }
                                },
                            });
                            if (!hasMemo_1) {
                                patterns.recommendations.push("Consider using React.memo for component ".concat(path.node.id.name));
                            }
                        }
                    },
                });
                return [2 /*return*/, patterns];
            });
        });
    };
    IntegratedAnalyzer.prototype.analyzePerformance = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var ast, performance;
            return __generator(this, function (_a) {
                ast = parser.parse(code, {
                    sourceType: 'module',
                    plugins: ['typescript', 'jsx'],
                });
                performance = {
                    issues: [],
                    suggestions: [],
                };
                (0, traverse_1.default)(ast, {
                    // Detecta criação de objetos em renders
                    JSXElement: function (path) {
                        path.traverse({
                            ObjectExpression: function (objPath) {
                                if (!objPath.scope.hasBinding('useCallback') && !objPath.scope.hasBinding('useMemo')) {
                                    performance.issues.push('Object created inside render - consider memoization');
                                }
                            },
                        });
                    },
                    // Detecta arrays inline em deps
                    CallExpression: function (path) {
                        if (t.isIdentifier(path.node.callee, { name: 'useEffect' }) ||
                            t.isIdentifier(path.node.callee, { name: 'useMemo' }) ||
                            t.isIdentifier(path.node.callee, { name: 'useCallback' })) {
                            var deps = path.node.arguments[1];
                            if (t.isArrayExpression(deps)) {
                                deps.elements.forEach(function (element) {
                                    if (t.isArrayExpression(element) || t.isObjectExpression(element)) {
                                        performance.issues.push('Inline array/object in dependency array - will cause infinite updates');
                                    }
                                });
                            }
                        }
                    },
                });
                return [2 /*return*/, performance];
            });
        });
    };
    IntegratedAnalyzer.prototype.analyzeSecurity = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var ast, security;
            return __generator(this, function (_a) {
                ast = parser.parse(code, {
                    sourceType: 'module',
                    plugins: ['typescript', 'jsx'],
                });
                security = {
                    vulnerabilities: [],
                    warnings: [],
                };
                (0, traverse_1.default)(ast, {
                    // Detecta uso de dangerouslySetInnerHTML
                    JSXAttribute: function (path) {
                        if (t.isJSXIdentifier(path.node.name, { name: 'dangerouslySetInnerHTML' })) {
                            security.vulnerabilities.push('Using dangerouslySetInnerHTML - XSS risk');
                        }
                    },
                    // Detecta eval e similares
                    CallExpression: function (path) {
                        if (t.isIdentifier(path.node.callee, { name: 'eval' }) ||
                            t.isIdentifier(path.node.callee, { name: 'Function' })) {
                            security.vulnerabilities.push('Using eval or Function constructor - security risk');
                        }
                    },
                });
                return [2 /*return*/, security];
            });
        });
    };
    IntegratedAnalyzer.prototype.analyzeStyle = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var ast, style;
            return __generator(this, function (_a) {
                ast = parser.parse(code, {
                    sourceType: 'module',
                    plugins: ['typescript', 'jsx'],
                });
                style = {
                    issues: [],
                    suggestions: [],
                };
                (0, traverse_1.default)(ast, {
                    // Verifica convenções de nomenclatura
                    FunctionDeclaration: function (path) {
                        var _a;
                        var name = (_a = path.node.id) === null || _a === void 0 ? void 0 : _a.name;
                        if (name) {
                            if (name[0].toUpperCase() === name[0] &&
                                !name.match(this.config.rules.naming.components)) {
                                style.issues.push("Component ".concat(name, " does not follow naming convention"));
                            }
                        }
                    },
                    // Verifica uso de CSS inline
                    JSXAttribute: function (path) {
                        if (t.isJSXIdentifier(path.node.name, { name: 'style' })) {
                            style.suggestions.push('Consider using Tailwind classes instead of inline styles');
                        }
                    },
                });
                return [2 /*return*/, style];
            });
        });
    };
    IntegratedAnalyzer.prototype.determineFixes = function (analysis) {
        var _this = this;
        var fixes = [];
        // Fixes para complexidade
        if (analysis.complexity.metrics.cyclomaticComplexity > this.config.rules.complexity) {
            analysis.complexity.details.complexFunctions.forEach(function (func) {
                fixes.push({
                    type: 'complexity',
                    location: func.loc,
                    fix: _this.generateComplexityFix(func),
                });
            });
        }
        // Fixes para padrões
        analysis.patterns.antiPatterns.forEach(function (pattern) {
            fixes.push({
                type: 'pattern',
                description: pattern,
                fix: _this.generatePatternFix(pattern),
            });
        });
        // Fixes para performance
        analysis.performance.issues.forEach(function (issue) {
            fixes.push({
                type: 'performance',
                description: issue,
                fix: _this.generatePerformanceFix(issue),
            });
        });
        return fixes;
    };
    IntegratedAnalyzer.prototype.applyFixes = function (code, fixes) {
        return __awaiter(this, void 0, void 0, function () {
            var fixedCode, ast, _i, fixes_1, fix, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fixedCode = code;
                        ast = parser.parse(fixedCode, {
                            sourceType: 'module',
                            plugins: ['typescript', 'jsx'],
                        });
                        _i = 0, fixes_1 = fixes;
                        _b.label = 1;
                    case 1:
                        if (!(_i < fixes_1.length)) return [3 /*break*/, 9];
                        fix = fixes_1[_i];
                        _a = fix.type;
                        switch (_a) {
                            case 'complexity': return [3 /*break*/, 2];
                            case 'pattern': return [3 /*break*/, 4];
                            case 'performance': return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 2: return [4 /*yield*/, this.applyComplexityFix(fixedCode, fix)];
                    case 3:
                        fixedCode = _b.sent();
                        return [3 /*break*/, 8];
                    case 4: return [4 /*yield*/, this.applyPatternFix(fixedCode, fix)];
                    case 5:
                        fixedCode = _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.applyPerformanceFix(fixedCode, fix)];
                    case 7:
                        fixedCode = _b.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, fixedCode];
                }
            });
        });
    };
    IntegratedAnalyzer.prototype.generateComplexityFix = function (func) {
        // Implementação da geração de fix para complexidade
        return "\n// Sugest\u00E3o de refatora\u00E7\u00E3o para ".concat(func.name, ":\n// 1. Dividir em subfun\u00E7\u00F5es menores\n// 2. Usar early returns\n// 3. Simplificar condicionais\n");
    };
    IntegratedAnalyzer.prototype.generatePatternFix = function (pattern) {
        // Implementação da geração de fix para padrões
        return "\n// Sugest\u00E3o de corre\u00E7\u00E3o para ".concat(pattern, ":\n// 1. Usar padr\u00F5es recomendados\n// 2. Seguir boas pr\u00E1ticas React\n");
    };
    IntegratedAnalyzer.prototype.generatePerformanceFix = function (issue) {
        // Implementação da geração de fix para performance
        return "\n// Sugest\u00E3o de otimiza\u00E7\u00E3o para ".concat(issue, ":\n// 1. Usar memoiza\u00E7\u00E3o\n// 2. Otimizar renders\n");
    };
    IntegratedAnalyzer.prototype.applyComplexityFix = function (code, fix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementação da aplicação de fix para complexidade
                return [2 /*return*/, code];
            });
        });
    };
    IntegratedAnalyzer.prototype.applyPatternFix = function (code, fix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementação da aplicação de fix para padrões
                return [2 /*return*/, code];
            });
        });
    };
    IntegratedAnalyzer.prototype.applyPerformanceFix = function (code, fix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementação da aplicação de fix para performance
                return [2 /*return*/, code];
            });
        });
    };
    return IntegratedAnalyzer;
}(events_1.EventEmitter));
exports.IntegratedAnalyzer = IntegratedAnalyzer;
