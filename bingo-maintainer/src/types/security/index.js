"use strict";
// src/types/security/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityCategory = exports.SecuritySeverity = void 0;
// Tipos base de segurança
var SecuritySeverity;
(function (SecuritySeverity) {
    SecuritySeverity["CRITICAL"] = "critical";
    SecuritySeverity["HIGH"] = "high";
    SecuritySeverity["MEDIUM"] = "medium";
    SecuritySeverity["LOW"] = "low";
    SecuritySeverity["INFO"] = "info";
})(SecuritySeverity || (exports.SecuritySeverity = SecuritySeverity = {}));
var SecurityCategory;
(function (SecurityCategory) {
    SecurityCategory["AUTHENTICATION"] = "authentication";
    SecurityCategory["AUTHORIZATION"] = "authorization";
    SecurityCategory["DATA_VALIDATION"] = "data-validation";
    SecurityCategory["FIREBASE_RULES"] = "firebase-rules";
    SecurityCategory["INPUT_VALIDATION"] = "input-validation";
    SecurityCategory["SENSITIVE_DATA"] = "sensitive-data";
    SecurityCategory["CONFIGURATION"] = "configuration";
    SecurityCategory["API_SECURITY"] = "api-security";
    SecurityCategory["REALTIME_PROTECTION"] = "realtime-protection";
    SecurityCategory["GAME_INTEGRITY"] = "game-integrity";
})(SecurityCategory || (exports.SecurityCategory = SecurityCategory = {}));
