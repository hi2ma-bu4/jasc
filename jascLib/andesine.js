/*
//* 2次元座標
Andesine.Vec2(x, y)
//* 3次元座標
Andesine.Vec3(x, y, z)
//* 2次元座標(class)
new Andesine.Vector2(x, y)
//* 3次元座標(class)
new Andesine.Vector3(x, y, z)

!※ Vectorシリーズの演算子オーバーロードでの割り算は
!	割り切れない場合、値が破損します！！
*/

/**
 * Andesine
 * @class Andesine
 * @classdesc jascゲームエンジン拡張ライブラリ
 * @returns {Andesine}
 */
class Andesine {
	// class計算用定数
	static _B_CARRY = 2n ** 53n;
	static _B_NEXT_CARRY_BASE = this._B_CARRY * 2n;
	static _B_FRACT = 10 ** 5;
	static _B_MIN = Number(-this._B_CARRY + 1n) / this._B_FRACT;
	static _B_MAX = Number(this._B_CARRY - 1n) / this._B_FRACT;

	// ####################################################################################################

	/**
	 * 2次元座標
	 * @param {number | bigint | Andesine.Vector2 | number[]} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @returns {InstanceType<typeof Andesine.Vector2>}
	 * @static
	 */
	static Vec2(x, y) {
		return new Andesine.Vector2(x, y);
	}
	/**
	 * 2次元座標
	 * @memberof Andesine
	 * @param {number | bigint | Andesine.Vector2 | number[]} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @returns {Andesine.Vector2}
	 */
	static Vector2 = class {
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
			this.#x = Andesine._toNumber(this.#x);
			this.#y = Andesine._toNumber(y);
		}

