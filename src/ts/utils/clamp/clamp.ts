/**
 * Clamps the number.
 *
 * @param value - A value to clamp.
 * @param min   - A min number.
 * @param max   - A max number.
 *
 * @return A clamped number.
 */
export function clamp( value: number, min: number, max: number ): number {
  return Math.max( Math.min( value, max ), min );
}