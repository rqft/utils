export declare class Node<T> {
    private readonly value;
    child: Node<T> | null;
    parent: Node<T> | null;
    constructor(value: T | null, child: Node<T> | null, parent: Node<T> | null);
    unwrap(): T;
    forward(): Node<T>;
    backward(): Node<T>;
    toJSON(): JSONNode<T>;
}
export interface JSONNode<T> {
    value: T | null;
    child?: JSONNode<T>;
}
export declare type Predicate<K, V, R> = ((value: V, key: K, collection: Collection<K, V>) => R);
export declare class Collection<K, V> {
    private head;
    constructor(iterable?: Iterable<[K, V]> | null | undefined);
    [Symbol.iterator](): Generator<[K, V], void, unknown>;
    private iterator;
    private final;
    private pair;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    size(): number;
    first(): [K, V] | undefined;
    last(): [K, V] | undefined;
    forEach(f: (value: V, key: K, collection: this) => unknown): this;
    map<U>(m: Predicate<K, V, U>): Collection<K, U>;
    filter(f: Predicate<K, V, boolean>): Collection<K, V>;
    filterMap<U>(f: Predicate<K, V, boolean>, m: Predicate<K, V, U>): Collection<K, U>;
    clone(): Collection<K, V>;
    chain(collection: Collection<K, V>): Collection<K, V>;
    some(s: Predicate<K, V, boolean>): boolean;
    every(e: Predicate<K, V, boolean>): boolean;
    keys(): Generator<K, void, unknown>;
    values(): Generator<V, void, unknown>;
    entries(): Generator<[K, V], void, unknown>;
    toJSON(): [K, V][];
}
