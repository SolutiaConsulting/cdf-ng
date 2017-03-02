"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var cache_storage_abstract_service_1 = require('../cache-storage-abstract.service');
/**
 * Service for storing data in local storage
 */
var CacheLocalStorage = (function (_super) {
    __extends(CacheLocalStorage, _super);
    function CacheLocalStorage() {
        _super.apply(this, arguments);
    }
    CacheLocalStorage.prototype.getItem = function (key) {
        var value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    };
    CacheLocalStorage.prototype.setItem = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };
    CacheLocalStorage.prototype.removeItem = function (key) {
        localStorage.removeItem(key);
    };
    CacheLocalStorage.prototype.clear = function () {
        localStorage.clear();
    };
    CacheLocalStorage.prototype.type = function () {
        return 0 /* LOCAL_STORAGE */;
    };
    CacheLocalStorage.prototype.isEnabled = function () {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        }
        catch (e) {
            return false;
        }
    };
    CacheLocalStorage = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CacheLocalStorage);
    return CacheLocalStorage;
}(cache_storage_abstract_service_1.CacheStorageAbstract));
exports.CacheLocalStorage = CacheLocalStorage;
//# sourceMappingURL=cache-local-storage.service.js.map