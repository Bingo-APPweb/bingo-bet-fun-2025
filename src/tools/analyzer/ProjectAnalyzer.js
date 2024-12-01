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
exports.ProjectAnalyzer = void 0;
// src/tools/analyzer/ProjectAnalyzer.ts
var promises_1 = require("fs/promises");
var path_1 = require("path");
var DependencyAnalyzer_1 = require("./DependencyAnalyzer");
var ProjectAnalyzer = /** @class */ (function () {
    function ProjectAnalyzer(projectRoot) {
        this.projectRoot = projectRoot;
        this.IGNORED_PATHS = new Set(['node_modules', 'dist', '.git', 'build']);
        this.VALID_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
        this.fileTree = { path: projectRoot, type: 'directory' };
        this.analysisResult = {
            orphanedFiles: [],
            missingDependencies: new Map(),
            circularDependencies: [],
            inconsistentNaming: [],
            misplacedFiles: [],
            suggestions: new Map(),
        };
        this.dependencyAnalyzer = new DependencyAnalyzer_1.DependencyAnalyzer(projectRoot);
    }
    ProjectAnalyzer.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dependencyAnalyzer.initialize()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Erro na inicializa\u00E7\u00E3o: ".concat(error_1.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.analyze = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dependencyAnalysis, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.buildFileTree()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Promise.all([
                                this.dependencyAnalyzer.analyze(),
                                this.analyzeImports(),
                                this.checkStructuralIntegrity(),
                                this.validateNamingConventions(),
                                this.detectMisplacedFiles(),
                            ])];
                    case 2:
                        dependencyAnalysis = (_a.sent())[0];
                        // Adiciona resultado da análise de dependências ao resultado final
                        this.analysisResult.dependencies = dependencyAnalysis;
                        return [2 /*return*/, this.analysisResult];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Erro durante análise:', error_2);
                        throw new Error("Erro durante a an\u00E1lise: ".concat(error_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.analyzeDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dependencyAnalyzer.analyze()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error("Erro na an\u00E1lise de depend\u00EAncias: ".concat(error_3.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.buildFileTree = function () {
        return __awaiter(this, arguments, void 0, function (currentPath, node) {
            var entries, error_4;
            var _this = this;
            if (currentPath === void 0) { currentPath = this.projectRoot; }
            if (node === void 0) { node = this.fileTree; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, promises_1.readdir)(currentPath, { withFileTypes: true })];
                    case 1:
                        entries = _a.sent();
                        node.children = [];
                        return [4 /*yield*/, Promise.all(entries.map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                var fullPath, childNode, content;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (this.IGNORED_PATHS.has(entry.name) || entry.name.startsWith('.'))
                                                return [2 /*return*/];
                                            fullPath = (0, path_1.join)(currentPath, entry.name);
                                            if (!entry.isDirectory()) return [3 /*break*/, 2];
                                            childNode = { path: fullPath, type: 'directory' };
                                            node.children.push(childNode);
                                            return [4 /*yield*/, this.buildFileTree(fullPath, childNode)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 4];
                                        case 2:
                                            if (!this.isValidSourceFile(entry.name)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, (0, promises_1.readFile)(fullPath, 'utf-8')];
                                        case 3:
                                            content = _a.sent();
                                            node.children.push({
                                                path: fullPath,
                                                type: 'file',
                                                imports: this.extractImports(content),
                                                exports: this.extractExports(content),
                                            });
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Erro ao processar diret\u00F3rio ".concat(currentPath, ":"), error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.analyzeImports = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, dependencyGraph, _i, files_1, file, dependencies, _a, _b, imp, resolvedPath, missing;
            var _c;
            return __generator(this, function (_d) {
                files = this.getAllFiles();
                dependencyGraph = new Map();
                for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                    file = files_1[_i];
                    if (!((_c = file.imports) === null || _c === void 0 ? void 0 : _c.length))
                        continue;
                    dependencies = new Set();
                    for (_a = 0, _b = file.imports; _a < _b.length; _a++) {
                        imp = _b[_a];
                        resolvedPath = this.resolveImportPath(file.path, imp);
                        if (resolvedPath) {
                            dependencies.add(resolvedPath);
                        }
                        else {
                            missing = this.analysisResult.missingDependencies.get(file.path) || [];
                            missing.push(imp);
                            this.analysisResult.missingDependencies.set(file.path, missing);
                        }
                    }
                    dependencyGraph.set(file.path, dependencies);
                    file.dependencies = dependencies;
                }
                this.detectCircularDependencies(dependencyGraph);
                return [2 /*return*/];
            });
        });
    };
    ProjectAnalyzer.prototype.detectCircularDependencies = function (graph) {
        var _this = this;
        var visited = new Set();
        var recursionStack = new Set();
        var explore = function (node, path) {
            if (path === void 0) { path = []; }
            if (recursionStack.has(node)) {
                var cycle = path.slice(path.indexOf(node));
                _this.analysisResult.circularDependencies.push(cycle);
                return;
            }
            if (visited.has(node))
                return;
            visited.add(node);
            recursionStack.add(node);
            var dependencies = graph.get(node) || new Set();
            for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                var dep = dependencies_1[_i];
                explore(dep, __spreadArray(__spreadArray([], path, true), [node], false));
            }
            recursionStack.delete(node);
        };
        for (var _i = 0, _a = graph.keys(); _i < _a.length; _i++) {
            var node = _a[_i];
            explore(node);
        }
    };
    ProjectAnalyzer.prototype.getAllFiles = function (node) {
        if (node === void 0) { node = this.fileTree; }
        var files = [];
        var traverse = function (n) {
            var _a;
            if (n.type === 'file')
                files.push(n);
            (_a = n.children) === null || _a === void 0 ? void 0 : _a.forEach(traverse);
        };
        traverse(node);
        return files;
    };
    ProjectAnalyzer.prototype.isValidSourceFile = function (name) {
        return this.VALID_EXTENSIONS.has(name.slice(name.lastIndexOf('.')));
    };
    ProjectAnalyzer.prototype.extractImports = function (content) {
        var imports = new Set();
        var regex = /import\s+(?:.*\s+from\s+)?['"]([^'"]+)['"]/g;
        var match;
        while ((match = regex.exec(content)) !== null) {
            imports.add(match[1]);
        }
        return Array.from(imports);
    };
    ProjectAnalyzer.prototype.extractExports = function (content) {
        var exports = new Set();
        var regex = /export\s+(?:default\s+)?(?:class|interface|type|const|function)\s+(\w+)/g;
        var match;
        while ((match = regex.exec(content)) !== null) {
            exports.add(match[1]);
        }
        return Array.from(exports);
    };
    ProjectAnalyzer.prototype.resolveImportPath = function (fromPath, importPath) {
        // Implementação mais robusta da resolução de importação aqui
        return null; // Por enquanto retorna null para simplificar
    };
    // Métodos a serem implementados
    ProjectAnalyzer.prototype.checkStructuralIntegrity = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ProjectAnalyzer.prototype.validateNamingConventions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ProjectAnalyzer.prototype.detectMisplacedFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return ProjectAnalyzer;
}());
exports.ProjectAnalyzer = ProjectAnalyzer;
