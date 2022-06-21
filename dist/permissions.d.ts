import { Bits } from "./bits";
export interface Perm {
    read: boolean;
    write: boolean;
}
export declare class Permissions extends Bits<Perm> {
    constructor(permissions?: Partial<Perm>);
    check<U extends keyof Perm>(key: U): this;
}
