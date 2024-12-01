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
exports.DuplicationAnalyzer = void 0;
// src/core/analyzers/DuplicationAnalyzer.ts
var BaseAnalyzer_1 = require("./BaseAnalyzer");
var crypto_1 = require("crypto");
var DuplicationAnalyzer = /** @class */ (function (_super) {
    __extends(DuplicationAnalyzer, _super);
    function DuplicationAnalyzer(config) {
        var _a, _b;
        var _this = _super.call(this, config) || this;
        _this.minDuplicationLength = ((_a = config.duplication) === null || _a === void 0 ? void 0 : _a.minLength) || 5;
        _this.similarityThreshold = ((_b = config.duplication) === null || _b === void 0 ? void 0 : _b.similarityThreshold) || 0.9;
        _this.codeBlockMap = new Map();
        return _this;
    }
    DuplicationAnalyzer.prototype.analyze = function (code, filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var lines, duplications, processedHashes, i, j, block, hash, similarBlocks;
            return __generator(this, function (_a) {
                lines = code.split('\n');
                duplications = [];
                processedHashes = new Set();
                // Analyze code blocks for duplications
                for (i = 0; i < lines.length - this.minDuplicationLength + 1; i++) {
                    for (j = this.minDuplicationLength; j <= Math.min(30, lines.length - i); j++) {
                        block = lines.slice(i, i + j).join('\n');
                        hash = this.hashCode(block);
                        if (processedHashes.has(hash))
                            continue;
                        processedHashes.add(hash);
                        similarBlocks = this.findSimilarBlocks(block, filePath);
                        if (similarBlocks.length > 1) {
                            duplications.push({
                                code: block,
                                locations: similarBlocks.map(function (b) { return b.location; }),
                                lineCount: j,
                                similarity: similarBlocks[0].similarity,
                            });
                        }
                    }
                }
                return [2 /*return*/, {
                        filePath: filePath,
                        timestamp: Date.now(),
                        duplications: duplications,
                        metrics: {
                            totalDuplications: duplications.length,
                            duplicatedLines: this.calculateDuplicatedLines(duplications),
                            largestDuplication: this.findLargestDuplication(duplications),
                        },
                        suggestions: this.generateSuggestions(duplications),
                    }];
            });
        });
    };
    DuplicationAnalyzer.prototype.hashCode = function (text) {
        return (0, crypto_1.createHash)('md5').update(text).digest('hex');
    };
    DuplicationAnalyzer.prototype.findSimilarBlocks = function (block, currentFile) {
        var _this = this;
        var similarBlocks = [];
        var blockTokens = this.tokenize(block);
        this.codeBlockMap.forEach(function (blocks, file) {
            if (file !== currentFile) {
                blocks.forEach(function (existingBlock) {
                    var similarity = _this.calculateSimilarity(blockTokens, _this.tokenize(existingBlock.code));
                    if (similarity >= _this.similarityThreshold) {
                        similarBlocks.push({
                            location: "".concat(file, ":").concat(existingBlock.location),
                            similarity: similarity,
                        });
                    }
                });
            }
        });
        return similarBlocks;
    };
    DuplicationAnalyzer.prototype.tokenize = function (code) {
        // Simple tokenization - could be enhanced with a proper parser
        return code.split(/[\s,{}()[\];]/).filter(function (token) { return token.length > 0; });
    };
    DuplicationAnalyzer.prototype.calculateSimilarity = function (tokens1, tokens2) {
        var set1 = new Set(tokens1);
        var set2 = new Set(tokens2);
        var intersection = new Set(__spreadArray([], set1, true).filter(function (x) { return set2.has(x); }));
        return (2.0 * intersection.size) / (set1.size + set2.size);
    };
    DuplicationAnalyzer.prototype.calculateDuplicatedLines = function (duplications) {
        return duplications.reduce(function (total, dup) { return total + dup.lineCount; }, 0);
    };
    DuplicationAnalyzer.prototype.findLargestDuplication = function (duplications) {
        return duplications.reduce(function (max, dup) { return Math.max(max, dup.lineCount); }, 0);
    };
    DuplicationAnalyzer.prototype.generateSuggestions = function (duplications) {
        var suggestions = [];
        if (duplications.length > 0) {
            suggestions.push('Consider extracting duplicated code into reusable functions or components');
            if (this.hasLargeDuplications(duplications)) {
                suggestions.push('Large code duplications detected. Consider implementing a shared module');
            }
            if (this.hasCrossDuplications(duplications)) {
                suggestions.push('Cross-file duplications found. Review architecture for potential abstraction opportunities');
            }
        }
        return suggestions;
    };
    DuplicationAnalyzer.prototype.hasLargeDuplications = function (duplications) {
        return duplications.some(function (dup) { return dup.lineCount > 20; });
    };
    DuplicationAnalyzer.prototype.hasCrossDuplications = function (duplications) {
        return duplications.some(function (dup) {
            return dup.locations.length > 1 && new Set(dup.locations.map(function (loc) { return loc.split(':')[0]; })).size > 1;
        });
    };
    return DuplicationAnalyzer;
}(BaseAnalyzer_1.BaseAnalyzer));
exports.DuplicationAnalyzer = DuplicationAnalyzer;
