"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var _a;
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var node_url_1 = require("node:url");
var node_path_1 = require("node:path");
var node_fs_1 = require("node:fs");
var chalk_1 = require("chalk");
var __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, node_path_1.dirname)(__filename);
var ProjectAnalyzer = /** @class */ (function () {
    function ProjectAnalyzer() {
        this.PROJECT_ROOT = 'BINGO-BET-FUN-2025';
        this.PATHS = {
            src: (0, node_path_1.join)(this.PROJECT_ROOT, 'src'),
            services: (0, node_path_1.join)(this.PROJECT_ROOT, 'src/services'),
            components: (0, node_path_1.join)(this.PROJECT_ROOT, 'src/components'),
            hooks: (0, node_path_1.join)(this.PROJECT_ROOT, 'src/hooks'),
            types: (0, node_path_1.join)(this.PROJECT_ROOT, 'src/types'),
        };
    }
    ProjectAnalyzer.prototype.findFiles = function (dir, extensions) {
        return __awaiter(this, void 0, void 0, function () {
            var files, entries, _i, entries_1, entry, fullPath, _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        files = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, node_fs_1.promises.readdir(dir, { withFileTypes: true })];
                    case 2:
                        entries = _d.sent();
                        _i = 0, entries_1 = entries;
                        _d.label = 3;
                    case 3:
                        if (!(_i < entries_1.length)) return [3 /*break*/, 7];
                        entry = entries_1[_i];
                        fullPath = (0, node_path_1.join)(dir, entry.name);
                        if (!entry.isDirectory()) return [3 /*break*/, 5];
                        _b = (_a = files.push).apply;
                        _c = [files];
                        return [4 /*yield*/, this.findFiles(fullPath, extensions)];
                    case 4:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        return [3 /*break*/, 6];
                    case 5:
                        if (entry.isFile() && extensions.includes((0, node_path_1.extname)(entry.name))) {
                            files.push(fullPath);
                        }
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _d.sent();
                        console.warn(chalk_1.default.yellow("Diret\u00F3rio n\u00E3o encontrado: ".concat(dir)));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, files];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.analyzeServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var services, files, _i, files_1, file, content, analysis, error_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(chalk_1.default.gray('Analisando serviços...'));
                        services = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, this.findFiles(this.PATHS.services, ['.ts'])];
                    case 2:
                        files = _a.sent();
                        _i = 0, files_1 = files;
                        _a.label = 3;
                    case 3:
                        if (!(_i < files_1.length)) return [3 /*break*/, 9];
                        file = files_1[_i];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, node_fs_1.promises.readFile(file, 'utf-8')];
                    case 5:
                        content = _a.sent();
                        return [4 /*yield*/, this.analyzeService(file, content)];
                    case 6:
                        analysis = _a.sent();
                        services.push(analysis);
                        console.log(chalk_1.default.gray(" \u2713 Analisado: ".concat(file)));
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        console.warn(chalk_1.default.yellow(" \u26A0\uFE0F Erro ao analisar ".concat(file, ":"), error_2));
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_3 = _a.sent();
                        console.warn(chalk_1.default.yellow('Erro ao buscar serviços:', error_3));
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, services];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.analyzeHooks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hooks, files, _i, files_2, file, content, analysis, error_4, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(chalk_1.default.gray('Analisando hooks...'));
                        hooks = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, this.findFiles(this.PATHS.hooks, ['.ts', '.tsx'])];
                    case 2:
                        files = _a.sent();
                        _i = 0, files_2 = files;
                        _a.label = 3;
                    case 3:
                        if (!(_i < files_2.length)) return [3 /*break*/, 9];
                        file = files_2[_i];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, node_fs_1.promises.readFile(file, 'utf-8')];
                    case 5:
                        content = _a.sent();
                        return [4 /*yield*/, this.analyzeHook(file, content)];
                    case 6:
                        analysis = _a.sent();
                        hooks.push(analysis);
                        console.log(chalk_1.default.gray(" \u2713 Analisado: ".concat(file)));
                        return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        console.warn(chalk_1.default.yellow(" \u26A0\uFE0F Erro ao analisar ".concat(file, ":"), error_4));
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_5 = _a.sent();
                        console.warn(chalk_1.default.yellow('Erro ao buscar hooks:', error_5));
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, hooks];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.analyzeTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var types, files, _i, files_3, file, content, analysis, error_6, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(chalk_1.default.gray('Analisando tipos...'));
                        types = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, this.findFiles(this.PATHS.types, ['.ts'])];
                    case 2:
                        files = _a.sent();
                        _i = 0, files_3 = files;
                        _a.label = 3;
                    case 3:
                        if (!(_i < files_3.length)) return [3 /*break*/, 9];
                        file = files_3[_i];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, node_fs_1.promises.readFile(file, 'utf-8')];
                    case 5:
                        content = _a.sent();
                        return [4 /*yield*/, this.analyzeType(file, content)];
                    case 6:
                        analysis = _a.sent();
                        types.push(analysis);
                        console.log(chalk_1.default.gray(" \u2713 Analisado: ".concat(file)));
                        return [3 /*break*/, 8];
                    case 7:
                        error_6 = _a.sent();
                        console.warn(chalk_1.default.yellow(" \u26A0\uFE0F Erro ao analisar ".concat(file, ":"), error_6));
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_7 = _a.sent();
                        console.warn(chalk_1.default.yellow('Erro ao buscar tipos:', error_7));
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, types];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.getFileName = function (path) {
        var _a;
        return ((_a = path.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace(/\.[^/.]+$/, '')) || '';
    };
    ProjectAnalyzer.prototype.extractImports = function (content) {
        var importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
        var imports = [];
        var match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        return imports;
    };
    ProjectAnalyzer.prototype.extractExports = function (content) {
        var exportRegex = /export\s+(?:default\s+)?(?:const|function|class|interface|type)\s+(\w+)/g;
        var exports = [];
        var match;
        while ((match = exportRegex.exec(content)) !== null) {
            exports.push(match[1]);
        }
        return exports;
    };
    ProjectAnalyzer.prototype.analyzeDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dependencies, packageJson, _a, _b, allFiles, _loop_1, this_1, _i, allFiles_1, file, error_8;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        dependencies = new Map();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 8, , 9]);
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, node_fs_1.promises.readFile((0, node_path_1.join)(this.PROJECT_ROOT, 'package.json'), 'utf-8')];
                    case 2:
                        packageJson = _b.apply(_a, [_c.sent()]);
                        // Add all dependencies from package.json
                        __spreadArray(__spreadArray([], Object.keys(packageJson.dependencies || {}), true), Object.keys(packageJson.devDependencies || {}), true).forEach(function (dep) {
                            dependencies.set(dep, new Set());
                        });
                        return [4 /*yield*/, this.findFiles(this.PATHS.src, ['.ts', '.tsx', '.js', '.jsx'])];
                    case 3:
                        allFiles = _c.sent();
                        _loop_1 = function (file) {
                            var content, imports;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, node_fs_1.promises.readFile(file, 'utf-8')];
                                    case 1:
                                        content = _d.sent();
                                        imports = this_1.extractImports(content);
                                        imports.forEach(function (imp) {
                                            var _a;
                                            var depName = imp.split('/')[0];
                                            if (dependencies.has(depName)) {
                                                (_a = dependencies.get(depName)) === null || _a === void 0 ? void 0 : _a.add(file);
                                            }
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, allFiles_1 = allFiles;
                        _c.label = 4;
                    case 4:
                        if (!(_i < allFiles_1.length)) return [3 /*break*/, 7];
                        file = allFiles_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_8 = _c.sent();
                        console.warn(chalk_1.default.yellow('Erro ao analisar dependências:', error_8));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, Array.from(dependencies.entries()).map(function (_a) {
                            var name = _a[0], locations = _a[1];
                            return ({
                                name: name,
                                usageCount: locations.size,
                                locations: Array.from(locations)
                            });
                        })];
                }
            });
        });
    };
    ProjectAnalyzer.prototype.generateOverview = function (components, services, hooks, types) {
        var issues = {
            high: 0,
            medium: 0,
            low: 0
        };
        // Count issues
        __spreadArray(__spreadArray(__spreadArray(__spreadArray([], components, true), services, true), hooks, true), types, true).forEach(function (item) {
            item.issues.forEach(function (issue) {
                issues[issue.severity]++;
            });
        });
        return {
            totalFiles: components.length + services.length + hooks.length + types.length,
            totalSize: __spreadArray(__spreadArray(__spreadArray(__spreadArray([], components, true), services, true), hooks, true), types, true).reduce(function (acc, curr) { return acc + ('size' in curr ? curr.size : 0); }, 0),
            componentsCount: components.length,
            servicesCount: services.length,
            hooksCount: hooks.length,
            typesCount: types.length,
            issues: issues
        };
    };
    ProjectAnalyzer.prototype.generateSuggestions = function (components, services, hooks, types) {
        var suggestions = [];
        // Análise de complexidade dos componentes
        var complexComponents = components.filter(function (c) { return c.complexity.complexity > 10; });
        if (complexComponents.length > 0) {
            suggestions.push({
                category: 'Complexidade',
                description: "".concat(complexComponents.length, " componentes t\u00EAm alta complexidade. Considere refator\u00E1-los."),
                priority: 'high'
            });
        }
        // Análise de cobertura de tipos
        if (types.length < services.length) {
            suggestions.push({
                category: 'Tipagem',
                description: 'Alguns serviços podem estar sem definições de tipos correspondentes.',
                priority: 'medium'
            });
        }
        // Análise de reutilização de hooks
        var hookUsage = new Map();
        components.forEach(function (c) {
            c.hooks.forEach(function (h) {
                hookUsage.set(h, (hookUsage.get(h) || 0) + 1);
            });
        });
        var frequentHooks = Array.from(hookUsage.entries())
            .filter(function (_a) {
            var _ = _a[0], count = _a[1];
            return count > 3;
        });
        if (frequentHooks.length > 0) {
            suggestions.push({
                category: 'Hooks',
                description: 'Considere criar hooks customizados para lógica frequentemente reutilizada.',
                priority: 'medium'
            });
        }
        return suggestions;
    };
    return ProjectAnalyzer;
}());
;
async;
analyzeProject();
Promise < ProjectAnalysis > {
    console: console,
    : .log(chalk_1.default.blue('\n🔍 Iniciando análise do projeto BINGO-BET-FUN-2025...\n')),
    const: components = await this.analyzeComponents(),
    const: services = await this.analyzeServices(),
    const: hooks = await this.analyzeHooks(),
    const: types = await this.analyzeTypes(),
    const: analysis,
    ProjectAnalysis: ProjectAnalysis,
    await: await,
    this: .generateReport(analysis),
    return: analysis
};
async;
analyzeComponents();
Promise < ComponentAnalysis[] > (_a = {
        console: console,
        : .log(chalk_1.default.gray('Analisando componentes...')),
        const: components,
        ComponentAnalysis: ComponentAnalysis
    },
    _a[] =  = [],
    _a.try = {
        const: files = await this.findFiles(this.PATHS.components, ['.tsx', '.jsx']),
        for: function (, file, of, files) {
            try {
                var content = yield node_fs_1.promises.readFile(file, 'utf-8');
                var analysis = yield this.analyzeComponent(file, content);
                components.push(analysis);
                console.log(chalk_1.default.gray(" \u2713 Analisado: ".concat(file)));
            }
            catch (error) {
                console.warn(chalk_1.default.yellow(" \u26A0\uFE0F Erro ao analisar ".concat(file, ":"), error));
            }
        }
    },
    _a.catch = function (error) {
        console.warn(chalk_1.default.yellow('Erro ao buscar componentes:', error));
    },
    _a.return = components,
    _a);
