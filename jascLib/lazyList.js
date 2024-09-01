/**
 * 遅延リストを作成する
 * @param {Array<any> | Generator<any, any, any>} collection
 * @returns {InstanceType<typeof LazyList>}
 */
function lazyList(collection) {
	return new LazyList(collection);
}

/**
 * 遅延リスト
 * @param {Array<any> | Generator<any, any, any>} collection - コレクション
 * @returns {LazyList}
 */
class LazyList {
	#collection;
	#_doneIter = false;
	#_not2array = false;

	constructor(collection) {
		if (typeof collection[Symbol.iterator] === "function") {
			this.#collection = collection;
		} else if (Jasc.isAssociative(collection)) {
			const len = collection.length ?? 0;
			const val = collection.value ?? null;
			this.#collection = this._createGenerator(len, val);
		} else {
			throw new TypeError("Invalid collection type");
		}
	}

	*[Symbol.iterator]() {
		this.#_doneIter = false;
		for (const item of this.#collection) {
			yield item;
		}
		this.#_doneIter = true;
	}

	/**
	 * 指定した長さのコレクションを生成する
	 * @param {number} length - 長さ
	 * @param {any} value - 値
	 * @returns {Generator<any, any, any>}
	 * @private
	 */
	_createGenerator(length, value) {
		function* generator() {
			for (let i = 0; i < length; i++) {
				yield value;
			}
		}
		return generator();
	}

