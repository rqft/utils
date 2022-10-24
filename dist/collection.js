"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCollection = void 0;
const permissions_1 = require("./permissions");
class BaseCollection {
    raw = {};
    permissions;
    constructor(iterable, permissions) {
        if (iterable) {
            for (const [key, value] of iterable) {
                this.raw[key] = value;
            }
        }
        this.permissions = new permissions_1.Permissions(permissions);
    }
    get size() {
        this.permissions.check('read');
        return Object.keys(this.raw).length;
    }
    has(key) {
        this.permissions.check('read');
        return key in this.raw;
    }
    hasSome(keys) {
        this.permissions.check('read');
        for (const key of keys) {
            if (this.has(key)) {
                return true;
            }
        }
        return false;
    }
    hasEvery(keys) {
        this.permissions.check('read');
        for (const key of keys) {
            if (!this.has(key)) {
                return false;
            }
        }
        return true;
    }
    get(key) {
        this.permissions.check('read');
        return this.raw[key];
    }
    getMany(keys) {
        this.permissions.check('read');
        const output = new BaseCollection([], this.permissions.clone().data());
        for (const key of keys) {
            if (this.has(key)) {
                output.raw[key] = this.raw[key];
            }
        }
        return output;
    }
    set(key, value) {
        this.permissions.check('write');
        this.raw[key] = value;
        return this;
    }
    setManyTo(keys, value) {
        this.permissions.check('write');
        for (const key of keys) {
            this.set(key, value);
        }
        return this;
    }
    setMany(entries) {
        this.permissions.check('write');
        for (const [key, value] of entries) {
            this.set(key, value);
        }
        return this;
    }
    delete(key) {
        this.permissions.check('write');
        delete this.raw[key];
        return this;
    }
    deleteMany(keys) {
        this.permissions.check('write');
        for (const key of keys) {
            this.delete(key);
        }
        return this;
    }
    clear() {
        this.permissions.check('write');
        this.raw = {};
        return this;
    }
    forEach(callback) {
        this.permissions.check('read');
        for (const key in this.raw) {
            callback(this.raw[key], key, this);
        }
        return this;
    }
    map(callback) {
        this.permissions.check('read');
        const output = new BaseCollection([], this.permissions.clone().data());
        for (const [key, value] of this.entries()) {
            output.permissions.check('write');
            output.set(key, callback(value, key, this));
        }
        return output;
    }
    filter(callback) {
        this.permissions.check('read');
        const output = new BaseCollection([], this.permissions.clone().data());
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) {
                output.permissions.check('write');
                output.set(key, value);
            }
        }
        return output;
    }
    find(callback) {
        this.permissions.check('read');
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) {
                return value;
            }
        }
        return undefined;
    }
    findKey(callback) {
        this.permissions.check('read');
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) {
                return key;
            }
        }
        return undefined;
    }
    intersection(other) {
        this.permissions.check('read');
        other.permissions.check('read');
        const output = new BaseCollection([], this.permissions.clone().data());
        for (const [key, value] of this.entries()) {
            if (other.has(key)) {
                output.permissions.check('write');
                output.set(key, value);
            }
        }
        return output;
    }
    union(other) {
        this.permissions.check('read');
        other.permissions.check('read');
        const output = new BaseCollection([], this.permissions.clone().data());
        for (const [key, value] of this.entries()) {
            output.permissions.check('write');
            output.set(key, value);
        }
    }
    difference(other) {
        this.permissions.check('read');
        other.permissions.check('read');
        const output = new BaseCollection([], this.permissions.clone().data());
        for (const [key, value] of this.entries()) {
            if (!other.has(key)) {
                output.permissions.check('write');
                output.set(key, value);
            }
        }
        return output;
    }
    some(callback) {
        this.permissions.check('read');
        for (const [key, value] of this.entries()) {
            if (callback(value, key, this)) {
                return true;
            }
        }
        return false;
    }
    every(callback) {
        this.permissions.check('read');
        for (const [key, value] of this.entries()) {
            if (!callback(value, key, this)) {
                return false;
            }
        }
        return true;
    }
    *entries() {
        this.permissions.check('read');
        for (const key in this.raw) {
            yield [key, this.raw[key]];
        }
    }
    *keys() {
        this.permissions.check('read');
        for (const key in this.raw) {
            yield key;
        }
    }
    *values() {
        this.permissions.check('read');
        for (const key in this.raw) {
            yield this.raw[key];
        }
    }
    clone() {
        this.permissions.check('read');
        return new BaseCollection(this.entries(), this.permissions.clone().data());
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    get [Symbol.toStringTag]() {
        return `${this.constructor.name} (${this.size} items)`;
    }
    toJSON() {
        this.permissions.check('read');
        return this.raw;
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
exports.BaseCollection = BaseCollection;
