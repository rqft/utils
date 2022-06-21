"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSet = void 0;
const permissions_1 = require("./permissions");
class BaseSet {
    raw;
    permissions;
    constructor(iterable, permissions) {
        this.raw = Array.from(iterable || []);
        this.permissions = new permissions_1.Permissions(permissions);
    }
    get size() {
        this.permissions.check("read");
        return this.raw.length;
    }
    has(key) {
        this.permissions.check("read");
        return this.raw.includes(key);
    }
    hasSome(keys) {
        this.permissions.check("read");
        for (const key of keys) {
            if (this.has(key)) {
                return true;
            }
        }
        return false;
    }
    hasEvery(keys) {
        this.permissions.check("read");
        for (const key of keys) {
            if (!this.has(key)) {
                return false;
            }
        }
        return true;
    }
    add(key) {
        this.permissions.check("write");
        this.raw.push(key);
        return this;
    }
    addMany(keys) {
        this.permissions.check("write");
        for (const key of keys) {
            this.add(key);
        }
        return this;
    }
    get(key) {
        this.permissions.check("read");
        return this.raw.indexOf(key);
    }
    remove(key) {
        this.permissions.check("write");
        const index = this.get(key);
        if (index !== -1) {
            this.raw.splice(index, 1);
        }
        return this;
    }
    removeMany(keys) {
        this.permissions.check("write");
        for (const key of keys) {
            this.remove(key);
        }
        return this;
    }
    clear() {
        this.permissions.check("write");
        this.raw = [];
        return this;
    }
    forEach(callback) {
        this.permissions.check("read");
        for (const value of this.raw) {
            callback(value, this);
        }
        return this;
    }
    filter(callback) {
        this.permissions.check("read");
        const output = new BaseSet([], this.permissions.clone().data());
        for (const value of this.raw) {
            if (callback(value, this)) {
                output.permissions.check("write");
                output.add(value);
            }
        }
        return output;
    }
    map(callback) {
        this.permissions.check("read");
        const output = new BaseSet([], this.permissions.clone().data());
        for (const value of this.raw) {
            output.permissions.check("write");
            output.add(callback(value, this));
        }
        return output;
    }
    some(callback) {
        this.permissions.check("read");
        for (const value of this.raw) {
            if (callback(value, this)) {
                return true;
            }
        }
        return false;
    }
    every(callback) {
        this.permissions.check("read");
        for (const value of this.raw) {
            if (!callback(value, this)) {
                return false;
            }
        }
        return true;
    }
    *entries() {
        this.permissions.check("read");
        for (const value of this.raw) {
            yield [value, value];
        }
    }
    *keys() {
        this.permissions.check("read");
        for (const value of this.raw) {
            yield value;
        }
    }
    *values() {
        this.permissions.check("read");
        for (const value of this.raw) {
            yield value;
        }
    }
    [Symbol.iterator]() {
        this.permissions.check("read");
        return this.values();
    }
    get [Symbol.toStringTag]() {
        return `${this.constructor.name} (${this.size} items)`;
    }
}
exports.BaseSet = BaseSet;