	/**
	 * 現在のコレクションがジェネレータか配列かを返す
	 *
	 * (true:ジェネレータ, false:配列)
	 * @returns {boolean}
	 * @readonly
	 */
	get isEvaluating() {
		return !Array.isArray(this.#collection);
	}

	/**
	 * コレクションが全評価されたかを返す
	 *
	 * (toArray実行後にmapなどを使用するとfalseに戻る為注意)
	 * @returns {boolean}
	 * @readonly
	 */
	get isDone() {
		return this.#_doneIter;
	}

	/**
	 * コレクションの最初の要素を返す
	 * @returns {any}
	 * @readonly
	 */
	get first() {
		const collection = this.#collection[Symbol.iterator]();
		const { value, done } = collection.next();
		return done ? undefined : value;
	}
	/**
	 * コレクションの最後の要素を返す
	 *
	 * (遅延リストが内部で全評価される為注意)
	 * @returns {any}
	 * @readonly
	 */
	get last() {
		const list = this.toArray();
		return list[list.length - 1];
	}

	/**
	 * コレクションの要素数を返す
	 *
	 * (遅延リストが内部で全評価される為注意)
	 * @returns {number}
	 * @readonly
	 */
	get length() {
		return this.toArray().length;
	}

	/**
	 * コレクションが空かどうかを返す
	 *
	 * (遅延リストが内部で全評価される為注意)
	 * @returns {boolean}
	 * @readonly
	 */
	get isEmpty() {
		return this.length === 0;
	}
	/**
	 * コレクションが空ではないかどうかを返す
	 *
	 * (遅延リストが内部で全評価される為注意)
	 * @returns {boolean}
	 * @readonly
	 * @deprecated
	 */
	get isNotEmpty() {
		return !this.isEmpty;
	}

	/**
	 * 全ての要素に関数を適用する
	 * @param {function} mapper - 関数
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	map(mapper) {
		const generator = function* (collection) {
			for (let item of collection) {
				yield mapper(item);
			}
		};
		return new LazyList(generator(this.#collection));
	}
	/**
	 * 全ての要素に関数を適用し、返却された配列やイテレータをフラットにして返す
	 * @param {function} mapper - 関数
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	flatMap(mapper) {
		const generator = function* (collection) {
			for (let item of collection) {
				yield* mapper(item);
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * 指定された値で埋める
	 */
	fill(value, start = 0, end = Infinity) {
		const generator = function* (collection) {
			let i = 0;
			for (let item of collection) {
				if (i >= start && i < end) {
					yield value;
				} else {
					yield item;
				}
				i++;
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * 要素から条件を満たすものを取り出す
	 * @param {function} predicate - 条件
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	filter(predicate) {
		const generator = function* (collection) {
			for (let item of collection) {
				if (predicate(item)) {
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * 最初のn個の要素を取り出す
	 * @param {number} n - 要素数
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	take(n) {
		const generator = function* (collection) {
			let count = 0;
			for (let item of collection) {
				if (count++ < n) {
					yield item;
				} else {
					break;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}
	/**
	 * 条件を満たす限り要素を取り出す
	 * @param {function} predicate - 条件
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	takeWhile(predicate) {
		const generator = function* (collection) {
			for (let item of collection) {
				if (predicate(item)) {
					yield item;
				} else {
					break;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * 最初のn個の要素を取り除き、残りの要素を取り出す
	 * @param {number} n - 要素数
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	skip(n) {
		const generator = function* (collection) {
			let count = 0;
			for (let item of collection) {
				if (count++ >= n) {
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}
	/**
	 * 条件を満たす限り要素を取り除き、残りの要素を取り出す
	 * @param {function} predicate - 条件
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	dropWhile(predicate) {
		const generator = function* (collection) {
			let dropping = true;
			for (let item of collection) {
				if (dropping && !predicate(item)) {
					dropping = false;
				}
				if (!dropping) {
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * コレクションのネストされた配列をフラットにする
	 *
	 * 1層のみフラット化する
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	flatten() {
		const generator = function* (collection) {
			for (let item of collection) {
				if (Array.isArray(item)) {
					yield* item;
				} else {
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}
	/**
	 * 指定された深さまでフラット化する
	 * @param {function} mapper - 関数
	 * @param {number} depth - 深さ
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	flatMapDepth(mapper, depth = 1) {
		const generator = function* (collection, currentDepth) {
			for (let item of collection) {
				if (currentDepth > 0 && Array.isArray(item)) {
					yield* generator(item, currentDepth - 1);
				} else {
					yield mapper(item);
				}
			}
		};
		return new LazyList(generator(this.#collection, depth));
	}

	/**
	 * 新しい要素を指定位置に挿入する
	 * @param {number} index - 挿入位置(0始まり, リスト外は挿入しない)
	 * @param {any} value - 挿入する値
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	insert(index, value) {
		const generator = function* (collection, index, value) {
			let i = 0;
			for (let item of collection) {
				if (i === index) {
					yield value;
				}
				yield item;
				i++;
			}
			if (i === index) {
				yield value;
			}
		};
		return new LazyList(generator(this.#collection, index, value));
	}
	/**
	 * 新しいコレクションを指定位置に挿入する
	 * @param {number} index - 挿入位置(0始まり, リスト外は挿入しない)
	 * @param {Array<any> | InstanceType<typeof Jasc.LazyList>} otherLazy - 挿入するコレクション
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	insertList(index, otherLazy) {
		const generator = function* (collection1, collection2, index) {
			let i = 0;
			for (let item of collection1) {
				if (i === index) {
					yield* collection2;
				}
				yield item;
				i++;
			}
			if (i === index) {
				yield* collection2;
			}
		};
		return new LazyList(generator(this.#collection, otherLazy._collection, index));
	}

	/**
	 * 指定位置の要素を削除する
	 * @param {number} index - 削除位置(0始まり)
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	remove(index) {
		const generator = function* (collection, index) {
			let i = 0;
			for (let item of collection) {
				if (i !== index) {
					yield item;
				}
				i++;
			}
		};
		return new LazyList(generator(this.#collection, index));
	}
	/**
	 * 指定範囲の要素を削除する
	 * @param {number} start - 開始位置
	 * @param {number} end - 終了位置
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	removeRange(start, end) {
		const generator = function* (collection, start, end) {
			let i = 0;
			for (let item of collection) {
				if (i < start || i >= end) {
					yield item;
				}
				i++;
			}
		};
		return new LazyList(generator(this.#collection, start, end));
	}

	/**
	 * 指定位置の要素を取得
	 * @param {number} index - 取得位置(0始まり)
	 * @returns {any}
	 */
	get(index) {
		let i = 0;
		for (let item of this.#collection) {
			if (i === index) {
				return item;
			}
			i++;
		}
		return undefined;
	}
	/**
	 * 指定範囲の要素を取得
	 * @param {number} start - 開始位置
	 * @param {number} end - 終了位置
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	slice(start, end) {
		const generator = function* (collection, start, end) {
			let i = 0;
			for (let item of collection) {
				if (i >= start) {
					if (i >= end) break;
					yield item;
				}
				i++;
			}
		};
		return new LazyList(generator(this.#collection, start, end));
	}

	/**
	 * 他のコレクションを後ろに結合する
	 * @param {Array<any> | InstanceType<typeof Jasc.LazyList>} otherLazy
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	concat(otherLazy) {
		const generator = function* (collection1, collection2) {
			yield* collection1;
			yield* collection2;
		};
		return new LazyList(generator(this.#collection, otherLazy._collection));
	}
	/**
	 * コレクションを結合し、重複を排除する
	 * @param {InstanceType<typeof Jasc.LazyList>} otherLazy
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	union(otherLazy) {
		const generator = function* (collection1, collection2) {
			const seen = new Set();
			for (let item of collection1) {
				if (!seen.has(item)) {
					seen.add(item);
					yield item;
				}
			}
			for (let item of collection2) {
				if (!seen.has(item)) {
					seen.add(item);
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection, otherLazy._collection));
	}

	/**
	 * 重複する要素を取り除き、一意の要素のみ返却する
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	distinct() {
		const generator = function* (collection) {
			const seen = new Set();
			for (let item of collection) {
				if (!seen.has(item)) {
					seen.add(item);
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}
	/**
	 * 指定されたキー関数を基に重複を取り除き、一意の要素のみ返却する
	 * @param {function} keyFn - キー関数
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	uniqBy(keyFn) {
		const generator = function* (collection) {
			const seen = new Set();
			for (let item of collection) {
				const key = keyFn(item);
				if (!seen.has(key)) {
					seen.add(key);
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * オブジェクトのコレクションから指定されたキーの要素を取り出す
	 * @param {string | number | Symbol} key - キー
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	pluck(key) {
		const generator = function* (collection) {
			for (let item of collection) {
				if (item != null && key in item) {
					yield item[key];
				}
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * 2つのコレクションを要素ごとにペアにする
	 *
	 * 最も短いコレクションの要素数を使用する
	 * @param {Array<any> | InstanceType<typeof Jasc.LazyList>} other - 他コレクション
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	zip(other) {
		const generator = function* (collection, otherCollection) {
			const iterator1 = collection[Symbol.iterator]();
			const iterator2 = otherCollection[Symbol.iterator]();
			let result1 = iterator1.next();
			let result2 = iterator2.next();
			while (!result1.done && !result2.done) {
				yield [result1.value, result2.value];
				result1 = iterator1.next();
				result2 = iterator2.next();
			}
		};
		return new LazyList(generator(this.#collection, other));
	}

	/**
	 * 指定されたサイズごとに要素を分割する
	 * @param {number} size
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	chunk(size) {
		const generator = function* (collection, size) {
			let chunk = [];
			for (let item of collection) {
				chunk.push(item);
				if (chunk.length === size) {
					yield chunk;
					chunk = [];
				}
			}
			if (chunk.length > 0) {
				yield chunk;
			}
		};
		return new LazyList(generator(this.#collection, size));
	}

	/**
	 * 他のコレクションと共通する要素を取得する
	 * @param {Array<any> | InstanceType<typeof Jasc.LazyList>} other - 他コレクション
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	intersect(other) {
		const generator = function* (collection, otherCollection) {
			const otherSet = new Set(otherCollection);
			for (let item of collection) {
				if (otherSet.has(item)) {
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection, other));
	}
	/**
	 * 他のコレクションと共通しない要素を取得する
	 * @param {Array<any> | InstanceType<typeof Jasc.LazyList>} other - 他コレクション
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	difference(other) {
		const generator = function* (collection, otherCollection) {
			const otherSet = new Set(otherCollection);
			for (let item of collection) {
				if (!otherSet.has(item)) {
					yield item;
				}
			}
		};
		return new LazyList(generator(this.#collection, other));
	}

	/**
	 * コレクションから指定された全ての組み合わせを生成する
	 * @param {number} k
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	combinations(k) {
		const generator = function* (collection, k) {
			const array = Array.from(collection);
			const n = array.length;

			function* combinationHelper(start, chosen) {
				if (chosen.length === k) {
					yield chosen;
					return;
				}
				for (let i = start; i < n; i++) {
					yield* combinationHelper(i + 1, chosen.concat(array[i]));
				}
			}

			yield* combinationHelper(0, []);
		};
		return new LazyList(generator(this.#collection, k));
	}
	/**
	 * コレクションから全ての順列を生成する
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	permutations() {
		const generator = function* (collection) {
			const stack = [{ arr: collection, result: [] }];

			while (stack.length > 0) {
				const { arr, result } = stack.pop();

				if (arr.length === 0) {
					yield result;
				} else {
					for (let i = 0; i < arr.length; i++) {
						const newArr = arr.slice(0, i).concat(arr.slice(i + 1));
						stack.push({ arr: newArr, result: result.concat(arr[i]) });
					}
				}
			}
		};
		return new LazyList(generator(this.toArray()));
	}

	/**
	 * 指定された回数繰り返す
	 *
	 * 例:[1,2,3] -> [1,2,3,1,2,3]
	 *
	 * (無限リストに対して使用出来ません)
	 * @param {number} n - 何回繰り返すか
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	repeat(n) {
		this.#_throwInfiniteError("repeat");
		const generator = function* (collection, n) {
			for (let i = 0; i < n; i++) {
				yield* collection;
			}
		};
		return new LazyList(generator(this.#collection, n));
	}
	/**
	 * 指定された回数繰り返す(無限に対応)
	 *
	 * `-1`指定であれば無限に繰り返す
	 *
	 * (無限の場合一部メゾットが使用不可)
	 * (無限リストに対して使用出来ません)
	 * @param {number} [n=-1] - 何回繰り返すか
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 * @throws {Jasc.InfiniteError}
	 */
	cycle(n = -1) {
		this.#_throwInfiniteError("cycle");
		const generator = function* (collection, n) {
			let count = 0;
			while (n < 0 || count++ < n) {
				yield* collection;
			}
		};
		if (n < 0) {
			this.#_not2array = true;
		}
		return new LazyList(generator(this.#collection, n));
	}

	/**
	 * 各要素に対して指定された関数を実行するが、各要素を変更しない
	 * @param {function} sideEffect
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	tap(sideEffect) {
		const generator = function* (collection) {
			for (let item of collection) {
				sideEffect(item);
				yield item;
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * 比較関数を基にソートする(無しでjs標準のsortを使用する)
	 *
	 * (遅延リストが内部で全評価される為注意)
	 * @param {function} [comparator]
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	sort(comparator) {
		const generator = function* (collection) {
			yield* collection.sort(comparator);
		};

		return new LazyList(generator(this.toArray()));
	}

	/**
	 * 隣接する要素を指定された条件に基づいてグループ化する
	 * @param {function} predicate
	 * @returns {InstanceType<typeof Jasc.LazyList>}
	 */
	groupAdjacent(predicate) {
		const generator = function* (collection) {
			let group = [];
			let prevItem = undefined;
			for (let item of collection) {
				if (group.length === 0 || predicate(prevItem, item)) {
					group.push(item);
				} else {
					yield group;
					group = [item];
				}
				prevItem = item;
			}
			if (group.length > 0) {
				yield group;
			}
		};
		return new LazyList(generator(this.#collection));
	}

	/**
	 * 要素を1つの値に集約する
	 *
	 * (無限リストに対して使用出来ません)
	 * @param {function} reducer - 集約関数
	 * @param {any} [initialValue] - 初期値
	 * @returns {any}
	 * @throws {Error}
	 */
	reduce(reducer, initialValue) {
		this.#_throwInfiniteError("reduce");
		let accumulator = initialValue;
		for (let item of this.#collection) {
			accumulator = reducer(accumulator, item);
		}
		return accumulator;
	}

	/**
	 * 条件を満たす最初の要素を取り出す
	 *
	 * (無限リストに対して使用出来ません)
	 * @param {function} predicate - 条件
	 * @returns {any}
	 * @throws {Error}
	 */
	find(predicate) {
		this.#_throwInfiniteError("find");
		for (let item of this.#collection) {
			if (predicate(item)) {
				return item;
			}
		}
		return undefined;
	}
	/**
	 * 条件を満たす最後の要素を取り出す
	 *
	 * (遅延リストが内部で全評価される為注意)
	 * (無限リストに対して使用出来ません)
	 * @param {function} predicate - 条件
	 * @returns {any}
	 * @throws {Error}
	 */
	findLast(predicate) {
		this.#_throwInfiniteError("findLast");
		let result = undefined;
		for (let item of this.#collection) {
			if (predicate(item)) {
				result = item;
			}
		}
		return result;
	}

	/**
	 * 一致する要素のインデックスを取得する
	 *
	 * (無限リストに対して使用出来ません)
	 * @param {any} value
	 * @returns {number} 見つからない場合は-1
	 * @throws {Error}
	 */
	indexOf(value) {
		this.#_throwInfiniteError("indexOf");
		let index = 0;
		for (let item of this.#collection) {
			if (item === value) return index;
			index++;
		}
		return -1;
	}

	/**
	 * 条件を満たす要素が少なくとも1つあるかを調べる
	 *
	 * (無限リストに対して使用出来ません)
	 * @param {function} predicate - 条件
	 * @returns {boolean}
	 * @throws {Error}
	 */
	some(predicate) {
		this.#_throwInfiniteError("some");
		for (let item of this.#collection) {
			if (predicate(item)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 要素が条件を全て満たすかを調べる
	 *
	 * (無限リストに対して使用出来ません)
	 * @param {function} predicate - 条件
	 * @returns {boolean}
	 * @throws {Error}
	 */
	every(predicate) {
		this.#_throwInfiniteError("every");
		for (let item of this.#collection) {
			if (!predicate(item)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 要素をグループ化して連想配列として返却する
	 *
	 * (無限リストに対して使用出来ません)
	 * @param {function} keyFn - キーを生成する関数
	 * @returns {Object.<any, Array<any>>}
	 * @throws {Error}
	 */
	groupBy(keyFn) {
		this.#_throwInfiniteError("groupBy");
		const groups = {};
		for (let item of this.#collection) {
			const key = keyFn(item);
			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(item);
		}
		return groups;
	}

	/**
	 * 条件を満たす要素を2つの配列に分割する
	 * @param {function} predicate - 条件
	 * @returns {Array<InstanceType<typeof Jasc.LazyList>>}
	 */
	partition(predicate) {
		const trueGroup = function* (collection) {
			for (let item of collection) {
				if (predicate(item)) {
					yield item;
				}
			}
		};
		const falseGroup = function* (collection) {
			for (let item of collection) {
				if (!predicate(item)) {
					yield item;
				}
			}
		};
		return [new LazyList(trueGroup(this.#collection)), new LazyList(falseGroup(this.#collection))];
	}

	/**
	 * 全ての要素を配列として返す
	 *
	 * (遅延リストが内部で全評価される為注意)
	 * (無限リストに対して使用出来ません)
	 * @returns {Array<any>}
	 * @throws {Error}
	 */
	toArray() {
		this.#_throwInfiniteError("toArray");
		if (Array.isArray(this.#collection)) {
			return this.#collection;
		}

		this.#collection = Array.from(this);
		return this.#collection;
	}

	#_throwInfiniteError(name) {
		if (this.#_not2array) {
			throw new Error(`${name}は無限リストに対して使用できません。`);
		}
	}
}
