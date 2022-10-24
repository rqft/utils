"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = exports.Node = void 0;
class Node {
    value;
    child;
    parent;
    constructor(value, child, parent) {
        this.value = value;
        this.child = child;
        this.parent = parent;
    }
    unwrap() {
        if (this.value === null) {
            throw new Error('Called `unwrap()` on None value');
        }
        return this.value;
    }
    forward() {
        if (this.child === null) {
            throw new Error('Called `forward()` with no child');
        }
        return this.child;
    }
    backward() {
        if (this.parent === null) {
            throw new Error('Called `backward()` with no parent');
        }
        return this.parent;
    }
    toJSON() {
        return { value: this.value, child: this.child?.toJSON() };
    }
}
exports.Node = Node;
class Collection {
    head = null;
    constructor(iterable) {
        if (iterable) {
            for (const [k, v] of iterable) {
                this.set(k, v);
            }
        }
    }
    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            yield node.unwrap();
            node = node.child;
        }
    }
    *iterator() {
        let node = this.head;
        while (node) {
            yield node;
            node = node.child;
        }
    }
    final() {
        let node = this.head;
        for (const value of this.iterator()) {
            node = value;
        }
        return node;
    }
    pair(key) {
        for (const value of this.iterator()) {
            if (value.unwrap()[0] === key) {
                return value;
            }
        }
    }
    get(key) {
        return this.pair(key)?.unwrap()[1];
    }
    has(key) {
        return this.get(key) !== undefined;
    }
    set(key, value) {
        if (this.has(key)) {
            this.delete(key);
        }
        const last = this.final();
        if (last) {
            last.child = new Node([key, value], null, last);
        }
        else {
            this.head = new Node([key, value], null, null);
        }
        return this;
    }
    delete(key) {
        const pair = this.pair(key);
        if (pair === undefined) {
            return false;
        }
        if (pair.parent) {
            pair.parent.child = pair.child;
        }
        else {
            this.head = pair.child;
        }
        return true;
    }
    size() {
        let i = 0;
        for (const {} of this) {
            i++;
        }
        return i;
    }
    first() {
        return this.head?.unwrap();
    }
    last() {
        return this.final()?.unwrap();
    }
    forEach(f) {
        for (const [key, value] of this) {
            f(value, key, this);
        }
        return this;
    }
    map(m) {
        const collect = new Collection();
        for (const [key, value] of this) {
            collect.set(key, m(value, key, this));
        }
        return collect;
    }
    filter(f) {
        const collect = new Collection();
        for (const [key, value] of this) {
            if (f(value, key, this)) {
                collect.set(key, value);
            }
        }
        return collect;
    }
    filterMap(f, m) {
        return this.filter(f).map(m);
    }
    clone() {
        return new Collection(this);
    }
    chain(collection) {
        const collect = this.clone();
        for (const [key, value] of collection) {
            collect.set(key, value);
        }
        return collect;
    }
    some(s) {
        for (const [key, value] of this) {
            if (s(value, key, this)) {
                return true;
            }
        }
        return false;
    }
    every(e) {
        for (const [key, value] of this) {
            if (!e(value, key, this)) {
                return false;
            }
        }
        return true;
    }
    *keys() {
        for (const [key] of this) {
            yield key;
        }
    }
    *values() {
        for (const [, value] of this) {
            yield value;
        }
    }
    *entries() {
        yield* this;
    }
    toJSON() {
        return Array.from(this);
    }
}
exports.Collection = Collection;
