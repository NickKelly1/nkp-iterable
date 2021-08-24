import { Maybe, None, Some } from '@nkp/maybe';
import { smartSort, toIterable } from './utils';
import { $ANY, $TODO } from './utility-types';
import { Iterateable, Orderable, Betweenable } from './types';
import { ICollection } from './collection.interface';

/**
 * Collection
 */
export class Collection<T> implements ICollection<T> {
  /**
   * Create a new Collection
   */
  static from<T>(pipelineable: Iterateable<T>): Collection<T> {
    return new Collection(pipelineable);
  }

  protected readonly items: T[];

  /**
   * Create a collection
   *
   * @param pipelineable
   */
  constructor(pipelineable: Iterateable<T>) {
    const iterable = toIterable(pipelineable);
    if (Array.isArray(iterable)) this.items = iterable;
    else this.items = Array.from(iterable);
  }

  /**
   * Get an iterator for the collections items
   */
  [Symbol.iterator](): IterableIterator<T> {
    return this.items[Symbol.iterator]();
  }

  /**
   * Length of the collection
   */
  getSize(): number {
    return this.items.length;
  }

  /**
   * Execute a side-effect callback on the collection itself
   *
   * Return the original collection
   *
   * @param callbackfn
   * @returns
   */
  tapSelf(callbackfn: (self: Collection<T>) => unknown): this {
    callbackfn(this);
    return this;
  }