		/**
		 * 座標設定
		 * @param {number | bigint | Andesine.Vector2 | number[]} [x] - x座標
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
			this.#x = Andesine._toNumber(this.#x);
			this.#y = Andesine._toNumber(y ?? this.#x);
			return this;
		}

		get x() {
			return this.#x;
		}

		set x(x) {
			this.#x = Andesine._toNumber(x);
		}

		get y() {
			return this.#y;
		}

		set y(y) {
			this.#y = Andesine._toNumber(y);
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
			let v = Andesine.Vector2.clamp(this);
			let tmpX = BigInt(Math.trunc(v.x * Andesine._B_FRACT));
			let tmpY = BigInt(Math.trunc(v.y * Andesine._B_FRACT));
			if (this.#x < Andesine._B_MIN || Andesine._B_MAX < this.#x) {
				console.warn(`[警告！] x座標は{${Andesine._B_MIN}～${Andesine._B_MAX}}の範囲に収める必要があります`);
			}
			if (this.#y < Andesine._B_MIN || Andesine._B_MAX < this.#y) {
				console.warn(`[警告！] y座標は{${Andesine._B_MIN}～${Andesine._B_MAX}}の範囲に収める必要があります`);
			}
			let ret = tmpX < 0 ? Andesine._B_CARRY | tmpX : tmpX;
			ret += (tmpY < 0 ? Andesine._B_CARRY | tmpY : tmpY) * Andesine._B_NEXT_CARRY_BASE;
			return ret;
		}

		/**
		 * 演算子オーバーロード解凍用
		 *
		 * @note コンストラクタを使用する方が楽
		 * @param {bigint} num
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		static unpack(num) {
			if (num instanceof Andesine.Vector2) {
				return num;
			}
			return Andesine.Vector2.convert(Andesine.Vector3.unpack(num));
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @overrides
		 */
		toString(nesting = 1) {
			return Andesine.Util.createToStringMessage(this, nesting, {
				x: this.#x,
				y: this.#y,
			});
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
		 * @returns {Andesine.Vector2}
		 */
		clone() {
			return new Andesine.Vector2(this.#x, this.#y);
		}

		/**
		 * 統合
		 * @param {InstanceType<typeof Andesine.Vector2> | number[] | bigint} arr - 統合対象
		 * @returns {InstanceType<typeof Andesine.Vector2> | null}
		 * @static
		 */
		static convert(arr) {
			// 計算結果
			if (typeof arr == "bigint") {
				return Andesine.Vector2.unpack(arr);
			}
			// Andesine.Vector3
			if (arr instanceof Andesine.Vector3) {
				return new Andesine.Vector2(arr.x, arr.y);
			}
			// 自身
			if (arr instanceof Andesine.Vector2) {
				return arr.clone();
			}
			// 配列
			if (Array.isArray(arr)) {
				if (arr.length < 1) {
					return null;
				}
				return new Andesine.Vector2(arr[0], arr[1] ?? 0);
			}
			// 連想配列
			if (Jasc.isAssociative(arr)) {
				return new Andesine.Vector2(arr.x, arr.y);
			}
			return null;
		}

		// ==================================================
		// 演算
		// ==================================================

		/**
		 * 足し算
		 * @param {Andesine.Vector2 | number} [v=0] - 足し算対象
		 * @returns {this}
		 */
		add(v = 0) {
			const t = Andesine._getPosNumber(v);
			this.#x += t.x;
			this.#y += t.y;
			return this;
		}
		/**
		 * 足し算
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 足し算対象1
		 * @param {InstanceType<typeof Andesine.Vector2> | number} v2 - 足し算対象2
		 * @returns {this}
		 * @static
		 */
		static add(v1, v2) {
			return v1.clone().add(v2);
		}
		/**
		 * 引き算
		 * @param {Andesine.Vector2 | number} [v=0] - 引き算対象
		 * @returns {this}
		 */
		sub(v = 0) {
			const t = Andesine._getPosNumber(v);
			this.#x -= t.x;
			this.#y -= t.y;
			return this;
		}
		/**
		 * 引き算
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 引き算対象1
		 * @param {InstanceType<typeof Andesine.Vector2> | number} v2 - 引き算対象2
		 * @returns {this}
		 * @static
		 */
		static sub(v1, v2) {
			return v1.clone().sub(v2);
		}
		/**
		 * 掛け算
		 * (スカラー倍)
		 * @param {Andesine.Vector2} [v=1] - 掛け算対象
		 * @returns {this}
		 */
		mul(v = 1) {
			const t = Andesine._getPosNumber(v);
			this.#x *= t.x;
			this.#y *= t.y;
			return this;
		}
		/**
		 * 掛け算
		 * (スカラー倍)
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 掛け算対象1
		 * @param {InstanceType<typeof Andesine.Vector2> | number} v2 - 掛け算対象2
		 * @returns {this}
		 * @static
		 */
		static mul(v1, v2) {
			return v1.clone().mul(v2);
		}
		/**
		 * 除算
		 * @param {Andesine.Vector2 | number} [v=1] - 除算対象
		 * @returns {this}
		 */
		div(v = 1) {
			const t = Andesine._getPosNumber(v);
			this.#x /= t.x;
			this.#y /= t.y;
			return this;
		}
		/**
		 * 除算
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 除算対象1
		 * @param {InstanceType<typeof Andesine.Vector2> | number} v2 - 除算対象2
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
			this.#x = Math.pow(this.#x, Andesine._toNumber(num1));
			this.#y = Math.pow(this.#y, Andesine._toNumber(num2 ?? num1));
			return this;
		}

		/**
		 * 等しい
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 */
		eq(v) {
			return Jasc.compareFloats(this.#x, v.x) && Jasc.compareFloats(this.#y, v.y);
		}
		/**
		 * 等しい
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static eq(v1, v2) {
			return v1.eq(v2);
		}
		/**
		 * 等しくない
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 */
		ne(v) {
			return !this.eq(v);
		}
		/**
		 * 等しくない
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static ne(v1, v2) {
			return v1.ne(v2);
		}
		/**
		 * 超(>)
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 */
		gt(v) {
			return this.#x > v.x && this.#y > v.y;
		}
		/**
		 * 超(>)
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static gt(v1, v2) {
			return v1.gt(v2);
		}
		/**
		 * 未満(<)
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 */
		lt(v) {
			return this.#x < v.x && this.#y < v.y;
		}
		/**
		 * 未満(<)
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static lt(v1, v2) {
			return v1.lt(v2);
		}
		/**
		 * 以上(>=)
		 * @param {Andesine.Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		ge(v) {
			return this.#x >= v.x && this.#y >= v.y;
		}
		/**
		 * 以上(>=)
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static ge(v1, v2) {
			return v1.ge(v2);
		}
		/**
		 * 以下(<=)
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 */
		le(v) {
			return this.#x <= v.x && this.#y <= v.y;
		}
		/**
		 * 以下(<=)
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
		 * @returns {boolean}
		 * @static
		 */
		static le(v1, v2) {
			return v1.le(v2);
		}

		/**
		 * ベクトルの内積
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {number}
		 */
		dot(v) {
			return this.#x * v.x + this.#y * v.y;
		}
		/**
		 * ベクトルの内積
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
		 * @returns {number}
		 * @static
		 */
		static dot(v1, v2) {
			return v1.dot(v2);
		}
		/**
		 * ベクトルの外積
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {number}
		 */
		cross(v) {
			return this.#x * v.y - this.#y * v.x;
		}
		/**
		 * ベクトルの外積
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 対象ベクトル1
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 対象ベクトル2
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
			return new Andesine.Vector2(Math.abs(this.#x), Math.abs(this.#y));
		}
		/**
		 * 符号のみ取得
		 * @returns {this}
		 * @readonly
		 */
		get sign() {
			return new Andesine.Vector2(Math.sign(this.#x), Math.sign(this.#y));
		}
		/**
		 * 四捨五入
		 * @returns {this}
		 * @readonly
		 */
		get round() {
			return new Andesine.Vector2(Math.round(this.#x), Math.round(this.#y));
		}
		/**
		 * 切り上げ
		 * @returns {this}
		 * @readonly
		 */
		get ceil() {
			return new Andesine.Vector2(Math.ceil(this.#x), Math.ceil(this.#y));
		}
		/**
		 * 切り下げ
		 * @returns {this}
		 * @readonly
		 */
		get floor() {
			return new Andesine.Vector2(Math.floor(this.#x), Math.floor(this.#y));
		}
		/**
		 * 切り捨て
		 * @returns {this}
		 * @readonly
		 */
		get trunc() {
			return new Andesine.Vector2(Math.trunc(this.#x), Math.trunc(this.#y));
		}
		/**
		 * 小数部のみ
		 * @returns {this}
		 * @readonly
		 */
		get fract() {
			return new Andesine.Vector2(this.#x - Math.floor(this.#x), this.#y - Math.floor(this.#y));
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
			return new Andesine.Vector2(this.#x / l, this.#y / l);
		}

		/**
		 * 範囲内に収める
		 * @param {Andesine.Vector2 | number} [min=Andesine._B_MIN] - 最小
		 * @param {Andesine.Vector2 | number} [max=Andesine._B_MAX] - 最大
		 * @returns {this}
		 */
		clamp(min = Andesine._B_MIN, max = Andesine._B_MAX) {
			this.#x = Math.max(min?.x ?? Andesine._toNumber(min), Math.min(max?.x ?? Andesine._toNumber(max), this.#x));
			this.#y = Math.max(min?.y ?? Andesine._toNumber(min), Math.min(max?.y ?? Andesine._toNumber(max), this.#y));
			return this;
		}
		/**
		 * 範囲内に収める
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @param {Andesine.Vector2 | number} [min=Andesine._B_MIN] - 最小
		 * @param {Andesine.Vector2 | number} [max=Andesine._B_MAX] - 最大
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		static clamp(v, min = Andesine._B_MIN, max = Andesine._B_MAX) {
			return v.clone().clamp(min, max);
		}

		/**
		 * 座標範囲設定
		 * @param {Andesine.Vector2 | number} [fromMin=Andesine._B_MIN] - 変換前最小
		 * @param {Andesine.Vector2 | number} [fromMax=Andesine._B_MAX] - 変換前最大
		 * @param {Andesine.Vector2 | number} [toMin=Andesine._B_MIN] - 変換後最小
		 * @param {Andesine.Vector2 | number} [toMax=Andesine._B_MAX] - 変換後最大
		 * @returns {this}
		 */
		map(fromMin = Andesine._B_MIN, fromMax = Andesine._B_MAX, toMin = Andesine._B_MIN, toMax = Andesine._B_MAX) {
			this.#x = Jasc.map(
				// x座標範囲設定
				this.#x,
				fromMin?.x ?? Andesine._toNumber(fromMin),
				fromMax?.x ?? Andesine._toNumber(fromMax),
				toMin?.x ?? Andesine._toNumber(toMin),
				toMax?.x ?? Andesine._toNumber(toMax)
			);
			this.#y = Jasc.map(
				// y座標範囲設定
				this.#y,
				fromMin?.y ?? Andesine._toNumber(fromMin),
				fromMax?.y ?? Andesine._toNumber(fromMax),
				toMin?.y ?? Andesine._toNumber(toMin),
				toMax?.y ?? Andesine._toNumber(toMax)
			);
			return this;
		}
		/**
		 * 座標範囲設定
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @param {Andesine.Vector2 | number} [fromMin=Andesine._B_MIN] - 変換前最小
		 * @param {Andesine.Vector2 | number} [fromMax=Andesine._B_MAX] - 変換前最大
		 * @param {Andesine.Vector2 | number} [toMin=Andesine._B_MIN] - 変換後最小
		 * @param {Andesine.Vector2 | number} [toMax=Andesine._B_MAX] - 変換後最大
		 */
		static map(v, fromMin = Andesine._B_MIN, fromMax = Andesine._B_MAX, toMin = Andesine._B_MIN, toMax = Andesine._B_MAX) {
			return v.clone().map(fromMin, fromMax, toMin, toMax);
		}

		// ==================================================
		// ユーティリティ
		// ==================================================

		/**
		 * 2点間の距離
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {number}
		 * @static
		 */
		static distance(v1, v2) {
			return Andesine.Vector2.sub(v1, v2).length;
		}
		/**
		 * 2点間の角度
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {number}
		 */
		angle(v) {
			return Math.atan2(this.#y - v.y, this.#x - v.x);
		}
		/**
		 * 2点間の角度
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {number}
		 * @static
		 */
		static angle(v1, v2) {
			return v1.angle(v2);
		}
		/**
		 * 2点は平行か(誤差非許容)
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {boolean}
		 * @static
		 * @deprecated
		 */
		static isParallel(v1, v2) {
			return Andesine.Vector2.cross(v1, v2) === 0;
		}
		/**
		 * 2点は垂直か(誤差非許容)
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {boolean}
		 * @static
		 * @deprecated
		 */
		static isPerpendicular(v1, v2) {
			return Andesine.Vector2.dot(v1, v2) === 0;
		}

		/**
		 * 2点のそれぞれの最大値
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static max(v1, v2) {
			return new Andesine.Vector2(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
		}
		/**
		 * 2点のそれぞれの最大値
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @deprecated
		 */
		max(v) {
			return Andesine.Vector2.max(this, v);
		}

		/**
		 * 2点のそれぞれの最小値
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static min(v1, v2) {
			return new Andesine.Vector2(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
		}
		/**
		 * 2点のそれぞれの最小値
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @deprecated
		 */
		min(v) {
			return Andesine.Vector2.min(this, v);
		}

		// ==================================================
		// 動作関連
		// ==================================================

		/**
		 * 2点間の線形補間
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static leap(start, end, t) {
			const s = Andesine.Vector2.convert(start);
			const e = Andesine.Vector2.convert(end);
			return new Andesine.Vector2(s.x + (e.x - s.x) * t, s.y + (e.y - s.y) * t);
		}
		/**
		 * 2点間の線形補間の座標に移動
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		leap(start, end, t) {
			this.set(Andesine.Vector2.leap(start, end, t));
			return this;
		}

		/**
		 * 2点間の滑らかな線形補間
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static smoothDamp(start, end, t) {
			return Andesine.Vector2.leap(start, end, -(Math.cos(Math.PI * t) - 1) / 2);
		}
		/**
		 * 2点間の滑らかな線形補間の座標に移動
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		smoothDamp(start, end, t) {
			this.set(Andesine.Vector2.smoothDamp(start, end, t));
			return this;
		}

		/**
		 * スプライン曲線
		 * @param {InstanceType<typeof Andesine.Vector2>[]} points - 通過点の配列
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static spline(points, t) {
			const n = points.length;
			if (n < 2) {
				throw new Error("ポイント数は少なくとも2以上必要です。");
			}

			if (n === 2) {
				// 2点のみの場合は直線補間
				return Andesine.Vector2.leap(points[0], points[1], t);
			}

			// 一回統一
			const _points = [];
			for (let i = 0; i < n; i++) {
				_points.push(Andesine.Vector2.convert(points[i]));
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

			return Andesine.Vector2.catmullRom(p0, p1, p2, p3, localT);
		}
		/**
		 * スプライン曲線
		 * @param {InstanceType<typeof Andesine.Vector2>[]} points - 通過点の配列
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		spline(points, t) {
			this.set(Andesine.Vector2.spline(points, t));
			return this;
		}

		/**
		 * Catmull-Rom補間
		 * @param {InstanceType<typeof Andesine.Vector2>} p0
		 * @param {InstanceType<typeof Andesine.Vector2>} p1
		 * @param {InstanceType<typeof Andesine.Vector2>} p2
		 * @param {InstanceType<typeof Andesine.Vector2>} p3
		 * @param {number} t
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static catmullRom(p0, p1, p2, p3, t) {
			const t2 = t * t;
			const t3 = t2 * t;

			const m = Andesine.Vector2.mul;

			const v0 = m(Vec2(p2 - p0), 0.5);
			const v1 = m(Vec2(p3 - p1), 0.5);

			return Vec2(m(Vec2(2n * p1 - 2n * p2 + v0 + v1), t3) + m(Vec2(-3n * p1 + 3n * p2 - 2n * v0 - v1), t2) + m(v0, t) + p1);
		}

		// ==================================================
		// よく使うベクトルの定義
		// ==================================================
		/**
		 * 0ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get zero() {
			return new Andesine.Vector2(0, 0);
		}
		/**
		 * 1ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get one() {
			return new Andesine.Vector2(1, 1);
		}

		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get up() {
			return new Andesine.Vector2(0, 1);
		}
		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get down() {
			return new Andesine.Vector2(0, -1);
		}
		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get left() {
			return new Andesine.Vector2(-1, 0);
		}
		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get right() {
			return new Andesine.Vector2(1, 0);
		}

		/**
		 * 許容最大値
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get MAX_VECTOR() {
			return new Andesine.Vector2(Andesine._B_MAX, Andesine._B_MAX);
		}
		/**
		 * 許容最小値
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get MIN_VECTOR() {
			return new Andesine.Vector2(Andesine._B_MIN, Andesine._B_MIN);
		}

		/**
		 * 無限大
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 * @deprecated
		 */
		static get positiveInfinity() {
			return new Andesine.Vector2(Infinity, Infinity);
		}
		/**
		 * 無限小
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 * @deprecated
		 */
		static get negativeInfinity() {
			return new Andesine.Vector2(-Infinity, -Infinity);
		}
	};

	// ####################################################################################################

	/**
	 * 3次元座標
	 * @param {number | bigint | Andesine.Vector2 | number[]} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @param {number} [z=0] - z座標
	 * @returns {InstanceType<typeof Andesine.Vector3>}
	 * @static
	 */
	static Vec3(x, y) {
		return new Andesine.Vector3(x, y);
	}

	/**
	 * 3次元座標
	 * @memberof Andesine
	 * @extends {Andesine.Vector2}
	 * @param {number | bigint | Andesine.Vector2 | number[]} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @param {number} [z=0] - z座標
	 * @returns {Andesine.Vector3}
	 */
	static Vector3 = class extends Andesine.Vector2 {
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
			this.#z = Andesine._toNumber(z);
		}

		/**
		 * 座標設定
		 * @param {number | bigint | Andesine.Vector2 | number[]} [x] - x座標
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
			this.#z = Andesine._toNumber(z ?? this.x);
			return this;
		}

		get z() {
			return this.#z;
		}

		set z(z) {
			this.#z = Andesine._toNumber(z);
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
			let v = Andesine.Vector3.clamp(this);
			let ret = super.valueOf();
			let tmpZ = BigInt(Math.trunc(v.z * Andesine._B_FRACT));
			if (this.#z < Andesine._B_MIN || Andesine._B_MAX < this.#z) {
				console.warn(`[警告！] z座標は{${Andesine._B_MIN}～${Andesine._B_MAX}}の範囲に収める必要があります`);
			}
			ret += (tmpZ < 0 ? Andesine._B_CARRY | tmpZ : tmpZ) * Andesine._B_NEXT_CARRY_BASE * Andesine._B_NEXT_CARRY_BASE;
			return ret;
		}

		/**
		 * 演算子オーバーロード解凍用
		 *
		 * @note コンストラクタを使用する方が楽
		 * @param {bigint} num
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @overrides
		 */
		static unpack(num) {
			if (num instanceof Andesine.Vector2) {
				return num;
			}
			if (typeof num != "bigint") {
				try {
					num = BigInt(num);
				} catch (e) {
					console.warn(e);
					return new Andesine.Vector3();
				}
			}
			let tmpX, tmpY, tmpZ;
			/*
			* Xがマイナスか
				((num & Andesine._B_CARRY) !== 0n)
			* Yがマイナスか
				((num & (Andesine._B_CARRY * Andesine._B_NEXT_CARRY_BASE)) !== 0n)
				//(num < 0)
			* Zがマイナスか
				((num & (Andesine._B_CARRY * Andesine._B_NEXT_CARRY_BASE * Andesine._B_NEXT_CARRY_BASE)) !== 0n)
			*/
			switch (((num & Andesine._B_CARRY) !== 0n) + ((num & (Andesine._B_CARRY * Andesine._B_NEXT_CARRY_BASE)) !== 0n) * 2 + ((num & (Andesine._B_CARRY * Andesine._B_NEXT_CARRY_BASE * Andesine._B_NEXT_CARRY_BASE)) !== 0n) * 4) {
				case 0:
					// x+ y+ z+ (0~,0~,0~)
					tmpX = num % Andesine._B_CARRY;
					tmpY = ((num - tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY;
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
				case 1:
					// x- y+ z+ (~-1,1~,0~)
					tmpX = (num % Andesine._B_CARRY) - Andesine._B_CARRY;
					tmpY = (((num + tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY) + 1n;
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
				case 2:
					// x+ y- z+ (0~,~-1,1~)
					tmpX = (((num + Andesine._B_CARRY) % Andesine._B_CARRY) + Andesine._B_CARRY) % Andesine._B_CARRY;
					tmpY = BigInt(Math.round(Number(((((num - tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY) - Andesine._B_CARRY) * 10n) / 10));
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
				case 3:
					// x- y- z+ (~-1,~0,1~)
					tmpX = (num % Andesine._B_CARRY) - Andesine._B_CARRY;
					tmpY = ((((num - tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY) - Andesine._B_CARRY) % Andesine._B_CARRY;
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
				case 4:
					// x+ y+ z- (0~,0~,~-1)
					tmpX = (((num + Andesine._B_CARRY) % Andesine._B_CARRY) + Andesine._B_CARRY) % Andesine._B_CARRY;
					tmpY = ((((num - tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY) + Andesine._B_CARRY) % Andesine._B_CARRY;
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
				case 5:
					// x- y+ z- (~-1,1~,~-1)
					tmpX = ((((num + Andesine._B_CARRY) % Andesine._B_CARRY) + Andesine._B_CARRY) % Andesine._B_CARRY) - Andesine._B_CARRY;
					tmpY = (((num + tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY) + Andesine._B_CARRY;
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
				case 6:
					// x+ y- z- (0~,~-1,~-1)
					tmpX = (((num + Andesine._B_CARRY) % Andesine._B_CARRY) + Andesine._B_CARRY) % Andesine._B_CARRY;
					tmpY = BigInt(Math.round(Number((((num - tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY) * 10n) / 10));
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
				case 7:
					// x- y- z- (~-1,~0,~-1)
					tmpX = num % Andesine._B_CARRY;
					tmpY = ((num - tmpX) / Andesine._B_NEXT_CARRY_BASE) % Andesine._B_CARRY;
					tmpZ = (num - tmpX - tmpY * Andesine._B_NEXT_CARRY_BASE) / Andesine._B_NEXT_CARRY_BASE / Andesine._B_NEXT_CARRY_BASE;
					break;
			}
			return new Andesine.Vector3(Number(tmpX) / Andesine._B_FRACT, Number(tmpY) / Andesine._B_FRACT, Number(tmpZ) / Andesine._B_FRACT);
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @overrides
		 */
		toString(nesting = 1) {
			return Andesine.Util.createToStringMessage(this, nesting, {
				x: this.x,
				y: this.y,
				z: this.#z,
			});
		}

		/**
		 * 複製
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @overrides
		 */
		clone() {
			return new Andesine.Vector3(this.x, this.y, this.#z);
		}

		/**
		 * 統合
		 * @param {InstanceType<typeof Andesine.Vector2> | number[] | Object | bigint} arr - 統合対象
		 * @returns {InstanceType<typeof Andesine.Vector3> | null}
		 * @static
		 * @overrides
		 */
		static convert(arr) {
			// 計算結果
			if (typeof arr === "bigint") {
				return Andesine.Vector3.unpack(arr);
			}
			// 自身
			if (arr instanceof Andesine.Vector3) {
				return arr.clone();
			}
			// Andesine.Vector2
			if (arr instanceof Andesine.Vector2) {
				return new Andesine.Vector3(arr.x, arr.y, 0);
			}
			// 配列
			if (Array.isArray(arr)) {
				if (arr.length < 3) {
					return this.convert(Andesine.Vector2.convert(arr));
				}
				return new Andesine.Vector3(arr[0], arr[1], arr[2]);
			}
			// 連想配列
			if (Jasc.isAssociative(arr)) {
				return new Andesine.Vector3(arr.x, arr.y, arr.z);
			}
			return null;
		}

		// ==================================================
		// 演算
		// ==================================================

		/**
		 * 足し算
		 * @param {InstanceType<typeof Andesine.Vector2> | number} [v=0] - 足し算対象
		 * @returns {this}
		 * @overrides
		 */
		add(v = 0) {
			super.add(v);
			const t = Andesine._getPosNumber(v);
			this.#z += t.z;
			return this;
		}
		/**
		 * 引き算
		 * @param {InstanceType<typeof Andesine.Vector2> | number} [v=0] - 引き算対象
		 * @returns {this}
		 * @overrides
		 */
		sub(v = 0) {
			super.sub(v);
			const t = Andesine._getPosNumber(v);
			this.#z -= t.z;
			return this;
		}
		/**
		 * 掛け算
		 * @param {Andesine.Vector2 | number} [v=1] - 掛け算対象
		 * @returns {this}
		 * @overrides
		 */
		mul(v = 1) {
			super.mul(v);
			const t = Andesine._getPosNumber(v);
			this.#z *= t.z;
			return this;
		}
		/**
		 * 除算
		 * @param {Andesine.Vector2 | number} [v=1] - 除算対象
		 * @returns {this}
		 * @overrides
		 */
		div(v = 1) {
			super.div(v);
			const t = Andesine._getPosNumber(v);
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
			this.#z = Math.pow(this.#z, Andesine._toNumber(num3 ?? num1));
			return this;
		}

		/**
		 * 等しい
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		eq(v) {
			let f = super.eq(v);
			if (v instanceof Andesine.Vector2) {
				return f;
			}
			return f && Jasc.compareFloats(this.#z, v.z);
		}
		/**
		 * 超(>)
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		gt(v) {
			let f = super.gt(v);
			if (v instanceof Andesine.Vector2) {
				return f;
			}
			return f && this.#z > v.z;
		}
		/**
		 * 未満(<)
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		lt(v) {
			let f = super.lt(v);
			if (v instanceof Andesine.Vector2) {
				return f;
			}
			return f && this.#z < v.z;
		}
		/**
		 * 以上(>=)
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		ge(v) {
			let f = super.ge(v);
			if (v instanceof Andesine.Vector2) {
				return f;
			}
			return f && this.#z >= v.z;
		}
		/**
		 * 以下(<=)
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {boolean}
		 * @overrides
		 */
		le(v) {
			let f = super.le(v);
			if (v instanceof Andesine.Vector2) {
				return f;
			}
			return f && this.#z <= v.z;
		}

		/**
		 * ベクトルの内積
		 * @param {InstanceType<typeof Andesine.Vector3>} v - 対象ベクトル
		 * @returns {number}
		 * @overrides
		 */
		dot(v) {
			return this.x * v.x + this.y * v.y + this.#z * v.z;
		}
		/**
		 * ベクトルの外積
		 * @param {InstanceType<typeof Andesine.Vector3>} v - 対象ベクトル
		 * @returns {Andesine.Vector3}
		 * @overrides
		 */
		cross(v) {
			return new Andesine.Vector3(this.y * v.z - this.#z * v.y, this.#z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
		}

		/**
		 * 絶対値
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get abs() {
			return new Andesine.Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.#z));
		}
		/**
		 * 符号のみ取得
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get sign() {
			return new Andesine.Vector3(Math.sign(this.x), Math.sign(this.y), Math.sign(this.#z));
		}
		/**
		 * 四捨五入
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get round() {
			return new Andesine.Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.#z));
		}
		/**
		 * 切り上げ
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get ceil() {
			return new Andesine.Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.#z));
		}
		/**
		 * 切り下げ
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get floor() {
			return new Andesine.Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.#z));
		}
		/**
		 * 切り捨て
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get trunc() {
			return new Andesine.Vector3(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.#z));
		}
		/**
		 * 小数部のみ
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get fract() {
			return new Andesine.Vector3(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.#z - Math.floor(this.#z));
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
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get normalize() {
			let l = this.length;
			return new Andesine.Vector3(this.x / l, this.y / l, this.#z / l);
		}
		/**
		 * 範囲内に収める
		 * @param {Andesine.Vector3 | number} [min=Andesine._B_MIN] - 最小
		 * @param {Andesine.Vector3 | number} [max=Andesine._B_MAX] - 最大
		 * @returns {this}
		 * @overrides
		 */
		clamp(min = Andesine._B_MIN, max = Andesine._B_MAX) {
			super.clamp(min, max);
			this.#z = Math.max(min?.z ?? Andesine._toNumber(min), Math.min(max?.z ?? Andesine._toNumber(max), this.#z));
			return this;
		}

		/**
		 * 座標範囲設定
		 * @param {Andesine.Vector2 | number} [fromMin=Andesine._B_MIN] - 変換前最小
		 * @param {Andesine.Vector2 | number} [fromMax=Andesine._B_MAX] - 変換前最大
		 * @param {Andesine.Vector2 | number} [toMin=Andesine._B_MIN] - 変換後最小
		 * @param {Andesine.Vector2 | number} [toMax=Andesine._B_MAX] - 変換後最大
		 * @returns {this}
		 * @overrides
		 */
		map(fromMin = Andesine._B_MIN, fromMax = Andesine._B_MAX, toMin = Andesine._B_MIN, toMax = Andesine._B_MAX) {
			super.map(fromMin, fromMax, toMin, toMax);
			this.#z = Jasc.map(
				// z座標範囲設定
				this.#z,
				fromMin?.z ?? Andesine._toNumber(fromMin),
				fromMax?.z ?? Andesine._toNumber(fromMax),
				toMin?.z ?? Andesine._toNumber(toMin),
				toMax?.z ?? Andesine._toNumber(toMax)
			);
			return this;
		}

		// ==================================================
		// ユーティリティ
		// ==================================================

		/**
		 * 2点間の距離
		 * @param {InstanceType<typeof Andesine.Vector3>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector3>} v2 - 2つ目のベクトル
		 * @returns {number}
		 * @static
		 * @overrides
		 */
		static distance(v1, v2) {
			return Andesine.Vector3.sub(v1, v2).length;
		}
		/**
		 * 2点間の角度
		 * @param {InstanceType<typeof Andesine.Vector3>} v - 対象ベクトル
		 * @returns {number}
		 * @overrides
		 */
		angle(v) {
			return Math.acos(this.dot(v) / (this.length * v.length));
		}

		/**
		 * 2つのベクトルの最大値
		 * @param {InstanceType<typeof Andesine.Vector3>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector3>} v2 - 2つ目のベクトル
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @static
		 * @override
		 */
		static max(v1, v2) {
			return new Andesine.Vector3(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y), Math.max(v1.z, v2.z));
		}
		/**
		 * 2つのベクトルの最大値
		 * @param {InstanceType<typeof Andesine.Vector3>} v - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @deprecated
		 * @override
		 */
		max(v) {
			return Andesine.Vector3.max(this, v);
		}

		/**
		 * 2つのベクトルの最小値
		 * @param {InstanceType<typeof Andesine.Vector3>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector3>} v2 - 2つ目のベクトル
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @static
		 * @override
		 */
		static min(v1, v2) {
			return new Andesine.Vector3(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y), Math.min(v1.z, v2.z));
		}
		/**
		 * 2つのベクトルの最小値
		 * @param {InstanceType<typeof Andesine.Vector3>} v1 - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @deprecated
		 * @override
		 */
		min(v) {
			return Andesine.Vector3.min(this, v);
		}

		// ==================================================
		// 動作関連
		// ==================================================

		/**
		 * 2点間の線形補間
		 * @param {InstanceType<typeof Andesine.Vector3> | number[]} start - 開始地点
		 * @param {InstanceType<typeof Andesine.Vector3> | number[]} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @static
		 * @override
		 */
		static leap(start, end, t) {
			const s = Andesine.Vector3.convert(start);
			const e = Andesine.Vector3.convert(end);
			return new Andesine.Vector3(s.x + (e.x - s.x) * t, s.y + (e.y - s.y) * t, s.z + (e.z - s.z) * t);
		}
		/**
		 * 2点間の線形補間
		 * @param {InstanceType<typeof Andesine.Vector3> | bigint | number[]} start - 開始地点
		 * @param {InstanceType<typeof Andesine.Vector3> | bigint | number[]} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 * @override
		 */
		leap(start, end, t) {
			this.set(Andesine.Vector3.leap(start, end, t));
			return this;
		}

		/**
		 * 2点間の滑らかな線形補間
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Andesine.Vector3}
		 * @static
		 */
		static smoothDamp(start, end, t) {
			return Andesine.Vector3.leap(start, end, -(eased = (Math.cos(Math.PI * t) - 1) / 2));
		}
		/**
		 * 2点間の滑らかな線形補間の座標に移動
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		smoothDamp(start, end, t) {
			this.set(Andesine.Vector3.smoothDamp(start, end, t));
			return this;
		}

		// ==================================================
		// よく使うベクトルの定義
		// ==================================================
		/**
		 * 0ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get zero() {
			return new Andesine.Vector3(0, 0, 0);
		}
		/**
		 * 1ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get one() {
			return new Andesine.Vector3(1, 1, 1);
		}

		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get up() {
			return new Andesine.Vector3(0, 1, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get down() {
			return new Andesine.Vector3(0, -1, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get left() {
			return new Andesine.Vector3(-1, 0, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get right() {
			return new Andesine.Vector3(1, 0, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 */
		static get forward() {
			return new Andesine.Vector3(0, 0, 1);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 */
		static get back() {
			return new Andesine.Vector3(0, 0, -1);
		}

		/**
		 * 許容最大値
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get MAX_VECTOR() {
			return new Andesine.Vector3(Andesine._B_MAX, Andesine._B_MAX, Andesine._B_MAX);
		}
		/**
		 * 許容最小値
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get MIN_VECTOR() {
			return new Andesine.Vector3(Andesine._B_MIN, Andesine._B_MIN, Andesine._B_MIN);
		}

		/**
		 * 無限大
		 * @type {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 * @deprecated
		 */
		static get positiveInfinity() {
			return new Andesine.Vector3(Infinity, Infinity, Infinity);
		}
		/**
		 * 無限小
		 * @type {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 * @deprecated
		 */
		static get negativeInfinity() {
			return new Andesine.Vector3(-Infinity, -Infinity, -Infinity);
		}
	};

	// ####################################################################################################

	/**
	 * 矩形
	 * (四角い範囲)
	 * @memberof Andesine
	 * @param {number | Andesine.Vector2} x - x座標(x,y座標)
	 * @param {number | Andesine.Vector2} y - y座標(w,hサイズ)
	 * @param {number | Andesine.Vector2} width - 幅
	 * @param {number} height - 高さ
	 * @returns {Andesine.Rectangle}
	 */
	static Rectangle = class {
		constructor(x = 0, y = 0, width = 0, height = 0) {
			if (typeof x === "number") {
				// x y ??
				this.position = new Andesine.Vector2(x, y);
				if (typeof width === "number") {
					// w h
					this.size = new Andesine.Vector2(width, height);
				} else {
					// wh
					this.size = Andesine.Vector2.convert(width);
				}
			} else {
				// xy ??
				this.position = Andesine.Vector2.convert(x);
				if (typeof y === "number") {
					// w h
					this.size = new Andesine.Vector2(y, width);
				} else {
					// wh
					this.size = Andesine.Vector2.convert(y);
				}
			}
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 */
		toString(nesting = 1) {
			return Andesine.Util.createToStringMessage(this, nesting, {
				position: this.position,
				size: this.size,
			});
		}

		/**
		 * 矩形の当たり判定
		 * @param {InstanceType<typeof Andesine.Vector2> | InstanceType<typeof Andesine.Rectangle>} other
		 * @param {boolean} [isFull=false] - 矩形全体に当たっているか
		 * @returns {boolean}
		 */
		isInside(other, isFull = false) {
			if (other instanceof Andesine.Vector2) {
				if (other.x < this.x || this.x + this.width < other.x || other.y < this.y || this.y + this.height < other.y) {
					return false;
				}
			} else if (other instanceof Andesine.Rectangle) {
				if (isFull) {
					if (other.x < this.x || this.x + this.width < other.x || other.y < this.y || this.y + this.height < other.y) {
						return false;
					}
				} else {
					// 部分的にでも擦ればok
					if (other.x + other.width < this.x || this.x + this.width < other.x || other.y + other.height < this.y || this.y + this.height < other.y) {
						return false;
					}
				}
			} else {
				const pos = Andesine.Vector2.convert(other);
				if (pos) {
					return this.isInside(pos, isFull);
				}
				console.warn("非対応の型");
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
	};

	// ####################################################################################################

	/**
	 * イベントを管理するクラス
	 * - 継承推奨
	 * @memberof Andesine
	 * @returns {Andesine.EventDispatcher}
	 * @abstract
	 */
	static EventDispatcher = class {
		#_events = {};

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @override
		 */
		toString(nesting = 1) {
			const ev = {};
			for (const key in this.#_events) {
				ev[key] = Object.keys(this.#_events[key]).length;
			}
			return Andesine.Util.createToStringMessage(this, nesting, ev);
		}

		/**
		 * 使用されていない変数域を解放
		 * @returns {number} 解放した数
		 */
		releaseResources() {
			let count = 0;
			for (const key in this.#_events) {
				if (Object.keys(this.#_events[key]).length <= 0) {
					delete this.#_events[key];
					count++;
				}
			}
			return count;
		}

		/**
		 * イベントを追加
		 * @param {string} eventType - イベントタイプ
		 * @param {function} callback
		 * @param {string} [name=""] - 削除時の参照用名称
		 */
		addEventListener(eventType, callback, name = "") {
			if (typeof callback !== "function") {
				console.error("callback is not function");
				return false;
			}
			if (!eventType) {
				console.warn("イベントタイプ未指定");
				return false;
			}
			if (!(eventType in this.#_events)) {
				this.#_events[eventType] = {};
			}
			if (name) {
				this.#_events[eventType][name] = callback;
			} else {
				name = Jasc.setAssociativeAutoName(this.#_events[eventType], callback, "andesine");
			}
			return name;
		}
		/**
		 * イベントを追加
		 * @param {string} eventType - イベントタイプ
		 * @param {Function} callback
		 * @param {string} [name=""] - 削除時の参照用名称
		 */
		on = this.addEventListener;

		/**
		 * イベントを削除
		 * @param {string} eventType - イベントタイプ
		 * @param {string} [name] - 削除時の参照用名称
		 * @returns {boolean}
		 */
		removeEventListener(eventType, name) {
			if (!(eventType in this.#_events)) {
				return false;
			}
			if (name) {
				if (this.#_events[eventType][name]) {
					delete this.#_events[eventType][name];
					return true;
				}
			} else {
				this.#_events[eventType] = {};
				return true;
			}
			return false;
		}
		/**
		 * イベントを削除
		 * @param {string} eventType - イベントタイプ
		 * @param {string} [name] - 削除時の参照用名称
		 * @returns {boolean}
		 */
		off = this.removeEventListener;

		/**
		 * イベントを発火
		 * @param {string} eventType - イベントタイプ
		 * @param {...any} [args] - イベントの引数
		 * @returns {false | number} 発火した数
		 */
		dispatchEvent(eventType, ...args) {
			if (!(eventType in this.#_events)) {
				return false;
			}
			let count = 0;
			for (const name in this.#_events[eventType]) {
				try {
					this.#_events[eventType][name](...args);
					count++;
				} catch (e) {
					console.error(e);
				}
			}
			return count;
		}
	};

	// ####################################################################################################

	/**
	 * 描画オブジェクト
	 * @memberof Andesine
	 * @exports Andesine.DrawObject
	 * @param {Object} [opt]
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @returns {Andesine.DrawObject}
	 * @abstract
	 */
	static DrawObject = class extends Andesine.EventDispatcher {
		#_parent = null;
		#_children = {};
		#_layerList = [];
		#_layer = 0;
		#_alpha = 1;

		isDestroy = false;
		isHidden = false;
		_ctx = null;

		constructor({ ctx = null, layer = 0 } = {}) {
			super();
			if (ctx == null) {
				ctx = jasc.game.getCurrentCtx();
			} else if (typeof ctx === "string") {
				if (jasc.readonly.game.ctx[ctx]) {
					ctx = jasc.readonly.game.ctx[ctx];
				} else {
					let elem = jasc.acq(ctx);
					if (elem) {
						if (Array.isArray(elem)) {
							elem = elem[0];
						}
						ctx = elem.getContext("2d");
					}
				}
			}
			if (!(ctx instanceof CanvasRenderingContext2D)) {
				throw new Error("描画オブジェクトの作成に失敗しました。");
			}
			this._ctx = ctx;
			this.layer = layer;
		}

		/**
		 * ctxを取得する
		 * @returns {CanvasRenderingContext2D}
		 * @readonly
		 */
		get ctx() {
			if (this.#_parent) {
				return this.#_parent.ctx;
			}
			return this._ctx;
		}

		/**
		 * レイヤーを取得する
		 * @returns {number}
		 * @readonly
		 */
		get layer() {
			return this.#_layer;
		}

		/**
		 * レイヤーを設定する
		 * @param {number} layer_ - レイヤー番号
		 * @throws {Error} レイヤーは数値で指定して下さい
		 */
		set layer(layer_) {
			if (typeof layer_ !== "number") {
				throw new Error("レイヤーは数値で指定して下さい。");
			}
			this.#_layer = layer_;
			// 親のレイヤーリストを更新
			if (this.#_parent) {
				this.#_parent._updateLayerList();
			}
		}

		/**
		 * レイヤーリストを更新
		 */
		_updateLayerList() {
			this.#_layerList = Andesine.Util.getSortLayerList(this.#_children);
		}

		/**
		 * 透明度を取得する
		 * @returns {number}
		 * @readonly
		 */
		get alpha() {
			return this.#_alpha;
		}

		/**
		 * 透明度を設定する
		 * @param {number} alpha_ - 透明度
		 */
		set alpha(alpha_) {
			if (typeof alpha_ !== "number") {
				throw new Error("透明度は数値で指定して下さい。");
			}
			if (alpha_ < 0) {
				alpha_ = 0;
			} else if (alpha_ > 1) {
				alpha_ = 1;
			}

			this.#_alpha = alpha_;
		}

		/**
		 * 画面描画時の透明度
		 * @returns {number}
		 * @readonly
		 */
		get displayAlpha() {
			const alpha = this.#_alpha * (this.#_parent?.displayAlpha ?? 1);
			if (alpha < 0.001) {
				return 0;
			}
			return alpha;
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @override
		 */
		toString(nesting = 1) {
			return Andesine.Util.createToStringMessage(this, nesting, {
				name: this.name,
				parent: this.#_parent,
				childLength: this.childLength,
			});
		}

		/**
		 * 使用されていない変数域を解放
		 * @returns {number} 解放した数
		 */
		releaseResources() {
			let count = super.releaseResources();
			for (let i = 0, li = this.#_layerList.length; i < li; i++) {
				count += this.#_children[this.#_layerList[i]].releaseResources();
			}
			return count;
		}

		/**
		 * 全体描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		_systemResetting() {
			this.resetting();
			for (let i = 0, li = this.#_layerList.length; i < li; i++) {
				this.#_children[this.#_layerList[i]]._systemResetting();
			}
		}

		/**
		 * 描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		resetting() {
			const size = Andesine.getFullSize(this, this.#_parent);
			this.dispatchEvent("resetting", this, this.#_parent, size);
		}

		/**
		 * 全体オブジェクト更新ループ
		 * @returns {undefined}
		 */
		_systemUpdate() {
			this.update();
			for (let i = 0, li = this.#_layerList.length; i < li; i++) {
				const name = this.#_layerList[i];
				const child = this.#_children[name];
				child._systemUpdate();
				if (this.isDestroy || child.isDestroy) {
					this.removeChild(name);
				}
			}
		}

		/**
		 * オブジェクト更新ループ
		 * @returns {undefined}
		 */
		update() {}

		/**
		 * 全体描画ループ
		 * @param {boolean} [isDraw] - 描画するか
		 * @returns {undefined}
		 */
		_systemDraw(isDraw) {
			if (this.isDestroy) {
				return;
			}
			if (!isDraw || this.isHidden) {
				return;
			}
			this.draw();
			for (let i = 0, li = this.#_layerList.length; i < li; i++) {
				this.#_children[this.#_layerList[i]]._systemDraw(isDraw);
			}
		}

		/**
		 * 描画ループ
		 * @returns {undefined}
		 */
		draw() {}

		/**
		 * 全体ホバー時処理
		 * @param {Object[]} es
		 * @param {number[]} [deepHover=[]]
		 * @returns {undefined}
		 */
		_systemHover(es, deepHover = []) {
			if (this.isDestroy) {
				return;
			}
			if (this.isInside) {
				if (!deepHover.length) {
					deepHover = [];
					for (let i = 0, li = es.length; i < li; i++) {
						deepHover[i] = 0;
					}
				}
				for (let i = 0, li = es.length; i < li; i++) {
					const e = es[i];
					const isHover = this.isInside(e.pos, false);
					if (isHover) {
						deepHover[i] = 0;
					}
				}
				const event = new Andesine.GameHoverEvent(this, es, deepHover);
				this.dispatchEvent("hover", event);
			}

			deepHover = deepHover.map((d) => d + 1);

			for (let i = 0, li = this.#_layerList.length; i < li; i++) {
				this.#_children[this.#_layerList[i]]._systemHover(es, deepHover);
			}
		}

		/**
		 * 全体クリック時処理
		 * @param {Object[]} es
		 * @param {number[]} [deepClick=[]]
		 * @returns {undefined}
		 */
		_systemClick(es, deepClick = []) {
			if (this.isDestroy) {
				return;
			}
			if (this.isInside) {
				if (!deepClick.length) {
					deepClick = [];
					for (let i = 0, li = es.length; i < li; i++) {
						deepClick[i] = 0;
					}
				}
				for (let i = 0, li = es.length; i < li; i++) {
					const e = es[i];
					const isClick = this.isInside(e.pos, false);
					if (isClick) {
						deepClick[i] = 0;
					}
				}
				const event = new Andesine.GameClickEvent(this, es, deepClick);
				this.dispatchEvent("click", event);
			}

			deepClick = deepClick.map((d) => d + 1);

			for (let i = 0, li = this.#_layerList.length; i < li; i++) {
				this.#_children[this.#_layerList[i]]._systemClick(es, deepClick);
			}
		}

		/**
		 * 子オブジェクトを追加
		 * @param {InstanceType<typeof Andesine.DrawObject>} child
		 * @param {string} [name] - オブジェクト名
		 * @returns {string} 設定されたオブジェクト名
		 */
		appendChild(child, name) {
			if (this.isDestroy || child.isDestroy) {
				return;
			}
			if (!(child instanceof Andesine.DrawObject)) {
				console.warn("DrawObjectを継承して下さい。");
				return false;
			}
			if (name) {
				this.#_children[name] = child;
			} else {
				name = Jasc.setAssociativeAutoName(this.#_children, child, "andesine");
			}
			// 親設定
			child._setParent(this);
			this._updateLayerList();
			return name;
		}

		/**
		 * 子オブジェクトを分離
		 * @param {string} name - オブジェクト名
		 * @returns {boolean}
		 */
		removeChild(name) {
			const child = this.#_children[name];
			if (child) {
				delete this.#_children[name];
				child._setParent(null);
				this._updateLayerList();
				return true;
			}
			return false;
		}

		/**
		 * 子オブジェクトを取得
		 * @param {string} name - オブジェクト名
		 * @returns {InstanceType<typeof Andesine.DrawObject>}
		 */
		getChild(name) {
			return this.#_children[name];
		}

		/**
		 * 子オブジェクト名リストを取得
		 * @returns {string[]}
		 */
		getChildNameList() {
			return this.#_layerList;
		}

		/**
		 * 子オブジェクト名を取得
		 * @param {InstanceType<typeof Andesine.DrawObject>} obj
		 * @returns {string | null}
		 */
		getChildName(obj) {
			for (let name in this.#_children) {
				if (this.#_children[name] === obj) {
					return name;
				}
			}
			return null;
		}

		/**
		 * オブジェクト名を取得
		 * @returns {string | null}
		 */
		get name() {
			if (this.#_parent) {
				return this.#_parent.getChildName(this);
			}
			return null;
		}

		getParentList() {
			const list = [];
			let obj = this;
			while (obj) {
				list.push(obj);
				obj = obj.parent;
			}
			list.reverse();
			return list;
		}

		getParentNameList() {
			const list = this.getParentList();
			return list.map((obj) => obj.name);
		}

		getParentClassNameList() {
			const list = this.getParentList();
			return list.map((obj) => obj.constructor.name);
		}

		/**
		 * 子オブジェクト数を取得
		 * @returns {number}
		 */
		get childLength() {
			return this.#_layerList.length;
		}

		/**
		 * 親オブジェクト取得
		 * @returns {InstanceType<typeof Andesine.DrawObject> | null}
		 * @readonly
		 */
		get parent() {
			return this.#_parent;
		}

		/**
		 * 親オブジェクト追加(システム用)
		 * @param {InstanceType<typeof Andesine.DrawObject> | null} parent
		 * @returns {undefined}
		 */
		_setParent(parent) {
			if (parent instanceof Andesine.DrawObject) {
				this.#_parent = parent;
				this._ctx = null;
			} else if (parent === null) {
				if (this.#_parent && !this._ctx) {
					this._ctx = this.#_parent._ctx;
				}
				this.#_parent = null;
			} else {
				console.warn("親オブジェクト指定エラー");
			}
		}
	};

	// ####################################################################################################

	/**
	 * 矩形(描画オブジェクト)
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {InstanceType<typeof Andesine.Box>}
	 * @static
	 */
	static createBox(opt) {
		return new Andesine.Box(opt);
	}
	/**
	 * 矩形(描画オブジェクト)
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {Andesine.Box}
	 */
	static Box = class extends Andesine.DrawObject {
		_animationObj;

		constructor({ ctx, layer = 0, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, bg = "", radius = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1 } = {}) {
			super({ ctx, layer });
			this.setting = {
				size,
			};
			this.rect = new Andesine.Rectangle(position, this._updateSize(false));
			this.bg = bg;
			this.radius = radius;
			this.boxAlign = boxAlign;
			this.boxBaseLine = boxBaseLine;
			this.alpha = alpha;
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @override
		 */
		toString(nesting = 1) {
			const pos = this.relative();
			return Andesine.Util.createToStringMessage(this, nesting, {
				name: this.name,
				rect: this.rect,
				absPos: pos,
				childLength: this.childLength,
			});
		}

		update() {
			this.dispatchEvent("update", this);
			if (this._animationObj) {
				this._animationObj.update();
			}
		}

		draw() {
			const ctx = this.ctx;

			const setting = {};
			if (this.bg) {
				setting.fillStyle = this.bg;
			} else {
				setting.fillStyle = "transparent";
			}
			setting.globalAlpha = this.displayAlpha;
			jasc.draw.ctxSetting(ctx, setting);
			this.dispatchEvent("draw", this);
			const pos = this.relative();
			this._updateSize(true);
			if (setting.globalAlpha == 0) {
				return true;
			}
			let rad = this.radius;
			if (rad === "max") {
				rad = Math.min(this.rect.width, this.rect.height) / 2;
			}
			if (rad > 0) {
				if (setting.fillStyle !== "transparent") {
					Andesine.createRoundRectPath(ctx, ...pos.array, this.rect.width, this.rect.height, rad);
					ctx.fill();
				}
			} else {
				if (setting.fillStyle !== "transparent") {
					ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);
				}
			}
			return false;
		}

		/**
		 * 相対的な座標を取得
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		relative() {
			let pos;
			if (this.parent) {
				const v1 = this.parent.relative();
				const v2 = this.rect.position;
				pos = Andesine.Vector2.add(v1, v2);
			} else {
				pos = this.rect.position.clone();
			}

			switch (this.boxAlign) {
				case "left":
					// 何もしない
					break;
				case "center":
					pos.x -= this.rect.width / 2;
					break;
				case "right":
					pos.x -= this.rect.width;
					break;
			}
			switch (this.boxBaseLine) {
				case "top":
					// 何もしない
					break;
				case "middle":
					pos.y -= this.rect.height / 2;
					break;
				case "bottom":
					pos.y -= this.rect.height;
					break;
			}
			return pos;
		}

		/**
		 * サイズを更新
		 * @param {boolean} [commit=true]
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		_updateSize(commit = true) {
			let size = this.setting.size;
			if (!size) {
				return this.rect.size.clone();
			}
			if (size instanceof Andesine.Vector2) {
				if (commit) {
					this.rect.width = size.x;
					this.rect.height = size.y;
				}
				this.setting.size = null;
				return size;
			}
			let w, h;
			if (Jasc.isAssociative(size)) {
				w = size.x ?? size.width ?? size.w ?? 0;
				h = size.y ?? size.height ?? size.h ?? 0;
			} else if (Array.isArray(size)) {
				w = size[0];
				h = size[1];
			} else if (typeof size === "string") {
				size = size.toLowerCase();
				if (size === "max" || size === "full") {
					w = "max";
					h = "max";
					this.setting.size = "max";
				}
			} else {
				return;
			}
			const ws = w.toString().toLowerCase();
			const v = new Andesine.Vector2();
			const pos = Andesine.getFullSize(this, this.parent);
			let ch = false;
			if (ws === "max" || ws === "full") {
				v.x = pos.x;
				ch = true;
			} else {
				v.x = +w;
			}
			const hs = h.toString().toLowerCase();
			if (hs === "max" || hs === "full") {
				v.y = pos.y;
				ch = true;
			} else {
				v.y = +h;
			}
			if (!ch) {
				this.setting.size = null;
			}
			if (commit) {
				this.rect.width = v.x;
				this.rect.height = v.y;
			}
			return v;
		}

		/**
		 * 矩形の当たり判定
		 * @param {InstanceType<typeof Andesine.Vector2> | InstanceType<typeof Andesine.Rectangle>} other
		 * @returns {boolean}
		 */
		isInside(other, isFull = false) {
			let obj;
			if (other instanceof Andesine.Box) {
				obj = other.rect;
			} else {
				obj = other;
			}
			const rect = new Andesine.Rectangle(this.relative(), this.rect.size);
			return rect.isInside(obj, isFull);
		}

		/**
		 * 移動アニメーション
		 * @param {object} [opt] - オプション
		 * @param {Andesine.Vector2} [opt.end=Andesine.Vector2.zero] - 終了座標
		 * @param {number} [opt.flameTime=60] - 所要フレーム数
		 * @param {string} [opt.type="smooth"] - アニメーションタイプ (smooth | leap)
		 * @returns {Promise<InstanceType<typeof Andesine.Box>>}
		 */
		moveAnimation({ end = Andesine.Vector2.zero, flameTime = 60, type = "smooth" }) {
			if (this._animationObj) {
				this._animationObj.stop(true);
			}
			return new Promise((resolve) => {
				const _this = this;
				this._animationObj = new Andesine.Animation(this, {
					end,
					flameTime,
					type,
					callback() {
						resolve(_this);
					},
				});
			});
		}

		/**
		 * アニメーションを再度実行
		 * @returns {Promise<InstanceType<typeof Andesine.Box>>}
		 */
		restartAnimation() {
			return new Promise((resolve) => {
				if (this._animationObj) {
					const _this = this;
					this._animationObj.restart(() => {
						resolve(_this);
					});
				} else {
					resolve(this);
				}
			});
		}
	};

	/**
	 * 使用可能最大サイズを取得
	 * @param {InstanceType<typeof Andesine.Box>} _this
	 * @param {typeof Andesine.Box} [_parent]
	 * @returns {Andesine.Vector2}
	 * @static
	 */
	static getFullSize(_this, _parent) {
		let w, h;
		if (_parent) {
			w = _parent.rect.width;
			h = _parent.rect.height;
		} else {
			const size = jasc.game.getCanvasSize(_this.ctx.canvas);
			w = size.width;
			h = size.height;
		}
		return new Andesine.Vector2(w, h);
	}

	/**
	 * オブジェクトを最大まで広げる
	 * @param {InstanceType<typeof Andesine.Box>} _this
	 * @param {Andesine.Box} [_parent]
	 * @param {InstanceType<typeof Andesine.Vector2>} size
	 * @returns {undefined}
	 * @static
	 */
	static _fullResize(_this, _parent, size) {
		const rect = _this.rect;
		rect.x = rect.y = 0;
		rect.width = size.x;
		rect.height = size.y;
	}

	// ####################################################################################################

	/**
	 * フレームを作成する
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer=0] - レイヤー番号
	 * @param {Andesine.Vector2 | "full"} [opt.size="full"] - サイズ
	 * @returns {InstanceType<typeof Andesine.Frame>}
	 * @static
	 */
	static createFrame({ ctx, layer = 0, size = "full" } = {}) {
		return new Andesine.Frame({ ctx, layer: layer, size: size });
	}
	/**
	 * 描画フレーム
	 * @memberof Andesine
	 * @extends {Andesine.Box}
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {Andesine.Frame}
	 */
	static Frame = class extends Andesine.Box {
		constructor({ ctx, layer = 0, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, bg = "", radius = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1 } = {}) {
			super({ ctx, layer, position, size, bg, radius, boxAlign, boxBaseLine, alpha });
		}
	};

	// ####################################################################################################

	/**
	 * 角が丸い四角形のパスを作成する
	 * @memberof Andesine
	 * @param  {CanvasRenderingContext2D} ctx コンテキスト
	 * @param  {Number} x   左上隅のX座標
	 * @param  {Number} y   左上隅のY座標
	 * @param  {Number} w   幅
	 * @param  {Number} h   高さ
	 * @param  {Number} r   半径
	 * @static
	 */
	static createRoundRectPath(ctx, x, y, w, h, r) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.arc(x + w - r, y + r, r, Math.PI * (3 / 2), 0, false);
		ctx.lineTo(x + w, y + h - r);
		ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1 / 2), false);
		ctx.lineTo(x + r, y + h);
		ctx.arc(x + r, y + h - r, r, Math.PI * (1 / 2), Math.PI, false);
		ctx.lineTo(x, y + r);
		ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3 / 2), false);
		ctx.closePath();
	}

	// ####################################################################################################

	/**
	 * 矩形+テキスト(描画オブジェクト)
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.text=""] - テキスト
	 * @param {string} [opt.fg="#000"] - 文字色
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.align="left"] - テキストの配置
	 * @param {number} [opt.lineHeight=0] - 行間
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {InstanceType<typeof Andesine.TextBox>}
	 * @static
	 */
	static createTextBox(opt) {
		return new Andesine.TextBox(opt);
	}
	/**
	 * 矩形+テキスト(描画オブジェクト)
	 * @memberof Andesine
	 * @extends {Andesine.Box}
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.text=""] - テキスト
	 * @param {string} [opt.fg="#000"] - 文字色
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.align="left"] - テキストの配置
	 * @param {number} [opt.lineHeight=0] - 行間
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {Andesine.TextBox}
	 */
	static TextBox = class extends Andesine.Box {
		constructor({ ctx, layer = 0, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, text = "", fg = "#000", bg = "", radius = 0, align = "left", lineHeight = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1 }) {
			super({ ctx, layer, position, size, bg, radius, boxAlign, boxBaseLine, alpha });
			this.text = text;
			this.fg = fg;
			this.align = align;
			this.lineHeight = lineHeight;
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @override
		 */
		toString(nesting = 1) {
			const pos = this.relative();
			return Andesine.Util.createToStringMessage(this, nesting, {
				name: this.name,
				rect: this.rect,
				absPos: pos,
				text: this.text,
				childLength: this.childLength,
			});
		}

		draw() {
			if (super.draw()) {
				return true;
			}
			const ctx = this.ctx;
			const pos = this.relative();
			ctx.fillStyle = this.fg;
			Andesine.fixedFillText(ctx, this.text, pos, this.rect.width, this.align, this.lineHeight);
			return false;
		}
	};

	/**
	 * テキストを自動改行
	 * 改行は"\n"で可能
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {string} text
	 * @param {InstanceType<typeof Andesine.Vector2>} pos
	 * @param {number} width
	 * @param {string} [align="left"]
	 * @param {number} [lineHight=0]
	 * @static
	 */
	static fixedFillText(ctx, text, pos, width, align = "left", lineHight = 0) {
		let column = [
				{
					text: "",
					width: 0,
					height: 0,
				},
			],
			line = 0;

		const _pos = Andesine.Vector2.convert(pos);

		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		for (let i = 0; i < text.length; i++) {
			const char = text.charAt(i);
			let textSize = ctx.measureText(column[line].text + char);
			let lineWidth = textSize.actualBoundingBoxRight;
			if (char == "\n" || lineWidth > width) {
				line++;
				column[line] = {
					text: "",
					width: 0,
					height: column[line - 1].height,
				};
				if (char == "\n") {
					continue;
				}
				textSize = ctx.measureText(char);
				lineWidth = textSize.actualBoundingBoxRight;
			}
			column[line].text += char;
			column[line].width = lineWidth;
			column[line].height = textSize.actualBoundingBoxDescent;
		}

		let padding,
			_sumLineHight = 0;
		for (let i = 0, li = column.length; i < li; i++) {
			const addHeight = column[i].height + lineHight;
			_sumLineHight += addHeight;
			if (column[i].text == "") {
				continue;
			}
			const lineWidth = column[i].width;
			if (align == "right") {
				padding = width - lineWidth;
			} else if (align == "center") {
				padding = (width - lineWidth) / 2;
			} else {
				padding = 0;
			}
			ctx.fillText(column[i].text, _pos.x + padding, _pos.y + _sumLineHight - addHeight, width);
		}
	}

	// ####################################################################################################

	/**
	 * 画像(描画オブジェクト)
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {Andesine.ImageBox}
	 */
	static ImageBox = class extends Andesine.Box {
		constructor({ ctx, layer = 0, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, bg = "", radius = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1 } = {}) {
			super({ ctx, layer, position, size, bg, radius, boxAlign, boxBaseLine, alpha });
			this.img = null;
		}

		// TODO:画像の読み込みとか
		draw() {
			super.draw();
			const ctx = this.ctx;
			const pos = this.relative();
			ctx.drawImage(this.img, pos.x, pos.y, this.rect.width, this.rect.height);
		}
	};

	// ####################################################################################################

	/**
	 * 待機
	 * @memberof Andesine
	 * @param {func} func - コールバック
	 * @param {number} [wait=1000] - 待機時間(fps)
	 * @returns {Andesine.WaitObj}
	 */
	static WaitObj = class extends Andesine.DrawObject {
		anim = 0;

		constructor(func, wait = 1000) {
			super();
			this.func = func;
			this.wait = wait;
		}

		update() {
			this.anim++;
			if (this.anim > this.wait) {
				this.wait = Infinity;
				this.isDestroy = true;
				this.func?.();
			}
		}
	};

	// ####################################################################################################

	/**
	 * アニメーション
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @param  {object} [opt] - オプション
	 * @param  {Andesine.Vector2} [opt.end=Andesine.Vector2.zero] - 終了座標
	 * @param  {number} [opt.flameTime=60] - 所要フレーム数
	 * @param  {string} [opt.type="smooth"] - アニメーションタイプ (smooth | leap)
	 * @param  {function} [opt.callback] - 終了時コールバック
	 * @returns {Andesine.Animation}
	 */
	static Animation = class {
		#callback = null;

		isDestroy = false;
		objType = null;
		nowFrame = 0;

		constructor(_this, { end = Andesine.Vector2.zero, flameTime = 60, type = "smooth", callback } = {}) {
			this.animObj = _this;
			if (this.animObj instanceof Andesine.Box) {
				this.objType = "box";
			}
			switch (this.objType) {
				case "box":
					this.start = this.animObj.rect.position.clone();
					break;
				default:
					this.start = Andesine.Vector2.zero;
			}
			this.end = end;
			this.flameTime = flameTime;
			this.type = type;
			this.#callback = callback;
		}

		/**
		 * フレームごと実行
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		update() {
			if (this.isDestroy) {
				return;
			}
			if (this.nowFrame >= this.flameTime) {
				this.nowFrame = -Infinity;
				this.isDestroy = true;
				this.#_finish();
				return;
			}
			const t = this.nowFrame / this.flameTime;
			let pos = null;
			switch (this.type) {
				case "smooth":
					pos = Andesine.Vector2.smoothDamp(this.start, this.end, t);
					break;
				case "leap":
					pos = Andesine.Vector2.leap(this.start, this.end, t);
					break;
			}
			switch (this.objType) {
				case "box":
					this.animObj.rect.position.set(pos);
					break;
			}
			this.nowFrame++;
			return pos;
		}

		/**
		 * アニメーションを停止
		 * @param {boolean} [obligation=false] - 終了時コールバック
		 * @returns {undefined}
		 */
		stop(obligation = false) {
			this.isDestroy = true;
			if (obligation) {
				this.#_finish();
			}
		}

		/**
		 * アニメーションを再開
		 * @returns {undefined}
		 */
		resume() {
			this.isDestroy = false;
		}

		/**
		 * 初めから再開
		 * @param {function} [callback] - 終了時コールバック(再設定する場合)
		 * @returns {undefined}
		 */
		restart(callback) {
			this.isDestroy = false;
			this.nowFrame = 0;
			this.#_finish();
			this.#callback = callback;
		}

		/**
		 * 終了時処理
		 */
		#_finish() {
			switch (this.objType) {
				case "box":
					this.animObj.rect.position.set(this.end);
					break;
			}

			this.#callback?.();
			this.#callback = null;
		}
	};
	// ####################################################################################################

	/**
	 * ゲームイベント(継承専用)
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @returns {Andesine.GameEvent}
	 * @abstract
	 */
	static GameEvent = class {
		constructor(_this) {
			this.target = _this;
		}

		/**
		 * 親オブジェクトを取得
		 * @returns {InstanceType<typeof Andesine.DrawObject> | null}
		 */
		get parent() {
			return this.target.parent;
		}

		/**
		 * 使用可能最大サイズを取得
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		getFullSize() {
			return Andesine.getFullSize(this.target, this.target.parent);
		}
	};

	// ==================================================

	/**
	 * ゲームタッチイベント(継承専用)
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @param  {Object[]} es - タッチイベントリスト
	 * @param  {number[]} deepList - タッチイベントの深さ
	 * @returns {Andesine.GameClickEvent}
	 * @abstract
	 */
	static GameTouchEvent = class extends Andesine.GameEvent {
		#_deepList;
		#_isThisEnable;

		constructor(_this, es, deepList) {
			super(_this);
			this._es = es;
			this.#_deepList = deepList.slice();
		}

		/**
		 * タッチイベントリストを取得
		 * @returns {Object[]}
		 */
		get eventList() {
			return this._es;
		}

		/**
		 * タッチタイプを取得
		 * @returns {string} mouse | touch
		 */
		get touchType() {
			return this._es[0].type;
		}

		get _isThisEnable() {
			if (this.#_isThisEnable != null) {
				return this.#_isThisEnable;
			}
			for (let i = 0, li = this.#_deepList.length; i < li; i++) {
				if (this.#_deepList[i] == 0) {
					this.#_isThisEnable = true;
				}
			}
			this.#_isThisEnable = false;
			return this.#_isThisEnable;
		}

		/**
		 * 指定の深さまでのイベントを取得
		 * @param  {number} [deep=0] - 深さ
		 * @returns {Object[]}
		 */
		getDeepList(deep = 0) {
			const list = [];
			for (let i = 0, li = this.#_deepList.length; i < li; i++) {
				if (this.#_deepList[i] <= deep) {
					list.push(this._es[i]);
				}
			}
			return list;
		}
	};

	// ==================================================

	/**
	 * ゲームホバーイベント
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @param  {Object[]} es - タッチイベントリスト
	 * @param  {number[]} deepHover - ホバー中の深さ
	 * @returns {Andesine.GameHoverEvent}
	 */
	static GameHoverEvent = class extends Andesine.GameTouchEvent {
		constructor(_this, es, deepHover) {
			super(_this, es, deepHover);
		}

		/**
		 * 自身はホバー中かを取得
		 * @returns {boolean}
		 * @readonly
		 */
		get isThisHover() {
			return this._isThisEnable;
		}
	};

	/**
	 * ゲームクリックイベント
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @param  {Object[]} es - タッチイベントリスト
	 * @param  {number[]} deepClick - クリック中の深さ
	 * @returns {Andesine.GameClickEvent}
	 */
	static GameClickEvent = class extends Andesine.GameTouchEvent {
		constructor(_this, es, deepClick) {
			super(_this, es, deepClick);
		}

		/**
		 * 自身はクリック中かを取得
		 * @returns {boolean}
		 * @readonly
		 */
		get isThisClick() {
			return this._isThisEnable;
		}
	};

	// ####################################################################################################

	/**
	 * キャンバスデータ保存用
	 * @memberof Andesine
	 * @returns {Andesine._Canvas}
	 */
	static _Canvas = class {
		#children = {};
		#layerList = [];

		constructor(canvas) {
			this.canvas = canvas;
			jasc.onEx(
				"touchend",
				(es) => {
					const rect = canvas.getBoundingClientRect();
					for (let i = 0, li = es.length; i < li; i++) {
						const e = es[i];
						es[i].pos = new Andesine.Vector2(e.clientX - rect.left, e.clientY - rect.top);
					}
					this._click(es);
				},
				this.canvas
			);
			jasc.onEx(
				"touchmove",
				(es) => {
					const rect = canvas.getBoundingClientRect();
					for (let i = 0, li = es.length; i < li; i++) {
						const e = es[i];
						es[i].pos = new Andesine.Vector2(e.clientX - rect.left, e.clientY - rect.top);
					}
					this._hover(es);
				},
				this.canvas
			);
		}

		_updateLayerList() {
			this.#layerList = Andesine.Util.getSortLayerList(this.#children);
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @override
		 */
		toString(nesting = 1) {
			return Andesine.Util.createToStringMessage(this, nesting, {
				children: this.#children,
				childLength: this.childLength,
			});
		}

		/**
		 * 使用されていない変数域を解放
		 * @returns {number} 解放した数
		 */
		releaseResources() {
			let count = 0;
			for (let i = 0, li = this.#layerList.length; i < li; i++) {
				count += this.#children[this.#layerList[i]].releaseResources();
			}
			return count;
		}

		/**
		 * 全体描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		resetting() {
			for (let i = 0, li = this.#layerList.length; i < li; i++) {
				this.#children[this.#layerList[i]]._systemResetting();
			}
		}

		/**
		 * 全体オブジェクト更新ループ
		 * @returns {undefined}
		 */
		_update() {
			for (let i = 0, li = this.#layerList.length; i < li; i++) {
				this.#children[this.#layerList[i]]._systemUpdate();
			}
		}

		/**
		 * 全体描画ループ
		 * @param {boolean} [isDraw] - 描画するか
		 * @returns {undefined}
		 */
		_draw(isDraw) {
			for (let i = 0, li = this.#layerList.length; i < li; i++) {
				this.#children[this.#layerList[i]]._systemDraw(isDraw);
			}
		}

		_hover(es) {
			for (let i = 0, li = this.#layerList.length; i < li; i++) {
				this.#children[this.#layerList[i]]._systemHover(es);
			}
		}

		_click(es) {
			for (let i = 0, li = this.#layerList.length; i < li; i++) {
				this.#children[this.#layerList[i]]._systemClick(es);
			}
		}

		/**
		 * 描画オブジェクトを追加
		 * @param {InstanceType<typeof Andesine.DrawObject>} child
		 * @param {string} [name=""]
		 * @returns {boolean}
		 */
		appendChild(child, name = "") {
			if (!(child instanceof Andesine.DrawObject)) {
				console.warn("DrawObjectを継承して下さい。");
				return false;
			}
			if (name) {
				this.#children[name] = child;
			} else {
				name = Jasc.setAssociativeAutoName(this.#children, child, "andesine");
			}
			this._updateLayerList();
			return name;
		}

		/**
		 * 描画オブジェクトを削除
		 * @param {string} name - オブジェクト名
		 * @returns {boolean}
		 */
		removeChild(name) {
			const child = this.#children[name];
			if (child) {
				delete this.#children[name];
				this._updateLayerList();
				return true;
			}
			return false;
		}

		/**
		 * 描画オブジェクトを取得
		 * @param {string} name
		 * @returns {InstanceType<typeof Andesine.DrawObject>}
		 */
		getChild(name) {
			return this.#children[name];
		}

		/**
		 * 子オブジェクト名リストを取得
		 * @returns {string[]}
		 */
		getChildNameList() {
			return this.#layerList;
		}

		/**
		 * 子オブジェクト名を取得
		 * @param {InstanceType<typeof Andesine.DrawObject>} obj
		 * @returns {string | null}
		 */
		getChildName(obj) {
			for (let name in this.#children) {
				if (this.#children[name] === obj) {
					return name;
				}
			}
			return null;
		}

		/**
		 * オブジェクト名を取得
		 * @returns {string | null}
		 */
		get name() {
			return; //TODO
		}

		/**
		 * 子オブジェクト数を取得
		 * @returns {number}
		 */
		get childLength() {
			return this.#layerList.length;
		}
	};

	// ####################################################################################################

	/**
	 * ゲームマネージャーを作成
	 * @returns {InstanceType<typeof Andesine.GameManager>}
	 * @static
	 */
	static createGameManager() {
		return new Andesine.GameManager();
	}
	/**
	 * ゲームマネージャー
	 * @memberof Andesine
	 * @returns {Andesine.GameManager}
	 */
	static GameManager = class {
		#canvasDict = {};

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 * @override
		 */
		toString(nesting = 1) {
			return Andesine.Util.createToStringMessage(this, nesting, {
				canvas: this.#canvasDict,
				canvasLength: this.getCanvasList().length,
			});
		}

		/**
		 * 全体描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		resetting() {
			for (const name in this.#canvasDict) {
				this.#canvasDict[name].resetting();
			}
		}
		/**
		 * 全体オブジェクト更新ループ
		 * @returns {undefined}
		 */
		update() {
			for (const name in this.#canvasDict) {
				this.#canvasDict[name]._update();
			}
		}

		/**
		 * 全体描画ループ
		 * @param {boolean} [isDraw] - 描画するか
		 * @returns {undefined}
		 */
		draw(isDraw) {
			for (const name in this.#canvasDict) {
				this.#canvasDict[name]._draw(isDraw);
			}
		}

		/**
		 * 描画オブジェクトを追加
		 * @param {InstanceType<typeof Andesine.DrawObject>} obj - 描画オブジェクト
		 * @param {string} [name=""] - オブジェクト名
		 * @returns {string[]} [キャンバス名, オブジェクト名]
		 */
		addDrawObject(obj, name = "") {
			if (!(obj instanceof Andesine.DrawObject)) {
				console.warn("DrawObjectを継承して下さい。");
				return false;
			}
			const canvasName = this._addCanvas(obj.ctx.canvas);
			name = this.#canvasDict[canvasName].appendChild(obj, name);
			return [canvasName, name];
		}

		/**
		 * 描画オブジェクトを削除
		 * @param {string} canvasName - キャンバス名
		 * @param {string} name - オブジェクト名
		 * @returns {boolean}
		 */
		removeDrawObject(canvasName, name) {
			if (!this.#canvasDict[canvasName]) {
				console.warn(`キャンバス「${canvasName}」は存在しません。`);
				return false;
			}
			return this.#canvasDict[canvasName].removeChild(name);
		}

		/**
		 * 描画オブジェクトを取得
		 * @param {string} canvasName - キャンバス名
		 * @param {string} name - オブジェクト名
		 * @returns {InstanceType<typeof Andesine.DrawObject>} 描画オブジェクト
		 */
		_getDrawObject(canvasName, name) {
			if (!this.#canvasDict[canvasName]) {
				console.warn(`キャンバス「${canvasName}」は存在しません。`);
				return null;
			}
			return this.#canvasDict[canvasName].getChild(name);
		}

		/**
		 * 描画オブジェクトを取得(階層指定)
		 * @param {string[]} nameList - オブジェクト名
		 * @returns {InstanceType<typeof Andesine.DrawObject> | null}
		 */
		getDrawObject(...nameList) {
			if (Array.isArray(nameList[0])) {
				nameList = nameList[0];
			}
			const len = nameList.length;
			if (len === 1) {
				return this.getCanvas(nameList[0]);
			}
			let p = this._getDrawObject(nameList[0], nameList[1]);
			if (len === 2) {
				return p;
			}
			for (let i = 2; i < len; i++) {
				p = p.getChild(nameList[i]);
				if (!p) {
					return null;
				}
			}
			return p;
		}

		/**
		 * 描画オブジェクトを検索
		 * @param {string} name - オブジェクト名
		 * @param {boolean} [multi=false] - 複数検索
		 * @returns {Array.<string, InstanceType<typeof Andesine.DrawObject>> | Array.<Array.<string, InstanceType<typeof Andesine.DrawObject>>>}
		 */
		searchDrawObject(name, multi = false) {
			const list = [];
			for (let key in this.#canvasDict) {
				const obj = this.#canvasDict[key].getChild(name);
				if (obj) {
					if (multi) {
						list.push([key, obj]);
					} else {
						return [key, obj];
					}
				}
			}
			if (multi) {
				return list;
			}
			return null;
		}

		/**
		 * キャンバスを追加
		 * @param {HTMLCanvasElement} canvas
		 * @returns {string}
		 */
		_addCanvas(canvas) {
			let name = jasc.game.getCanvasName(canvas);
			if (this.#canvasDict[name]) {
				return name;
			}
			for (let key in this.#canvasDict) {
				if (this.#canvasDict[key] === canvas) {
					return key;
				}
			}
			const obj = new Andesine._Canvas(canvas);
			if (name) {
				this.#canvasDict[name] = obj;
			} else {
				name = Jasc.setAssociativeAutoName(this.#canvasDict, obj, "andesine");
			}
			return name;
		}

		/**
		 * キャンバスを取得
		 * @param {string | HTMLCanvasElement | InstanceType<typeof Andesine._Canvas>} name
		 * @returns {string | null}
		 */
		getCanvas(name) {
			if (typeof name === "string") {
				return this.#canvasDict[name];
			}
			if (name instanceof Andesine._Canvas) {
				for (let key in this.#canvasDict) {
					if (this.#canvasDict[key] === name) {
						return key;
					}
				}
				return null;
			}
			if (name instanceof HTMLCanvasElement) {
				for (let key in this.#canvasDict) {
					if (this.#canvasDict[key].canvas === name) {
						return key;
					}
				}
				return null;
			}
			return null;
		}

		/**
		 * キャンバス一覧
		 * @returns {string[]}
		 */
		getCanvasList() {
			return Object.keys(this.#canvasDict);
		}
	};

	// ####################################################################################################

	/**
	 * ユーティリティ
	 * @memberof Andesine
	 * @returns {Andesine.Util}
	 */
	static Util = class {
		// NoSleep使用変数
		static _NO_SLEEP_JS_URL = "https://cdn.jsdelivr.net/gh/richtr/NoSleep.js/dist/NoSleep.min.js";
		static _noSleep = null;
		static _noSleepLoaded = false;
		static _noSleepEnabled = false;

		/**
		 * 端末をスリープ状態にさせない
		 *
		 * 注意: 初回起動はユーザーの画面1クリックが必要です。
		 * @param {boolean} [flag=true] - スリープ状態にするか
		 * @returns {Promise<boolean>} 成功したか
		 */
		static setNoSleep(flag = true) {
			return new Promise((resolve) => {
				const _this = this;
				if (this._noSleepLoaded) {
					if (!this._noSleep) {
						console.error("NoSleep.jsが読み込まれていません");
						resolve(false);
						return;
					}
					if (flag) {
						if (!this._noSleepEnabled) {
							this._noSleep.enable().then(() => {
								_this._noSleepEnabled = true;
								resolve(true);
							});
							return;
						}
					} else {
						if (this._noSleepEnabled) {
							this._noSleepEnabled = false;
							this._noSleep.disable();
							resolve(true);
							return;
						}
					}
					resolve(false);
					return;
				} else if (!flag) {
					resolve(false);
					return;
				}
				this._noSleepLoaded = true;
				jasc.loadFile(this._NO_SLEEP_JS_URL, {
					defer: true,
				}).then(() => {
					_this._noSleep = new NoSleep();
					document.addEventListener(
						"click",
						function enableNoSleep() {
							document.removeEventListener("click", enableNoSleep, false);
							_this._noSleep.enable().then(() => {
								_this._noSleepEnabled = true;
								resolve(true);
							});
						},
						false
					);
				});
			});
		}

		/**
		 * classのtoStringの記述を統一する
		 * @param {any} obj - 対象
		 * @param {number} nesting - 階層
		 * @param {...any} args - 引数
		 */
		static createToStringMessage(obj, nesting, ...args) {
			const argStr = [];
			const argLen = args.length;
			if (typeof nesting !== "number") {
				nesting = 1;
			} else if (nesting < 0) {
				nesting = 0;
			}
			let type = "Array";
			if (argLen == 1) {
				// 引数が1つ
				const arg = args[0];
				if (Jasc.isAssociative(arg)) {
					// 引数が連想配列の場合は別処理
					for (const key in arg) {
						let value = arg[key];
						if (typeof value == "string") {
							value = `"${value}"`;
						} else {
							value = toString(value, nesting);
						}
						argStr.push(`${key}: ${value}`);
					}
					type = "Dict";
				} else {
					argStr.push(toString(arg, nesting));
				}
			} else {
				// 引数が複数
				for (let i = 0; i < argLen; i++) {
					argStr.push(toString(args[i], nesting));
				}
			}
			//const constructorName = this.getParentClassNameList(obj).join(".");
			const constructorName = obj.constructor.name;
			switch (type) {
				case "Array":
					return `<${constructorName} (${argStr.join(", ")})>`;
				case "Dict":
					return `<${constructorName} {${argStr.join(", ")}}>`;
			}
			return;
			function toString(value, nesting) {
				if (value == null) {
					return value;
				}
				if (Jasc.isAssociative(value)) {
					if (nesting <= 0) {
						return "[...]";
					}
					const list = [];
					for (const key in value) {
						list.push(`${key}: ${toString(value[key], nesting - 1)}`);
					}
					return `{${list.join(", ")}}`;
				}
				if (Array.isArray(value)) {
					if (nesting <= 1) {
						return "[...]";
					}
					const list = [];
					for (let i = 0, li = value.length; i < li; i++) {
						list.push(toString(value[i], nesting - 1));
					}
					return `[${list.join(", ")}]`;
				}
				if (value.toString) {
					if (Jasc.isNativeCode(value.toString)) {
						return value.toString();
					}
					if (nesting <= 0) {
						return "[...]";
					}
					return value.toString(nesting - 1);
				}
				return value;
			}
		}

		/**
		 * レイヤーでソートする
		 * @param {object} dict - ソート対象
		 * @returns {string[]} - ソート後のキー
		 */
		static getSortLayerList(dict) {
			const keys = Object.keys(dict);
			keys.sort((a, b) => {
				return dict[a].layer - dict[b].layer;
			});
			return keys;
		}
	};

	// ####################################################################################################

	/**
	 * 数値化(jasc引数省略)
	 */
	static _toNumber(n) {
		return Jasc.toNumber(n, true);
	}

	/**
	 * 座標簡易変換
	 */
	static _getPosNumber(v) {
		const tmp = Andesine.Vector3.convert(v);
		if (tmp) {
			return tmp;
		}
		return new Andesine.Vector3(v, v, v);
	}
}

if (typeof Jasc !== "function") {
	console.error("[andesine]前提ライブラリ「Jasc」が存在しません。");
} else if (typeof jasc !== "object") {
	console.error("[andesine]前提ライブラリ「jasc」が存在しません。");
} else {
	let co = Jasc.customOperator;
	// Vectorシリーズ 旧演算子オーバーロード(無駄)
	co(Andesine.Vector2, "+")((a) => (b) => a.constructor.add(a, b));
	co(Andesine.Vector2, "+=")((a) => (b) => a.add(b));
	co(Andesine.Vector2, "-")((a) => (b) => a.constructor.sub(a, b));
	co(Andesine.Vector2, "-=")((a) => (b) => a.sub(b));
	co(Andesine.Vector2, "*")((a) => (b) => a.constructor.mul(a, b));
	co(Andesine.Vector2, "*=")((a) => (b) => a.mul(b));
	co(Andesine.Vector2, "/")((a) => (b) => a.constructor.div(a, b));
	co(Andesine.Vector2, "/=")((a) => (b) => a.div(b));
	co(Andesine.Vector2, "=")((a) => (b) => a.set(b));
}
