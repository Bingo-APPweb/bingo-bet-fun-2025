#!/usr/bin/env node
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
var commander_1 = require("commander");
var chalk_1 = require("chalk");
var ora_1 = require("ora");
var Runner_1 = require("../src/core/Runner");
var auth_1 = require("../src/auth");
var config_1 = require("../src/utils/config");
var program = new commander_1.Command();
program
    .version('1.0.0')
    .description('BingoBetFun code maintainer and analyzer');
program
    .command('check')
    .description('Run a basic check on the codebase')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, config, auth, runner, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = (0, ora_1.default)('Running code check...').start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, config_1.loadConfig)()];
            case 2:
                config = _a.sent();
                auth = new auth_1.MaintainerAuth(process.env.MAINTAINER_SECRET || 'default-secret');
                runner = new Runner_1.MaintainerRunner(config, auth);
                runner.on('health-check', function (health) {
                    spinner.text = "Analyzing... Complexity: ".concat(health.complexity);
                });
                return [4 /*yield*/, runner.run()];
            case 3:
                _a.sent();
                spinner.succeed('Check completed');
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                spinner.fail(chalk_1.default.red("Check failed: ".concat(error_1.message)));
                process.exit(1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
program
    .command('watch')
    .description('Watch for changes and run continuous analysis')
    .option('--fix', 'Automatically fix issues when possible')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var config, auth, runner, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(chalk_1.default.blue('Starting watch mode...'));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, config_1.loadConfig)()];
            case 2:
                config = _a.sent();
                config.autofix = options.fix;
                auth = new auth_1.MaintainerAuth(process.env.MAINTAINER_SECRET || 'default-secret');
                runner = new Runner_1.MaintainerRunner(config, auth);
                runner.on('health-check', function (health) {
                    console.log(chalk_1.default.green("Health check completed: ".concat(health.timestamp)));
                });
                runner.watch();
                console.log(chalk_1.default.green('Watching for changes...'));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error(chalk_1.default.red("Watch mode failed: ".concat(error_2.message)));
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program
    .command('analyze <file>')
    .description('Analyze a specific file')
    .option('-d, --detailed', 'Show detailed analysis')
    .action(function (file, options) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, config, auth, runner, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = (0, ora_1.default)("Analyzing ".concat(file, "...")).start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, config_1.loadConfig)()];
            case 2:
                config = _a.sent();
                auth = new auth_1.MaintainerAuth(process.env.MAINTAINER_SECRET || 'default-secret');
                runner = new Runner_1.MaintainerRunner(config, auth);
                return [4 /*yield*/, runner.analyzeFile(file)];
            case 3:
                result = _a.sent();
                spinner.stop();
                if (options.detailed) {
                    console.log(chalk_1.default.blue('Detailed Analysis:'));
                    console.log(JSON.stringify(result, null, 2));
                }
                else {
                    console.log(chalk_1.default.green('Analysis Summary:'));
                    console.log("Complexity: ".concat(result.complexity));
                    console.log("Issues: ".concat(result.issues.length));
                }
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                spinner.fail(chalk_1.default.red("Analysis failed: ".concat(error_3.message)));
                process.exit(1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
program.parse(process.argv);