  /**
   * Execute a side-effect callback for each item in the collection
   *
   * Return the original collection
   *
   * @param callbackfn
   * @returns
   */
  tap(callbackfn: (item: T, i: number) => unknown): this {
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      callbackfn(this.items[i]!, i);
    }
    return this;
  }

  /**
   * Execute a side-effect callback for each item in the collection
   *
   * @param callbackfn
   */
  forEach(callbackfn: (item: T, i: number) => unknown): void {
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      callbackfn(this.items[i]!, i);
    }
  }

  /**
   * Get the first value of the collection
   *
   * @returns
   */
  first(): Maybe<T> {
    if (this.items.length <= 0) return Maybe.none;
    return Maybe.some(this.items[0]!);
  }

  /**
   * Map the collection from `T` to `U`
   *
   * @param callbackfn
   * @returns
   */
  map<U>(callbackfn: (value: T, currentIndex: number) => U): Collection<U> {
    const collected: U[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      collected.push(callbackfn(this.items[i]!, i));
    }
    return new Collection(collected);
  }

  /**
   * Flat map the pipeline
   *
   * Flatly map pipeline kind S to V, and type T to U
   *
   * @param callbackfn
   * @returns
   */
  flatMap<U>(callbackfn: (value: T, currentIndex: number) => Iterateable<U>): Collection<U> {
    const collected: U[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      const iterable = callbackfn(item, i);
      collected.push(...toIterable(iterable));
    }
    return new Collection(collected);
  }

  /**
   * Flatten the pipeline
   *
   * @param this
   * @returns
   */
  flat<U>(this: Collection<Iterable<U>>): Collection<U> {
    const collected: U[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      collected.push(...item);
    }
    return new Collection(collected);
  }


  /**
   * Pick only the Some values
   */
  flatSome<U>(this: Collection<Some<U>>): Collection<U>
  flatSome<U>(this: Collection<Maybe<U>>): Collection<U>
  flatSome(this: Collection<None>): Collection<never>
  flatSome<U>(this: Collection<Maybe<U>>): Collection<U> {
    return this
      .filter(Maybe.isSome)
      .map(item => item.value);
  }

  /**
   * Filter the pipeline
   *
   * @param callbackfn
   * @returns
   */
  filter<U extends T>(callbackfn: ((value: T, currentIndex: number) => value is U)): Collection<U>
  filter(callbackfn: (value: T, currentIndex: number) => boolean): Collection<T>
  filter(callbackfn: (value: T, currentIndex: number) => boolean): Collection<T> {
    const collected: T[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (callbackfn(item, i)) collected.push(item);
    }
    return new Collection(collected);
  }

  /**
   * Filter in values less than the given value
   *
   * @param value
   * @returns
   */
  lt(value: Orderable): Collection<T> {
    const collected: T[] = [];
    const to = this.items.length;
    const _value = Number(value);
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      const number = Number(item);
      if (!Number.isNaN(number) && number < _value) {
        collected.push(item);
      }
    }
    return new Collection(collected);
  }

  /**
   * Filter in values less than the given value
   *
   * @param value
   * @returns
   */
  lte(value: Orderable): Collection<T> {
    const collected: T[] = [];
    const to = this.items.length;
    const _value = Number(value);
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      const number = Number(item);
      if (!Number.isNaN(number) && number <= _value) {
        collected.push(item);
      }
    }
    return new Collection(collected);
  }

  /**
   * Filter in values less than the given value
   *
   * @param value
   * @returns
   */
  gt(value: Orderable): Collection<T> {
    const collected: T[] = [];
    const to = this.items.length;
    const _value = Number(value);
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      const number = Number(item);
      if (!Number.isNaN(number) && number > _value) {
        collected.push(item);
      }
    }
    return new Collection(collected);
  }

  /**
   * Filter in values less than the given value
   *
   * @param value
   * @returns
   */
  gte(value: Orderable): Collection<T> {
    const collected: T[] = [];
    const to = this.items.length;
    const _value = Number(value);
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      const number = Number(item);
      if (!Number.isNaN(number) && number >= _value) {
        collected.push(item);
      }
    }
    return new Collection(collected);
  }

  /**
   * Filter in values less than the given value
   *
   * @param value
   * @returns
   */
  btw(left: Betweenable, right: Betweenable): Collection<T> {
    const collected: T[] = [];
    const to = this.items.length;

    let li = true;
    let lv: number;
    if (typeof left === 'number')  lv = left;
    else if (left instanceof Date) lv = left.valueOf();
    else if (Array.isArray(left)) {
      const leftValue = left[0]!;
      if (typeof leftValue === 'number')  lv = leftValue;
      else if (leftValue instanceof Date) lv = leftValue.valueOf();
      li = left[1] ?? true;
    }
    else {
      const leftValue = left.value!;
      if (typeof leftValue === 'number')  lv = leftValue;
      else if (leftValue instanceof Date) lv = leftValue.valueOf();
      li = left.inclusive ?? true;
    }

    let ri = true;
    let rv: number;
    if (typeof right === 'number')  rv = right;
    else if (right instanceof Date) rv = right.valueOf();
    else if (Array.isArray(right)) {
      const rightValue = right[0]!;
      if (typeof rightValue === 'number')  rv = rightValue;
      else if (rightValue instanceof Date) rv = rightValue.valueOf();
      ri = right[1] ?? true;
    }
    else {
      const rightValue = right.value!;
      if (typeof rightValue === 'number')  rv = rightValue;
      else if (rightValue instanceof Date) rv = rightValue.valueOf();
      ri = right.inclusive ?? true;
    }

    // we try to avoid excessive branching inside function calls to keep
    // everything fast
    // that's why the same loop is repeated nearly 4 times
    //
    // some other popular libraries like Webpack achieve this by compiling
    // code using new Function(...)
    // but this use-case is simple enough that we can avoid it

    switch (li) {
    case true:
      switch (ri) {
      case true:
        // [left, right]
        for (let i = 0; i < to; i += 1) {
          const item = this.items[i]!;
          const number = Number(item);
          if (!Number.isNaN(number)
            && number >= lv!
            && number <= rv!
          ) {
            collected.push(item);
          }
        }
        break;
      case false:
        // [left, right)
        for (let i = 0; i < to; i += 1) {
          const item = this.items[i]!;
          const number = Number(item);
          if (!Number.isNaN(number)
            && number >= lv!
            && number < rv!
          ) {
            collected.push(item);
          }
        }
        break;
      }
      break;
    case false:
      switch (ri) {
      case true:
        // (left, right]
        for (let i = 0; i < to; i += 1) {
          const item = this.items[i]!;
          const number = Number(item);
          if (!Number.isNaN(number)
            && number > lv!
            && number <= rv!
          ) {
            collected.push(item);
          }
        }
        break;
      case false:
        // (left, right)
        for (let i = 0; i < to; i += 1) {
          const item = this.items[i]!;
          const number = Number(item);
          if (!Number.isNaN(number)
            && number > lv!
            && number < rv!
          ) {
            collected.push(item);
          }
        }
        break;
      }
      break;
    }

    return new Collection(collected);
  }

  /**
   * Filter out the specific values
   *
   * @param value
   */
  exclude(...remove: T[]): Collection<T> {
    const removeSet = new Set(remove);
    const collected: NonNullable<T>[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (!removeSet.has(item)) {
        collected.push(item);
      }
    }
    return new Collection(collected);
  }

  /**
   * Exclude the first "count" items of the pipeline
   *
   * @param count
   * @returns
   */
  skip(count?: number): Collection<T> {
    const _count = count ?? 1;
    const to = this.items.length;
    const collected: T[] = [];
    for (let i = _count; i < to; i += 1) {
      collected.push(this.items[i]!);
    }
    return new Collection(collected);
  }

  /**
   * Exclude items that test positive
   *
   * @param regexp
   * @returns
   */
  notMatching(regexp: RegExp): Collection<T> {
    const collected: T[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (!regexp.test(String(item))) collected.push(item);
    }
    return new Collection(collected);
  }

  /**
   * Exclude undefined values from the pipeline
   *
   * @param this
   * @returns
   */
  notUndefined(): Collection<T extends undefined ? never : T> {
    const collected: (T extends undefined ? never : T)[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (item !== undefined) {
        collected.push(item as unknown as $TODO<$ANY>);
      }
    }
    return new Collection(collected);
  }

  /**
   * Exclude null values from the pipeline
   *
   * @param this
   * @returns
   */
  notNull(): Collection<T extends null ? never : T> {
    const collected: (T extends null ? never : T)[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (item !== null) {
        collected.push(item as unknown as $TODO<$ANY>);
      }
    }
    return new Collection(collected);
  }

  /**
   * Exclude nullable values from the pipeline
   *
   * @param this
   * @returns
   */
  notNullable(): Collection<NonNullable<T>> {
    const collected: NonNullable<T>[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (item != undefined) {
        collected.push(item as unknown as $TODO<$ANY>);
      }
    }
    return new Collection(collected);
  }

  /**
   * Filter in the specific value
   *
   * @param value
   */
  pick(...keep: T[]): Collection<T> {
    const keepSet = new Set(keep);
    const collected: NonNullable<T>[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (keepSet.has(item)) {
        collected.push(item);
      }
    }
    return new Collection(collected);
  }

  /**
   * Pick items that test positive
   *
   * @param regexp
   * @returns
   */
  matching(regexp: RegExp): Collection<T> {
    const collected: NonNullable<T>[] = [];
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (regexp.test(String(item))) {
        collected.push(item);
      }
    }
    return new Collection(collected);
  }

  /**
   * Pick the first "count" items of the pipeline
   *
   * @param count
   * @returns
   */
  take(count?: number): Collection<T> {
    const collected: NonNullable<T>[] = [];
    const _count = count ?? 1;
    const to = Math.min(_count, this.items.length);
    for (let i = 0; i < to; i += 1) {
      collected.push(this.items[i]!);
    }
    return new Collection(collected);
  }

  /**
   * Push items onto the pipeline
   *
   * @param push
   * @returns
   */
  push(...pushed: T[]): Collection<T> {
    const collected: T[] = Array.from(this.items);
    collected.push(...pushed);
    return new Collection(collected);
  }

  /**
   * Concatenate items onto the pipeline
   *
   * @param concat
   * @returns
   */
  concat(concat: Iterateable<T>): Collection<T> {
    const collected: T[] = Array.from(this.items);
    collected.push(...toIterable(concat));
    return new Collection(collected);
  }

  /**
   * Unshift items onto the pipeline
   *
   * @param unshifted
   * @returns
   */
  unshift(...unshifted: T[]): Collection<T> {
    return new Collection(unshifted.concat(this.items));
  }

  /**
   * Concatenate items onto the pipeline
   *
   * @param precat
   * @returns
   */
  precat(precat: Iterateable<T>): Collection<T> {
    return new Collection([...toIterable(precat),].concat(this.items));
  }

  /**
   * Sort items on the the pipeline
   *
   * Has sensible deafaults
   *
   * Immutable
   *
   * @param sort
   * @returns
   */
  sort(
    sort:
      | 'asc' | 'ASC'
      | 'desc' | 'DESC'
      | 1 | '1'
      | -1 | '-1'
      | ((a: T, b: T) => number)
  ): Collection<T> {
    let direction: 1 | -1 = 1;
    if (typeof sort === 'string') {
      const _sort = sort.toLowerCase().trim();
      if (_sort === 'asc') direction = 1;
      if (_sort === '1') direction = 1;
      if (_sort === 'desc') direction = -1;
      if (_sort === '-1') direction = -1;
    }
    else if (sort === 1) direction = 1;
    else if (sort === -1) direction = -1;

    const sortFn = typeof sort === 'function' ? sort : smartSort(direction);

    return new Collection(Array.from(this.items).sort(sortFn));
  }

  /**
   * Reverse the pipeline
   *
   * Immutable
   *
   * @returns
   */
  reverse(): Collection<T> {
    return new Collection(Array.from(this.items).reverse());
  }

  /**
   * Slice values from the pipeline
   *
   * @param start
   * @param end
   * @returns
   */
  slice(start?: number, end?: number): Collection<T> {
    return new Collection(this.items.slice(start, end));
  }

  /**
   * Zip with another iterable, stopping on first empty result
   *
   * @param this
   * @param right
   * @returns
   */
  zipShort<U>(right: Iterateable<U>): Collection<[T, U]> {
    const collected: [T, U][] = [];
    const _right = [...toIterable(right),];
    const to = Math.min(this.items.length, _right.length);
    for (let i = 0; i < to; i += 1) {
      collected.push([this.items[i]!, _right[i]!,]);
    }
    return new Collection(collected);
  }

  /**
   * Zip with another iterable, stopping on last empty result
   *
   * @param right
   * @returns
   */
  zipLong<U>(right: Iterateable<U>): Collection<[Maybe<T>, Maybe<U>]> {
    const collected: [Maybe<T>, Maybe<U>][] = [];

    const _left = this.items;
    const _right = Array.isArray(right) ? right : [...toIterable(right),];

    const _leftLength = _left.length;
    const _rightLength = _right.length;

    const to = Math.max(_leftLength, _rightLength);
    for (let i = 0; i < to; i += 1) {
      let leftMaybe: Maybe<T>;
      if (i >= _leftLength) leftMaybe = Maybe.none;
      else leftMaybe = Maybe.some(_left[i]!);

      let rightMaybe: Maybe<U>;
      if (i >= _rightLength) rightMaybe = Maybe.none;
      else rightMaybe = Maybe.some(_right[i]!);

      collected.push([leftMaybe, rightMaybe,]);
    }
    return new Collection(collected);
  }

  /**
   * Reduce the pipeline
   *
   * @param callbackfn
   * @param initial
   * @returns
   */
  reduce<U>(
    callbackfn: ((previousValue: T, currentValue: U, currentIndex: number) => U),
    initial: U,
  ): U {
    let result = initial;
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      result = callbackfn(this.items[i]!, result, i);
    }
    return result;
  }

  /**
   * Reduce Right the pipeline
   *
   * @param this
   * @param
   * @returns
   */
  reduceRight<U>(
    callbackfn: ((previousValue: T, currentValue: U, currentIndex: number) => U),
    initial: U,
  ): U {
    let result = initial;
    const to = this.items.length;
    let index = 0;
    for (let i = to - 1; i >= 0; i -= 1) {
      result = callbackfn(this.items[i]!, result, index);
      index += 1;
    }
    return result;
  }

  /**
   * Join the pipeline into a string
   *
   * @param separator
   * @returns
   */
  join(separator?: string): string {
    return this.items.join(separator);
  }

  /**
   * Is every callback true?
   *
   * @param this
   * @param callbackfn
   * @returns
   */
  every(callbackfn: (value: T, currentIndex: number) => boolean): boolean {
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      if (!callbackfn(this.items[i]!, i)) return false;
    }
    return true;
  }

  /**
   * Is some value true?
   *
   * @param callbackfn
   * @returns
   */
  some(callbackfn: (value: T, currentIndex: number) => boolean): boolean {
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      if (callbackfn(this.items[i]!, i)) return true;
    }
    return false;
  }

  /**
   * Remove non-unique items from the pipeline
   *
   * @param this
   * @returns
   */
  unique(): Collection<T> {
    return new Collection(new Set(this.items));
  }

  /**
   * Find an item in the iterable
   */
  find(callbackfn: (value: T, currentIndex: number) => boolean): Maybe<T> {
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      const item = this.items[i]!;
      if (callbackfn(item, i)) {
        return Maybe.some(item);
      }
    }
    return Maybe.none;
  }

  /**
   * Find an index of an item in the iterable
   */
  findIndex(callbackfn: (value: T, currentIndex: number) => boolean): Maybe<number> {
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      if (callbackfn(this.items[i]!, i)) {
        return Maybe.some(i);
      }
    }
    return Maybe.none;
  }

  /**
   * Get the index of a value
   */
  indexOf(value: T): Maybe<number> {
    const to = this.items.length;
    for (let i = 0; i < to; i += 1) {
      if (this.items[i]! === value ) {
        return Maybe.some(i);
      }
    }
    return Maybe.none;
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
    const items = this.items;
    if (index >= 0) {
      if (index >= items.length) return Maybe.none;
      return Maybe.some(items[index]!);
    }
    if (-index > items.length) return Maybe.none;

    return Maybe.some(items[items.length - index]!);
  }

  /**
   * Trasnform the Pipeline to an array
   *
   * @returns
   */
  toArray(): T[] {
    return Array.from(this.items);
  }

  /**
   * Trasnform the Pipeline to an array
   *
   * @returns
   */
  toSet(): Set<T> {
    return new Set(this.items);
  }

  /**
   * Transform the Collection into a Map
   *
   * @param this
   */
  toMap<K, V>(this: Collection<[K, V]>): Map<K, V> {
    return new Map(this);
  }
}