import { Bits } from './bits';

export interface Perm {
  read: boolean;
  write: boolean;
}

export class Permissions extends Bits<Perm> {
  constructor(permissions?: Partial<Perm>) {
    super(Object.assign({}, { read: true, write: true }, permissions));
  }

  check<U extends keyof Perm>(key: U) {
    const data = this.get(key);
    if (!data) {
      throw new Error(`Permission ${key} is not set`);
    }
    return this;
  }
}
