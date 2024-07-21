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
		 * @returns {string}
		 * @overrides
		 */
		toString() {
			return Andesine.Util.createToStringMessage(this, {
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

	static Vec2(x, y) {
		return new Andesine.Vector2(x, y);
	}

	// ####################################################################################################

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
		 * @returns {string}
		 * @overrides
		 */
		toString() {
			return Andesine.Util.createToStringMessage(this, {
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

	static Vec3(x, y) {
		return new Andesine.Vector3(x, y);
	}

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
		 * @returns {string}
		 */
		toString() {
			return Andesine.Util.createToStringMessage(this, {
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
	 * 描画オブジェクト
	 * @memberof Andesine
	 * @param {CanvasRenderingContext2D | String} [ctx]
	 * @returns {Andesine.DrawObject}
	 */
	static DrawObject = class {
		#resetting;
		#resettingType = null;

		isDestroy = false;
		isHidden = false;
		_ctx = null;

		_parent = null;
		_children = {};

		constructor(ctx = null) {
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
		}

		get ctx() {
			if (this._parent) {
				return this._parent.ctx;
			}
			return this._ctx;
		}

		/**
		 * 文字列で返却
		 * @returns {string}
		 */
		toString() {
			return Andesine.Util.createToStringMessage(this, {
				parent: this._parent,
				childLength: Object.keys(this._children).length,
			});
		}

		/**
		 * 全体描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		_systemResetting() {
			this.resetting();
			for (const key in this._children) {
				this._children[key]._systemResetting();
			}
		}

		/**
		 * 描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		resetting() {
			if (this.#resettingType === null) {
				return;
			}
			const size = Andesine.getFullSize(this, this._parent);
			switch (this.#resettingType) {
				case "function":
					this.#resetting(this, this._parent, size);
					break;
				case "object":
					let ret = this.#resetting.next(this, this._parent, size);
					if (ret.done) {
						this.#resettingType = null;
					}
					break;
			}
		}

		/**
		 * 描画オブジェクトのリセット設定
		 * @param {function(InstanceType<typeof Andesine.DrawObject>, InstanceType<typeof Andesine.DrawObject>, InstanceType<typeof Andesine.Vector2>):undefined} fn
		 * @returns {this}
		 */
		setResetting(fn) {
			const type = typeof fn;
			if (type === "function" || type === "object") {
				this.#resetting = fn;
				this.#resettingType = type;
				this.resetting();
			} else {
				this.#resettingType = null;
			}
			return this;
		}

		/**
		 * 全体オブジェクト更新ループ
		 * @returns {undefined}
		 */
		_systemUpdate() {
			this.update();
			for (const name in this._children) {
				const child = this._children[name];
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
			this.draw(isDraw);
			for (const name in this._children) {
				this._children[name]._systemDraw(isDraw);
			}
		}

		/**
		 * 描画ループ
		 * @param {boolean} [isDraw] - 描画するか
		 * @returns {undefined}
		 */
		draw(isDraw) {}

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
			// 親設定
			child._setParent(this);
			if (name) {
				this._children[name] = child;
			} else {
				name = Jasc.setAssociativeAutoName(this._children, child, "andesine");
			}
			return name;
		}

		/**
		 * 子オブジェクトを分離
		 * @param {string} name - オブジェクト名
		 * @returns {boolean}
		 */
		removeChild(name) {
			const child = this._children[name];
			if (child) {
				child._setParent(null);
				delete this._children[name];
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
			return this._children[name];
		}

		getChildNameList() {
			return Object.keys(this._children);
		}

		/**
		 * 親オブジェクト追加
		 * @param {InstanceType<typeof Andesine.DrawObject>} parent
		 * @returns {undefined}
		 */
		_setParent(parent) {
			this._parent = parent;
		}

		addEventListener(eventType, callback) {
			// 何もしない
		}
	};

	// ####################################################################################################

	/**
	 * 矩形(描画オブジェクト)
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @returns {Andesine.Box}
	 */
	static Box = class extends Andesine.DrawObject {
		_animationObj;

		constructor({ ctx, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, bg = "", radius = 0, boxAlign = "left", boxBaseLine = "top" } = {}) {
			super(ctx);
			this.rect = new Andesine.Rectangle(position, size);
			this.bg = bg;
			this.radius = radius;
			this.boxAlign = boxAlign;
			this.boxBaseLine = boxBaseLine;
		}

		/**
		 * 文字列で返却
		 * @returns {string}
		 */
		toString() {
			const pos = this.relative();
			return Andesine.Util.createToStringMessage(this, {
				rect: this.rect,
				absPos: pos,
				childLength: Object.keys(this._children).length,
			});
		}

		update() {
			if (this._animationObj) {
				this._animationObj.update();
			}
		}

		/**
		 * 描画
		 * @param {boolean} [isDraw=true] - 描画するか
		 * @returns {undefined}
		 * @override
		 */
		draw(isDraw = true) {
			const ctx = this.ctx;

			const setting = {};
			if (this.bg) {
				setting.fillStyle = this.bg;
			} else {
				setting.fillStyle = "transparent";
			}
			jasc.draw.ctxSetting(ctx, setting);
			const pos = this.relative();
			let rad = this.radius;
			if (rad === "max") {
				rad = Math.min(this.rect.width, this.rect.height) / 2;
			}
			if (rad > 0) {
				Andesine.createRoundRectPath(ctx, ...pos.array, this.rect.width, this.rect.height, rad);
				ctx.fill();
			} else {
				ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);
			}
		}

		/**
		 * 相対的な座標を取得
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		relative() {
			let pos;
			if (this._parent) {
				const v1 = this._parent.relative();
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
		 * 矩形の当たり判定
		 * @param {InstanceType<typeof Andesine.Vector2> | InstanceType<typeof Andesine.Rectangle>} other
		 * @returns {boolean}
		 */
		isInside(other, isFull = false) {
			let obj = null;
			if (other instanceof Andesine.Box) {
				obj = other.rect;
			}
			if (other instanceof Andesine.Vector2 || other instanceof Andesine.Rectangle) {
				obj = other;
			} else {
				const pos = Andesine.Vector2.convert(other);
				if (!pos) {
					console.warn("非対応の型");
					return false;
				}
				obj = pos;
			}
			return this.rect.isInside(obj, isFull);
		}

		/**
		 * ホバー時処理
		 */
		hover(isHover) {
			// 何もしない
		}

		/**
		 * クリック時処理
		 */
		click(isClick) {
			// 何もしない
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
	 */
	static _fullResize(_this, _parent, size) {
		const rect = _this.rect;
		rect.x = rect.y = 0;
		rect.width = size.x;
		rect.height = size.y;
	}

	// ####################################################################################################

	/**
	 * 描画フレーム
	 * @memberof Andesine
	 * @extends {Andesine.Box}
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.boxAlign="left"] - 描画起点位置
	 * @param {string} [opt.boxBaseLine="top"] - 描画起点位置
	 * @returns {Andesine.Frame}
	 */
	static Frame = class extends Andesine.Box {
		constructor({ ctx, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, bg = "", radius = 0, boxAlign = "left", boxBaseLine = "top" } = {}) {
			super({ ctx, position, size, bg, radius, boxAlign, boxBaseLine });
		}
	};

	/**
	 * フレームを作成する
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {Andesine.Vector2 | "full"} [opt.size="full"] - サイズ
	 * @returns {InstanceType<typeof Andesine.Frame>}
	 * @static
	 */
	static createFrame({ ctx, size = "full" } = {}) {
		let _size = size;
		if (size === "full") {
			const ctx = jasc.game.getCurrentCtx();
			_size = new Andesine.Vector2(ctx.canvas.width, ctx.canvas.height);
		}
		const frame = new Andesine.Frame({ ctx, size: _size });
		if (size === "full") {
			frame.setResetting(Andesine._fullResize);
		}
		return frame;
	}

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
	 * @memberof Andesine
	 * @extends {Andesine.Box}
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.text=""] - テキスト
	 * @param {string} [opt.fg="#000"] - 文字色
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {string} [opt.align="left"] - テキストの配置
	 * @returns {Andesine.TextBox}
	 */
	static TextBox = class extends Andesine.Box {
		constructor({ ctx, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, text = "", fg = "#000", bg = "", radius = 0, align = "left" }) {
			super({ ctx, position, size, bg, radius });
			this.text = text;
			this.fg = fg;
			this.align = align;
		}

		/**
		 * 文字列で返却
		 * @returns {string}
		 */
		toString() {
			const pos = this.relative();
			return Andesine.Util.createToStringMessage(this, {
				rect: this.rect,
				absPos: pos,
				text: this.text,
				childLength: Object.keys(this._children).length,
			});
		}

		draw(isDraw = true) {
			super.draw(isDraw);
			const ctx = this.ctx;
			const pos = this.relative();
			jasc.draw.ctxSetting(ctx, {
				fillStyle: this.fg,
			});
			Andesine.fixedFillText(ctx, this.text, pos, this.rect.width, this.align);
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
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
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
	 * イベントを管理するクラス
	 * - 継承推奨
	 * @memberof Andesine
	 * @returns {Andesine.EventDispatcher}
	 * @abstract
	 */
	static EventDispatcher = class {
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
	};

	// ####################################################################################################

	/**
	 * ゲームイベント
	 * @memberof Andesine
	 * @param {any} target - 対象
	 * @returns {GameEvent}
	 */
	static GameEvent = class {
		constructor(target) {
			this.target = target;
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
		 * @param {...any} args - 引数
		 */
		static createToStringMessage(obj, ...args) {
			const argStr = [];
			const argLen = args.length;
			let type = "Array";
			if (argLen == 1) {
				// 引数が1つ
				const arg = args[0];
				if (Jasc.isAssociative(arg)) {
					// 引数が連想配列の場合は別処理
					for (const key in arg) {
						let value = arg[key];
						if (Jasc.isAssociative(value) || Array.isArray(value)) {
							value = JSON.stringify(value);
						} else if (typeof value == "string") {
							value = `"${value}"`;
						}
						argStr.push(`${key}: ${value}`);
					}
					type = "Dict";
				} else {
					argStr.push(arg);
				}
			} else {
				// 引数が複数
				for (let i = 0; i < argLen; i++) {
					const arg = args[i];
					if (Jasc.isAssociative(arg)) {
						argStr.push(JSON.stringify(arg));
					} else {
						argStr.push(arg);
					}
				}
			}
			switch (type) {
				case "Array":
					return `<${obj.constructor.name} (${argStr.join(", ")})>`;
				case "Dict":
					return `<${obj.constructor.name} {${argStr.join(", ")}}>`;
			}
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