async;
analyzeComponent(file, string, content, string);
Promise < ComponentAnalysis > {
    const: name = this.getFileName(file),
    const: imports = this.extractImports(content),
    const: exports = this.extractExports(content),
    const: hooks = this.extractHooks(content),
    const: props = this.extractProps(content),
    const: complexity = {
        lines: content.split('\n').length,
        functions: (content.match(/function|=>|\{/g) || []).length,
        conditionals: (content.match(/if|else|switch|case|\?|&&|\|\|/g) || []).length,
        complexity: this.calculateCyclomaticComplexity(content),
    },
    const: issues = this.analyzeComponentIssues(content, hooks, props),
    return: {
        name: name,
        path: file,
        size: Buffer.from(content).length,
        imports: imports,
        exports: exports,
        hooks: hooks,
        props: props,
        complexity: complexity,
        issues: issues,
    }
};
calculateCyclomaticComplexity(content, string);
number;
{
    var decisions = (content.match(/if|else if|else|for|while|switch|case|\?|&&|\|\||catch/g) || []).length;
    return decisions + 1; // Base complexity of 1
}
extractProps(content, string);
{
    required: string[];
    optional: string[];
}
{
    var propsInterface = content.match(/interface\s+\w*Props\s*\{([^}]+)\}/);
    var required_1 = [];
    var optional_1 = [];
    if (propsInterface) {
        var propsContent = propsInterface[1];
        var propLines = propsContent.split('\n');
        propLines.forEach(function (line) {
            var propMatch = line.match(/(\w+)(\?)?:/);
            if (propMatch) {
                var name_1 = propMatch[1], optional_ = propMatch[2];
                if (optional_) {
                    optional_1.push(name_1);
                }
                else {
                    required_1.push(name_1);
                }
            }
        });
    }
    return { required: required_1, optional: optional_1 };
}
analyzeComponentIssues(content, string, hooks, string[], props ?  : { required: string[], optional: string[] });
ComponentAnalysis['issues'];
{
    var issues = [];
    // Tamanho do arquivo
    var lines = content.split('\n').length;
    if (lines > 300) {
        issues.push({
            severity: 'high',
            message: 'Componente muito grande',
            suggestion: 'Divida em componentes menores ou extraia lógica para hooks/utils',
        });
    }
    // Complexidade
    var complexity = this.calculateCyclomaticComplexity(content);
    if (complexity > 15) {
        issues.push({
            severity: 'high',
            message: 'Alta complexidade ciclomática',
            suggestion: 'Simplifique a lógica ou divida em componentes menores',
        });
    }
    // Uso de hooks
    if (hooks.length > 7) {
        issues.push({
            severity: 'medium',
            message: 'Muitos hooks em uso',
            suggestion: 'Considere extrair lógica para hooks customizados',
        });
    }
    // Props obrigatórias
    if (props && props.required.length > 5) {
        issues.push({
            severity: 'medium',
            message: 'Muitas props obrigatórias',
            suggestion: 'Use composição ou context para reduzir o número de props',
        });
    }
    // Renderização condicional
    var conditionalRenders = (content.match(/\{.*\?.*:.*\}/g) || []).length;
    if (conditionalRenders > 5) {
        issues.push({
            severity: 'low',
            message: 'Muitas renderizações condicionais',
            suggestion: 'Extraia lógica para componentes separados',
        });
    }
    return issues;
}
extractHooks(content, string);
string[];
{
    var builtInHooks = [
        'useState',
        'useEffect',
        'useContext',
        'useReducer',
        'useCallback',
        'useMemo',
        'useRef',
    ];
    var customHookRegex = /use[A-Z]\w+/g;
    var customHooks = content.match(customHookRegex) || [];
    return __spreadArray([], new Set(__spreadArray(__spreadArray([], builtInHooks.filter(function (hook) { return content.includes(hook); }), true), customHooks, true)), true);
}
async;
analyzeService(file, string, content, string);
Promise < ServiceAnalysis > {
    const: name = this.getFileName(file),
    const: methods = this.extractMethods(content),
    const: dependencies = this.extractImports(content),
    const: issues = this.analyzeServiceIssues(content, methods),
    return: {
        name: name,
        path: file,
        methods: methods,
        dependencies: dependencies,
        issues: issues,
    }
};
async;
analyzeHook(file, string, content, string);
Promise < HookAnalysis > {
    const: name = this.getFileName(file),
    const: dependencies = this.extractImports(content),
    const: params = this.extractParams(content),
    const: returnType = this.extractReturnType(content),
    const: useEffects = (content.match(/useEffect/g) || []).length,
    const: useStates = (content.match(/useState/g) || []).length,
    const: customHooks = this.extractCustomHooks(content),
    const: issues = this.analyzeHookIssues(content),
    return: {
        name: name,
        path: file,
        dependencies: dependencies,
        params: params,
        returnType: returnType,
        useEffects: useEffects,
        useStates: useStates,
        customHooks: customHooks,
        issues: issues,
    }
};
async;
analyzeType(file, string, content, string);
Promise < TypeAnalysis > {
    const: name = this.getFileName(file),
    const: exports = this.extractTypeExports(content),
    const: dependencies = this.extractImports(content),
    const: issues = this.analyzeTypeIssues(content),
    return: {
        name: name,
        path: file,
        exports: exports,
        dependencies: dependencies,
        issues: issues,
    }
};
extractMethods(content, string);
ServiceAnalysis['methods'];
{
    var methodRegex = /(?:public|private)?\s*async?\s+(\w+)\s*\((.*?)\)(?:\s*:\s*([^{]+))?/g;
    var methods = [];
    var match = void 0;
    while ((match = methodRegex.exec(content)) !== null) {
        var name_2 = match[1], params = match[2], returnType = match[3];
        methods.push({
            name: name_2,
            params: params
                .split(',')
                .map(function (p) { return p.trim(); })
                .filter(Boolean),
            returnType: (returnType === null || returnType === void 0 ? void 0 : returnType.trim()) || 'void',
            complexity: this.calculateMethodComplexity(content, name_2),
        });
    }
    return methods;
}
calculateMethodComplexity(content, string, methodName, string);
number;
{
    // Simplified complexity calculation
    var methodContent = this.extractMethodContent(content, methodName);
    return this.calculateCyclomaticComplexity(methodContent);
}
extractMethodContent(content, string, methodName, string);
string;
{
    var methodRegex = new RegExp("\\b".concat(methodName, "\\s*\\([^)]*\\)\\s*{([^}]+)}"));
    var match = methodRegex.exec(content);
    return match ? match[1] : '';
}
extractParams(content, string);
string[];
{
    var paramRegex = /\((.*?)\)/;
    var match = content.match(paramRegex);
    if (!match)
        return [];
    return match[1]
        .split(',')
        .map(function (p) { return p.trim(); })
        .filter(Boolean);
}
extractReturnType(content, string);
string;
{
    var returnTypeRegex = /\):\s*([^{]+)/;
    var match = content.match(returnTypeRegex);
    return match ? match[1].trim() : 'void';
}
extractCustomHooks(content, string);
string[];
{
    var hookRegex = /use[A-Z]\w+/g;
    var hooks = content.match(hookRegex) || [];
    return hooks.filter(function (hook) { return !['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'].includes(hook); });
}
extractTypeExports(content, string);
TypeAnalysis['exports'];
{
    var exports_1 = [];
    var interfaceRegex = /interface\s+(\w+)/g;
    var typeRegex = /type\s+(\w+)/g;
    var enumRegex = /enum\s+(\w+)/g;
    var match = void 0;
    while ((match = interfaceRegex.exec(content)) !== null) {
        exports_1.push({
            name: match[1],
            kind: 'interface',
            properties: this.countProperties(content, match[1]),
        });
    }
    while ((match = typeRegex.exec(content)) !== null) {
        exports_1.push({
            name: match[1],
            kind: 'type',
            properties: this.countProperties(content, match[1]),
        });
    }
    while ((match = enumRegex.exec(content)) !== null) {
        exports_1.push({
            name: match[1],
            kind: 'enum',
            properties: this.countProperties(content, match[1]),
        });
    }
    return exports_1;
}
countProperties(content, string, typeName, string);
number;
{
    var typeContent = this.extractTypeContent(content, typeName);
    return (typeContent.match(/\w+\s*:/g) || []).length;
}
extractTypeContent(content, string, typeName, string);
string;
{
    var typeRegex = new RegExp("\\b".concat(typeName, "\\s*{([^}]+)}"));
    var match = typeRegex.exec(content);
    return match ? match[1] : '';
}
analyzeServiceIssues(content, string, methods, ServiceAnalysis['methods']);
ServiceAnalysis['issues'];
{
    var issues_1 = [];
    // Complexidade dos métodos
    methods.forEach(function (method) {
        if (method.complexity > 10) {
            issues_1.push({
                severity: 'high',
                message: "M\u00E9todo ".concat(method.name, " tem alta complexidade"),
                suggestion: 'Considere dividir em métodos menores',
            });
        }
    });
    // Tamanho do serviço
    if (methods.length > 10) {
        issues_1.push({
            severity: 'medium',
            message: 'Serviço com muitos métodos',
            suggestion: 'Considere dividir em múltiplos serviços',
        });
    }
    return issues_1;
}
analyzeHookIssues(content, string);
HookAnalysis['issues'];
{
    var issues = [];
    // Muitos useEffects
    var useEffectCount = (content.match(/useEffect/g) || []).length;
    if (useEffectCount > 3) {
        issues.push({
            severity: 'medium',
            message: 'Hook com muitos useEffects',
            suggestion: 'Considere dividir em múltiplos hooks',
        });
    }
    // Complexidade
    if (this.calculateCyclomaticComplexity(content) > 5) {
        issues.push({
            severity: 'high',
            message: 'Hook muito complexo',
            suggestion: 'Simplifique a lógica ou divida em múltiplos hooks',
        });
    }
    return issues;
}
analyzeTypeIssues(content, string);
TypeAnalysis['issues'];
{
    var issues_2 = [];
    // Interfaces muito grandes
    var interfaceMatches = content.match(/interface\s+\w+\s*{[^}]+}/g) || [];
    interfaceMatches.forEach(function (interfaceContent) {
        var propertyCount = (interfaceContent.match(/\w+\s*:/g) || []).length;
        if (propertyCount > 10) {
            issues_2.push({
                severity: 'medium',
                message: 'Interface muito grande',
                suggestion: 'Considere dividir em interfaces menores',
            });
        }
    });
    return issues_2;
}
async;
generateReport(analysis, {
    components: FileAnalysis[],
    services: FileAnalysis[],
    hooks: FileAnalysis[],
    types: FileAnalysis[]
});
Promise < void  > {
    console: console,
    : .log(chalk_1.default.blue('\n📊 Gerando relatório...\n')),
    const: reportPath = (0, node_path_1.join)(this.PROJECT_ROOT, 'analysis-report.html'),
    const: report = this.generateHTMLReport(analysis),
    await: await,
    fs: node_fs_1.promises,
    : .writeFile(reportPath, report),
    console: console,
    : .log(chalk_1.default.green("\u2728 Relat\u00F3rio gerado em ".concat(reportPath)))
};
generateHTMLReport(analysis, {
    components: FileAnalysis[],
    services: FileAnalysis[],
    hooks: FileAnalysis[],
    types: FileAnalysis[]
});
string;
{
    return "<!DOCTYPE html>\n    <html lang=\"pt-BR\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>An\u00E1lise do Projeto BINGO-BET-FUN-2025</title>\n        <script src=\"https://cdn.tailwindcss.com\"></script>\n        <script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js\"></script>\n    </head>\n    <body class=\"bg-gray-100 min-h-screen\">\n        <div class=\"container mx-auto px-4 py-8\">\n            <header class=\"mb-12 text-center\">\n                <h1 class=\"text-4xl font-bold mb-4 text-gray-800\">An\u00E1lise do Projeto BINGO-BET-FUN-2025</h1>\n                <p class=\"text-gray-600\">Relat\u00F3rio gerado em ".concat(new Date().toLocaleDateString(), "</p>\n            </header>\n\n            <!-- Dashboard -->\n            <div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12\">\n                <div class=\"bg-white rounded-lg shadow-md p-6\">\n                    <h3 class=\"text-lg font-semibold mb-2 text-blue-600\">Componentes</h3>\n                    <p class=\"text-3xl font-bold\">").concat(analysis.components.length, "</p>\n                </div>\n                <div class=\"bg-white rounded-lg shadow-md p-6\">\n                    <h3 class=\"text-lg font-semibold mb-2 text-green-600\">Servi\u00E7os</h3>\n                    <p class=\"text-3xl font-bold\">").concat(analysis.services.length, "</p>\n                </div>\n                <div class=\"bg-white rounded-lg shadow-md p-6\">\n                    <h3 class=\"text-lg font-semibold mb-2 text-purple-600\">Hooks</h3>\n                    <p class=\"text-3xl font-bold\">").concat(analysis.hooks.length, "</p>\n                </div>\n                <div class=\"bg-white rounded-lg shadow-md p-6\">\n                    <h3 class=\"text-lg font-semibold mb-2 text-yellow-600\">Tipos</h3>\n                    <p class=\"text-3xl font-bold\">").concat(analysis.types.length, "</p>\n                </div>\n            </div>\n\n            <!-- Issues Summary -->\n            <div class=\"bg-white rounded-lg shadow-md p-6 mb-12\">\n                <h2 class=\"text-2xl font-bold mb-6\">Problemas Encontrados</h2>\n                <div class=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n                    ").concat(this.generateIssuesSummaryHTML(analysis), "\n                </div>\n            </div>\n\n            <!-- Components Analysis -->\n            <div class=\"bg-white rounded-lg shadow-md p-6 mb-12\">\n                <h2 class=\"text-2xl font-bold mb-6\">An\u00E1lise de Componentes</h2>\n                <div class=\"overflow-x-auto\">\n                    <table class=\"min-w-full table-auto\">\n                        <thead class=\"bg-gray-50\">\n                            <tr>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Nome</th>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Tamanho</th>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Depend\u00EAncias</th>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Issues</th>\n                            </tr>\n                        </thead>\n                        <tbody class=\"bg-white divide-y divide-gray-200\">\n                            ").concat(this.generateComponentsTableHTML(analysis.components), "\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n\n            <!-- Services Analysis -->\n            <div class=\"bg-white rounded-lg shadow-md p-6 mb-12\">\n                <h2 class=\"text-2xl font-bold mb-6\">An\u00E1lise de Servi\u00E7os</h2>\n                <div class=\"overflow-x-auto\">\n                    <table class=\"min-w-full table-auto\">\n                        <thead class=\"bg-gray-50\">\n                            <tr>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Nome</th>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Tamanho</th>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Depend\u00EAncias</th>\n                                <th class=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">Issues</th>\n                            </tr>\n                        </thead>\n                        <tbody class=\"bg-white divide-y divide-gray-200\">\n                            ").concat(this.generateServicesTableHTML(analysis.services), "\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n\n            <!-- Recommendations -->\n            <div class=\"bg-white rounded-lg shadow-md p-6 mb-12\">\n                <h2 class=\"text-2xl font-bold mb-6\">Recomenda\u00E7\u00F5es</h2>\n                <div class=\"space-y-4\">\n                    ").concat(this.generateRecommendationsHTML(analysis), "\n                </div>\n            </div>\n\n            <!-- Charts -->\n            <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6 mb-12\">\n                <div class=\"bg-white rounded-lg shadow-md p-6\">\n                    <h2 class=\"text-xl font-bold mb-4\">Distribui\u00E7\u00E3o de Issues</h2>\n                    <canvas id=\"issuesChart\"></canvas>\n                </div>\n                <div class=\"bg-white rounded-lg shadow-md p-6\">\n                    <h2 class=\"text-xl font-bold mb-4\">Tamanho dos Arquivos</h2>\n                    <canvas id=\"sizeChart\"></canvas>\n                </div>\n            </div>\n        </div>\n\n        <script>\n            // Configura\u00E7\u00E3o dos gr\u00E1ficos\n            const issuesCtx = document.getElementById('issuesChart').getContext('2d');\n            const sizeCtx = document.getElementById('sizeChart').getContext('2d');\n\n            new Chart(issuesCtx, {\n                type: 'doughnut',\n                data: {\n                    labels: ['Alta', 'M\u00E9dia', 'Baixa'],\n                    datasets: [{\n                        data: [\n                            ").concat(this.countIssuesBySeverity(analysis, 'high'), ",\n                            ").concat(this.countIssuesBySeverity(analysis, 'medium'), ",\n                            ").concat(this.countIssuesBySeverity(analysis, 'low'), "\n                        ],\n                        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6']\n                    }]\n                },\n                options: {\n                    responsive: true,\n                    plugins: {\n                        legend: {\n                            position: 'bottom'\n                        }\n                    }\n                }\n            });\n\n            new Chart(sizeCtx, {\n                type: 'bar',\n                data: {\n                    labels: ['Componentes', 'Servi\u00E7os', 'Hooks', 'Tipos'],\n                    datasets: [{\n                        label: 'Tamanho M\u00E9dio (KB)',\n                        data: [\n                            ").concat(this.calculateAverageSize(analysis.components), ",\n                            ").concat(this.calculateAverageSize(analysis.services), ",\n                            ").concat(this.calculateAverageSize(analysis.hooks), ",\n                            ").concat(this.calculateAverageSize(analysis.types), "\n                        ],\n                        backgroundColor: ['#93C5FD', '#86EFAC', '#C4B5FD', '#FDE68A']\n                    }]\n                },\n                options: {\n                    responsive: true,\n                    plugins: {\n                        legend: {\n                            display: false\n                        }\n                    },\n                    scales: {\n                        y: {\n                            beginAtZero: true\n                        }\n                    }\n                }\n            });\n        </script>\n    </body>\n    </html>");
}
generateIssuesSummaryHTML(analysis, {
    components: FileAnalysis[],
    services: FileAnalysis[],
    hooks: FileAnalysis[],
    types: FileAnalysis[]
});
string;
{
    var allIssues = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], analysis.components, true), analysis.services, true), analysis.hooks, true), analysis.types, true).flatMap(function (item) { return item.issues; });
    var highCount = allIssues.filter(function (issue) { return issue.severity === 'high'; }).length;
    var mediumCount = allIssues.filter(function (issue) { return issue.severity === 'medium'; }).length;
    var lowCount = allIssues.filter(function (issue) { return issue.severity === 'low'; }).length;
    return "\n        <div class=\"bg-red-50 rounded-lg p-6\">\n            <h3 class=\"text-red-800 font-semibold mb-2\">Alta Prioridade</h3>\n            <p class=\"text-3xl font-bold text-red-600\">".concat(highCount, "</p>\n        </div>\n        <div class=\"bg-yellow-50 rounded-lg p-6\">\n            <h3 class=\"text-yellow-800 font-semibold mb-2\">M\u00E9dia Prioridade</h3>\n            <p class=\"text-3xl font-bold text-yellow-600\">").concat(mediumCount, "</p>\n        </div>\n        <div class=\"bg-blue-50 rounded-lg p-6\">\n            <h3 class=\"text-blue-800 font-semibold mb-2\">Baixa Prioridade</h3>\n            <p class=\"text-3xl font-bold text-blue-600\">").concat(lowCount, "</p>\n        </div>");
}
generateComponentsTableHTML(components, FileAnalysis[]);
string;
{
    return components.map(function (comp) { return "\n        <tr>\n            <td class=\"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900\">".concat(comp.name, "</td>\n            <td class=\"px-6 py-4 whitespace-nowrap text-sm text-gray-500\">").concat(Math.round(comp.size / 1024), " KB</td>\n            <td class=\"px-6 py-4 whitespace-nowrap text-sm text-gray-500\">").concat(comp.dependencies.length, "</td>\n            <td class=\"px-6 py-4 whitespace-nowrap\">\n                ").concat(_this.generateIssuesBadgesHTML(comp.issues), "\n            </td>\n        </tr>"); }).join('');
}
generateServicesTableHTML(services, FileAnalysis[]);
string;
{
    return services.map(function (service) { return "\n        <tr>\n            <td class=\"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900\">".concat(service.name, "</td>\n            <td class=\"px-6 py-4 whitespace-nowrap text-sm text-gray-500\">").concat(Math.round(service.size / 1024), " KB</td>\n            <td class=\"px-6 py-4 whitespace-nowrap text-sm text-gray-500\">").concat(service.dependencies.length, "</td>\n            <td class=\"px-6 py-4 whitespace-nowrap\">\n                ").concat(_this.generateIssuesBadgesHTML(service.issues), "\n            </td>\n        </tr>"); }).join('');
}
generateIssuesBadgesHTML(issues, FileAnalysis['issues']);
string;
{
    var highCount = issues.filter(function (i) { return i.severity === 'high'; }).length;
    var mediumCount = issues.filter(function (i) { return i.severity === 'medium'; }).length;
    var lowCount = issues.filter(function (i) { return i.severity === 'low'; }).length;
    return "\n        ".concat(highCount ? "<span class=\"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800\">".concat(highCount, " Alta</span>") : '', "\n        ").concat(mediumCount ? "<span class=\"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800\">".concat(mediumCount, " M\u00E9dia</span>") : '', "\n        ").concat(lowCount ? "<span class=\"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800\">".concat(lowCount, " Baixa</span>") : '');
}
generateRecommendationsHTML(analysis, {
    components: FileAnalysis[],
    services: FileAnalysis[],
    hooks: FileAnalysis[],
    types: FileAnalysis[]
});
string;
{
    var recommendations = this.generateRecommendationsSection(analysis).split('\n');
    return recommendations.map(function (rec) { return "\n        <div class=\"bg-green-50 rounded-lg p-4\">\n            <p class=\"text-green-800\">".concat(rec, "</p>\n        </div>"); }).join('');
}
countIssuesBySeverity(analysis, {
    components: FileAnalysis[],
    services: FileAnalysis[],
    hooks: FileAnalysis[],
    types: FileAnalysis[]
}, severity, 'high' | 'medium' | 'low');
number;
{
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], analysis.components, true), analysis.services, true), analysis.hooks, true), analysis.types, true).flatMap(function (item) { return item.issues; }).filter(function (issue) { return issue.severity === severity; }).length;
}
calculateAverageSize(items, FileAnalysis[]);
number;
{
    if (items.length === 0)
        return 0;
    var totalSize = items.reduce(function (acc, item) { return acc + item.size; }, 0);
    return Math.round(totalSize / items.length / 1024); // Converter para KB
}
";\n\n    await fs.writeFile(reportPath, reportHTML);\n    console.log(chalk.green(";
n;
Relatório;
gerado;
em;
$;
{
    reportPath;
}
n(templateObject_1 || (templateObject_1 = __makeTemplateObject(["));\n  }\n}\n\n// Executar a an\u00E1lise\nconst analyzer = new ProjectAnalyzer();\nanalyzer.analyzeProject().catch((error) => {\n  console.error(chalk.red('Erro durante a an\u00E1lise:'), error);\n  process.exit(1);\n});\n"], ["));\n  }\n}\n\n// Executar a an\u00E1lise\nconst analyzer = new ProjectAnalyzer();\nanalyzer.analyzeProject().catch((error) => {\n  console.error(chalk.red('Erro durante a an\u00E1lise:'), error);\n  process.exit(1);\n});\n"])));
var templateObject_1;
