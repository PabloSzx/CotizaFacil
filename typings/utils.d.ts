/**
 * If B implements A, it gives A, otherwise, it gives never
 */
export type IfImplements<A, B> = B extends A ? A : never;
