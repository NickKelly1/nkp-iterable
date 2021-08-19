import { Dam } from './dam';

describe('Dam', () => {
  it('should flatten itself', () => {
    const c1 = new Dam([1, 2, 3,]);
    const c2 = new Dam(c1);
    for (const next of c2) {
      expect(typeof next).toEqual('number');
    }
  });

  describe('at(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]);
        expect(pipeline.at(0).value).toEqual(1);
        expect(pipeline.at(1).value).toEqual(2);
        expect(pipeline.at(2).value).toEqual(3);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,]));
        expect(pipeline.at(0).value).toEqual(1);
        expect(pipeline.at(1).value).toEqual(2);
        expect(pipeline.at(2).value).toEqual(3);
      });
      it('map', () => {
        const map = new Map<number, number>([
          [1, 1,], [2, 2,], [3, 3,],
        ]);
        const pipeline = new Dam(map);
        expect(pipeline.at(0).value).toEqual([1, 1,]);
        expect(pipeline.at(1).value).toEqual([2, 2,]);
        expect(pipeline.at(2).value).toEqual([3, 3,]);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1; yield 2; yield 3;
        });
        expect(pipeline.at(0).value).toEqual(1);
        expect(pipeline.at(1).value).toEqual(2);
        expect(pipeline.at(2).value).toEqual(3);
      });
    });
  });

  describe('run(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]);
        const called: number[] = [];
        pipeline.forEach(item => { called.push(item); });
        expect(called[0]).toEqual(1);
        expect(called[1]).toEqual(2);
        expect(called[2]).toEqual(3);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,]));
        const called: number[] = [];
        pipeline.forEach(item => { called.push(item); });
        expect(called[0]).toEqual(1);
        expect(called[1]).toEqual(2);
        expect(called[2]).toEqual(3);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map);
        const called: [number, number][] = [];
        pipeline.forEach(item => { called.push(item); });
        expect(called[0]).toEqual([1, 1,]);
        expect(called[1]).toEqual([2, 2,]);
        expect(called[2]).toEqual([3, 3,]);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1; yield 2; yield 3;
        });
        expect(pipeline.at(0).value).toEqual(1);
        expect(pipeline.at(1).value).toEqual(2);
        expect(pipeline.at(2).value).toEqual(3);
      });
    });
  });

  describe('map(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]).map(n => n + 1);
        expect(pipeline.at(0).value).toEqual(2);
        expect(pipeline.at(1).value).toEqual(3);
        expect(pipeline.at(2).value).toEqual(4);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,])).map(n => n + 1);
        expect(pipeline.at(0).value).toEqual(2);
        expect(pipeline.at(1).value).toEqual(3);
        expect(pipeline.at(2).value).toEqual(4);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map).map<[number, number]>(
          ([a, b,]) => ([a + 1, b + 1,]));
        expect(pipeline.at(0).value).toEqual([2, 2,]);
        expect(pipeline.at(1).value).toEqual([3, 3,]);
        expect(pipeline.at(2).value).toEqual([4, 4,]);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        }).map(n => n + 1);
        expect(pipeline.at(0).value).toEqual(2);
        expect(pipeline.at(1).value).toEqual(3);
        expect(pipeline.at(2).value).toEqual(4);
      });
    });
  });

  describe('first(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]);
        expect(pipeline.first().value).toEqual(1);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,]));
        expect(pipeline.first().value).toEqual(1);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map);
        expect(pipeline.first().value).toEqual([1, 1,]);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        });
        expect(pipeline.first().value).toEqual(1);
      });
    });
  });

  describe('filter(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]).filter((v) => v !== 2);
        expect(pipeline.at(1).value).toEqual(3);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,])).filter((v) => v !== 2);
        expect(pipeline.at(1).value).toEqual(3);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map).filter(([v,]) => v !== 2);
        expect(pipeline.at(1).value).toEqual([3, 3,]);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        }).filter((v) => v !== 2);
        expect(pipeline.at(1).value).toEqual(3);
      });
    });
  });

  describe('exclude(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]).exclude(1, 2);
        expect(pipeline.at(0).value).toEqual(3);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,])).exclude(1, 3);
        expect(pipeline.at(0).value).toEqual(2);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(() => map.values()).exclude(3, 1);
        expect(pipeline.at(0).value).toEqual(2);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        }).exclude(2);
        expect(pipeline.at(1).value).toEqual(3);
      });
    });
  });

  describe('pick(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]).pick(1, 3);
        expect(pipeline.at(1).value).toEqual(3);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,])).pick(1, 3);
        expect(pipeline.at(1).value).toEqual(3);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map.values()).pick(3, 1);
        expect(pipeline.at(1).value).toEqual(3);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        }).pick(2);
        expect(pipeline.at(0).value).toEqual(2);
      });
    });
  });

  describe('getSize(...)', () => {
    describe('should map every item', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]);
        expect(pipeline.getSize()).toEqual(3);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,]));
        expect(pipeline.getSize()).toEqual(3);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map);
        expect(pipeline.getSize()).toEqual(3);
      });
      it('generator', () => {
        const pipeline = new Dam(function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        });
        expect(pipeline.getSize()).toEqual(3);
      });
    });
  });


  describe('push(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]).push(4, 5);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,])).push(4, 5);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(() => map.values()).push(4, 5);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
      it('generator', () => {
        const generator = function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        };
        const pipeline = new Dam(generator).push(4, 5);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
    });
  });


  describe('concat(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]).concat([4, 5,]);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,])).concat([4, 5,]);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(() => map.values()).concat([4, 5,]);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
      it('generator', () => {
        const generator = function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        };
        const pipeline = new Dam(generator).concat([4, 5,]);
        expect(pipeline.at(3).value).toEqual(4);
        expect(pipeline.at(4).value).toEqual(5);
      });
    });
  });


  describe('sort(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]).sort(-1);
        expect(pipeline.sort(-1).toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort(1).toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('desc').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('asc').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('DESC').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('ASC').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('-1').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('1').toArray()).toEqual([1, 2, 3,]);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,]));
        expect(pipeline.sort(-1).toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort(1).toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('desc').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('asc').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('DESC').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('ASC').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('-1').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('1').toArray()).toEqual([1, 2, 3,]);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(() => map.values());
        expect(pipeline.sort(-1).toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort(1).toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('desc').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('asc').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('DESC').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('ASC').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('-1').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('1').toArray()).toEqual([1, 2, 3,]);
      });
      it('generator', () => {
        const generator = function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        };
        const pipeline = new Dam(generator);
        expect(pipeline.sort(-1).toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort(1).toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('desc').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('asc').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('DESC').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('ASC').toArray()).toEqual([1, 2, 3,]);
        expect(pipeline.sort('-1').toArray()).toEqual([3, 2, 1,]);
        expect(pipeline.sort('1').toArray()).toEqual([1, 2, 3,]);
      });
    });
  });

  describe('toArray(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]);
        expect(pipeline.toArray()).toEqual([1, 2, 3,]);
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,]));
        expect(pipeline.toArray()).toEqual([1, 2, 3,]);
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map);
        expect(pipeline.toArray()).toEqual([[1, 1,], [2, 2,], [3, 3,],]);
      });
      it('generator', () => {
        const generator = function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        };
        const pipeline = new Dam(generator);
        expect(pipeline.toArray()).toEqual([1, 2, 3,]);
      });
    });
  });

  describe('toSet(...)', () => {
    describe('should work on', () => {
      it('array', () => {
        const pipeline = new Dam([1, 2, 3,]);
        expect(pipeline.toSet()).toEqual(new Set([1, 2, 3,]));
      });
      it('set', () => {
        const pipeline = new Dam(new Set([1, 2, 3,]));
        expect(pipeline.toSet()).toEqual(new Set([1, 2, 3,]));
      });
      it('map', () => {
        const map = new Map<number, number>([[1, 1,], [2, 2,], [3, 3,],]);
        const pipeline = new Dam(map);
        expect(pipeline.toSet()).toEqual(new Set([[1, 1,], [2, 2,], [3, 3,],]));
      });
      it('generator', () => {
        const generator = function * (): Iterable<number> {
          yield 1;
          yield 2;
          yield 3;
        };
        const pipeline = new Dam(generator);
        expect(pipeline.toSet()).toEqual(new Set([1, 2, 3,]));
      });
    });
  });
});