"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = void 0;
const bits_1 = require("./bits");
class Permissions extends bits_1.Bits {
    constructor(permissions) {
        super(Object.assign({}, { read: true, write: true }, permissions));
    }
    check(key) {
        const data = this.get(key);
        if (!data) {
            throw new Error(`Permission ${key} is not set`);
        }
        return this;
    }
}
exports.Permissions = Permissions;
