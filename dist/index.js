"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = exports.BaseSet = exports.Permissions = exports.BaseCollection = exports.Bits = void 0;
var bits_1 = require("./bits");
Object.defineProperty(exports, "Bits", { enumerable: true, get: function () { return bits_1.Bits; } });
var collection_1 = require("./collection");
Object.defineProperty(exports, "BaseCollection", { enumerable: true, get: function () { return collection_1.BaseCollection; } });
var permissions_1 = require("./permissions");
Object.defineProperty(exports, "Permissions", { enumerable: true, get: function () { return permissions_1.Permissions; } });
var set_1 = require("./set");
Object.defineProperty(exports, "BaseSet", { enumerable: true, get: function () { return set_1.BaseSet; } });
exports.Types = __importStar(require("./types"));
