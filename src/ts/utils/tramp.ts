/**
 * Transforms a function that returns either a direct value or a thunk (a
 * no-argument function that returns a value) into a function that only returns
 * a direct value. It does this by repeatedly evaluating the function if it
 * returns a thunk, until a direct value is obtained.
 *
 * @template T The type of the value to be returned by the trampoline function.
 * @template A The type tuple representing the argument types accepted by the
 * function `f`.
 * @param f A function that takes arguments of type `A` and returns either a
 * value of type `T` or a thunk that returns `T`.
 * @returns A function that takes the same arguments but guarantees to return a
 * direct value of type `T`.
 *
 * To convert a normal recursive function into a trampolined one:
 * 1. Modify the recursive function to return a thunk instead of making a direct
 *    recursive call.
 * 2. Wrap the modified function with the `tramp` function.
 *
 * @example
 * ```typescript
 * // Original recursive function
 * function factorial(n: bigint, x = 1n): bigint {
 *     if (n <= 1) return x;
 *     return factorial(n - 1n, n * x);
 * }
 *
 * // Modified to use trampoline
 * function factorialAux(n: bigint, x = 1n): bigint | Thunk<bigint> {
 *     if (n <= 1) return x;
 *     return () => factorial(n - 1n, n * x);
 * }
 * const trampolinedFactorial = tramp(factorialAux);
 * ```
 */
export function tramp<T, A extends readonly any[]>(f: (...args: A) => (T | Thunk<T>)): (...args: A) => T {
    return (...args: A) => {
        let result = f(...args);
        while (is_thunk(result)) {
            result = result();
        }
        return result;
    };
}

export type Thunk<T> = () => T;

export function is_thunk<T>(v: T | Thunk<T>): v is Thunk<T> {
    return typeof v === "function" && v.length === 0;
}