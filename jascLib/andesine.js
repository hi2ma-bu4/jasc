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
	if (typeof jasc == "undefined") {
		console.warn("[andesine]前提ライブラリ「jasc」が存在しません。");
		return;
	}

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
		if (jasc.customOperator) {
			let co = jasc.customOperator;
			// Vector2 & 3 演算子オーバーロード(無駄)
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
	}

	/**
	 * 2次元座標
	 * @typedef {Vector2} Vector2
	 * @param {number} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @returns {Vector2}
	 */
	class Vector2 {
		constructor(x, y) {
			this.x = x ?? 0;
			if (typeof this.x !== "number") {
				let t = this.constructor.convert(x);
				this.x = t.x;
				this.y = t.y;
				return;
			}
			this.y = y ?? 0;
		}

		/**
		 * 座標設定
		 * @param {number} [x] - x座標
		 * @param {number} [y] - y座標
		 * @returns {this}
		 */
		set(x, y) {
			this.x = x ?? 0;
			if (typeof this.x !== "number") {
				let t = this.constructor.convert(x);
				this.x = t.x;
				this.y = t.y;
				return this;
			}
			this.y = y ?? this.x;
			return this;
		}

		/**
		 * 配列で返却
		 * @returns {[number, number]}
		 * @readonly
		 */
		get array() {
			return [this.x, this.y];
		}
		/**
		 * 連想配列で返却
		 * @returns {{x: number, y: number}}
		 * @readonly
		 */
		get associative() {
			return { x: this.x, y: this.y };
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
			if (this.x < bMin || bMax < this.x) {
				console.warn(`[警告！] x座標は{${bMin}～${bMax}}の範囲に収める必要があります`);
			}
			if (this.y < bMin || bMax < this.y) {
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
			return `Vector2(${this.x}, ${this.y})`;
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
			return new Vector2(this.x, this.y);
		}

		/**
		 * 統合
		 * @param {Vector2 | number[] | Object | bigint} arr - 統合対象
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
				if (arr.length < 2) {
					return null;
				}
				return new Vector2(arr[0], arr[1]);
			}
			// 連想配列
			if (jasc.isAssociative(arr)) {
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
			this.x += v.x ?? v;
			this.y += v.y ?? v;
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
			this.x -= v.x ?? v;
			this.y -= v.y ?? v;
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
			this.x *= v.x ?? v;
			this.y *= v.y ?? v;
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
			this.x /= v.x ?? v;
			this.y /= v.y ?? v;
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
			this.x = Math.pow(this.x, num1);
			this.y = Math.pow(this.y, num2 ?? num1);
			return this;
		}

		/**
		 * 等しい
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {boolean}
		 */
		eq(v) {
			return jasc.compareFloats(this.x, v.x) && jasc.compareFloats(this.y, v.y);
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
			return this.x > v.x && this.y > v.y;
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
			return this.x < v.x && this.y < v.y;
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
			return this.x >= v.x && this.y >= v.y;
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
			return this.x <= v.x && this.y <= v.y;
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
			return this.x * v.x + this.y * v.y;
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
			return this.x * v.y - this.y * v.x;
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
			return new Vector2(Math.abs(this.x), Math.abs(this.y));
		}
		/**
		 * 符号のみ取得
		 * @returns {this}
		 * @readonly
		 */
		get sign() {
			return new Vector2(Math.sign(this.x), Math.sign(this.y));
		}
		/**
		 * 四捨五入
		 * @returns {this}
		 * @readonly
		 */
		get round() {
			return new Vector2(Math.round(this.x), Math.round(this.y));
		}
		/**
		 * 切り上げ
		 * @returns {this}
		 * @readonly
		 */
		get ceil() {
			return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
		}
		/**
		 * 切り下げ
		 * @returns {this}
		 * @readonly
		 */
		get floor() {
			return new Vector2(Math.floor(this.x), Math.floor(this.y));
		}
		/**
		 * 切り捨て
		 * @returns {this}
		 * @readonly
		 */
		get trunc() {
			return new Vector2(Math.trunc(this.x), Math.trunc(this.y));
		}
		/**
		 * 小数部のみ
		 * @returns {this}
		 * @readonly
		 */
		get fract() {
			return new Vector2(this.x - Math.floor(this.x), this.y - Math.floor(this.y));
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
			return Math.sqrt(this.x ** 2 + this.y ** 2);
		}
		/**
		 * ベクトルの正規化
		 * @returns {this}
		 * @readonly
		 */
		get normalize() {
			let l = this.length;
			return new Vector2(this.x / l, this.y / l);
		}

		/**
		 * 範囲内に収める
		 * @param {Vector2 | number} [min=bMin] - 最小
		 * @param {Vector2 | number} [max=bMax] - 最大
		 * @returns {this}
		 */
		clamp(min = bMin, max = bMax) {
			this.x = Math.max(min?.x ?? min, Math.min(max?.x ?? max, this.x));
			this.y = Math.max(min?.y ?? min, Math.min(max?.y ?? max, this.y));
			return this;
		}
		/**
		 * 範囲内に収める
		 * @param {Vector2} v - 対象ベクトル
		 * @param {Vector2} [min=bMin] - 最小
		 * @param {Vector2} [max=bMax] - 最大
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
			this.x = jasc.map(
				// x座標範囲設定
				this.x,
				fromMin?.x ?? fromMin,
				fromMax?.x ?? fromMax,
				toMin?.x ?? toMin,
				toMax?.x ?? toMax
			);
			this.y = jasc.map(
				// y座標範囲設定
				this.y,
				fromMin?.y ?? fromMin,
				fromMax?.y ?? fromMax,
				toMin?.y ?? toMin,
				toMax?.y ?? toMax
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
			return Vector2.sub(v1, v2).len;
		}
		/**
		 * 2点間の角度
		 * @param {Vector2} v - 対象ベクトル
		 * @returns {number}
		 */
		angle(v) {
			return Math.atan2(this.y - v.y, this.x - v.x);
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

		// ==================================================
		// よく使うベクトルの定義
		// ==================================================
		static get zero() {
			return new Vector2(0, 0);
		}
		static get one() {
			return new Vector2(1, 1);
		}
		static get up() {
			return new Vector2(0, 1);
		}
		static get down() {
			return new Vector2(0, -1);
		}
		static get left() {
			return new Vector2(-1, 0);
		}
		static get right() {
			return new Vector2(1, 0);
		}
		static get MAX_VECTOR() {
			return new Vector2(bMax, bMax);
		}
		static get MIN_VECTOR() {
			return new Vector2(bMin, bMin);
		}
	}

	/**
	 * 3次元座標
	 * @extends {Vector2}
	 * @typedef {Vector3} Vector3
	 * @param {number} [x=0] - x座標
	 * @param {number} [y=0] - y座標
	 * @param {number} [z=0] - z座標
	 * @returns {Vector3}
	 */
	class Vector3 extends Vector2 {
		constructor(x, y, z) {
			if (x != undefined && typeof x != "number") {
				super();
				let t = this.constructor.convert(x);
				this.x = t.x;
				this.y = t.y;
				this.z = t.z;
				return;
			}
			super(x, y);
			this.z = z ?? 0;
		}

		/**
		 * 座標設定
		 * @param {number} [x] - x座標
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
				this.z = t.z;
				return this;
			}
			super.set(x, y);
			if (z == undefined) {
				if (x != undefined && y != undefined) {
					z = 0;
				}
			}
			this.z = z ?? this.x;
			return this;
		}

		/**
		 * 配列で返却
		 * @returns {[number, number, number]}
		 * @readonly
		 * @overrides
		 */
		get array() {
			return [this.x, this.y, this.z];
		}
		/**
		 * 連想配列で返却
		 * @returns {{x: number, y: number, z: number}}
		 * @readonly
		 * @overrides
		 */
		get associative() {
			return { x: this.x, y: this.y, z: this.z };
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
			if (this.z < bMin || bMax < this.z) {
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
			return `Vector3(${this.x}, ${this.y}, ${this.z})`;
		}

		/**
		 * 複製
		 * @returns {Vector3}
		 * @overrides
		 */
		clone() {
			return new Vector3(this.x, this.y, this.z);
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
			if (jasc.isAssociative(arr)) {
				return new Vector3(arr.x, arr.y, arr.z);
			}
			return null;
		}

		// ==================================================
		// 演算
		// ==================================================

		/**
		 * 足し算
		 * @param {Vector2} [v=0] - 足し算対象
		 * @returns {this}
		 * @overrides
		 */
		add(v = 0) {
			super.add(v);
			this.z += v.z ?? v;
			return this;
		}
		/**
		 * 引き算
		 * @param {Vector2} [v=0] - 引き算対象
		 * @returns {this}
		 * @overrides
		 */
		sub(v = 0) {
			super.sub(v);
			this.z -= v.z ?? v;
			return this;
		}
		/**
		 * 掛け算
		 * @param {Vector2} [v=1] - 掛け算対象
		 * @returns {this}
		 * @overrides
		 */
		mul(v = 1) {
			super.mul(v);
			this.z *= v.z ?? v;
			return this;
		}
		/**
		 * 除算
		 * @param {Vector2} [v=1] - 除算対象
		 * @returns {this}
		 * @overrides
		 */
		div(v = 1) {
			super.div(v);
			this.z /= v.z ?? v;
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
			this.z = Math.pow(this.z, num3 ?? num1);
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
			return f && jasc.compareFloats(this.z, v.z);
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
			return f && this.z > v.z;
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
			return f && this.z < v.z;
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
			return f && this.z >= v.z;
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
			return f && this.z <= v.z;
		}

		/**
		 * ベクトルの内積
		 * @param {Vector3} v - 対象ベクトル
		 * @returns {number}
		 * @overrides
		 */
		dot(v) {
			return this.x * v.x + this.y * v.y + this.z * v.z;
		}
		/**
		 * ベクトルの外積
		 * @param {Vector3} v - 対象ベクトル
		 * @returns {Vector3}
		 * @overrides
		 */
		cross(v) {
			return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
		}

		/**
		 * 絶対値
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get abs() {
			return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
		}
		/**
		 * 符号のみ取得
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get sign() {
			return new Vector3(Math.sign(this.x), Math.sign(this.y), Math.sign(this.z));
		}
		/**
		 * 四捨五入
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get round() {
			return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
		}
		/**
		 * 切り上げ
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get ceil() {
			return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
		}
		/**
		 * 切り下げ
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get floor() {
			return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
		}
		/**
		 * 切り捨て
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get trunc() {
			return new Vector3(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.z));
		}
		/**
		 * 小数部のみ
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get fract() {
			return new Vector3(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.z - Math.floor(this.z));
		}

		/**
		 * ベクトルの長さ
		 * @returns {number}
		 * @readonly
		 * @overrides
		 */
		get length() {
			return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
		}
		/**
		 * ベクトルの正規化
		 * @returns {Vector3}
		 * @readonly
		 * @overrides
		 */
		get normalize() {
			let l = this.length;
			return new Vector3(this.x / l, this.y / l, this.z / l);
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
			this.z = Math.max(min?.z ?? min, Math.min(max?.z ?? max, this.z));
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
			this.z = jasc.map(
				// z座標範囲設定
				this.z,
				fromMin?.z ?? fromMin,
				fromMax?.z ?? fromMax,
				toMin?.z ?? toMin,
				toMax?.z ?? toMax
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

		// ==================================================
		// よく使うベクトルの定義
		// ==================================================
		static get zero() {
			return new Vector3(0, 0, 0);
		}
		static get one() {
			return new Vector3(1, 1, 1);
		}
		static get up() {
			return new Vector3(0, 1, 0);
		}
		static get down() {
			return new Vector3(0, -1, 0);
		}
		static get left() {
			return new Vector3(-1, 0, 0);
		}
		static get right() {
			return new Vector3(1, 0, 0);
		}
		static get forward() {
			return new Vector3(0, 0, 1);
		}
		static get backward() {
			return new Vector3(0, 0, -1);
		}
		static get MAX_VECTOR() {
			return new Vector3(bMax, bMax, bMax);
		}
		static get MIN_VECTOR() {
			return new Vector3(bMin, bMin, bMin);
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
		constructor(x = 0, y = 0, width = 0, height = 0) {
			if (typeof x === "number") {
				// x y ??
				this.vec = new Vector2(x, y);
				if (typeof width === "number") {
					// w h
					this.size = new Vector2(width, height);
				} else {
					// wh
					this.size = Vector2.convert(width);
				}
			} else {
				// xy ??
				this.vec = Vector2.convert(x);
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
			if (other.x >= this.x + this.width || this.x >= other.x + other.width || other.y >= this.y + this.height || this.y >= other.y + other.height) {
				return false;
			}
			return true;
		}

		// getter/setter
		get x() {
			return this.vec.x;
		}
		set x(x) {
			this.vec.x = x;
		}
		get y() {
			return this.vec.y;
		}
		set y(y) {
			this.vec.y = y;
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
	 * 画像クラス
	 * @param {Image} image - 画像
	 * @param {Rectangle} rectangle - 矩形
	 */
	class Sprite {
		constructor(image, rectangle) {
			this.image = image;
			this.rectangle = rectangle;
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

	/**
	 * ゲームオブジェクト
	 * @extends {EventDispatcher}
	 * @typedef {Actor} Actor
	 * @param {Vector2 | number[]} v - 座標
	 * @param {Rectangle} hitArea - 当たり判定
	 * @param {string[]} [tags=[]] - タグ
	 * @returns {Actor}
	 * @abstract
	 */
	class Actor extends EventDispatcher {
		constructor(v, hitArea, tags = []) {
			super();
			this._vec = Vector2.convert(v);

			this.hitArea = hitArea;
			this._hitAreaOffsetX = hitArea.x;
			this._hitAreaOffsetY = hitArea.y;
			this.tags = tags;
		}

		/**
		 * 更新時処理
		 * @param {GameInfo} gameInfo - ゲーム情報
		 * @param {Input} input - 入力情報
		 * @returns {number | undefined} - 終了コード
		 * @abstract
		 */
		update(gameInfo, input) {}

		/**
		 * 描画処理
		 * @param {Object} ctx - 描画対象
		 * @abstract
		 */
		render(ctx) {}

		/**
		 * タグに含まれるか
		 * @param {string} tagName - タグ
		 * @returns {boolean}
		 */
		hasTag(tagName) {
			return this.tags.includes(tagName);
		}

		/**
		 * 生成時にイベント送信
		 * @param {Actor} actor - 生成したオブジェクト
		 * @returns {undefined}
		 */
		spawnActor(actor) {
			this.dispatchEvent("spawnactor", new GameEvent(actor));
		}

		/**
		 * 破棄時にイベント送信
		 * @returns {undefined}
		 */
		destroy() {
			this.dispatchEvent("destroy", new GameEvent(this));
		}

		get x() {
			return this._vec.x;
		}
		set x(value) {
			this._vec.x = value;
			this.hitArea.x = value + this._hitAreaOffsetX;
		}
		get y() {
			return this._vec.y;
		}
		set y(value) {
			this._vec.y = value;
			this.hitArea.y = value + this._hitAreaOffsetY;
		}
	}

	/**
	 * 画像付きゲームオブジェクト
	 * @extends {Actor}
	 * @typedef {SpriteActor} SpriteActor
	 * @param {Vector2 | number[]} v - 座標
	 * @param {Sprite} sprite - 画像
	 * @param {Rectangle} hitArea - 当たり判定
	 * @param {string[]} [tags=[]] - タグ
	 * @returns {SpriteActor}
	 */
	class SpriteActor extends Actor {
		constructor(v, sprite, hitArea, tags = []) {
			super(v, hitArea, tags);
			this.sprite = sprite;
		}

		/**
		 * 描画処理
		 * @param {Object} ctx - 描画対象
		 * @returns {undefined}
		 * @override
		 */
		render(ctx) {
			const rect = this.sprite.rectangle;
			ctx.drawImage(this.sprite.image, rect.x, rect.y, rect.width, rect.height, this.x, this.y, rect.width, rect.height);
		}

		isOutOfBounds(boundRect) {
			const actorLeft = this.x;
			const actorRight = this.x + this.width;
			const actorTop = this.y;
			const actorBottom = this.y + this.height;

			const horizontal = actorRight < boundRect.x || actorLeft > boundRect.width;
			const vertical = actorBottom < boundRect.y || actorTop > boundRect.height;

			return horizontal || vertical;
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
		 * @param {number | Vector2} x - x座標(x,y座標)
		 * @param {number | Vector2} y - y座標(w,hサイズ)
		 * @param {number} width - 幅
		 * @param {number} height - 高さ
		 * @returns {Rectangle}
		 */
		Rectangle,

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

		/**
		 * ゲームオブジェクト(class)
		 * - 継承利用 推奨
		 * @returns {Actor}
		 */
		Actor,
		/**
		 * 画像付きゲームオブジェクト(class)
		 * - 継承利用 推奨
		 * @returns {SpriteActor}
		 */
		SpriteActor,
	};

	//初期化
	return new andesine();
})();
