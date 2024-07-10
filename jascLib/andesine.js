/*
//* 2次元座標
andesine.Vec2(x, y)
//* 3次元座標
andesine.Vec3(x, y, z)
//* 2次元座標(class)
new andesine.Vector2(x, y)
//* 3次元座標(class)
new andesine.Vector3(x, y, z)

!※ Vectorシリーズの演算子オーバーロードでの割り算は
!	割り切れない場合、値が破損します！！
*/

/**
 * Andesine インスタンス
 * @class andesine
 * @classdesc jascゲームエンジン拡張ライブラリ
 * @returns {andesine}
 */
var Andesine = (function () {
	if (typeof Jasc !== "function") {
		console.warn("[andesine]前提ライブラリ「Jasc」が存在しません。");
		return;
	}
	if (typeof jasc !== "object") {
		console.warn("[andesine]前提ライブラリ「jasc」が存在しません。");
		return;
	}

	// 高速化用定数
	const PI = Math.PI;

	// Vectorシリーズ演算子オーバーロード用定数
	const b_carry = 2n ** 53n;
	const b_nextCarryBase = b_carry * 2n;
	const fract = 10 ** 5;

	const bMin = Number(-b_carry + 1n) / fract;
	const bMax = Number(b_carry - 1n) / fract;

	/**
	 * andesineライブラリ
	 * @returns {andesine}
	 */
	function andesine() {
		let co = Jasc.customOperator;
		// Vectorシリーズ 旧演算子オーバーロード(無駄)
		co(Vector2, "+")((a) => (b) => a.constructor.add(a, b));
		co(Vector2, "+=")((a) => (b) => a.add(b));
		co(Vector2, "-")((a) => (b) => a.constructor.sub(a, b));
		co(Vector2, "-=")((a) => (b) => a.sub(b));
		co(Vector2, "*")((a) => (b) => a.constructor.mul(a, b));
		co(Vector2, "*=")((a) => (b) => a.mul(b));
		co(Vector2, "/")((a) => (b) => a.constructor.div(a, b));
		co(Vector2, "/=")((a) => (b) => a.div(b));
		co(Vector2, "=")((a) => (b) => a.set(b));
	}

	function toNumber(n) {
		return Jasc.toNumber(n, true);
	}

	function getPosNumber(v) {
		const tmp = Vector3.convert(v);
		if (tmp) {
			return tmp;
		}
		return new Vector3(v, v, v);
	}

	/**
	 * 2次元座標
	 * @typedef {Vector2} Vector2
	 * @param {number | bigint | Vector2 | number[]} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @returns {Vector2}
	 */
	class Vector2 {
		#x;
		#y;

		constructor(x, y) {
			this.#x = x ?? 0;
			if (typeof this.#x !== "number") {
				let t = this.constructor.convert(x);
				this.#x = t.x;
				this.#y = t.y;
				return;
			}
			this.#x = toNumber(this.#x);
			this.#y = toNumber(y);
		}

		/**
		 * 座標設定
		 * @param {number | bigint | Vector2 | number[]} [x] - x座標
		 * @param {number} [y] - y座標
		 * @returns {this}
		 */
		set(x, y) {
			this.#x = x ?? 0;
			if (typeof this.#x !== "number") {
				let t = this.constructor.convert(x);
				this.#x = t.x;
				this.#y = t.y;
				return this;
			}
			this.#x = toNumber(this.#x);
			this.#y = toNumber(y ?? this.#x);
			return this;
		}

		get x() {
			return this.#x;
		}

		set x(x) {
			this.#x = toNumber(x);
		}

		get y() {
			return this.#y;
		}

		set y(y) {
			this.#y = toNumber(y);
		}

		/**
		 * 配列で返却
		 * @returns {[number, number]}
		 * @readonly
		 */
		get array() {
			return [this.#x, this.#y];
		}
		/**
		 * 連想配列で返却
		 * @returns {{x: number, y: number}}
		 * @readonly
		 */
		get associative() {
			return { x: this.#x, y: this.#y };
		}

		/**
		 * 演算子オーバーロード用
		 *
		 * 上限を超えると破綻するので注意
		 * @returns {bigint}
		 * @overrides
		 */
		valueOf() {
			let v = Vector2.clamp(this);
			let tmpX = BigInt(Math.trunc(v.x * fract));
			let tmpY = BigInt(Math.trunc(v.y * fract));
			if (this.#x < bMin || bMax < this.#x) {
				console.warn(`[警告！] x座標は{${bMin}～${bMax}}の範囲に収める必要があります`);
			}
			if (this.#y < bMin || bMax < this.#y) {
				console.warn(`[警告！] y座標は{${bMin}～${bMax}}の範囲に収める必要があります`);
			}
			let ret = tmpX < 0 ? b_carry | tmpX : tmpX;
			ret += (tmpY < 0 ? b_carry | tmpY : tmpY) * b_nextCarryBase;
			return ret;
		}

		/**
		 * 演算子オーバーロード解凍用
		 *
		 * @note コンストラクタを使用する方が楽
		 * @param {bigint} num
		 * @returns {Vector2}
		 */
		static unpack(num) {
			if (num instanceof Vector2) {
				return num;
			}
			return Vector2.convert(Vector3.unpack(num));
		}

		/**
		 * 文字列で返却
		 * @returns {string}
		 * @overrides
		 */
		toString() {
			return `Vector2(${this.#x}, ${this.#y})`;
		}

		/**
		 * JSONに変換
		 * @returns {number[]}
		 */
		toJSON() {
			return this.array;
		}

		/**
		 * 複製
		 * @returns {Vector2}
		 */
		clone() {
			return new Vector2(this.#x, this.#y);
		}

		/**
		 * 統合
		 * @param {Vector2 | number[] | bigint} arr - 統合対象
		 * @returns {Vector2 | null}
		 * @static
		 */
		static convert(arr) {
			// 計算結果
			if (typeof arr == "bigint") {
				return Vector2.unpack(arr);
			}
			// Vector3
			if (arr instanceof Vector3) {
				return new Vector2(arr.x, arr.y);
			}
			// 自身
			if (arr instanceof Vector2) {
				return arr.clone();
			}
			// 配列
			if (Array.isArray(arr)) {
				if (arr.length < 1) {
					return null;
				}
				return new Vector2(arr[0], arr[1] ?? 0);
			}
			// 連想配列
			if (Jasc.isAssociative(arr)) {
				return new Vector2(arr.x, arr.y);
			}
			return null;
		}

		// ==================================================
		// 演算
		// ==================================================

		/**
		 * 足し算
		 * @param {Vector2 | number} [v=0] - 足し算対象
		 * @returns {this}
		 */
		add(v = 0) {
			const t = getPosNumber(v);
			this.#x += t.x;
			this.#y += t.y;
			return this;
		}
		/**
		 * 足し算
		 * @param {Vector2} v1 - 足し算対象1
		 * @param {Vector2 | number} v2 - 足し算対象2
		 * @returns {this}
		 * @static
		 */
		static add(v1, v2) {
			return v1.clone().add(v2);
		}
		/**
		 * 引き算
		 * @param {Vector2 | number} [v=0] - 引き算対象
		 * @returns {this}
		 */
		sub(v = 0) {
			const t = getPosNumber(v);
			this.#x -= t.x;
			this.#y -= t.y;
			return this;
		}
		/**
		 * 引き算
		 * @param {Vector2} v1 - 引き算対象1
		 * @param {Vector2 | number} v2 - 引き算対象2
		 * @returns {this}
		 * @static
		 */
		static sub(v1, v2) {
			return v1.clone().sub(v2);
		}
		/**
		 * 掛け算
		 * (スカラー倍)
		 * @param {Vector2} [v=1] - 掛け算対象
		 * @returns {this}
		 */
		mul(v = 1) {
			const t = getPosNumber(v);
			this.#x *= t.x;
			this.#y *= t.y;
			return this;
		}
		/**
		 * 掛け算
		 * (スカラー倍)
		 * @param {Vector2} v1 - 掛け算対象1
		 * @param {Vector2 | number} v2 - 掛け算対象2
		 * @returns {this}
		 * @static
		 */
		static mul(v1, v2) {
			return v1.clone().mul(v2);
		}
		/**
		 * 除算
		 * @param {Vector2 | number} [v=1] - 除算対象
		 * @returns {this}
		 */
		div(v = 1) {
			const t = getPosNumber(v);
			this.#x /= t.x;
			this.#y /= t.y;
			return this;
		}
		/**
		 * 除算
		 * @param {Vector2} v1 - 除算対象1
		 * @param {Vector2 | number} v2 - 除算対象2
		 * @returns {this}
		 * @static
		 */
		static div(v1, v2) {
			return v1.clone().div(v2);
		}
		/**
		 * 乗算
		 * @param {number} num - 乗数
		 * @returns {this}
		 */
		pow(num1 = 1, num2) {
			this.#x = Math.pow(this.#x, toNumber(num1));
			this.#y = Math.pow(this.#y, toNumber(num2 ?? num1));
			return this;
		}

		/**
		 * 等しい
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		eq(v) {
			return Jasc.compareFloats(this.#x, v.x) && Jasc.compareFloats(this.#y, v.y);
		}
		/**
		 * 等しい
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static eq(v1, v2) {
			return v1.eq(v2);
		}
		/**
		 * 等しくない
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		ne(v) {
			return !this.eq(v);
		}
		/**
		 * 等しくない
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static ne(v1, v2) {
			return v1.ne(v2);
		}
		/**
		 * 超(>)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		gt(v) {
			return this.#x > v.x && this.#y > v.y;
		}
		/**
		 * 超(>)
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static gt(v1, v2) {
			return v1.gt(v2);
		}
		/**
		 * 未満(<)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		lt(v) {
			return this.#x < v.x && this.#y < v.y;
		}
		/**
		 * 未満(<)
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static lt(v1, v2) {
			return v1.lt(v2);
		}
		/**
		 * 以上(>=)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		ge(v) {
			return this.#x >= v.x && this.#y >= v.y;
		}
		/**
		 * 以上(>=)
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static ge(v1, v2) {
			return v1.ge(v2);
		}
		/**
		 * 以下(<=)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		le(v) {
			return this.#x <= v.x && this.#y <= v.y;
		}
		/**
		 * 以下(<=)
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static le(v1, v2) {
			return v1.le(v2);
		}

		/**
		 * ベクトルの内積
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {number}
		 */
		dot(v) {
			return this.#x * v.x + this.#y * v.y;
		}
		/**
		 * ベクトルの内積
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {number}
		 * @static
		 */
		static dot(v1, v2) {
			return v1.dot(v2);
		}
		/**
		 * ベクトルの外積
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {number}
		 */
		cross(v) {
			return this.#x * v.y - this.#y * v.x;
		}
		/**
		 * ベクトルの外積
		 * @param {Vector2} v1 - 対象ベクトル1
		 * @param {Vector2} v2 - 対象ベクトル2
		 * @returns {number}
		 * @static
		 */
		static cross(v1, v2) {
			return v1.cross(v2);
		}

		/**
		 * 絶対値
		 * @returns {this}
		 * @readonly
		 */
		get abs() {
			return new Vector2(Math.abs(this.#x), Math.abs(this.#y));
		}
		/**
		 * 符号のみ取得
		 * @returns {this}
		 * @readonly
		 */
		get sign() {
			return new Vector2(Math.sign(this.#x), Math.sign(this.#y));
		}
		/**
		 * 四捨五入
		 * @returns {this}
		 * @readonly
		 */
		get round() {
			return new Vector2(Math.round(this.#x), Math.round(this.#y));
		}
		/**
		 * 切り上げ
		 * @returns {this}
		 * @readonly
		 */
		get ceil() {
			return new Vector2(Math.ceil(this.#x), Math.ceil(this.#y));
		}
		/**
		 * 切り下げ
		 * @returns {this}
		 * @readonly
		 */
		get floor() {
			return new Vector2(Math.floor(this.#x), Math.floor(this.#y));
		}
		/**
		 * 切り捨て
		 * @returns {this}
		 * @readonly
		 */
		get trunc() {
			return new Vector2(Math.trunc(this.#x), Math.trunc(this.#y));
		}
		/**
		 * 小数部のみ
		 * @returns {this}
		 * @readonly
		 */
		get fract() {
			return new Vector2(this.#x - Math.floor(this.#x), this.#y - Math.floor(this.#y));
		}

		/**
		 * 逆ベクトル
		 * @returns {this}
		 * @readonly
		 */
		get inverse() {
			return this.clone().mul(-1);
		}
		/**
		 * ベクトルの長さ
		 * @returns {number}
		 * @readonly
		 */
		get length() {
			return Math.sqrt(this.#x ** 2 + this.#y ** 2);
		}
		/**
		 * ベクトルの正規化
		 * @returns {this}
		 * @readonly
		 */
		get normalize() {
			let l = this.length;
			return new Vector2(this.#x / l, this.#y / l);
		}

		/**
		 * 範囲内に収める
		 * @param {Vector2 | number} [min=bMin] - 最小
		 * @param {Vector2 | number} [max=bMax] - 最大
		 * @returns {this}
		 */
		clamp(min = bMin, max = bMax) {
			this.#x = Math.max(min?.x ?? toNumber(min), Math.min(max?.x ?? toNumber(max), this.#x));
			this.#y = Math.max(min?.y ?? toNumber(min), Math.min(max?.y ?? toNumber(max), this.#y));
			return this;
		}
		/**
		 * 範囲内に収める
		 * @param {Vector2} v - 対象ベクトル
		 * @param {Vector2 | number} [min=bMin] - 最小
		 * @param {Vector2 | number} [max=bMax] - 最大
		 * @returns {Vector2}
		 */
		static clamp(v, min = bMin, max = bMax) {
			return v.clone().clamp(min, max);
		}

		/**
		 * 座標範囲設定
		 * @param {Vector2 | number} [fromMin=bMin] - 変換前最小
		 * @param {Vector2 | number} [fromMax=bMax] - 変換前最大
		 * @param {Vector2 | number} [toMin=bMin] - 変換後最小
		 * @param {Vector2 | number} [toMax=bMax] - 変換後最大
		 * @returns {this}
		 */
		map(fromMin = bMin, fromMax = bMax, toMin = bMin, toMax = bMax) {
			this.#x = Jasc.map(
				// x座標範囲設定
				this.#x,
				fromMin?.x ?? toNumber(fromMin),
				fromMax?.x ?? toNumber(fromMax),
				toMin?.x ?? toNumber(toMin),
				toMax?.x ?? toNumber(toMax)
			);
			this.#y = Jasc.map(
				// y座標範囲設定
				this.#y,
				fromMin?.y ?? toNumber(fromMin),
				fromMax?.y ?? toNumber(fromMax),
				toMin?.y ?? toNumber(toMin),
				toMax?.y ?? toNumber(toMax)
			);
			return this;
		}
		/**
		 * 座標範囲設定
		 * @param {Vector2} v - 対象ベクトル
		 * @param {Vector2 | number} [fromMin=bMin] - 変換前最小
		 * @param {Vector2 | number} [fromMax=bMax] - 変換前最大
		 * @param {Vector2 | number} [toMin=bMin] - 変換後最小
		 * @param {Vector2 | number} [toMax=bMax] - 変換後最大
		 */
		static map(v, fromMin = bMin, fromMax = bMax, toMin = bMin, toMax = bMax) {
			return v.clone().map(fromMin, fromMax, toMin, toMax);
		}

		// ==================================================
		// ユーティリティ
		// ==================================================

		/**
		 * 2点間の距離
		 * @param {Vector2} v1 - 1つ目のベクトル
		 * @param {Vector2} v2 - 2つ目のベクトル
		 * @returns {number}
		 * @static
		 */
		static distance(v1, v2) {
			return Vector2.sub(v1, v2).length;
		}
		/**
		 * 2点間の角度
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {number}
		 */
		angle(v) {
			return Math.atan2(this.#y - v.y, this.#x - v.x);
		}
		/**
		 * 2点間の角度
		 * @param {Vector2} v1 - 1つ目のベクトル
		 * @param {Vector2} v2 - 2つ目のベクトル
		 * @returns {number}
		 * @static
		 */
		static angle(v1, v2) {
			return v1.angle(v2);
		}
		/**
		 * 2点は平行か(誤差非許容)
		 * @param {Vector2} v1 - 1つ目のベクトル
		 * @param {Vector2} v2 - 2つ目のベクトル
		 * @returns {boolean}
		 * @static
		 * @deprecated
		 */
		static isParallel(v1, v2) {
			return Vector2.cross(v1, v2) === 0;
		}
		/**
		 * 2点は垂直か(誤差非許容)
		 * @param {Vector2} v1 - 1つ目のベクトル
		 * @param {Vector2} v2 - 2つ目のベクトル
		 * @returns {boolean}
		 * @static
		 * @deprecated
		 */
		static isPerpendicular(v1, v2) {
			return Vector2.dot(v1, v2) === 0;
		}

		/**
		 * 2点のそれぞれの最大値
		 * @param {Vector2} v1 - 1つ目のベクトル
		 * @param {Vector2} v2 - 2つ目のベクトル
		 * @returns {Vector2}
		 * @static
		 */
		static max(v1, v2) {
			return new Vector2(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
		}
		/**
		 * 2点のそれぞれの最大値
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {Vector2}
		 * @deprecated
		 */
		max(v) {
			return Vector2.max(this, v);
		}

		/**
		 * 2点のそれぞれの最小値
		 * @param {Vector2} v1 - 1つ目のベクトル
		 * @param {Vector2} v2 - 2つ目のベクトル
		 * @returns {Vector2}
		 * @static
		 */
		static min(v1, v2) {
			return new Vector2(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
		}
		/**
		 * 2点のそれぞれの最小値
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {Vector2}
		 * @deprecated
		 */
		min(v) {
			return Vector2.min(this, v);
		}

		// ==================================================
		// 動作関連
		// ==================================================

		/**
		 * 2点間の線形補間
		 * @param {bigint | number[] | Vector2} start - 開始地点
		 * @param {bigint | number[] | Vector2} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Vector2}
		 * @static
		 */
		static leap(start, end, t) {
			const s = Vector2.convert(start);
			const e = Vector2.convert(end);
			return new Vector2(s.x + (e.x - s.x) * t, s.y + (e.y - s.y) * t);
		}
		/**
		 * 2点間の線形補間の座標に移動
		 * @param {bigint | number[] | Vector2} start - 開始地点
		 * @param {bigint | number[] | Vector2} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		leap(start, end, t) {
			this.set(Vector2.leap(start, end, t));
			return this;
		}

		/**
		 * 2点間の滑らかな線形補間
		 * @param {bigint | number[] | Vector2} start - 開始地点
		 * @param {bigint | number[] | Vector2} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Vector2}
		 * @static
		 */
		static smoothDamp(start, end, t) {
			return Vector2.leap(start, end, -(Math.cos(PI * t) - 1) / 2);
		}
		/**
		 * 2点間の滑らかな線形補間の座標に移動
		 * @param {bigint | number[] | Vector2} start - 開始地点
		 * @param {bigint | number[] | Vector2} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		smoothDamp(start, end, t) {
			this.set(Vector2.smoothDamp(start, end, t));
			return this;
		}

		/**
		 * スプライン曲線
		 * @param {Vector2[]} points - 通過点の配列
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Vector2}
		 * @static
		 */
		static spline(points, t) {
			const n = points.length;
			if (n < 2) {
				throw new Error("ポイント数は少なくとも2以上必要です。");
			}

			if (n === 2) {
				// 2点のみの場合は直線補間
				return Vector2.leap(points[0], points[1], t);
			}

			// 一回統一
			const _points = [];
			for (let i = 0; i < n; i++) {
				_points.push(Vector2.convert(points[i]));
			}

			// 3以下の場合は、最初と最後のポイントを複製
			const extendedPoints = [_points[0], ..._points, _points[n - 1]];

			const segmentCount = extendedPoints.length - 3;
			const segment = Math.min((t * segmentCount) | 0, segmentCount - 1);
			const localT = (t - segment / segmentCount) * segmentCount;
			const p0 = extendedPoints[segment];
			const p1 = extendedPoints[segment + 1];
			const p2 = extendedPoints[segment + 2];
			const p3 = extendedPoints[segment + 3];

			return Vector2.catmullRom(p0, p1, p2, p3, localT);
		}
		/**
		 * スプライン曲線
		 * @param {Vector2[]} points - 通過点の配列
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Vector2}
		 */
		spline(points, t) {
			this.set(Vector2.spline(points, t));
			return this;
		}

		/**
		 * Catmull-Rom補間
		 * @param {Vector2} p0
		 * @param {Vector2} p1
		 * @param {Vector2} p2
		 * @param {Vector2} p3
		 * @param {number} t
		 * @returns {Vector2}
		 * @static
		 */
		static catmullRom(p0, p1, p2, p3, t) {
			const t2 = t * t;
			const t3 = t2 * t;

			const m = Vector2.mul;

			const v0 = m(Vec2(p2 - p0), 0.5);
			const v1 = m(Vec2(p3 - p1), 0.5);

			return Vec2(m(Vec2(2n * p1 - 2n * p2 + v0 + v1), t3) + m(Vec2(-3n * p1 + 3n * p2 - 2n * v0 - v1), t2) + m(v0, t) + p1);
		}

		// ==================================================
		// よく使うベクトルの定義
		// ==================================================
		/**
		 * 0ベクトル
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get zero() {
			return new Vector2(0, 0);
		}
		/**
		 * 1ベクトル
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get one() {
			return new Vector2(1, 1);
		}

		/**
		 * 単位ベクトル
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get up() {
			return new Vector2(0, 1);
		}
		/**
		 * 単位ベクトル
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get down() {
			return new Vector2(0, -1);
		}
		/**
		 * 単位ベクトル
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get left() {
			return new Vector2(-1, 0);
		}
		/**
		 * 単位ベクトル
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get right() {
			return new Vector2(1, 0);
		}

		/**
		 * 許容最大値
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get MAX_VECTOR() {
			return new Vector2(bMax, bMax);
		}
		/**
		 * 許容最小値
		 * @type {Vector2}
		 * @readonly
		 * @static
		 */
		static get MIN_VECTOR() {
			return new Vector2(bMin, bMin);
		}

		/**
		 * 無限大
		 * @type {Vector2}
		 * @readonly
		 * @static
		 * @deprecated
		 */
		static get positiveInfinity() {
			return new Vector2(Infinity, Infinity);
		}
		/**
		 * 無限小
		 * @type {Vector2}
		 * @readonly
		 * @static
		 * @deprecated
		 */
		static get negativeInfinity() {
			return new Vector2(-Infinity, -Infinity);
		}
	}

	/**
	 * 3次元座標
	 * @extends {Vector2}
	 * @typedef {Vector3} Vector3
	 * @param {number | bigint | Vector2 | number[]} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @param {number} [z=0] - z座標
	 * @returns {Vector3}
	 */
	class Vector3 extends Vector2 {
		#z;

		constructor(x, y, z) {
			if (x != undefined && typeof x != "number") {
				super();
				let t = this.constructor.convert(x);
				this.x = t.x;
				this.y = t.y;
				this.#z = t.z;
				return;
			}
			super(x, y);
			this.#z = toNumber(z);
		}

		/**
		 * 座標設定
		 * @param {number | bigint | Vector2 | number[]} [x] - x座標
		 * @param {number} [y] - y座標
		 * @param {number} [z] - z座標
		 * @returns {this}
		 * @overrides
		 */
		set(x, y, z) {
			if (x != undefined && typeof x != "number") {
				super.set();
				let t = this.constructor.convert(x);
				this.x = t.x;
				this.y = t.y;
				this.#z = t.z;
				return this;
			}
			super.set(x, y);
			if (z == undefined) {
				if (x != undefined && y != undefined) {
					z = 0;
				}
			}
			this.#z = toNumber(z ?? this.x);
			return this;
		}

		get z() {
			return this.#z;
		}

		set z(z) {
			this.#z = toNumber(z);
		}

		/**
		 * 配列で返却
		 * @returns {[number, number, number]}
		 * @readonly
		 * @overrides
		 */
		get array() {
			return [this.x, this.y, this.#z];
		}
		/**
		 * 連想配列で返却
		 * @returns {{x: number, y: number, z: number}}
		 * @readonly
		 * @overrides
		 */
		get associative() {
			return { x: this.x, y: this.y, z: this.#z };
		}

		/**
		 * 演算子オーバーロード用
		 *
		 * 上限を超えると破綻するので注意
		 * @returns {bigint}
		 * @overrides
		 */
		valueOf() {
			let v = Vector3.clamp(this);
			let ret = super.valueOf();
			let tmpZ = BigInt(Math.trunc(v.z * fract));
			if (this.#z < bMin || bMax < this.#z) {
				console.warn(`[警告！] z座標は{${bMin}～${bMax}}の範囲に収める必要があります`);
			}
			ret += (tmpZ < 0 ? b_carry | tmpZ : tmpZ) * b_nextCarryBase * b_nextCarryBase;
			return ret;
		}

		/**
		 * 演算子オーバーロード解凍用
		 *
		 * @note コンストラクタを使用する方が楽
		 * @param {bigint} num
		 * @returns {Vector2}
		 * @overrides
		 */
		static unpack(num) {
			if (num instanceof Vector2) {
				return num;
			}
			if (typeof num != "bigint") {
				try {
					num = BigInt(num);
				} catch (e) {
					console.warn(e);
					return new Vector3();
				}
			}
			let tmpX, tmpY, tmpZ;
			/*
			* Xがマイナスか
				((num & b_carry) !== 0n)
			* Yがマイナスか
				((num & (b_carry * b_nextCarryBase)) !== 0n)
				//(num < 0)
			* Zがマイナスか
				((num & (b_carry * b_nextCarryBase * b_nextCarryBase)) !== 0n)
			*/
			switch (((num & b_carry) !== 0n) + ((num & (b_carry * b_nextCarryBase)) !== 0n) * 2 + ((num & (b_carry * b_nextCarryBase * b_nextCarryBase)) !== 0n) * 4) {
				case 0:
					// x+ y+ z+ (0~,0~,0~)
					tmpX = num % b_carry;
					tmpY = ((num - tmpX) / b_nextCarryBase) % b_carry;
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
				case 1:
					// x- y+ z+ (~-1,1~,0~)
					tmpX = (num % b_carry) - b_carry;
					tmpY = (((num + tmpX) / b_nextCarryBase) % b_carry) + 1n;
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
				case 2:
					// x+ y- z+ (0~,~-1,1~)
					tmpX = (((num + b_carry) % b_carry) + b_carry) % b_carry;
					tmpY = BigInt(Math.round(Number(((((num - tmpX) / b_nextCarryBase) % b_carry) - b_carry) * 10n) / 10));
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
				case 3:
					// x- y- z+ (~-1,~0,1~)
					tmpX = (num % b_carry) - b_carry;
					tmpY = ((((num - tmpX) / b_nextCarryBase) % b_carry) - b_carry) % b_carry;
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
				case 4:
					// x+ y+ z- (0~,0~,~-1)
					tmpX = (((num + b_carry) % b_carry) + b_carry) % b_carry;
					tmpY = ((((num - tmpX) / b_nextCarryBase) % b_carry) + b_carry) % b_carry;
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
				case 5:
					// x- y+ z- (~-1,1~,~-1)
					tmpX = ((((num + b_carry) % b_carry) + b_carry) % b_carry) - b_carry;
					tmpY = (((num + tmpX) / b_nextCarryBase) % b_carry) + b_carry;
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
				case 6:
					// x+ y- z- (0~,~-1,~-1)
					tmpX = (((num + b_carry) % b_carry) + b_carry) % b_carry;
					tmpY = BigInt(Math.round(Number((((num - tmpX) / b_nextCarryBase) % b_carry) * 10n) / 10));
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
				case 7:
					// x- y- z- (~-1,~0,~-1)
					tmpX = num % b_carry;
					tmpY = ((num - tmpX) / b_nextCarryBase) % b_carry;
					tmpZ = (num - tmpX - tmpY * b_nextCarryBase) / b_nextCarryBase / b_nextCarryBase;
					break;
			}
			return new Vector3(Number(tmpX) / fract, Number(tmpY) / fract, Number(tmpZ) / fract);
		}

		/**
		 * 文字列で返却
		 * @returns {string}
		 * @overrides
		 */
		toString() {
			return `Vector3(${this.x}, ${this.y}, ${this.#z})`;
		}

		/**
		 * 複製
		 * @returns {Vector3}
		 * @overrides
		 */
		clone() {
			return new Vector3(this.x, this.y, this.#z);
		}

		/**
		 * 統合
		 * @param {Vector2 | number[] | Object | bigint} arr - 統合対象
		 * @returns {Vector3 | null}
		 * @static
		 * @overrides
		 */
		static convert(arr) {
			// 計算結果
			if (typeof arr === "bigint") {
				return Vector3.unpack(arr);
			}
			// 自身
			if (arr instanceof Vector3) {
				return arr.clone();
			}
			// Vector2
			if (arr instanceof Vector2) {
				return new Vector3(arr.x, arr.y, 0);
			}
			// 配列
			if (Array.isArray(arr)) {
				if (arr.length < 3) {
					return this.convert(Vector2.convert(arr));
				}
				return new Vector3(arr[0], arr[1], arr[2]);
			}
			// 連想配列
			if (Jasc.isAssociative(arr)) {
				return new Vector3(arr.x, arr.y, arr.z);
			}
			return null;
		}

		// ==================================================
		// 演算
		// ==================================================

		/**
		 * 足し算
		 * @param {Vector2 | number} [v=0] - 足し算対象
		 * @returns {this}
		 * @overrides
		 */
		add(v = 0) {
			super.add(v);
			const t = getPosNumber(v);
			this.#z += t.z;
			return this;
		}
		/**
		 * 引き算
		 * @param {Vector2 | number} [v=0] - 引き算対象
		 * @returns {this}
		 * @overrides
		 */
		sub(v = 0) {
			super.sub(v);
			const t = getPosNumber(v);
			this.#z -= t.z;
			return this;
		}
		/**
		 * 掛け算
		 * @param {Vector2 | number} [v=1] - 掛け算対象
		 * @returns {this}
		 * @overrides
		 */
		mul(v = 1) {
			super.mul(v);
			const t = getPosNumber(v);
			this.#z *= t.z;
			return this;
		}
		/**
		 * 除算
		 * @param {Vector2 | number} [v=1] - 除算対象
		 * @returns {this}
		 * @overrides
		 */
		div(v = 1) {
			super.div(v);
			const t = getPosNumber(v);
			this.#z /= t.z;
			return this;
		}
		/**
		 * 乗算
		 * @param {number} num - 乗数
		 * @returns {this}
		 * @overrides
		 */
		pow(num1 = 1, num2, num3) {
			super.pow(num1, num2);
			if (num3 == undefined) {
				if (num1 != undefined && num2 != undefined) {
					num3 = 0;
				}
			}
			this.#z = Math.pow(this.#z, toNumber(num3 ?? num1));
			return this;
		}

		/**
		 * 等しい
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		eq(v) {
			let f = super.eq(v);
			if (v instanceof Vector2) {
				return f;
			}
			return f && Jasc.compareFloats(this.#z, v.z);
		}
		/**
		 * 超(>)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		gt(v) {
			let f = super.gt(v);
			if (v instanceof Vector2) {
				return f;
			}
			return f && this.#z > v.z;
		}
		/**
		 * 未満(<)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		lt(v) {
			let f = super.lt(v);
			if (v instanceof Vector2) {
				return f;
			}
			return f && this.#z < v.z;
		}
		/**
		 * 以上(>=)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		ge(v) {
			let f = super.ge(v);
			if (v instanceof Vector2) {
				return f;
			}
			return f && this.#z >= v.z;
		}
		/**
		 * 以下(<=)
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		le(v) {
			let f = super.le(v);
			if (v instanceof Vector2) {
				return f;
			}
			return f && this.#z <= v.z;
		}

		/**
		 * ベクトルの内積
		 * @param {Vector3} v - 対象ベクトル
		 * @returns {number}
		 * @overrides
		 */
		dot(v) {
			return this.x * v.x + this.y * v.y + this.#z * v.z;
		}
		/**
		 * ベクトルの外積
		 * @param {Vector3} v - 対象ベクトル
		 * @returns {Vector3}
		 * @overrides
		 */
		cross(v) {
			return new Vector3(this.y * v.z - this.#z * v.y, this.#z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
		}

		/**
		 * 絶対値
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get abs() {
			return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.#z));
		}
		/**
		 * 符号のみ取得
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get sign() {
			return new Vector3(Math.sign(this.x), Math.sign(this.y), Math.sign(this.#z));
		}
		/**
		 * 四捨五入
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get round() {
			return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.#z));
		}
		/**
		 * 切り上げ
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get ceil() {
			return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.#z));
		}
		/**
		 * 切り下げ
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get floor() {
			return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.#z));
		}
		/**
		 * 切り捨て
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get trunc() {
			return new Vector3(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.#z));
		}
		/**
		 * 小数部のみ
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get fract() {
			return new Vector3(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.#z - Math.floor(this.#z));
		}

		/**
		 * ベクトルの長さ
		 * @returns {number}
		 * @readonly
		 * @overrides
		 */
		get length() {
			return Math.sqrt(this.x ** 2 + this.y ** 2 + this.#z ** 2);
		}
		/**
		 * ベクトルの正規化
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get normalize() {
			let l = this.length;
			return new Vector3(this.x / l, this.y / l, this.#z / l);
		}
		/**
		 * 範囲内に収める
		 * @param {Vector3 | number} [min=bMin] - 最小
		 * @param {Vector3 | number} [max=bMax] - 最大
		 * @returns {this}
		 * @overrides
		 */
		clamp(min = bMin, max = bMax) {
			super.clamp(min, max);
			this.#z = Math.max(min?.z ?? toNumber(min), Math.min(max?.z ?? toNumber(max), this.#z));
			return this;
		}

		/**
		 * 座標範囲設定
		 * @param {Vector2 | number} [fromMin=bMin] - 変換前最小
		 * @param {Vector2 | number} [fromMax=bMax] - 変換前最大
		 * @param {Vector2 | number} [toMin=bMin] - 変換後最小
		 * @param {Vector2 | number} [toMax=bMax] - 変換後最大
		 * @returns {this}
		 * @overrides
		 */
		map(fromMin = bMin, fromMax = bMax, toMin = bMin, toMax = bMax) {
			super.map(fromMin, fromMax, toMin, toMax);
			this.#z = Jasc.map(
				// z座標範囲設定
				this.#z,
				fromMin?.z ?? toNumber(fromMin),
				fromMax?.z ?? toNumber(fromMax),
				toMin?.z ?? toNumber(toMin),
				toMax?.z ?? toNumber(toMax)
			);
			return this;
		}

		// ==================================================
		// ユーティリティ
		// ==================================================

		/**
		 * 2点間の距離
		 * @param {Vector3} v1 - 1つ目のベクトル
		 * @param {Vector3} v2 - 2つ目のベクトル
		 * @returns {number}
		 * @static
		 * @overrides
		 */
		static distance(v1, v2) {
			return Vector3.sub(v1, v2).length;
		}
		/**
		 * 2点間の角度
		 * @param {Vector3} v - 対象ベクトル
		 * @returns {number}
		 * @overrides
		 */
		angle(v) {
			return Math.acos(this.dot(v) / (this.length * v.length));
		}

		/**
		 * 2つのベクトルの最大値
		 * @param {Vector3} v1 - 1つ目のベクトル
		 * @param {Vector3} v2 - 2つ目のベクトル
		 * @returns {Vector3}
		 * @static
		 * @override
		 */
		static max(v1, v2) {
			return new Vector3(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y), Math.max(v1.z, v2.z));
		}
		/**
		 * 2つのベクトルの最大値
		 * @param {Vector3} v - 対象ベクトル
		 * @returns {Vector3}
		 * @deprecated
		 * @override
		 */
		max(v) {
			return Vector3.max(this, v);
		}

		/**
		 * 2つのベクトルの最小値
		 * @param {Vector3} v1 - 1つ目のベクトル
		 * @param {Vector3} v2 - 2つ目のベクトル
		 * @returns {Vector3}
		 * @static
		 * @override
		 */
		static min(v1, v2) {
			return new Vector3(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y), Math.min(v1.z, v2.z));
		}
		/**
		 * 2つのベクトルの最小値
		 * @param {Vector3} v1 - 対象ベクトル
		 * @returns {Vector3}
		 * @deprecated
		 * @override
		 */
		min(v) {
			return Vector3.min(this, v);
		}

		// ==================================================
		// 動作関連
		// ==================================================

		/**
		 * 2点間の線形補間
		 * @param {Vector3 | number[]} start - 開始地点
		 * @param {Vector3 | number[]} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Vector3}
		 * @static
		 * @override
		 */
		static leap(start, end, t) {
			const s = Vector3.convert(start);
			const e = Vector3.convert(end);
			return new Vector3(s.x + (e.x - s.x) * t, s.y + (e.y - s.y) * t, s.z + (e.z - s.z) * t);
		}
		/**
		 * 2点間の線形補間
		 * @param {Vector3 | bigint | number[]} start - 開始地点
		 * @param {Vector3 | bigint | number[]} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 * @override
		 */
		leap(start, end, t) {
			this.set(Vector3.leap(start, end, t));
			return this;
		}

		/**
		 * 2点間の滑らかな線形補間
		 * @param {bigint | number[] | Vector3} start - 開始地点
		 * @param {bigint | number[] | Vector3} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Vector3}
		 * @static
		 */
		static smoothDamp(start, end, t) {
			return Vector3.leap(start, end, -(eased = (Math.cos(PI * t) - 1) / 2));
		}
		/**
		 * 2点間の滑らかな線形補間の座標に移動
		 * @param {bigint | number[] | Vector3} start - 開始地点
		 * @param {bigint | number[] | Vector3} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		smoothDamp(start, end, t) {
			this.set(Vector3.smoothDamp(start, end, t));
			return this;
		}

		// ==================================================
		// よく使うベクトルの定義
		// ==================================================
		/**
		 * 0ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get zero() {
			return new Vector3(0, 0, 0);
		}
		/**
		 * 1ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get one() {
			return new Vector3(1, 1, 1);
		}

		/**
		 * 単位ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get up() {
			return new Vector3(0, 1, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get down() {
			return new Vector3(0, -1, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get left() {
			return new Vector3(-1, 0, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get right() {
			return new Vector3(1, 0, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 */
		static get forward() {
			return new Vector3(0, 0, 1);
		}
		/**
		 * 単位ベクトル
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 */
		static get back() {
			return new Vector3(0, 0, -1);
		}

		/**
		 * 許容最大値
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get MAX_VECTOR() {
			return new Vector3(bMax, bMax, bMax);
		}
		/**
		 * 許容最小値
		 * @returns {Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get MIN_VECTOR() {
			return new Vector3(bMin, bMin, bMin);
		}

		/**
		 * 無限大
		 * @type {Vector3}
		 * @readonly
		 * @static
		 * @override
		 * @deprecated
		 */
		static get positiveInfinity() {
			return new Vector3(Infinity, Infinity, Infinity);
		}
		/**
		 * 無限小
		 * @type {Vector3}
		 * @readonly
		 * @static
		 * @override
		 * @deprecated
		 */
		static get negativeInfinity() {
			return new Vector3(-Infinity, -Infinity, -Infinity);
		}
	}

	/**
	 * 矩形
	 * (四角い範囲)
	 * @typedef {Rectangle} Rectangle
	 * @param {number | Vector2} x - x座標(x,y座標)
	 * @param {number | Vector2} y - y座標(w,hサイズ)
	 * @param {number | Vector2} width - 幅
	 * @param {number} height - 高さ
	 * @returns {Rectangle}
	 */
	class Rectangle {
		#x;
		#y;

		constructor(x = 0, y = 0, width = 0, height = 0) {
			if (typeof x === "number") {
				// x y ??
				this.position = new Vector2(x, y);
				if (typeof width === "number") {
					// w h
					this.size = new Vector2(width, height);
				} else {
					// wh
					this.size = Vector2.convert(width);
				}
			} else {
				// xy ??
				this.position = Vector2.convert(x);
				if (typeof y === "number") {
					// w h
					this.size = new Vector2(y, width);
				} else {
					// wh
					this.size = Vector2.convert(y);
				}
			}
		}

		/**
		 * 矩形と矩形の当たり判定
		 * @param {Rectangle} other
		 * @returns {boolean}
		 */
		hitTest(other) {
			if (other.x >= this.#x + this.width || this.#x >= other.x + other.width || other.y >= this.#y + this.height || this.#y >= other.y + other.height) {
				return false;
			}
			return true;
		}

		// getter/setter
		get x() {
			return this.position.x;
		}
		set x(x) {
			this.position.x = x;
		}
		get y() {
			return this.position.y;
		}
		set y(y) {
			this.position.y = y;
		}
		get width() {
			return this.size.x;
		}
		set width(w) {
			this.size.x = w;
		}
		get height() {
			return this.size.y;
		}
		set height(h) {
			this.size.y = h;
		}
	}

	/**
	 * 矩形(描画オブジェクト)
	 * @param {Vector2} x - x,y座標
	 * @param {Vector2} y - w,hサイズ
	 * @param {string} [bg=""] - 背景色
	 * @returns {Box}
	 */
	class Box {
		constructor(ctx, xy = Vector2.zero, wh = Vector2.zero, bg = "") {
			this.ctx = ctx;
			this.rect = new Rectangle(xy, wh);
			this.bg = bg;
		}

		/**
		 * 描画
		 * @param {boolean} [isDraw=true] - 描画するか
		 * @returns {undefined}
		 */
		draw(isDraw = true) {
			if (!isDraw) {
				return;
			}

			this.ctx.fillStyle = this.bg;
			this.ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
		}
	}

	/**
	 * 矩形+テキスト(描画オブジェクト)
	 * @param {Vector2} x - x,y座標
	 * @param {Vector2} y - w,hサイズ
	 * @param {string} [text=""] - テキスト
	 * @param {string} [fg=""] - 文字色
	 * @param {string} [bg=""] - 背景色
	 * @returns {TextBox}
	 */
	class TextBox extends Box {
		constructor(ctx, xy = Vector2.zero, wh = Vector2.zero, text, fg = "#000", bg = "") {
			super(ctx, xy, wh, bg);
			this.text = text;
			this.fg = fg;
		}

		draw(isDraw = true) {
			super.draw(isDraw);
			this.ctx.fillStyle = "black";
			this.ctx.fillText(this.text, this.rect.x + 5, this.rect.y + 10);
		}
	}

	/**
	 * イベントを管理するクラス
	 * - 継承推奨
	 * @typedef {EventDispatcher} EventDispatcher
	 * @returns {EventDispatcher}
	 * @abstract
	 */
	class EventDispatcher {
		constructor() {
			this._eventListeners = {};
			// 表記ぶれ
			this.on = this.addEventListener;
			this.off = this.removeEventListener;
		}

		/**
		 * イベントリスナーを追加
		 * @param {string} type - イベントタイプ
		 * @param {function} callback - コールバック
		 * @param {string} [name=auto] - 削除時の参照用名称
		 * @returns {undefined}
		 */
		addEventListener(type, callback, name = "") {
			if (typeof callback != "function") {
				console.error("callback must be function");
				return;
			}
			if (this._eventListeners[type] == undefined) {
				this._eventListeners[type] = {};
			}
			if (name == "") {
				jasc.setAssociativeAutoName(this._eventListeners[type], callback, "__andesine");
			} else {
				this._eventListeners[type][name] = callback;
			}
		}

		/**
		 * イベントリスナーを削除
		 * @param {string} type - イベントタイプ
		 * @param {string} [name] - 削除時の参照用名称
		 * @returns {undefined}
		 */
		removeEventListener(type, name = "") {
			if (this._eventListeners[type] != undefined) {
				if (name != "") {
					this._eventListeners[type][name] = null;
					delete this._eventListeners[type][name];
				} else {
					this._eventListeners[type] = {};
				}
			}
		}

		/**
		 * イベントを実行
		 * @param {string} type - イベントタイプ
		 * @param {Event} event - イベント
		 * @returns {undefined}
		 */
		dispatchEvent(type, event) {
			const listeners = this._eventListeners[type];
			if (listeners != undefined) {
				for (const name in listeners) {
					listeners[name](event);
				}
			}
		}
	}

	/**
	 * ゲームイベント
	 * @typedef {GameEvent} GameEvent
	 * @param {any} target - 対象
	 * @returns {GameEvent}
	 */
	class GameEvent {
		constructor(target) {
			this.target = target;
		}
	}

	andesine.prototype = {
		/**
		 * 2次元座標(class)
		 * @returns {Vector2}
		 */
		Vector2,
		/**
		 * 2次元座標(関数)
		 * @param {number} [x=0] - x座標
		 * @param {number} [y=0] - y座標
		 * @returns {Vector2}
		 */
		Vec2(x, y) {
			return new Vector2(x, y);
		},
		/**
		 * 3次元座標(class)
		 * @returns {Vector3}
		 */
		Vector3,
		/**
		 * 3次元座標(関数)
		 * @param {number} [x=0] - x座標
		 * @param {number} [y=0] - y座標
		 * @param {number} [z=0] - z座標
		 * @returns {Vector3}
		 */
		Vec3(x, y, z) {
			return new Vector3(x, y, z);
		},

		/**
		 * 矩形(class)
		 * @returns {Rectangle}
		 */
		Rectangle,

		/**
		 * 矩形(描画オブジェクト)
		 * @returns {Box}
		 */
		Box,

		/**
		 * 矩形+テキスト(描画オブジェクト)
		 * @returns {TextBox}
		 */
		TextBox,

		/**
		 * イベント管理(class)
		 * - 継承利用 推奨
		 * @returns {EventDispatcher}
		 */
		EventDispatcher,

		/**
		 * ゲームイベント(class)
		 * @param {any} target - 対象
		 * @returns {GameEvent}
		 */
		GameEvent,
	};

	//初期化
	return new andesine();
})();
