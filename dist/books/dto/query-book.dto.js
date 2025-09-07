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
exports.QueryBookDto = exports.SortField = exports.SortDirection = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "ASC";
    SortDirection["DESC"] = "DESC";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var SortField;
(function (SortField) {
    SortField["TITLE"] = "title";
    SortField["AUTHOR"] = "author";
    SortField["PUBLISHER"] = "publisher";
    SortField["PRICE"] = "price";
    SortField["GENRE"] = "genre";
    SortField["CREATED_AT"] = "createdAt";
})(SortField = exports.SortField || (exports.SortField = {}));
class QueryBookDto {
    constructor() {
        this.sortBy = SortField.TITLE;
        this.sortDir = SortDirection.ASC;
        this.page = 1;
        this.limit = 10;
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Término de búsqueda' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBookDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Género del libro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBookDto.prototype, "genre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Editorial del libro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBookDto.prototype, "publisher", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Autor del libro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBookDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Disponibilidad del libro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryBookDto.prototype, "availability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo para ordenar', enum: SortField }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortField),
    __metadata("design:type", String)
], QueryBookDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dirección del ordenamiento',
        enum: SortDirection,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortDirection),
    __metadata("design:type", String)
], QueryBookDto.prototype, "sortDir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número de página',
        minimum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryBookDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Elementos por página',
        minimum: 1,
        maximum: 100,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QueryBookDto.prototype, "limit", void 0);
exports.QueryBookDto = QueryBookDto;
//# sourceMappingURL=query-book.dto.js.map