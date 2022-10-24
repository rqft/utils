import type { Perm} from './permissions';
import { Permissions } from './permissions';
// skip get, getMany
export type Predicate<T, V, R> = (value: V, obj: T) => R;
export class BaseSet<T> {
  private raw: Array<T>;
  private permissions: Permissions;
  constructor(iterable?: Iterable<T>, permissions?: Partial<Perm>) {
    this.raw = Array.from(iterable || []);
    this.permissions = new Permissions(permissions);
  }

  public get size(): number {
    this.permissions.check('read');
    return this.raw.length;
  }

  public has(key: T): boolean {
    this.permissions.check('read');
    return this.raw.includes(key);
  }

  public hasSome(keys: Iterable<T>): boolean {
    this.permissions.check('read');

    for (const key of keys) {
      if (this.has(key)) {
        return true;
      }
    }

    return false;
  }

  public hasEvery(keys: Iterable<T>): boolean {
    this.permissions.check('read');

    for (const key of keys) {
      if (!this.has(key)) {
        return false;
      }
    }

    return true;
  }

  public add(key: T): this {
    this.permissions.check('write');
    this.raw.push(key);

    return this;
  }

  public addMany(keys: Iterable<T>): this {
    this.permissions.check('write');
    for (const key of keys) {
      this.add(key);
    }

    return this;
  }

  private get(key: T): number {
    this.permissions.check('read');
    return this.raw.indexOf(key);
  }

  public remove(key: T): this {
    this.permissions.check('write');

    const index = this.get(key);
    if (index !== -1) {
      this.raw.splice(index, 1);
    }

    return this;
  }

  public removeMany(keys: Iterable<T>): this {
    this.permissions.check('write');

    for (const key of keys) {
      this.remove(key);
    }

    return this;
  }

  public clear(): this {
    this.permissions.check('write');
    this.raw = [];
    return this;
  }

  public forEach(callback: Predicate<this, T, void>): this {
    this.permissions.check('read');
    for (const value of this.raw) {
      callback(value, this);
    }
    return this;
  }

  public filter<S extends T>(
    callback: (value: T, obj: this) => value is S
  ): BaseSet<S>;
  public filter(callback: Predicate<this, T, boolean>): BaseSet<T>;
  public filter(callback: Predicate<this, T, boolean>): BaseSet<T> {
    this.permissions.check('read');
    const output = new BaseSet<T>([], this.permissions.clone().data());

    for (const value of this.raw) {
      if (callback(value, this)) {
        output.permissions.check('write');
        output.add(value);
      }
    }
    return output;
  }

  public map<R = T>(callback: Predicate<this, T, R>): BaseSet<R> {
    this.permissions.check('read');
    const output = new BaseSet<R>([], this.permissions.clone().data());

    for (const value of this.raw) {
      output.permissions.check('write');
      output.add(callback(value, this));
    }
    return output;
  }

  public some(callback: Predicate<this, T, boolean>): boolean {
    this.permissions.check('read');
    for (const value of this.raw) {
      if (callback(value, this)) {
        return true;
      }
    }
    return false;
  }

  public every(callback: Predicate<this, T, boolean>): boolean {
    this.permissions.check('read');
    for (const value of this.raw) {
      if (!callback(value, this)) {
        return false;
      }
    }
    return true;
  }

  public clone(): BaseSet<T> {
    this.permissions.check('read');
    return new BaseSet<T>(this.raw, this.permissions.clone().data());
  }

  public *entries(): IterableIterator<[T, T]> {
    this.permissions.check('read');

    for (const value of this.raw) {
      yield [value, value];
    }
  }

  public *keys(): IterableIterator<T> {
    this.permissions.check('read');

    for (const value of this.raw) {
      yield value;
    }
  }

  public *values(): IterableIterator<T> {
    this.permissions.check('read');

    for (const value of this.raw) {
      yield value;
    }
  }

  public [Symbol.iterator](): IterableIterator<T> {
    this.permissions.check('read');
    return this.values();
  }

  public get [Symbol.toStringTag]() {
    return `${this.constructor.name} (${this.size} items)`;
  }

  public toJSON(): Array<T> {
    this.permissions.check('read');
    return this.raw;
  }

  public toString(): string {
    this.permissions.check('read');
    return JSON.stringify(this.toJSON());
  }
}
