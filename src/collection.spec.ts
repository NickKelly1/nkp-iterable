import { Collection } from './collection';
import { testAt } from './test/at.spec.util';
import { testBtw } from './test/btw.spec.util';
import { testConcat } from './test/concat.spec.util';
import { testEvery } from './test/every.spec.util';
import { testExclude } from './test/exclude.spec.util';
import { testFilter } from './test/filter.spec.util';
import { testFindIndex } from './test/find-index.spec.util';
import { testFind } from './test/find.spec.util';
import { testFirst } from './test/first.spec.util';
import { testFlatMap } from './test/flat-map.spec.util';
import { testFlatSome } from './test/flat-some.spec.util';
import { testFlat } from './test/flat.spec.util';
import { testForEach } from './test/for-each.spec.util';
import { testForkFlat } from './test/fork-flat.spec.util';
import { testForkMap } from './test/fork-map.spec.util';
import { testForkOn } from './test/fork-on.spec.util';
import { testGetSize } from './test/get-size.spec.util';
import { testGt } from './test/gt.spec.util';
import { testGte } from './test/gte.spec.util';
import { testIndexOf } from './test/index-of.spec.util';
import { testJoin } from './test/join.spec.util';
import { testLt } from './test/lt.spec.util';
import { testLte } from './test/lte.spec.util';
import { testMap } from './test/map.spec.util';
import { testMatch } from './test/match.spec.util';
import { testMatching } from './test/matching.spec.util';
import { testNotMatching } from './test/not-matching.spec.util';
import { testNotNull } from './test/not-null.spec.util';
import { testNotNullable } from './test/not-nullable.spec.util';
import { testNotUndefined } from './test/not-undefined.spec.util';
import { testPick } from './test/pick.spec.util';
import { testPluck } from './test/pluck.spec.util';
import { testPrecat } from './test/precat.spec.util';
import { testPush } from './test/push.spec.util';
import { testReduceRight } from './test/reduce-right.spec.util';
import { testReduce } from './test/reduce.spec.util';
import { testReverse } from './test/reverse.spec.util';
import { testSkip } from './test/skip.spec.util';
import { testSlice } from './test/slice.spec.util';
import { testSome } from './test/some.spec.util';
import { testSort } from './test/sort.spec.util';
import { testTake } from './test/take.spec.util';
import { testTapSelf } from './test/tap-self.spec.util';
import { testTap } from './test/tap.spec.util';
import { testToArray } from './test/to-array.spec.util';
import { testToMap } from './test/to-map.spec.util';
import { testToSet } from './test/to-set.spec.util';
import { testUnique } from './test/unique.spec.util';
import { testUnshift } from './test/unshift.spec.util';
import { testZipLong } from './test/zip-long.spec.util';
import { testZipShort } from './test/zip-short.spec.util';
import { Iterateable } from './types';

describe('Collection', () => {
  it('should flatten on construction', () => {
    const c1 = new Collection([1, 2, 3,]);
    const c2 = new Collection(c1);
    for (const next of c2) {
      expect(typeof next).toEqual('number');
    }
  });

  function create<T>(iterable: Iterateable<T>): Collection<T> {
    return new Collection(iterable);
  }

  testAt(create);
  testBtw(create);
  testConcat(create);
  testEvery(create);
  testExclude(create);
  testFilter(create);
  testFind(create);
  testFindIndex(create);
  testFirst(create);
  testFlat(create);
  testFlatMap(create);
  testFlatSome(create);
  testForEach(create);
  testForkFlat(create);
  testForkMap(create);
  testForkOn(create);
  testGetSize(create);
  testGt(create);
  testGte(create);
  testIndexOf(create);
  testJoin(create);
  testLt(create);
  testLte(create);
  testMap(create);
  testMatch(create);
  testMatching(create);
  testNotMatching(create);
  testNotNull(create);
  testNotNullable(create);
  testNotUndefined(create);
  testPick(create);
  testPluck(create);
  testPrecat(create);
  testPush(create);
  testReduce(create);
  testReduceRight(create);
  testReverse(create);
  testSkip(create);
  testSlice(create);
  testSome(create);
  testSort(create);
  testTake(create);
  testTap(create);
  testTapSelf(create);
  testToArray(create);
  testToMap(create);
  testToSet(create);
  testUnique(create);
  testUnshift(create);
  testZipLong(create);
  testZipShort(create);
});
