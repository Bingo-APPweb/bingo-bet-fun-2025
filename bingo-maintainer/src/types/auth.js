"use strict";
// packages/maintainer/src/types/auth.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionLevel = exports.SecurityEventType = exports.SecuritySeverity = void 0;
/**
 * Enumeração dos níveis de severidade para eventos de segurança
 */
var SecuritySeverity;
(function (SecuritySeverity) {
    SecuritySeverity["LOW"] = "LOW";
    SecuritySeverity["MEDIUM"] = "MEDIUM";
    SecuritySeverity["HIGH"] = "HIGH";
    SecuritySeverity["CRITICAL"] = "CRITICAL";
})(SecuritySeverity || (exports.SecuritySeverity = SecuritySeverity = {}));
/**
 * Enumeração dos tipos de eventos de segurança
 */
var SecurityEventType;
(function (SecurityEventType) {
    SecurityEventType["AUTH_SUCCESS"] = "AUTH_SUCCESS";
    SecurityEventType["AUTH_FAILURE"] = "AUTH_FAILURE";
    SecurityEventType["INVALID_TOKEN"] = "INVALID_TOKEN";
    SecurityEventType["SESSION_EXPIRED"] = "SESSION_EXPIRED";
    SecurityEventType["SUSPICIOUS_ACTIVITY"] = "SUSPICIOUS_ACTIVITY";
    SecurityEventType["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    SecurityEventType["ACCESS_DENIED"] = "ACCESS_DENIED";
    SecurityEventType["PERMISSION_CHANGE"] = "PERMISSION_CHANGE";
})(SecurityEventType || (exports.SecurityEventType = SecurityEventType = {}));
// packages/maintainer/src/types/auth.ts
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel[PermissionLevel["NONE"] = 0] = "NONE";
    PermissionLevel[PermissionLevel["READ"] = 1] = "READ";
    PermissionLevel[PermissionLevel["WRITE"] = 2] = "WRITE";
    PermissionLevel[PermissionLevel["ADMIN"] = 3] = "ADMIN";
    PermissionLevel[PermissionLevel["SUPER_ADMIN"] = 4] = "SUPER_ADMIN";
})(PermissionLevel || (exports.PermissionLevel = PermissionLevel = {}));
