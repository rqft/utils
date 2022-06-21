export declare type Override<T1, T2> = Omit<T1, keyof T2> & T2;
export declare type Flood<T, U> = {
    [P in keyof T]: U;
};
export declare type Not<T extends boolean> = T extends true ? false : true;
export declare type Set<T extends Record<Key, boolean>, K extends keyof T, V> = Override<T, {
    [P in K]: V;
}>;
export declare type Key = string | number | symbol;
