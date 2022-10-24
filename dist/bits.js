"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bits = void 0;
class Bits {
    static = Bits;
    raw;
    key;
    constructor(data) {
        this.key = Reflect.ownKeys(data).sort();
        this.raw = this.static.load(data);
    }
    at(key) {
        return this.key.indexOf(key);
    }
    mask(key) {
        return 1 << this.at(key);
    }
    enable(key) {
        this.raw |= this.mask(key);
        return this;
    }
    disable(key) {
        this.raw &= ~this.mask(key);
        return this;
    }
    toggle(key) {
        this.raw ^= this.mask(key);
        return this;
    }
    set(key, value) {
        switch (value) {
            case true:
                return this.enable(key);
            case false:
                return this.disable(key);
            default:
                throw new Error('Invalid value');
        }
    }
    get(key) {
        return Boolean(this.raw & this.mask(key));
    }
    data() {
        return this.static.unload(this.raw, this.key);
    }
    fill(value) {
        for (const key of this.key) {
            this.set(key, value);
        }
        return this;
    }
    reset() {
        this.raw = 0;
        return this;
    }
    flood() {
        return this.fill(true);
    }
    clone() {
        return new this.static(this.data());
    }
    *[Symbol.iterator]() {
        for (const key of this.key) {
            yield [key, this.get(key)];
        }
    }
    *entries() {
        for (const key of this.key) {
            yield [key, this.get(key)];
        }
    }
    *keys() {
        for (const key of this.key) {
            yield key;
        }
    }
    *values() {
        for (const key of this.key) {
            yield this.get(key);
        }
    }
    static load(data) {
        const keys = Reflect.ownKeys(data).sort();
        let output = 0;
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const value = data[key];
            if (value) {
                output = output | (1 << index);
            }
        }
        return output;
    }
    static unload(value, keys) {
        const output = {};
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const bit = 1 << index;
            output[key] = ((value & bit) !== 0);
        }
        return output;
    }
}
exports.Bits = Bits;
const obj = {
    a: true,
    b: false,
};
const bits = new Bits(obj);
bits.clone().enable('b').set('a', false).data().a;
