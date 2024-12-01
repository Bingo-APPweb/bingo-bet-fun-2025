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
exports.SecurityAnalyzer = void 0;
// src/core/analyzers/SecurityAnalyzer.ts
var BaseAnalyzer_1 = require("./BaseAnalyzer");
var firebase_rules_parser_1 = require("../../utils/firebase-rules-parser");
var SecurityAnalyzer = /** @class */ (function (_super) {
    __extends(SecurityAnalyzer, _super);
    function SecurityAnalyzer(config) {
        var _this = _super.call(this, config) || this;
        _this.HIGH_RISK_PATTERNS = [
            /.write:\s*true/,
            /.read:\s*true/,
            /auth\s*==\s*null/,
            /\$uid\s*!==\s*auth\.uid/,
        ];
        _this.CRITICAL_FUNCTIONS = [
            'updateUserBalance',
            'processGameResults',
            'updateRewards',
            'validateWinner',
        ];
        return _this;
    }
    SecurityAnalyzer.prototype.analyze = function (code, context) {
        return __awaiter(this, void 0, void 0, function () {
            var vulnerabilities, timestamps, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, analysis, error_1;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        vulnerabilities = [];
                        timestamps = {
                            startTime: Date.now(),
                            endTime: 0,
                        };
                        _l.label = 1;
                    case 1:
                        _l.trys.push([1, 9, , 10]);
                        _a = context.fileType;
                        switch (_a) {
                            case 'firebase-rules': return [3 /*break*/, 2];
                            case 'typescript': return [3 /*break*/, 4];
                            case 'javascript': return [3 /*break*/, 4];
                            case 'config': return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 2:
                        _c = (_b = vulnerabilities.push).apply;
                        _d = [vulnerabilities];
                        return [4 /*yield*/, this.analyzeFirebaseRules(code)];
                    case 3:
                        _c.apply(_b, _d.concat([(_l.sent())]));
                        return [3 /*break*/, 8];
                    case 4:
                        _f = (_e = vulnerabilities.push).apply;
                        _g = [vulnerabilities];
                        return [4 /*yield*/, this.analyzeSourceCode(code, context)];
                    case 5:
                        _f.apply(_e, _g.concat([(_l.sent())]));
                        return [3 /*break*/, 8];
                    case 6:
                        _j = (_h = vulnerabilities.push).apply;
                        _k = [vulnerabilities];
                        return [4 /*yield*/, this.analyzeConfig(code)];
                    case 7:
                        _j.apply(_h, _k.concat([(_l.sent())]));
                        return [3 /*break*/, 8];
                    case 8:
                        timestamps.endTime = Date.now();
                        analysis = {
                            filePath: context.filePath,
                            timestamp: timestamps.startTime,
                            vulnerabilities: vulnerabilities,
                            metrics: {
                                highRiskIssues: vulnerabilities.filter(function (v) { return v.severity === 'high'; }).length,
                                mediumRiskIssues: vulnerabilities.filter(function (v) { return v.severity === 'medium'; }).length,
                                lowRiskIssues: vulnerabilities.filter(function (v) { return v.severity === 'low'; }).length,
                                analysisTime: timestamps.endTime - timestamps.startTime,
                            },
                            suggestions: this.generateSuggestions(vulnerabilities),
                            context: {
                                environment: context.environment,
                                fileType: context.fileType,
                            },
                        };
                        // Emitir evento para logging e monitoramento
                        this.emit('security-analysis-complete', analysis);
                        return [2 /*return*/, analysis];
                    case 9:
                        error_1 = _l.sent();
                        this.emit('security-analysis-error', { error: error_1, context: context });
                        throw error_1;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SecurityAnalyzer.prototype.analyzeFirebaseRules = function (rulesContent) {
        return __awaiter(this, void 0, void 0, function () {
            var vulnerabilities, rules;
            var _this = this;
            return __generator(this, function (_a) {
                vulnerabilities = [];
                rules = (0, firebase_rules_parser_1.parseRules)(rulesContent);
                // Verificar permissões muito abertas
                this.HIGH_RISK_PATTERNS.forEach(function (pattern) {
                    if (pattern.test(rulesContent)) {
                        vulnerabilities.push({
                            type: 'firebase-rules',
                            severity: 'high',
                            message: 'Potentially dangerous security rule detected',
                            line: _this.findLineNumber(rulesContent, pattern),
                            code: pattern.source,
                            suggestedFix: 'Implement proper authentication checks',
                        });
                    }
                });
                // Verificar estrutura das regras
                this.validateRuleStructure(rules, vulnerabilities);
                return [2 /*return*/, vulnerabilities];
            });
        });
    };
    SecurityAnalyzer.prototype.analyzeSourceCode = function (code, context) {
        return __awaiter(this, void 0, void 0, function () {
            var vulnerabilities, dataValidation, sensitiveData;
            var _this = this;
            return __generator(this, function (_a) {
                vulnerabilities = [];
                // Verificar funções críticas
                this.CRITICAL_FUNCTIONS.forEach(function (funcName) {
                    if (code.includes(funcName)) {
                        var authCheck = _this.checkAuthenticationValidation(code, funcName);
                        if (!authCheck.valid) {
                            vulnerabilities.push({
                                type: 'authentication',
                                severity: 'high',
                                message: "Critical function \"".concat(funcName, "\" may lack proper authentication"),
                                line: authCheck.line,
                                code: funcName,
                                suggestedFix: 'Add authentication validation before executing critical operations',
                            });
                        }
                    }
                });
                dataValidation = this.checkDataValidation(code);
                if (!dataValidation.valid) {
                    vulnerabilities.push({
                        type: 'data-validation',
                        severity: 'medium',
                        message: 'Potential data validation issues detected',
                        line: dataValidation.line,
                        code: dataValidation.code,
                        suggestedFix: 'Implement proper data validation and sanitization',
                    });
                }
                sensitiveData = this.checkSensitiveDataExposure(code);
                if (sensitiveData.length > 0) {
                    vulnerabilities.push.apply(vulnerabilities, sensitiveData.map(function (data) { return ({
                        type: 'sensitive-data',
                        severity: 'high',
                        message: 'Possible exposure of sensitive data',
                        line: data.line,
                        code: data.code,
                        suggestedFix: 'Remove or encrypt sensitive information',
                    }); }));
                }
                return [2 /*return*/, vulnerabilities];
            });
        });
    };
    SecurityAnalyzer.prototype.analyzeConfig = function (configContent) {
        return __awaiter(this, void 0, void 0, function () {
            var vulnerabilities, config, securitySettings;
            return __generator(this, function (_a) {
                vulnerabilities = [];
                config = JSON.parse(configContent);
                // Verificar exposição de credenciais
                if (this.hasExposedCredentials(config)) {
                    vulnerabilities.push({
                        type: 'credentials',
                        severity: 'critical',
                        message: 'Exposed credentials in configuration',
                        line: 0,
                        code: 'config',
                        suggestedFix: 'Move sensitive data to environment variables',
                    });
                }
                securitySettings = this.validateSecuritySettings(config);
                vulnerabilities.push.apply(vulnerabilities, securitySettings);
                return [2 /*return*/, vulnerabilities];
            });
        });
    };
    SecurityAnalyzer.prototype.validateRuleStructure = function (rules, vulnerabilities) {
        // Validação da estrutura de regras do Firebase
        var criticalPaths = ['games', 'users', 'transactions'];
        criticalPaths.forEach(function (path) {
            if (!rules[path] || !rules[path].read || !rules[path].write) {
                vulnerabilities.push({
                    type: 'firebase-rules',
                    severity: 'high',
                    message: "Missing security rules for critical path: ".concat(path),
                    line: 0,
                    code: path,
                    suggestedFix: "Add explicit read/write rules for ".concat(path),
                });
            }
        });
    };
    SecurityAnalyzer.prototype.checkAuthenticationValidation = function (code, funcName) {
        // Implementar verificação de validação de autenticação
        var functionBody = this.extractFunctionBody(code, funcName);
        var hasAuthCheck = /auth\.currentUser|isAuthenticated|requireAuth/.test(functionBody);
        return {
            valid: hasAuthCheck,
            line: this.findLineNumber(code, new RegExp(funcName)),
        };
    };
    SecurityAnalyzer.prototype.checkDataValidation = function (code) {
        // Implementar verificação de validação de dados
        return {
            valid: true,
            line: 0,
            code: '',
        };
    };
    SecurityAnalyzer.prototype.checkSensitiveDataExposure = function (code) {
        // Implementar verificação de exposição de dados sensíveis
        return [];
    };
    SecurityAnalyzer.prototype.hasExposedCredentials = function (config) {
        // Implementar verificação de credenciais expostas
        return false;
    };
    SecurityAnalyzer.prototype.validateSecuritySettings = function (config) {
        // Implementar validação de configurações de segurança
        return [];
    };
    SecurityAnalyzer.prototype.generateSuggestions = function (vulnerabilities) {
        // Gerar sugestões baseadas nas vulnerabilidades encontradas
        var suggestions = new Set();
        vulnerabilities.forEach(function (vulnerability) {
            switch (vulnerability.type) {
                case 'firebase-rules':
                    suggestions.add('Review and strengthen Firebase security rules');
                    break;
                case 'authentication':
                    suggestions.add('Implement comprehensive authentication checks');
                    break;
                case 'data-validation':
                    suggestions.add('Add thorough data validation and sanitization');
                    break;
                // Adicionar mais casos conforme necessário
            }
        });
        return Array.from(suggestions);
    };
    SecurityAnalyzer.prototype.findLineNumber = function (content, pattern) {
        var lines = content.split('\n');
        return lines.findIndex(function (line) { return pattern.test(line); }) + 1;
    };
    SecurityAnalyzer.prototype.extractFunctionBody = function (code, funcName) {
        // Implementar extração do corpo da função
        return '';
    };
    return SecurityAnalyzer;
}(BaseAnalyzer_1.BaseAnalyzer));
exports.SecurityAnalyzer = SecurityAnalyzer;
