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
exports.CodeComplexityAnalyzer = void 0;
// src/core/analyzers/CodeComplexityAnalyzer.ts
var parser = require("@babel/parser");
var traverse_1 = require("@babel/traverse");
var BaseAnalyzer_1 = require("./BaseAnalyzer");
var CodeComplexityAnalyzer = /** @class */ (function (_super) {
    __extends(CodeComplexityAnalyzer, _super);
    function CodeComplexityAnalyzer(config) {
        var _this = _super.call(this, config) || this;
        _this.codeBlocks = new Map();
        _this.COMPLEXITY_THRESHOLD = config.rules.complexity || 10;
        _this.MIN_DUPLICATE_LENGTH = config.rules.minDuplicateLength || 5;
        return _this;
    }
    CodeComplexityAnalyzer.prototype.analyze = function (filePath, code) {
        return __awaiter(this, void 0, void 0, function () {
            var ast, complexityMetrics, duplications, report, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ast = parser.parse(code, {
                            sourceType: 'module',
                            plugins: ['typescript', 'jsx'],
                        });
                        complexityMetrics = this.analyzeComplexity(ast);
                        return [4 /*yield*/, this.findDuplications(code)];
                    case 1:
                        duplications = _a.sent();
                        report = {
                            filePath: filePath,
                            timestamp: Date.now(),
                            metrics: {
                                cyclomaticComplexity: complexityMetrics.complexity,
                                duplicateBlocks: duplications.length,
                                duplicateLines: this.calculateDuplicateLines(duplications),
                                maintainabilityIndex: this.calculateMaintainabilityIndex(complexityMetrics),
                            },
                            issues: this.generateIssues(complexityMetrics, duplications),
                            details: {
                                complexFunctions: complexityMetrics.complexFunctions,
                                duplications: duplications,
                            },
                        };
                        this.emit('analysis-complete', report);
                        return [2 /*return*/, report];
                    case 2:
                        error_1 = _a.sent();
                        this.emit('analysis-error', { filePath: filePath, error: error_1 });
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CodeComplexityAnalyzer.prototype.analyzeComplexity = function (ast) {
        var _this = this;
        var complexityMetrics = {
            complexity: 0,
            complexFunctions: [],
        };
        (0, traverse_1.default)(ast, {
            enter: function (path) {
                var _a, _b;
                // Incrementa complexidade para estruturas de controle
                if (path.isIfStatement() ||
                    path.isWhileStatement() ||
                    path.isForStatement() ||
                    path.isForOfStatement() ||
                    path.isForInStatement() ||
                    path.isSwitchCase() ||
                    path.isConditionalExpression()) {
                    complexityMetrics.complexity++;
                }
                // Análise de funções
                if (path.isFunctionDeclaration() ||
                    path.isFunctionExpression() ||
                    path.isArrowFunctionExpression()) {
                    var functionName = ((_a = path.node.id) === null || _a === void 0 ? void 0 : _a.name) || 'anonymous';
                    var functionComplexity = _this.calculateFunctionComplexity(path);
                    if (functionComplexity > _this.COMPLEXITY_THRESHOLD) {
                        complexityMetrics.complexFunctions.push({
                            name: functionName,
                            complexity: functionComplexity,
                            loc: (_b = path.node.loc) === null || _b === void 0 ? void 0 : _b.start,
                        });
                    }
                }
            },
        });
        return complexityMetrics;
    };
    CodeComplexityAnalyzer.prototype.calculateFunctionComplexity = function (path) {
        var complexity = 1; // Base complexity
        path.traverse({
            enter: function (childPath) {
                if (childPath.isIfStatement() ||
                    childPath.isWhileStatement() ||
                    childPath.isForStatement() ||
                    childPath.isForOfStatement() ||
                    childPath.isForInStatement() ||
                    childPath.isSwitchCase() ||
                    childPath.isConditionalExpression() ||
                    childPath.isLogicalExpression({ operator: '&&' }) ||
                    childPath.isLogicalExpression({ operator: '||' })) {
                    complexity++;
                }
            },
        });
        return complexity;
    };
    CodeComplexityAnalyzer.prototype.findDuplications = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var lines, duplications, hashMap, i, _loop_1, this_1, windowSize, state_1;
            return __generator(this, function (_a) {
                lines = code.split('\n');
                duplications = [];
                hashMap = new Map();
                // Sliding window para encontrar duplicações
                for (i = 0; i <= lines.length - this.MIN_DUPLICATE_LENGTH; i++) {
                    _loop_1 = function (windowSize) {
                        if (i + windowSize > lines.length)
                            return "break";
                        var block = lines.slice(i, i + windowSize).join('\n');
                        var hash = this_1.hashCode(block);
                        if (!hashMap.has(hash)) {
                            hashMap.set(hash, [i]);
                        }
                        else {
                            var positions = hashMap.get(hash);
                            if (!positions.includes(i)) {
                                positions.push(i);
                                duplications.push({
                                    code: block,
                                    lines: windowSize,
                                    occurrences: positions.length,
                                    positions: positions.map(function (pos) { return ({
                                        start: pos,
                                        end: pos + windowSize,
                                    }); }),
                                });
                            }
                        }
                    };
                    this_1 = this;
                    for (windowSize = this.MIN_DUPLICATE_LENGTH; windowSize <= 20; windowSize++) {
                        state_1 = _loop_1(windowSize);
                        if (state_1 === "break")
                            break;
                    }
                }
                return [2 /*return*/, duplications];
            });
        });
    };
    CodeComplexityAnalyzer.prototype.calculateMaintainabilityIndex = function (metrics) {
        // Fórmula do índice de manutenibilidade
        // MI = 171 - 5.2 * ln(HV) - 0.23 * CC - 16.2 * ln(LOC)
        var HV = metrics.complexity * Math.log(metrics.complexity); // Volume Halstead
        var CC = metrics.complexity; // Complexidade Ciclomática
        var LOC = metrics.complexFunctions.length; // Linhas de Código
        return Math.max(0, Math.min(100, 171 - 5.2 * Math.log(HV) - 0.23 * CC - 16.2 * Math.log(LOC)));
    };
    CodeComplexityAnalyzer.prototype.generateIssues = function (complexityMetrics, duplications) {
        var issues = [];
        // Problemas de complexidade
        for (var _i = 0, _a = complexityMetrics.complexFunctions; _i < _a.length; _i++) {
            var func = _a[_i];
            if (func.complexity > this.COMPLEXITY_THRESHOLD) {
                issues.push({
                    type: 'complexity',
                    severity: func.complexity > this.COMPLEXITY_THRESHOLD * 1.5 ? 'high' : 'medium',
                    message: "Function ".concat(func.name, " has high cyclomatic complexity (").concat(func.complexity, ")"),
                    location: func.loc,
                    suggestedFix: 'Consider breaking down the function into smaller, more manageable pieces',
                });
            }
        }
        // Problemas de duplicação
        for (var _b = 0, duplications_1 = duplications; _b < duplications_1.length; _b++) {
            var dup = duplications_1[_b];
            if (dup.lines >= this.MIN_DUPLICATE_LENGTH) {
                issues.push({
                    type: 'duplication',
                    severity: dup.lines > this.MIN_DUPLICATE_LENGTH * 2 ? 'high' : 'medium',
                    message: "Found ".concat(dup.occurrences, " occurrences of duplicated code (").concat(dup.lines, " lines)"),
                    location: dup.positions[0],
                    suggestedFix: 'Consider extracting duplicated code into a shared function or component',
                });
            }
        }
        return issues;
    };
    CodeComplexityAnalyzer.prototype.hashCode = function (str) {
        return require('crypto').createHash('md5').update(str).digest('hex');
    };
    CodeComplexityAnalyzer.prototype.calculateDuplicateLines = function (duplications) {
        return duplications.reduce(function (total, dup) { return total + dup.lines * (dup.occurrences - 1); }, 0);
    };
    return CodeComplexityAnalyzer;
}(BaseAnalyzer_1.BaseAnalyzer));
exports.CodeComplexityAnalyzer = CodeComplexityAnalyzer;
