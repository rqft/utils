import { Perm } from "./permissions";
export declare type Predicate<T, V, R> = (value: V, obj: T) => R;
export declare class BaseSet<T> {
    private raw;
    private permissions;
    constructor(iterable?: Iterable<T>, permissions?: Partial<Perm>);
    get size(): number;
    has(key: T): boolean;
    hasSome(keys: Iterable<T>): boolean;
    hasEvery(keys: Iterable<T>): boolean;
    add(key: T): this;
    addMany(keys: Iterable<T>): this;
    private get;
    remove(key: T): this;
    removeMany(keys: Iterable<T>): this;
    clear(): this;
    forEach(callback: Predicate<this, T, void>): this;
    filter<S extends T>(callback: (value: T, obj: this) => value is S): BaseSet<S>;
    filter(callback: Predicate<this, T, boolean>): BaseSet<T>;
    map<R = T>(callback: Predicate<this, T, R>): BaseSet<R>;
    some(callback: Predicate<this, T, boolean>): boolean;
    every(callback: Predicate<this, T, boolean>): boolean;
    entries(): IterableIterator<[T, T]>;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    [Symbol.iterator](): IterableIterator<T>;
    get [Symbol.toStringTag](): string;
}
