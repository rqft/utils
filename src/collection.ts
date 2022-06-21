import { Perm, Permissions } from "./permissions";

export type Predicate<T, K, V, R> = (value: V, key: K, obj: T) => R;

export class Collection<K extends string | number | symbol, V> {
  private raw = {} as Record<K, V>;
  private permissions: Permissions;
  constructor(iterable?: Iterable<[K, V]>, permissions?: Partial<Perm>) {
    if (iterable) {
      for (const [key, value] of iterable) {
        this.raw[key] = value;
      }
    }

    this.permissions = new Permissions(permissions);
  }

  public get size(): number {
    this.permissions.check("read");
    return Object.keys(this.raw).length;
  }

  public has(key: K): boolean {
    this.permissions.check("read");
    return key in this.raw;
  }

  public hasSome(keys: Iterable<K>): boolean {
    this.permissions.check("read");
    for (const key of keys) {
      if (this.has(key)) {
        return true;
      }
    }
    return false;
  }

  public hasEvery(keys: Iterable<K>): boolean {
    this.permissions.check("read");
    for (const key of keys) {
      if (!this.has(key)) {
        return false;
      }
    }
    return true;
  }

  public get(key: K): V {
    this.permissions.check("read");
    return this.raw[key];
  }

  public getMany<U extends K = K>(keys: Iterable<U>): Collection<U, V> {
    this.permissions.check("read");
    const output = new Collection<U, V>([], this.permissions.clone().data());

    for (const key of keys) {
      if (this.has(key)) {
        output.raw[key] = this.raw[key];
      }
    }

    return output;
  }

  public set(key: K, value: V): this {
    this.permissions.check("write");
    this.raw[key] = value;
    return this;
  }

  public setManyTo(keys: Iterable<K>, value: V): Collection<K, V> {
    this.permissions.check("write");
    for (const key of keys) {
      this.set(key, value);
    }
    return this;
  }

  public setMany(entries: Iterable<[K, V]>): Collection<K, V> {
    this.permissions.check("write");
    for (const [key, value] of entries) {
      this.set(key, value);
    }
    return this;
  }

  public delete(key: K): this {
    this.permissions.check("write");
    delete this.raw[key];
    return this;
  }

  public deleteMany(keys: Iterable<K>): this {
    this.permissions.check("write");
    for (const key of keys) {
      this.delete(key);
    }
    return this;
  }

  public clear(): this {
    this.permissions.check("write");
    this.raw = {} as Record<K, V>;
    return this;
  }

  public forEach(callback: Predicate<this, K, V, void>): this {
    this.permissions.check("read");
    for (const key in this.raw) {
      callback(this.raw[key], key, this);
    }
    return this;
  }

  public map<R = V>(callback: Predicate<this, K, V, R>): Collection<K, R> {
    this.permissions.check("read");
    const output = new Collection<K, R>([], this.permissions.clone().data());

    for (const [key, value] of this.entries()) {
      output.permissions.check("write");
      output.set(key, callback(value, key, this));
    }

    return output;
  }

  public filter<S extends V>(
    callback: (value: V, key: K, obj: this) => value is S
  ): Collection<K, S>;
  public filter(
    callback: Predicate<this, K, V, boolean>
  ): Collection<K, V | undefined> {
    this.permissions.check("read");
    const output = new Collection<K, V | undefined>(
      [],
      this.permissions.clone().data()
    );

    for (const [key, value] of this.entries()) {
      if (callback(value, key, this)) {
        output.permissions.check("write");
        output.set(key, value);
      }
    }

    return output;
  }

  public find(callback: Predicate<this, K, V, boolean>): V | undefined {
    this.permissions.check("read");
    for (const [key, value] of this.entries()) {
      if (callback(value, key, this)) {
        return value;
      }
    }
    return undefined;
  }

  public findKey(callback: Predicate<this, K, V, boolean>): K | undefined {
    this.permissions.check("read");
    for (const [key, value] of this.entries()) {
      if (callback(value, key, this)) {
        return key;
      }
    }
    return undefined;
  }

  public intersection(other: Collection<K, V>) {
    this.permissions.check("read");
    other.permissions.check("read");
    const output = new Collection<K, V>([], this.permissions.clone().data());

    for (const [key, value] of this.entries()) {
      if (other.has(key)) {
        output.permissions.check("write");
        output.set(key, value);
      }
    }

    return output;
  }

  public union(other: Collection<K, V>) {
    this.permissions.check("read");
    other.permissions.check("read");
    const output = new Collection<K, V>([], this.permissions.clone().data());

    for (const [key, value] of this.entries()) {
      output.permissions.check("write");
      output.set(key, value);
    }
  }

  public difference(other: Collection<K, V>) {
    this.permissions.check("read");
    other.permissions.check("read");
    const output = new Collection<K, V>([], this.permissions.clone().data());

    for (const [key, value] of this.entries()) {
      if (!other.has(key)) {
        output.permissions.check("write");
        output.set(key, value);
      }
    }
    return output;
  }

  public some(callback: Predicate<this, K, V, boolean>): boolean {
    this.permissions.check("read");

    for (const [key, value] of this.entries()) {
      if (callback(value, key, this)) {
        return true;
      }
    }

    return false;
  }

  public every(callback: Predicate<this, K, V, boolean>): boolean {
    this.permissions.check("read");

    for (const [key, value] of this.entries()) {
      if (!callback(value, key, this)) {
        return false;
      }
    }

    return true;
  }

  public *entries(): IterableIterator<[K, V]> {
    this.permissions.check("read");
    for (const key in this.raw) {
      yield [key, this.raw[key]];
    }
  }

  public *keys(): IterableIterator<K> {
    this.permissions.check("read");
    for (const key in this.raw) {
      yield key;
    }
  }

  public *values(): IterableIterator<V> {
    this.permissions.check("read");
    for (const key in this.raw) {
      yield this.raw[key];
    }
  }

  public clone(): Collection<K, V> {
    return new Collection(this.entries(), this.permissions.clone().data());
  }

  public [Symbol.iterator]() {
    return this.entries();
  }

  public get [Symbol.toStringTag]() {
    return `${this.constructor.name} (${this.size} items)`;
  }
}
