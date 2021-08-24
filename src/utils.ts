import { Iterateable } from './types';

/**
 * Sort with the given direction
 *
 * @param direction
 * @returns
 */
export function smartSort(direction: -1 | 1) {
  return function sort<T>(a: T, b: T): number {
    if (a === b) return 0;
    if (a < b) return -direction;
    if (a > b) return direction;
    return 0;
  };
}

/**
 * Convert the iterateable to iterable
 *
 * @param pipelineable
 * @returns
 */
export function toIterable<T>(pipelineable: Iterateable<T>): Iterable<T> {
  if (typeof pipelineable === 'function') return pipelineable();
  return pipelineable;
}