import { Flood, Not, Set } from "./types";

export type Bit = 0 | 1;

export class Bits<
  T extends Record<K, boolean>,
  K extends string | number | symbol = keyof T
> {
  private static: typeof Bits = Bits;
  private raw: number;
  private key: Array<keyof T>;

  constructor(data: T) {
    this.key = Reflect.ownKeys(data).sort() as Array<keyof T>;
    this.raw = this.static.load(data);
  }

  private at(key: keyof T) {
    return this.key.indexOf(key);
  }

  private mask(key: keyof T) {
    return 1 << this.at(key);
  }

  // @ts-ignore
  public enable<U extends keyof T>(key: U): Bits<Set<T, U, true>, K> {
    this.raw |= this.mask(key);
    return this as never; // lol
  }

  // @ts-ignore
  public disable<U extends keyof T>(key: U): Bits<Set<T, U, false>, K> {
    this.raw &= ~this.mask(key);
    return this as never; // lol
  }

  // @ts-ignore
  public toggle<U extends keyof T>(key: U): Bits<Set<T, U, Not<T[U]>>, K> {
    this.raw ^= this.mask(key);
    return this as never; // lol
  }

  public set<U extends K, V extends boolean>(
    key: U,
    value: V
    // @ts-ignore
  ): Bits<Set<T, U, V>, K> {
    switch (value) {
      case true:
        return this.enable(key) as never;
      case false:
        return this.disable(key) as never;
      default:
        throw new Error("Invalid value");
    }
  }

  public get<U extends keyof T>(key: U): T[U] {
    return Boolean(this.raw & this.mask(key)) as T[U];
  }

  public data(): T {
    return this.static.unload(this.raw, this.key);
  }

  public fill<V extends boolean>(value: boolean): Bits<Flood<T, V>, K> {
    for (const key of this.key) {
      this.set(key as K, value);
    }
    return this as never; // lol
  }

  public reset(): Bits<Flood<T, false>, K> {
    this.raw = 0;
    return this as never; // lol
  }

  public flood(): Bits<Flood<T, true>, K> {
    return this.fill(true);
  }

  public clone() {
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

  static load<
    T extends Record<K, boolean>,
    K extends string | number | symbol = keyof T
  >(data: T) {
    const keys = Reflect.ownKeys(data).sort() as Array<K>;

    let output = 0;

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = data[key! as K];
      if (value) {
        output = output | (1 << index);
      }
    }

    return output;
  }

  static unload<
    T extends Record<K, boolean>,
    K extends string | number | symbol = keyof T
  >(value: number, keys: Array<keyof T>) {
    let output = {} as T;

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const bit = 1 << index;
      output[key as K] = ((value & bit) !== 0) as T[K];
    }

    return output;
  }
}

const obj = {
  a: true,
  b: false,
} as const;

const bits = new Bits(obj);
bits.clone().enable("b").set("a", false).data().a;
