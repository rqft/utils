export class Node<T> {
  constructor(private readonly value: T | null, public child: Node<T> | null, public parent: Node<T> | null) {}

  public unwrap() {
    if (this.value === null) {
      throw new Error('Called `unwrap()` on None value');
    }

    return this.value;
  }

  public forward() {
    if (this.child === null) {
      throw new Error('Called `forward()` with no child');
    }

    return this.child;
  }

  public backward() {
    if (this.parent === null) {
      throw new Error('Called `backward()` with no parent');
    }
        
    return this.parent;
  }

  public toJSON(): JSONNode<T> {
    return {value:this.value,child:this.child?.toJSON()};
  }
}

export interface JSONNode<T> {
    value: T | null,
    child?: JSONNode<T>
}

export type Predicate<K, V, R> = ((value: V, key: K, collection: Collection<K, V>) => R)

export class Collection<K, V> {
  private head: Node<[K, V]> | null = null;
  constructor(iterable?: Iterable<[K, V]> | null | undefined) {
    if (iterable) {
      for (const [k,v] of iterable) {
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

  /** like Symbol.iterator, but returns wrapped values */
  private *iterator() {
    let node = this.head;
    while (node) {
      yield node;
      node = node.child;
    }
  }

  private final() {
    let node = this.head;
    for (const value of this.iterator()) {
      node = value;
    }

    return node;
  }

  private pair(key: K) {
    for (const value of this.iterator()) {
      if (value.unwrap()[0] === key) {
        return value;
      }
    }
  }

  public get(key: K) {
    return this.pair(key)?.unwrap()[1];
  }

  public has(key: K) {
    return this.get(key) !== undefined;
  }

  public set(key: K, value: V) {
    if (this.has(key)) {
      this.delete(key);
    }

    const last = this.final();

    if (last) {
      last.child = new Node([key, value], null, last);
    } else {
      this.head = new Node([key, value], null, null);
    }

    return this;
  }

  public delete(key: K) {
    const pair = this.pair(key);

    if (pair === undefined) { return false; }

    if (pair.parent) {
      pair.parent.child = pair.child;
    } else {
      this.head = pair.child;
    }

    return true;
  }

  public size() {
    let i = 0;
    // eslint-disable-next-line no-empty-pattern
    for (const {} of this) {
      i++;
    }

    return i;
  }

  public first() {
    return this.head?.unwrap();
  }

  public last() {
    return this.final()?.unwrap();
  }

  public forEach(f: (value: V, key: K, collection: this) => unknown) {
    for (const [key, value] of this) {
      f(value, key, this);
    }

    return this;
  }

  public map<U>(m: Predicate<K, V, U>): Collection<K, U> {
    const collect = new Collection<K, U>();

    for (const [key, value] of this) {
      collect.set(key, m(value, key, this));
    }

    return collect;
  }

  public filter(f: Predicate<K, V, boolean>): Collection<K, V> {
    const collect = new Collection<K, V>();

    for (const [key, value] of this) {
      if (f(value, key, this)) {
        collect.set(key, value);
      }
    }

    return collect;
  }

  public filterMap<U>(f: Predicate<K, V, boolean>, m: Predicate<K, V, U>): Collection<K, U> {
    return this.filter(f).map(m);
  }

  public clone() {
    // abuse the fact that we support iterator protocol
    return new Collection<K, V>(this);
  }

  public chain(collection: Collection<K, V>) {
    const collect = this.clone();
    for (const [key, value] of collection) {
      collect.set(key, value);
    }

    return collect;
  }

  public some(s: Predicate<K, V, boolean>) {
    for (const [key, value] of this) {
      if (s(value, key, this)) {
        return true;
      }
    }

    return false;
  }

  public every(e: Predicate<K, V, boolean>) {
    for (const [key, value] of this) {
      if (!e(value, key, this)) {
        return false;
      }
    }

    return true;
  }

  public *keys() {
    for (const [key] of this) {
      yield key;
    }
  }

  public *values() {
    for (const [, value] of this) { 
      yield value;
    }
  }

  public *entries() {
    yield* this;
  }

  public toJSON() {
    return Array.from(this);
  }
}