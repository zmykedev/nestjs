"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.AuditLogLevel = exports.AuditLogStatus = exports.AuditLogAction = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
var AuditLogAction;
(function (AuditLogAction) {
    AuditLogAction["INVENTORY_ADDED"] = "INVENTORY_ADDED";
    AuditLogAction["INVENTORY_UPDATED"] = "INVENTORY_UPDATED";
    AuditLogAction["INVENTORY_REMOVED"] = "INVENTORY_REMOVED";
    AuditLogAction["INVENTORY_VIEWED"] = "INVENTORY_VIEWED";
    AuditLogAction["INVENTORY_SEARCHED"] = "INVENTORY_SEARCHED";
    AuditLogAction["CREATE"] = "CREATE";
    AuditLogAction["READ"] = "READ";
    AuditLogAction["UPDATE"] = "UPDATE";
    AuditLogAction["DELETE"] = "DELETE";
    AuditLogAction["LOGIN"] = "LOGIN";
    AuditLogAction["LOGOUT"] = "LOGOUT";
    AuditLogAction["EXPORT"] = "EXPORT";
    AuditLogAction["IMPORT"] = "IMPORT";
    AuditLogAction["SEARCH"] = "SEARCH";
    AuditLogAction["FILTER"] = "FILTER";
    AuditLogAction["SORT"] = "SORT";
    AuditLogAction["PAGINATION"] = "PAGINATION";
})(AuditLogAction = exports.AuditLogAction || (exports.AuditLogAction = {}));
var AuditLogStatus;
(function (AuditLogStatus) {
    AuditLogStatus["SUCCESS"] = "SUCCESS";
    AuditLogStatus["FAILURE"] = "FAILURE";
    AuditLogStatus["PENDING"] = "PENDING";
})(AuditLogStatus = exports.AuditLogStatus || (exports.AuditLogStatus = {}));
var AuditLogLevel;
(function (AuditLogLevel) {
    AuditLogLevel["INFO"] = "INFO";
    AuditLogLevel["WARNING"] = "WARNING";
    AuditLogLevel["ERROR"] = "ERROR";
    AuditLogLevel["DEBUG"] = "DEBUG";
})(AuditLogLevel = exports.AuditLogLevel || (exports.AuditLogLevel = {}));
let AuditLog = class AuditLog extends base_entity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "user_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "user_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entity_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "request_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "response_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: AuditLogStatus.SUCCESS }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AuditLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: AuditLogLevel.INFO }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AuditLog.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ip_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "user_agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "http_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AuditLog.prototype, "response_time_ms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "error_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "metadata", void 0);
AuditLog = __decorate([
    (0, typeorm_1.Entity)('audit_logs'),
    (0, typeorm_1.Index)(['user_id', 'created_at']),
    (0, typeorm_1.Index)(['entity_type', 'entity_id']),
    (0, typeorm_1.Index)(['action', 'created_at']),
    (0, typeorm_1.Index)(['status', 'created_at']),
    (0, typeorm_1.Index)(['level', 'created_at'])
], AuditLog);
exports.AuditLog = AuditLog;
//# sourceMappingURL=audit-log.entity.js.map