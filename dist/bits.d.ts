import type { Flood, Not, Set } from './types';
export declare type Bit = 0 | 1;
export declare class Bits<T extends Record<K, boolean>, K extends number | string | symbol = keyof T> {
    private static;
    private raw;
    private key;
    constructor(data: T);
    private at;
    private mask;
    enable<U extends keyof T>(key: U): Bits<Set<T, U, true>, K>;
    disable<U extends keyof T>(key: U): Bits<Set<T, U, false>, K>;
    toggle<U extends keyof T>(key: U): Bits<Set<T, U, Not<T[U]>>, K>;
    set<U extends K, V extends boolean>(key: U, value: V): Bits<Set<T, U, V>, K>;
    get<U extends keyof T>(key: U): T[U];
    data(): T;
    fill<V extends boolean>(value: boolean): Bits<Flood<T, V>, K>;
    reset(): Bits<Flood<T, false>, K>;
    flood(): Bits<Flood<T, true>, K>;
    clone(): Bits<T, keyof T>;
    [Symbol.iterator](): Generator<(keyof T | T[keyof T])[], void, unknown>;
    entries(): Generator<(keyof T | T[keyof T])[], void, unknown>;
    keys(): Generator<keyof T, void, unknown>;
    values(): Generator<T[keyof T], void, unknown>;
    static load<T extends Record<K, boolean>, K extends number | string | symbol = keyof T>(data: T): number;
    static unload<T extends Record<K, boolean>, K extends number | string | symbol = keyof T>(value: number, keys: Array<keyof T>): T;
}
