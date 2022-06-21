export type Override<T1, T2> = Omit<T1, keyof T2> & T2;
export type Flood<T, U> = { [P in keyof T]: U };
export type Not<T extends boolean> = T extends true ? false : true;
export type Set<
  T extends Record<Key, boolean>,
  K extends keyof T,
  V
> = Override<T, { [P in K]: V }>;
export type Key = string | number | symbol;
