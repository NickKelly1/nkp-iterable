import { Maybe } from '@nkp/maybe';
import { GetURI, HKT, Kind, URIs } from '../HKT';
import { Pipeline } from '../pipeline/pipeline';
import { Pipelineable, unpipeline } from '../utils/types';
import { $TODO } from '../utils/utility-types';

// declare URI
export const DamURI = 'Dam';
export type DamURI = typeof DamURI;

// register for usage as higher kind type
declare module '../HKT' {
  interface URIToKind<A> {
    readonly [DamURI]: Dam<A>;
  }
}

/**
 * Iterable Dam
 *
 * Items rest calmy in the dam until the foodgates open.
 *
 *  - memory: light
 *  - cpu: heavy
 *
 * Items are created on-demand when an endpoint function like toArray(),
 * toSet(), item(...), or getSize(...) are called.
 * Items are otherwise not stored in the Dam's memory
 *
 * Do ! NOT ! use directly with exhaustive iterators like:
 *  - Array.prototype.values
 *  - Set.prototype.values
 *  - Map.prototype.keys
 *  - Map.prototype.values
 *  - Map.prototype.entries
 *  - ...
 * as these iterators, once exhausted, cannot be reset to their initial state
 * and will stop producing values
 *
 * However, you may use a factory function that returns an iterator
 *
 * Bad:
 * ```ts
 * const map = new Map([[1, {}, [2, {}], [3, {}]])
 * new Dam(map.values());
 * ```
 *
 * Good:
 * ```ts
 * const map = new Map([[1, {}, [2, {}], [3, {}]]);
 * new Dam(() => map.values())
 * ```
 */
export class Dam<T> extends Pipeline<T> implements HKT<DamURI, T> {
  public override readonly URI = DamURI;

  constructor(protected readonly root: Pipelineable<T>) {
    super();
  }

  /**
   * Create a Repeatable from a recording
   *
   * @param Iterable
   * @param
   * @param T
   */
  static record<T>(iterable: Iterable<T>): Dam<T> {
    return new Dam<T>(Array.from(iterable));
  }

  /**
   * @inheritdoc
   */
  * [Symbol.iterator](): IterableIterator<T> {
    yield * unpipeline(this.root);
  }

  /**
   * Collect the Dam's contents
   *
   * Runs all transformations and rebases to an array of the resulting items
   */
  rebase<H1 extends URIs>(this: Kind<H1, T>): Kind<H1, T> {
    return new (this.constructor as $TODO)(this.toArray());
  }

  /**
   * Fire callback for each element of the Pipeline
   *
   * @param callbackfn
   */
  forEach<H1 extends URIs = GetURI<this>>(
    this: Kind<H1, T>,
    callbackfn: (item: T, i: number, stop: () => void) => unknown,
  ): Kind<H1, T> {
    let stopped = false;
    const stop = () => { stopped = true; };
    let i = 0;
    for (const item of this) {
      i += 1;
      callbackfn(item, i, stop);
      if (stopped) break;
    }
    return this;
  }

  /**
   * Get the first value
   *
   * @returns
   */
  first<H1 extends URIs = GetURI<this>>(this: Kind<H1, T>): Maybe<T> {
    return (this as Dam<T>).at(0);
  }

  /**
   * Find an item in the iterable
   */
  find<H1 extends URIs = GetURI<this>>(
    this: Kind<H1, T>,
    callbackfn: (value: T, currentIndex: number) => boolean,
  ): Maybe<T> {
    let i = 0;
    for (const item of this) {
      if (callbackfn(item, i)) return Maybe.some(item);
      i += 1;
    }
    return Maybe.none;
  }

  /**
   * Get the current size of the pipeline if run
   */
  getSize<H1 extends URIs = GetURI<this>>(this: Kind<H1, T>): number {
    const self = this as Dam<T>;
    if (Array.isArray(self.root)) return self.root.length;
    if (self.root instanceof Set) return self.root.size;
    if (self.root instanceof Map) return self.root.size;
    let i = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of this) { i += 1; }
    return i;
  }

  /**
   * Get the n'th item in the pipeline if run
   *
   * iterates over the entire iterable until the index
   * this is a heavy operation
   *
   * if you need index access, consider using @nkp/collection
   * or arrays instead
   *
   * @param index
   * @returns
   */
  at(index: number): Maybe<T> {
    // shortcut for arrays
    if (Array.isArray(this.root)) {
      if (index >= 0) {
        if (index >= this.root.length) return Maybe.none;
        return Maybe.some(this.root[index]);
      } else {
        if (-index > this.root.length) return Maybe.none;
        return Maybe.some(this.root[this.root.length - index]);
      }
    }

    let i = 0;
    if (i >= 0) {
      // seek to index
      for (const item of this) {
        if (i === index) return Maybe.some(item);
        i += 1;
      }
      return Maybe.none;
    } else {
      // i is negative
      // collect as array and reverse index
      const arr = (this as Kind<DamURI, T>).toArray();
      if (-index > arr.length) return Maybe.none;
      return Maybe.some(arr[arr.length - index]!);
    }
  }
}