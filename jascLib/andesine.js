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

	static _CLOCK_MAX_FRAME = 10 ** 53;

	static _ERROR_COLOR = "#FF00FFD0";

	// ####################################################################################################
	// 計算定数

	/**
	 * 八分円周率(1/8)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static EIGHTH_PI = Math.PI / 8;
	/**
	 * 四分円周率(1/4)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static QUARTER_PI = Math.PI / 4;
	/**
	 * 半円周率(1/2)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static HALF_PI = Math.PI / 2;
	/**
	 * 四分の三円周率(3/4)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static THREE_QUARTERS_PI = Andesine.QUARTER_PI * 3;
	/**
	 * 円周率(1)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static PI = Math.PI;
	/**
	 * 1.5円周率(3/2)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static THREE_HALF_PI = Andesine.HALF_PI * 3;
	/**
	 * 2倍円周率(2)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static TAU = Math.PI * 2;
	/**
	 * 2倍円周率(2)
	 * @memberof Andesine
	 * @type {number}
	 * @static
	 * @readonly
	 */
	static TWO_PI = Andesine.TAU;

	// ####################################################################################################
	// 変更可能定数

	/**
	 * スキップするフレームの最大値
	 * @type {number}
	 * @default 30
	 */
	static MAX_SKIP_FRAME = 5;

	/**
	 * デバッグモード
	 * @memberof Andesine
	 * @type {boolean}
	 * @static
	 */
	static DEBUG = false;

	// ####################################################################################################

	static _debug_save_data;
	static _debug_save_data_setting(ctx, drawSizeScale = 1) {
		Andesine._debug_save_data = [
			// ctxも保存する
			ctx,
			ctx.globalAlpha,
			ctx.strokeStyle,
			ctx.lineWidth,
		];
		ctx.globalAlpha = 0.5;
		ctx.lineWidth = drawSizeScale;
	}
	static _debug_restore_data_setting() {
		const dsd = Andesine._debug_save_data;
		if (!dsd) return;
		const ctx = dsd[0];
		ctx.globalAlpha = dsd[1];
		ctx.strokeStyle = dsd[2];
		ctx.lineWidth = dsd[3];

		Andesine._debug_save_data = null;
	}

	/**
	 * [デバッグ]回転前の色
	 * @memberof Andesine
	 * @type {string}
	 * @static
	 * @readonly
	 */
	static _DEBUG_BEFORE_ROTATION_COLOR = "#f00";
	/**
	 * [デバッグ]回転前の位置設定
	 * @param {CanvasRenderingContext2D} ctx
	 * @static
	 */
	static _debug_before_rotation_setting(ctx, drawSizeScale) {
		Andesine._debug_save_data_setting(ctx, drawSizeScale);
		ctx.strokeStyle = Andesine._DEBUG_BEFORE_ROTATION_COLOR;
	}
	/**
	 * [デバッグ]衝突判定用の色
	 * @memberof Andesine
	 * @type {string}
	 * @static
	 * @readonly
	 */
	static _DEBUG_COLLISION_DETECTION_COLOR = "#0f0";
	/**
	 * [デバッグ]衝突判定用の設定
	 * @param {CanvasRenderingContext2D} ctx
	 * @static
	 */
	static _debug_collision_detection_setting(ctx, drawSizeScale) {
		Andesine._debug_save_data_setting(ctx, drawSizeScale);
		ctx.strokeStyle = Andesine._DEBUG_COLLISION_DETECTION_COLOR;
	}
	/**
	 * [デバッグ]文字表示サイズ用の色
	 * @memberof Andesine
	 * @type {string}
	 * @static
	 * @readonly
	 */
	static _DEBUG_TEXT_SIZE_COLOR = "#0ff";
	/**
	 * [デバッグ]文字表示サイズの設定
	 */
	static _debug_text_size_setting(ctx, drawSizeScale) {
		Andesine._debug_save_data_setting(ctx, drawSizeScale);
		ctx.strokeStyle = Andesine._DEBUG_TEXT_SIZE_COLOR;
	}
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
	static Vector2 = class Vector2 {
		#x;
		#y;

		constructor(x, y) {
			this.#x = x ?? 0;
			if (typeof this.#x !== "number") {
				let t = Vector2.convert(x);
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
				let t = Vector2.convert(x);
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
			let v = Vector2.clamp(this);
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
			if (num instanceof Vector2) {
				return num;
			}
			return Vector2.convert(Andesine.Vector3.unpack(num));
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
			return new Vector2(this.#x, this.#y);
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
				return Vector2.unpack(arr);
			}
			// Andesine.Vector3
			if (arr instanceof Andesine.Vector3) {
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
		 * ベクトルの合計
		 * @param {InstanceType<typeof Andesine.Vector2>[]} vec - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static sum(...vec) {
			const v = new Vector2();
			vec.forEach((e) => v.add(e));
			return v;
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
			return new Vector2(this.#x / l, this.#y / l);
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
			return Vector2.sub(v1, v2).length;
		}
		/**
		 * 2点間の角度
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {number} 角度(ラジアン)
		 */
		angle(v) {
			return Math.atan2(this.#y - v.y, this.#x - v.x);
		}
		/**
		 * 2点間の角度
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {number} 角度(ラジアン)
		 * @static
		 */
		static angle(v1, v2) {
			return v1.angle(v2);
		}

		/**
		 * 距離と角度から座標を求める
		 * @param {number} distance - 距離
		 * @param {number} angle - 角度
		 * @returns {InstanceType<typeof Andesine.Vector2>} 座標
		 */
		angle2coord(distance, angle) {
			return new Vector2(this.#x + distance * Math.cos(angle), this.#y + distance * Math.sin(angle));
		}

		/**
		 * 距離と角度から座標を求める
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @param {number} distance - 距離
		 * @param {number} angle - 角度
		 * @returns {InstanceType<typeof Andesine.Vector2>} 座標
		 * @static
		 */
		static angle2coord(v, distance, angle) {
			return v.angle2coord(distance, angle);
		}

		/**
		 * 回転行列
		 * @param {number} angle - 角度
		 * @returns {InstanceType<typeof Andesine.Vector2>} 座標
		 */
		matrix(angle) {
			return new Vector2(this.#x * Math.cos(angle) - this.#y * Math.sin(angle), this.#x * Math.sin(angle) + this.#y * Math.cos(angle));
		}

		/**
		 * 回転行列
		 * @param {InstanceType<typeof Andesine.Vector2>} v - ベクトル
		 * @param {number} angle - 角度
		 * @returns {InstanceType<typeof Andesine.Vector2>} 座標
		 * @static
		 */
		static matrix(v, angle) {
			return v.matrix(angle);
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
			return Vector2.cross(v1, v2) === 0;
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
			return Vector2.dot(v1, v2) === 0;
		}

		/**
		 * 2点のそれぞれの最大値
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static max(v1, v2) {
			return new Vector2(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
		}
		/**
		 * 2点のそれぞれの最大値
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @deprecated
		 */
		max(v) {
			return Vector2.max(this, v);
		}

		/**
		 * 2点のそれぞれの最小値
		 * @param {InstanceType<typeof Andesine.Vector2>} v1 - 1つ目のベクトル
		 * @param {InstanceType<typeof Andesine.Vector2>} v2 - 2つ目のベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static min(v1, v2) {
			return new Vector2(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
		}
		/**
		 * 2点のそれぞれの最小値
		 * @param {InstanceType<typeof Andesine.Vector2>} v - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector2>}
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
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @static
		 */
		static leap(start, end, t) {
			const s = Vector2.convert(start);
			const e = Vector2.convert(end);
			return new Vector2(s.x + (e.x - s.x) * t, s.y + (e.y - s.y) * t);
		}
		/**
		 * 2点間の線形補間の座標に移動
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		leap(start, end, t) {
			this.set(Vector2.leap(start, end, t));
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
			return Vector2.leap(start, end, -(Math.cos(Andesine.PI * t) - 1) / 2);
		}
		/**
		 * 2点間の滑らかな線形補間の座標に移動
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector2>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {this}
		 */
		smoothDamp(start, end, t) {
			this.set(Vector2.smoothDamp(start, end, t));
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
				return Vector2.leap(points[0], points[1], t);
			}

			// 一回統一
			const _points = [];
			for (let i = 0; i < n; i++) {
				_points.push(Vector2.convert(points[i]));
			}

			// 3以下の場合は、最初と最後のポイントを複製
			const extendedPoints = [_points[0], ..._points, _points[n - 1]];

			const segmentCount = n - 1;
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
		 * @param {InstanceType<typeof Andesine.Vector2>[]} points - 通過点の配列
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		spline(points, t) {
			this.set(Vector2.spline(points, t));
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

			const Vec2 = Vector2.unpack;
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
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get zero() {
			return new Vector2(0, 0);
		}
		/**
		 * 1ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get one() {
			return new Vector2(1, 1);
		}

		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get up() {
			return new Vector2(0, 1);
		}
		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get down() {
			return new Vector2(0, -1);
		}
		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get left() {
			return new Vector2(-1, 0);
		}
		/**
		 * 単位ベクトル
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get right() {
			return new Vector2(1, 0);
		}

		/**
		 * 許容最大値
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get MAX_VECTOR() {
			return new Vector2(Andesine._B_MAX, Andesine._B_MAX);
		}
		/**
		 * 許容最小値
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 */
		static get MIN_VECTOR() {
			return new Vector2(Andesine._B_MIN, Andesine._B_MIN);
		}

		/**
		 * 無限大
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 * @deprecated
		 */
		static get positiveInfinity() {
			return new Vector2(Infinity, Infinity);
		}
		/**
		 * 無限小
		 * @type {Andesine.Vector2}
		 * @readonly
		 * @static
		 * @deprecated
		 */
		static get negativeInfinity() {
			return new Vector2(-Infinity, -Infinity);
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
	static Vector3 = class Vector3 extends Andesine.Vector2 {
		#z;

		constructor(x, y, z) {
			if (x != undefined && typeof x != "number") {
				super();
				let t = Vector3.convert(x);
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
				let t = Vector3.convert(x);
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
			let v = Vector3.clamp(this);
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
					return new Vector3();
				}
			}
			let tmpX, tmpY, tmpZ;
			const _B_CARRY = Andesine._B_CARRY;
			const _B_NEXT_CARRY_BASE = Andesine._B_NEXT_CARRY_BASE;
			/*
			* Xがマイナスか
				((num & _B_CARRY) !== 0n)
			* Yがマイナスか
				((num & (_B_CARRY * _B_NEXT_CARRY_BASE)) !== 0n)
				//(num < 0)
			* Zがマイナスか
				((num & (_B_CARRY * _B_NEXT_CARRY_BASE * _B_NEXT_CARRY_BASE)) !== 0n)
			*/
			switch (((num & _B_CARRY) !== 0n) + ((num & (_B_CARRY * _B_NEXT_CARRY_BASE)) !== 0n) * 2 + ((num & (_B_CARRY * _B_NEXT_CARRY_BASE * _B_NEXT_CARRY_BASE)) !== 0n) * 4) {
				case 0:
					// x+ y+ z+ (0~,0~,0~)
					tmpX = num % _B_CARRY;
					tmpY = ((num - tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY;
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
				case 1:
					// x- y+ z+ (~-1,1~,0~)
					tmpX = (num % _B_CARRY) - _B_CARRY;
					tmpY = (((num + tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY) + 1n;
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
				case 2:
					// x+ y- z+ (0~,~-1,1~)
					tmpX = (((num + _B_CARRY) % _B_CARRY) + _B_CARRY) % _B_CARRY;
					tmpY = BigInt(Math.round(Number(((((num - tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY) - _B_CARRY) * 10n) / 10));
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
				case 3:
					// x- y- z+ (~-1,~0,1~)
					tmpX = (num % _B_CARRY) - _B_CARRY;
					tmpY = ((((num - tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY) - _B_CARRY) % _B_CARRY;
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
				case 4:
					// x+ y+ z- (0~,0~,~-1)
					tmpX = (((num + _B_CARRY) % _B_CARRY) + _B_CARRY) % _B_CARRY;
					tmpY = ((((num - tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY) + _B_CARRY) % _B_CARRY;
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
				case 5:
					// x- y+ z- (~-1,1~,~-1)
					tmpX = ((((num + _B_CARRY) % _B_CARRY) + _B_CARRY) % _B_CARRY) - _B_CARRY;
					tmpY = (((num + tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY) + _B_CARRY;
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
				case 6:
					// x+ y- z- (0~,~-1,~-1)
					tmpX = (((num + _B_CARRY) % _B_CARRY) + _B_CARRY) % _B_CARRY;
					tmpY = BigInt(Math.round(Number((((num - tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY) * 10n) / 10));
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
				case 7:
					// x- y- z- (~-1,~0,~-1)
					tmpX = num % _B_CARRY;
					tmpY = ((num - tmpX) / _B_NEXT_CARRY_BASE) % _B_CARRY;
					tmpZ = (num - tmpX - tmpY * _B_NEXT_CARRY_BASE) / _B_NEXT_CARRY_BASE / _B_NEXT_CARRY_BASE;
					break;
			}
			return new Vector3(Number(tmpX) / Andesine._B_FRACT, Number(tmpY) / Andesine._B_FRACT, Number(tmpZ) / Andesine._B_FRACT);
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
			return new Vector3(this.x, this.y, this.#z);
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
				return Vector3.unpack(arr);
			}
			// 自身
			if (arr instanceof Vector3) {
				return arr.clone();
			}
			// Andesine.Vector2
			if (arr instanceof Andesine.Vector2) {
				return new Vector3(arr.x, arr.y, 0);
			}
			// 配列
			if (Array.isArray(arr)) {
				if (arr.length < 3) {
					return this.convert(Andesine.Vector2.convert(arr));
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
		 * ベクトルの合計
		 * @param {InstanceType<typeof Andesine.Vector2>[]} vec - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @static
		 * @override
		 */
		static sum(...vec) {
			const v = new Vector3();
			vec.forEach((e) => v.add(e));
			return v;
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
			return new Vector3(this.y * v.z - this.#z * v.y, this.#z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
		}

		/**
		 * 絶対値
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get abs() {
			return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.#z));
		}
		/**
		 * 符号のみ取得
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get sign() {
			return new Vector3(Math.sign(this.x), Math.sign(this.y), Math.sign(this.#z));
		}
		/**
		 * 四捨五入
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get round() {
			return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.#z));
		}
		/**
		 * 切り上げ
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get ceil() {
			return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.#z));
		}
		/**
		 * 切り下げ
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get floor() {
			return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.#z));
		}
		/**
		 * 切り捨て
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get trunc() {
			return new Vector3(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.#z));
		}
		/**
		 * 小数部のみ
		 * @returns {Andesine.Vector3}
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
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @overrides
		 */
		get normalize() {
			let l = this.length;
			return new Vector3(this.x / l, this.y / l, this.#z / l);
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
			return Vector3.sub(v1, v2).length;
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
			return new Vector3(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y), Math.max(v1.z, v2.z));
		}
		/**
		 * 2つのベクトルの最大値
		 * @param {InstanceType<typeof Andesine.Vector3>} v - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector3>}
		 * @deprecated
		 * @override
		 */
		max(v) {
			return Vector3.max(this, v);
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
			return new Vector3(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y), Math.min(v1.z, v2.z));
		}
		/**
		 * 2つのベクトルの最小値
		 * @param {InstanceType<typeof Andesine.Vector3>} v1 - 対象ベクトル
		 * @returns {InstanceType<typeof Andesine.Vector3>}
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
		 * @param {InstanceType<typeof Andesine.Vector3> | number[]} start - 開始地点
		 * @param {InstanceType<typeof Andesine.Vector3> | number[]} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {InstanceType<typeof Andesine.Vector3>}
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
		 * @param {InstanceType<typeof Andesine.Vector3> | bigint | number[]} start - 開始地点
		 * @param {InstanceType<typeof Andesine.Vector3> | bigint | number[]} end - 終了地点
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
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} end - 終了地点
		 * @param {number} t - 線形補間率(0~1)
		 * @returns {Andesine.Vector3}
		 * @static
		 */
		static smoothDamp(start, end, t) {
			return Vector3.leap(start, end, -(eased = (Math.cos(Andesine.PI * t) - 1) / 2));
		}
		/**
		 * 2点間の滑らかな線形補間の座標に移動
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} start - 開始地点
		 * @param {bigint | number[] | InstanceType<typeof Andesine.Vector3>} end - 終了地点
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
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get zero() {
			return new Vector3(0, 0, 0);
		}
		/**
		 * 1ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get one() {
			return new Vector3(1, 1, 1);
		}

		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get up() {
			return new Vector3(0, 1, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get down() {
			return new Vector3(0, -1, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get left() {
			return new Vector3(-1, 0, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get right() {
			return new Vector3(1, 0, 0);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 */
		static get forward() {
			return new Vector3(0, 0, 1);
		}
		/**
		 * 単位ベクトル
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 */
		static get back() {
			return new Vector3(0, 0, -1);
		}

		/**
		 * 許容最大値
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get MAX_VECTOR() {
			return new Vector3(Andesine._B_MAX, Andesine._B_MAX, Andesine._B_MAX);
		}
		/**
		 * 許容最小値
		 * @returns {Andesine.Vector3}
		 * @readonly
		 * @static
		 * @override
		 */
		static get MIN_VECTOR() {
			return new Vector3(Andesine._B_MIN, Andesine._B_MIN, Andesine._B_MIN);
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
			return new Vector3(Infinity, Infinity, Infinity);
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
			return new Vector3(-Infinity, -Infinity, -Infinity);
		}
	};

	// ####################################################################################################

	/**
	 * 矩形
	 * (四角い範囲)
	 * @memberof Andesine
	 * @param {Andesine.Vector2 | number[]} xy - x,y座標
	 * @param {Andesine.Vector2 | number[]} wh - 幅,高さ
	 * @returns {Andesine.Rectangle}
	 */
	static Rectangle = class Rectangle {
		#_size;

		constructor(xy = Andesine.Vector2.zero, wh = Andesine.Vector2.zero) {
			this.position = Andesine.Vector2.convert(xy);
			this.size = Andesine.Vector2.convert(wh);
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
		 * サイズ
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @readonly
		 */
		get size() {
			this.#_normalizeSize();
			return this.#_size;
		}

		/**
		 * サイズ
		 * @param {InstanceType<typeof Andesine.Vector2> | number[]} size
		 */
		set size(size) {
			this.#_size = Andesine.Vector2.convert(size);
			this.#_normalizeSize();
		}

		/**
		 * x座標
		 * @returns {number}
		 * @readonly
		 */
		get x() {
			return this.position.x;
		}
		/**
		 * x座標
		 * @param {number} x
		 */
		set x(x) {
			this.position.x = x;
		}
		/**
		 * y座標
		 * @returns {number}
		 * @readonly
		 */
		get y() {
			return this.position.y;
		}
		/**
		 * y座標
		 * @param {number} y
		 */
		set y(y) {
			this.position.y = y;
		}
		/**
		 * 幅
		 * @returns {number}
		 * @readonly
		 */
		get width() {
			return this.#_size.x;
		}
		/**
		 * 幅
		 * @param {number} w
		 */
		set width(w) {
			this.#_size.x = w;
			this.#_normalizeSize();
		}
		/**
		 * 高さ
		 * @returns {number}
		 * @readonly
		 */
		get height() {
			return this.#_size.y;
		}
		/**
		 * 高さ
		 * @param {number} h
		 */
		set height(h) {
			this.#_size.y = h;
			this.#_normalizeSize();
		}

		/**
		 * 中心
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 * @readonly
		 */
		get center() {
			return Andesine.Vector2.div(this.size, 2).add(this.position);
		}

		/**
		 * 対角線の長さ
		 * @returns {number}
		 * @readonly
		 */
		get diagonal() {
			const w = this.width;
			const h = this.height;
			return Math.sqrt(w * w + h * h);
		}

		/**
		 * 90度回転させた矩形を生成
		 * @returns {InstanceType<typeof Andesine.Rectangle>}
		 */
		rotate90() {
			const c = this.center;
			const w = this.width,
				h = this.height;
			return new Rectangle([c.x - h / 2, c.y - w / 2], [h, w]);
		}

		/**
		 * 矩形が収まる最小サイズの円を生成
		 * @returns {InstanceType<typeof Andesine.Circle>}
		 */
		toCircle() {
			return new Andesine.Circle({ xy: this.center, radius: this.diagonal / 2 });
		}

		/**
		 * サイズの正規化
		 * @returns {undefined}
		 * @private
		 */
		#_normalizeSize() {
			if (this.#_size.x < 0) {
				this.#_size.x = 0;
			}
			if (this.#_size.y < 0) {
				this.#_size.y = 0;
			}
		}

		/**
		 * 複製
		 * @returns {InstanceType<typeof Andesine.Rectangle>}
		 */
		clone() {
			return new Rectangle(this.position.clone(), this.size.clone());
		}

		/**
		 * 矩形同士の比較
		 * @param {InstanceType<typeof Andesine.Rectangle>} other
		 * @returns {boolean}
		 */
		eq(other) {
			if (!other) {
				return false;
			}
			return this.position.eq(other.position) && this.size.eq(other.size);
		}

		/**
		 * 矩形の当たり判定
		 * @param {InstanceType<typeof Andesine.Vector2> | InstanceType<typeof Andesine.Rectangle> | InstanceType<typeof Andesine.Circle>} other
		 * @param {boolean} [isFull=false] - 矩形に完全に含まれるか
		 * @returns {boolean}
		 */
		isInside(other, isFull = false) {
			if (other instanceof Andesine.Vector2) {
				// 矩形と点の当たり判定
				return this.x <= other.x && other.x <= this.x + this.width && this.y <= other.y && other.y <= this.y + this.height;
			} else if (other instanceof Rectangle) {
				// 矩形と矩形の当たり判定
				if (isFull) {
					//return this.x <= other.x && other.x <= this.x + this.width && this.y <= other.y && other.y <= this.y + this.height;
					return this.x <= other.x && other.x + other.width <= this.x + this.width && this.y <= other.y && other.y + other.height <= this.y + this.height;
				}
				return this.x <= other.x + other.width && other.x <= this.x + this.width && this.y <= other.y + other.height && other.y <= this.y + this.height;
			} else if (other instanceof Andesine.Circle) {
				if (isFull) {
					// 矩形と円(楕円)の当たり判定(内包)
					function distanceCircleToLine(A, B, C) {
						return Math.abs(A * cx + B * cy + C) / Math.sqrt(A * A + B * B);
					}
					let r = other.radius;
					if (other.isEllipse) {
						// 楕円の場合
						r = Math.min(r.x, r.y);
					}

					const cx = other.x;
					const cy = other.y;

					const lines = [
						{ A: 0, B: 1, C: -this.y },
						{ A: 0, B: -1, C: this.y + this.height },
						{ A: 1, B: 0, C: -this.x },
						{ A: -1, B: 0, C: this.x + this.width },
					];

					for (const line of lines) {
						if (distanceCircleToLine(line.A, line.B, line.C) > radius) {
							return false;
						}
					}
					return true;
				}
				// 矩形と円(楕円)の当たり判定(接触)
				return other.isInside(this);
			}
			const pos = Andesine.Vector2.convert(other);
			if (pos) {
				return this.isInside(pos, isFull);
			}
			console.warn("非対応の型:", typeof other);
			return false;
		}
	};

	// ####################################################################################################

	/**
	 * 円
	 * (円形の範囲)
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {number[] | Andesine.Vector2} [opt.xy] - 座標
	 * @param {number | number[] | Andesine.Vector2} [opt.radius=0] - 半径
	 * @param {number} [opt.startAngle=0] - 開始角度
	 * @param {number} [opt.endAngle=Andesine.TAU] - 終了角度
	 * @param {boolean} [opt.counterclockwise=false] - false:時計回り true:反時計回り
	 * @returns {Andesine.Circle}
	 */
	static Circle = class Circle {
		#_radius;

		constructor({ xy = Andesine.Vector2.zero, radius = 0, startAngle = 0, endAngle = Andesine.TAU, counterclockwise = false }) {
			this.position = Andesine.Vector2.convert(xy);
			this.radius = radius;
			this.startAngle = startAngle;
			this.endAngle = endAngle;
			this.counterclockwise = counterclockwise;
		}

		/**
		 * 楕円か
		 * @returns {boolean}
		 * @readonly
		 */
		get isEllipse() {
			return typeof this.#_radius !== "number";
		}

		/**
		 * 文字列で返却
		 * @param {number} [nesting] - 表示階層
		 * @returns {string}
		 */
		toString(nesting = 1) {
			return Andesine.Util.createToStringMessage(this, nesting, {
				position: this.position,
				radius: this.radius,
				isEllipse: this.isEllipse,
				angle: [this.startAngle, this.endAngle],
				counterclockwise: this.counterclockwise,
			});
		}

		/**
		 * 半径
		 * @returns {number | InstanceType<typeof Andesine.Vector2>}
		 * @readonly
		 */
		get radius() {
			this.#_normalizeRadius();
			return this.#_radius;
		}
		/**
		 * 半径
		 * @param {number | number[] | InstanceType<typeof Andesine.Vector2>} r
		 */
		set radius(r) {
			if (typeof r === "number") {
				this.#_radius = r;
				this.#_normalizeRadius();
				return;
			}
			const rad = Andesine.Vector2.convert(r);
			if (rad.x == rad.y) {
				this.#_radius = rad.x;
			} else {
				this.#_radius = rad;
			}
			this.#_normalizeRadius();
		}
		/**
		 * 半径w
		 * @returns {number}
		 * @readonly
		 */
		get radiusW() {
			if (this.isEllipse) {
				return this.#_radius.x;
			}
			return this.#_radius;
		}
		/**
		 * 半径w
		 * @param {number} r
		 */
		set radiusW(r) {
			if (this.isEllipse) {
				if (this.#_radius.y == r) {
					this.#_radius = r;
				} else {
					this.#_radius.x = r;
				}
				this.#_normalizeRadius();
				return;
			}
			this.radius = [r, this.radius];
		}
		/**
		 * 半径h
		 * @returns {number}
		 * @readonly
		 */
		get radiusH() {
			if (this.isEllipse) {
				return this.#_radius.y;
			}
			return this.#_radius;
		}
		/**
		 * 半径h
		 * @param {number} r
		 */
		set radiusH(r) {
			if (this.isEllipse) {
				if (this.#_radius.x == r) {
					this.#_radius = r;
				} else {
					this.#_radius.y = r;
				}
				this.#_normalizeRadius();
				return;
			}
			this.radius = [this.radius, r];
		}

		/**
		 * 半径の正規化
		 * @returns {undefined}
		 * @private
		 */
		#_normalizeRadius() {
			if (this.isEllipse) {
				if (this.#_radius.x < 0) {
					this.#_radius.x = 0;
				}
				if (this.#_radius.y < 0) {
					this.#_radius.y = 0;
				}
				return;
			}
			if (this.#_radius < 0) {
				this.#_radius = 0;
			}
		}

		/**
		 * x座標
		 * @returns {number}
		 * @readonly
		 */
		get x() {
			return this.position.x;
		}
		/**
		 * x座標
		 * @param {number} x
		 */
		set x(x) {
			this.position.x = x;
		}
		/**
		 * y座標
		 * @returns {number}
		 * @readonly
		 */
		get y() {
			return this.position.y;
		}
		/**
		 * y座標
		 * @param {number} y
		 */
		set y(y) {
			this.position.y = y;
		}

		/**
		 * 上部座標
		 * @returns {number}
		 * @readonly
		 */
		get top() {
			if (this.isEllipse) {
				return this.position.y - this.radius;
			}
			return this.position.y - this.radius.y;
		}
		/**
		 * 下部座標
		 * @returns {number}
		 * @readonly
		 */
		get bottom() {
			if (this.isEllipse) {
				return this.position.y + this.radius;
			}
			return this.position.y + this.radius.y;
		}
		/**
		 * 左端座標
		 * @returns {number}
		 * @readonly
		 */
		get left() {
			if (this.isEllipse) {
				return this.position.x - this.radius;
			}
			return this.position.x - this.radius.x;
		}
		/**
		 * 右端座標
		 * @returns {number}
		 * @readonly
		 */
		get right() {
			if (this.isEllipse) {
				return this.position.x + this.radius;
			}
			return this.position.x + this.radius.x;
		}

		/**
		 * 複製
		 * @returns {InstanceType<typeof Andesine.Circle>}
		 */
		clone() {
			return new Circle(this);
		}

		/**
		 * 円同士の比較
		 * @param {InstanceType<typeof Andesine.Circle>} other
		 * @param {boolean} [severe=false] - 詳細比較
		 * @returns {boolean}
		 */
		eq(other, severe = false) {
			if (!other) {
				return false;
			}
			let res = this.position.eq(other.position);
			if (this.isEllipse) {
				if (!other.isEllipse) {
					return false;
				}
				res &&= this.#_radius.eq(other.radius);
			} else {
				if (other.isEllipse) {
					return false;
				}
				res &&= this.#_radius == other.radius;
			}
			if (!severe) {
				return res;
			}
			return res && this.startAngle == other.startAngle && this.endAngle == other.endAngle && this.counterclockwise == other.counterclockwise;
		}

		/**
		 * 円の当たり判定
		 * @param {InstanceType<typeof Andesine.Vector2> | InstanceType<typeof Andesine.Circle> | InstanceType<typeof Andesine.Rectangle>} other
		 * @param {boolean} [isFull=false] - 円に完全に含まれるか
		 * @returns {boolean}
		 */
		isInside(other, isFull = false) {
			const r = this.#_radius;
			if (other instanceof Andesine.Vector2) {
				if (this.isEllipse) {
					// 楕円と点の当たり判定
					const leftSide = (other.x - this.x) ** 2 / r.x ** 2;
					const rightSide = (other.y - this.y) ** 2 / r.y ** 2;
					return leftSide + rightSide <= 1;
				}
				// 円と点の当たり判定
				return (other.x - this.x) ** 2 + (other.y - this.y) ** 2 <= r ** 2;
			} else if (other instanceof Circle) {
				const isE1 = this.isEllipse;
				const isE2 = other.isEllipse;
				const r2 = other.radius;
				if (isE1 && isE2) {
					// 楕円と楕円の当たり判定
					const dx = other.x - this.x;
					const dy = other.y - this.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (isFull) {
						return distance + r2.x <= r.x && distance + r2.y <= r.y;
					}
					return distance <= r.x + r2.x && distance <= r.y + r2.y;
				} else if (isE1 || isE2) {
					let distance, r_ell1, r_ell2;
					if (isE1) {
						// 楕円と円の当たり判定
						const dx = this.x - other.x;
						const dy = this.y - other.y;
						distance = Math.sqrt(dx * dx + dy * dy);
						r_ell1 = r2;
						r_ell2 = r;
					} else {
						// 円と楕円の当たり判定
						const dx = other.x - this.x;
						const dy = other.y - this.y;
						distance = Math.sqrt(dx * dx + dy * dy);
						r_ell1 = r;
						r_ell2 = r2;
					}
					if (isFull) {
						return distance + r_ell2.x <= r_ell1 && distance + r_ell2.y <= r_ell1;
					}
					return distance <= r_ell1 + Math.max(r_ell2.x, r_ell2.y);
				}
				// 円と円の当たり判定
				const dx = other.x - this.x;
				const dy = other.y - this.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (isFull) {
					return distance + r2 <= r;
				}
				return distance <= r + r2;
			} else if (other instanceof Andesine.Rectangle) {
				// 円(楕円)と矩形の当たり判定
				if (isFull) {
					// TODO: 矩形と円(楕円)の当たり判定(内包)
					console.warn("矩形と円の当たり判定は未実装");
				}

				const rc = other.center;
				const halfWidth = other.width / 2;
				const halfHeight = other.height / 2;
				const dx = Math.abs(this.x - rc.x);
				const dy = Math.abs(this.y - rc.y);
				let radiusX, radiusY;
				if (this.isEllipse) {
					radiusX = r.x;
					radiusY = r.y;
				} else {
					radiusX = r;
					radiusY = r;
				}

				// 四角の半幅と半高さを超えているかどうかを判定
				if (dx > halfWidth + radiusX || dy > halfHeight + radiusY) {
					return false;
				}
				// 四角のエッジに最も近い点までの距離を計算
				if (dx <= halfWidth || dy <= halfHeight) {
					return true;
				}
				// 楕円の場合の接触判定
				if (this.isEllipse) {
					return (dx - halfWidth) ** 2 / radiusX ** 2 + (dy - halfHeight) ** 2 / radiusY ** 2 <= 1;
				}
				// 円の場合の接触判定
				return (dx - halfWidth) ** 2 + (dy - halfHeight) ** 2 <= radiusX ** 2;
			}
			const pos = Andesine.Vector2.convert(other);
			if (pos) {
				return this.isInside(pos, isFull);
			}
			console.warn("非対応の型:", typeof other);
			return false;
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
		 * @param {function} callback
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

		eventExists(eventType) {
			return eventType in this.#_events;
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
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @returns {Andesine.DrawObject}
	 * @abstract
	 */
	static DrawObject = class extends Andesine.EventDispatcher {
		#_manager = null;
		#_canvasObj = null;
		#_mask = null;
		#_parent = null;
		#_children = {};
		#_layerList = [];
		#_layer = 0;
		#_alpha = 1;
		#_angle = 0;

		#isDisabled = false;

		#_cache_topCanvasObject = null;

		/**
		 * システム使用用の設定
		 * @memberof Andesine.DrawObject
		 * @type {Object}
		 * @readonly
		 * @private
		 */
		setting = {};

		isDestroy = false;
		isHidden = false;
		_ctx = null;

		/**
		 * スキップするフレームの通常値(掛け算)
		 * @type {number}
		 * @default 1
		 * @private
		 */
		defaultSkipFrame = 1;
		/**
		 * スキップするフレームの非表示時の値(掛け算)
		 * @type {number}
		 * @default 2
		 * @private
		 */
		hiddenSkipFrame = 3;

		_nextSkipFrame = 1;
		_skipCounter = 0;
		_cache_nsf = 1;
		_cache_gcf;

		_cache_isInCanvas = null;
		_cache_drawSizeScale = null;

		constructor({ ctx = null, layer = 0, parent = null, hiddenToDestroy = "off", mask = null } = {}) {
			super();
			this.layer = layer;

			if (parent && parent.appendChild) {
				parent.appendChild(this);
			} else {
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

			this.hiddenToDestroy = hiddenToDestroy.toLowerCase();
			this.mask = mask;

			this._cache_drawSizeScale = this.canvasObject?.drawSizeScale ?? 1;
		}

		/**
		 * ゲームマネージャーを取得する
		 * @returns {InstanceType<typeof Andesine.GameManager>}
		 * @readonly
		 */
		get manager() {
			if (!this.#_manager && this.parent) {
				this.#_manager = this.parent.manager;
			}
			return this.#_manager;
		}
		/**
		 * ゲームマネージャーを設定する
		 * @param {InstanceType<typeof Andesine.GameManager>} manager
		 */
		set manager(manager) {
			if (manager instanceof Andesine.GameManager) {
				this.#_manager = manager;
			}
		}

		/**
		 * キャンバスオブジェクトを取得する
		 * @returns {InstanceType<typeof Andesine._Canvas>}
		 * @readonly
		 */
		get canvasObject() {
			if (!this.#_canvasObj && this.parent) {
				if (this.parent.canvas) {
					const name = this.manager.getCanvas(this.parent.canvas);
					this.#_canvasObj = this.manager.getCanvas(name);
				} else {
					this.#_canvasObj = this.parent.canvasObject;
				}
			}

			return this.#_canvasObj;
		}
		/**
		 * キャンバスオブジェクトを設定する
		 * @param {InstanceType<typeof Andesine._Canvas>} canvasObj
		 */
		set canvasObject(canvasObj) {
			if (canvasObj instanceof Andesine._Canvas) {
				this.#_canvasObj = canvasObj;
				this.#_cache_topCanvasObject = null;
			}
		}

		/**
		 * 最上位キャンバスオブジェクトを取得する
		 * @returns {InstanceType<typeof Andesine._Canvas>}
		 * @readonly
		 */
		get topCanvasObject() {
			if (this.#_cache_topCanvasObject) {
				return this.#_cache_topCanvasObject;
			}
			let can = this.canvasObject;
			while (can.isInner) {
				can = can.parentCanvas;
			}
			this.#_cache_topCanvasObject = can;
			return can;
		}

		/**
		 * ctxを取得する
		 * @returns {CanvasRenderingContext2D}
		 * @readonly
		 */
		get ctx() {
			if (this.#_parent) {
				if (this.#_parent.canvas) {
					return this.#_parent._ctx;
				}
				return this.#_parent.ctx;
			}
			return this._ctx;
		}

		/**
		 * マスクを取得
		 * @returns {InstanceType<typeof Andesine.Mask>}
		 * @readonly
		 */
		get mask() {
			return this.#_mask;
		}
		/**
		 * マスクを設定
		 * @param {InstanceType<typeof Andesine.Mask> | null} mask
		 * @throws {Error} マスクはオブジェクトで指定して下さい
		 */
		set mask(mask) {
			if (mask && !(mask instanceof Andesine.Mask)) {
				throw new Error("マスクはオブジェクトで指定して下さい。");
			}
			this.#_mask = mask;
			if (this.#_mask) {
				this.#_mask._setParent(this);
			}
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
		 * @returns {undefined}
		 */
		_updateLayerList() {
			this.#_layerList = Andesine.Util.getSortLayerList(this.#_children);
		}

		/**
		 * ボタンイベント無効化
		 * @returns {boolean}
		 * @readonly
		 */
		get isDisabled() {
			if (this.#_parent?.isDisabled) {
				return true;
			}
			return this.#isDisabled;
		}
		/**
		 * ボタンイベント無効化
		 * @param {boolean} disable
		 */
		set isDisabled(disable) {
			if (typeof disable !== "boolean") {
				disable = !!disable;
			}
			this.#isDisabled = disable;
		}

		addEventListener(eventType, callback, name = "") {
			const new_name = super.addEventListener(eventType, callback, name);
			if (eventType == "change") {
				this._checkChangeObject(true);
			}
			return new_name;
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
			let par = 1;
			if (this.#_parent && !this.#_parent.canvas) {
				par = this.#_parent.displayAlpha;
			}
			const alpha = this.#_alpha * par;
			if (alpha < 0.001) {
				return 0;
			}
			return alpha;
		}

		/**
		 * 角度を取得する
		 * @returns {number}
		 * @readonly
		 */
		get angle() {
			return this.#_angle;
		}

		/**
		 * 角度を設定する
		 * @param {number} angle_ - 角度
		 */
		set angle(angle_) {
			if (typeof angle_ !== "number") {
				throw new Error("角度は数値で指定して下さい。");
			}
			this.#_angle = angle_;
		}

		/**
		 * 画面描画時の角度
		 * @returns {number}
		 * @readonly
		 */
		get displayAngle() {
			let par = 0;
			if (this.#_parent && !this.#_parent.canvas) {
				par = this.#_parent.displayAngle;
			}
			return this.#_angle + par;
		}

		/**
		 * 画面描画時の角度(正規化)
		 * @returns {number}
		 * @readonly
		 */
		get normalizeDisplayAngle() {
			return Jasc.normalizeRadian(this.displayAngle);
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
			if (this.hiddenToDestroy === "gc") {
				if (this.isInCanvas && !this.isInCanvas()) {
					this.isDestroy = true;
					return count + 1;
				}
			}
			for (const name of this.#_layerList) {
				count += this.#_children[name].releaseResources();
			}
			return count;
		}

		/**
		 * 全体描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		_systemResetting() {
			this.resetting();
			for (const name of this.#_layerList) {
				this.#_children[name]._systemResetting();
			}
		}

		/**
		 * 描画オブジェクトのリセット
		 * @returns {undefined}
		 */
		resetting() {
			this._cache_drawSizeScale = this.canvasObject.drawSizeScale;
			if (this.eventExists("resetting")) {
				const event = new Andesine.GameResettingEvent(this);
				this.dispatchEvent("resetting", event);
			}
		}

		/**
		 * 全体オブジェクト更新ループ
		 * @param {Object.<string, Array<any> | number>} es - イベントオブジェクト
		 * @param {Object.<string, Array<number>>} deeps - イベント深度
		 * @param {number} skipCou - スキップ数
		 * @param {boolean} [isParentChange] - 親変更フラグ
		 * @returns {number}
		 */
		_systemUpdate(es, deeps, skipCou, isParentChange) {
			let count = 0;
			this._cache_isInCanvas = null;

			const skipFrameCou = Andesine.Util.calcDoFrame(this, skipCou, es.gcf);
			if (skipFrameCou === 0) {
				return count;
			}

			const _isParCheck = this._checkChangeObject(isParentChange);
			if (_isParCheck && this.hiddenToDestroy === "on") {
				if (this.isInCanvas && !this.isInCanvas()) {
					this.isDestroy = true;
					return count;
				}
			}
			const nd = {};
			if (this.isInside) {
				this._updateDeepEvent(es, deeps, nd, Andesine.GameTouchStartEvent, "touchStart");
				this._updateDeepEvent(es, deeps, nd, Andesine.GameHoverEvent, "hover", "hoverMove");
				this._updateDeepEvent(es, deeps, nd, Andesine.GameClickEvent, "click");
			}
			this.update(skipFrameCou);
			count++;
			if (this.isInnerUpdate === false) {
				return count;
			}
			for (const name of this.#_layerList) {
				const child = this.#_children[name];
				count += child._systemUpdate(es, nd, skipFrameCou, _isParCheck);
				if (this.isDestroy || child.isDestroy) {
					this.removeChild(name);
				}
			}
			return count;
		}

		/**
		 * deepリストの更新
		 * @param {Object.<string, Array<any> | number>} es - イベントオブジェクト
		 * @param {Object.<string, Array<number>>} deeps - イベント深度
		 * @param {Object.<string, Array<number>>} nd - 更新後の深度
		 * @param {Andesine.GameEvent} eventClass - イベントクラス
		 * @param {string} name - イベント名
		 * @param {string} [subName] - サブイベント名
		 * @returns {undefined}
		 * @private
		 */
		_updateDeepEvent(es, deeps, nd, eventClass, name, subName) {
			const esObj = es[name];
			if (!esObj) {
				return;
			}
			const deep = deeps[name].slice();
			esObj.event.forEach((e, i) => {
				if (this.isInside(e.pos, false)) {
					deep[i] = 0;
				}
			});
			const isEM = this.eventExists(name);
			const isES = subName && this.eventExists(subName);
			if (isEM || isES) {
				const event = new eventClass(this, esObj.event, deep.slice(), esObj.isNew);
				if (isEM) {
					this.dispatchEvent(name, event);
				}
				if (isES) {
					this.dispatchEvent(subName, event);
				}
			}
			nd[name] = deep.map((d) => d + 1);
		}

		/**
		 * 前回確認時との変更をチェック
		 * @param {boolean} [isParentChange] - 親変更フラグ
		 * @returns {boolean} 変更フラグ
		 * @private
		 */
		_checkChangeObject(isParentChange) {
			if (isParentChange) {
				if (this.eventExists("change")) {
					const event = new Andesine.GameChangeEvent(this);
					this.dispatchEvent("change", event);
				}
			}
			return false;
		}

		/**
		 * オブジェクト更新ループ
		 * @param {number} [skipCou] - スキップ数
		 * @returns {undefined}
		 */
		update(skipCou) {}

		/**
		 * 全体描画ループ
		 * @returns {number}
		 */
		_systemDraw() {
			if (this.isDestroy || this.isHidden) {
				this._nextSkipFrame = this.hiddenSkipFrame;
				return 0;
			}
			let count = 0;
			const ctx = this.ctx;
			ctx.save();
			const isDraw = this.draw();
			if (isDraw) {
				this._nextSkipFrame = this.hiddenSkipFrame;
			} else {
				this._nextSkipFrame = this.defaultSkipFrame;
			}
			count += !isDraw;
			ctx.restore();
			for (const name of this.#_layerList) {
				count += this.#_children[name]._systemDraw();
			}
			return count;
		}

		/**
		 * 描画ループ
		 * @returns {boolean}
		 */
		draw() {
			return false;
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
				this._cache_drawSizeScale = this.canvasObject.drawSizeScale;
			} else if (parent === null) {
				if (this.#_parent && !this._ctx) {
					this._ctx = this.#_parent._ctx;
				}
				this.#_parent = null;
			} else {
				console.warn("親オブジェクト指定エラー");
			}
		}

		ds_convertDrawScale(...args) {
			const ds = this._cache_drawSizeScale;
			const list = [];
			for (const v of args) {
				if (typeof v == "number") {
					list.push(v * ds);
				} else {
					list.push(v);
				}
			}
			return list;
		}

		ds_strokeRect(ctx, x, y, w, h) {
			ctx.strokeRect(...this.ds_convertDrawScale(x, y, w, h));
		}
		ds_fillRect(ctx, x, y, w, h) {
			ctx.fillRect(...this.ds_convertDrawScale(x, y, w, h));
		}
		ds_strokeText(ctx, str, x, y, w) {
			ctx.strokeText(str, ...this.ds_convertDrawScale(x, y, w));
		}
		ds_fillText(ctx, str, x, y, w) {
			ctx.fillText(str, ...this.ds_convertDrawScale(x, y, w));
		}
		ds_arc(ctx, x, y, r, a1, a2) {
			ctx.arc(...this.ds_convertDrawScale(x, y), r, a1, a2);
		}
		ds_translate(ctx, x, y) {
			ctx.translate(...this.ds_convertDrawScale(x, y));
		}
	};

	// ####################################################################################################

	/**
	 * 矩形(描画オブジェクト)
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {InstanceType<typeof Andesine.DrawObject>} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {InstanceType<typeof Andesine.Mask>} [opt.mask] - クリッピングマスク
	 * @param {InstanceType<typeof Andesine.Vector2>} [opt.position] - 座標
	 * @param {InstanceType<typeof Andesine.Vector2>} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {number} [opt.angle=0] - 角度
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
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
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {number} [opt.angle=0] - 角度
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {Andesine.Box}
	 */
	static Box = class extends Andesine.DrawObject {
		_animationObjData = {};
		_animationPromiseData = {};

		_cache_relative;
		_cache_baseRelative;
		_cache_Rect;
		_cache_baseRect;

		constructor({ ctx, layer = 0, parent = null, hiddenToDestroy = "off", mask = null, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, bg = "", bgBd = "", bgBdWidth = 1, radius = 0, angle = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1 } = {}) {
			super({ ctx, layer, parent, hiddenToDestroy, mask });
			this.setting.size = size;
			this.rect = new Andesine.Rectangle(position, this._updateSize(false));
			this.bg = bg;
			this.bgBd = bgBd;
			this.bgBdWidth = bgBdWidth;
			this.radius = radius;
			this.angle = angle;
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

		/**
		 * 前回確認時との変更をチェック
		 * @param {boolean} [isParentChange] - 親変更フラグ
		 * @returns {boolean} 変更フラグ
		 * @override
		 */
		_checkChangeObject(isParentChange, stack = false) {
			this._cache_relative = null;
			this._cache_baseRelative = null;
			const rect = new Andesine.Rectangle(this.relative(), this.rect.size);
			const isChange = !rect.eq(this._cache_Rect);
			if (isChange) {
				this._cache_Rect = rect;

				const baseRect = new Andesine.Rectangle(this.relative(false), this.rect.size);
				this._cache_baseRect = baseRect;
			}
			if (isChange || isParentChange) {
				if (this.eventExists("change")) {
					const event = new Andesine.GameChangeEvent(this);
					this.dispatchEvent("change", event);
					if (!stack) {
						this._checkChangeObject(false, true);
					}
				}
			}
			return isChange;
		}

		update(skipCou) {
			if (this.eventExists("update")) {
				const event = new Andesine.GameUpdateEvent(this);
				this.dispatchEvent("update", event);
			}
			for (const name in this._animationObjData) {
				this._animationObjData[name].update(skipCou);
			}
		}

		draw() {
			const ctx = this.ctx;
			const ds = this._cache_drawSizeScale;

			const setting = {};
			if (this.bg) {
				setting.fillStyle = this.bg;
			} else {
				setting.fillStyle = "transparent";
			}
			if (this.bgBd) {
				setting.strokeStyle = this.bgBd;
				setting.lineWidth = this.bgBdWidth * ds;
			} else {
				setting.strokeStyle = "transparent";
			}
			setting.globalAlpha = this.displayAlpha;
			jasc.draw.ctxSetting(ctx, setting);
			if (this.eventExists("draw")) {
				const event = new Andesine.GameDrawEvent(this);
				this.dispatchEvent("draw", event);
			}
			const pos = this.relative();
			this._updateSize(true);
			// 透明なら描画しない
			if (setting.globalAlpha == 0) {
				return true;
			}
			// キャンバス外なら描画しない
			if (!this.isInCanvas()) {
				return true;
			}

			if (Andesine.DEBUG) {
				Andesine._debug_before_rotation_setting(ctx, ds);
				this.ds_strokeRect(ctx, pos.x, pos.y, this.rect.size.x, this.rect.size.y);
				Andesine._debug_restore_data_setting();
			}

			const angle = this.normalizeDisplayAngle;
			if (!Jasc.compareFloats(angle, 0)) {
				const centerPos = this.getCenter().mul(ds);
				ctx.translate(centerPos.x, centerPos.y);
				ctx.rotate(angle);
				const inv = centerPos.inverse;
				ctx.translate(inv.x, inv.y);
			}
			if (this.mask) {
				this.mask.clip(ctx, pos);
			}

			if (Andesine.DEBUG) {
				ctx.globalAlpha = 0.1;
			}

			if (this.rect.size.eq(Andesine._CACHE_VEC2_ZERO)) {
				// サイズ0なら描画しない
				return false;
			}
			// 描画するかのフラグ
			const isDrawBG = setting.fillStyle !== "transparent";
			const isDrawBD = setting.strokeStyle !== "transparent" && this.bgBdWidth > 0;

			// 描くものが無ければ描画しない
			if (!isDrawBG && !isDrawBD) {
				return false;
			}

			let rad = this.radius;
			if (rad === "max") {
				rad = Math.min(this.rect.width, this.rect.height) / 2;
			}
			if (rad > 0) {
				// 丸角
				if (isDrawBG || isDrawBD) {
					this.createRoundRectPath(ctx, ...pos.array, this.rect.width, this.rect.height, rad);
				}
				if (isDrawBD) {
					ctx.stroke();
				}
				if (isDrawBG) {
					ctx.fill();
				}
			} else {
				// 普通の四角
				if (isDrawBD) {
					this.ds_strokeRect(ctx, pos.x, pos.y, this.rect.width, this.rect.height);
				}
				if (isDrawBG) {
					this.ds_fillRect(ctx, pos.x, pos.y, this.rect.width, this.rect.height);
				}
			}
			return false;
		}

		/**
		 * 回転後の絶対座標(左上)を取得
		 * @param {boolean} [toCanvas=true] - キャンバス単位で取得(falseなら最上位キャンバスからの絶対座標)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		rotatedPosition(toCanvas = true) {
			const parent = this.parent;
			if (!parent) {
				throw new Error("parent is null");
			}
			const parent_pos = parent.relative(toCanvas);
			const child_size = Andesine.Vector2.div(this.rect.size, 2);
			const pCenterPos = Andesine.Vector2.add(parent_pos, Andesine.Vector2.div(parent.rect.size, 2));
			return Andesine.Vector2.sub(Andesine.Vector2.sum(this.rect.position, parent_pos, child_size), pCenterPos).matrix(parent.displayAngle).add(pCenterPos).sub(child_size);
		}

		/**
		 * 絶対座標を取得
		 * @param {boolean} [toCanvas=true] - キャンバス単位で取得(falseなら最上位キャンバスからの絶対座標)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		relative(toCanvas = true) {
			if (toCanvas) {
				if (this._cache_relative) {
					return this._cache_relative.clone();
				}
			} else if (this._cache_baseRelative) {
				return this._cache_baseRelative.clone();
			}

			let pos;
			if (this.parent && !(toCanvas && this.parent.canvas)) {
				pos = this.rotatedPosition(toCanvas);
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
			if (toCanvas) {
				this._cache_relative = pos.clone();
			} else {
				this._cache_baseRelative = pos.clone();
			}
			return pos;
		}

		/**
		 * 中心座標を取得
		 * @param {boolean} [toCanvas=true] - キャンバス単位で取得(falseなら最上位キャンバスからの絶対座標)
		 * @returns {InstanceType<typeof Andesine.Vector2>}
		 */
		getCenter(toCanvas = true) {
			const pos = this.relative(toCanvas);
			return Andesine.Vector2.div(this.rect.size, 2).add(pos);
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
				throw new Error("invalid size data");
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
		isInside(other, isFull = false, toCanvas = true) {
			let obj;
			if (other instanceof Andesine.Box) {
				obj = other.rect;
			} else {
				obj = other;
			}
			let rect;
			if (toCanvas) {
				if (this._cache_Rect) {
					rect = this._cache_Rect;
				} else {
					rect = new Andesine.Rectangle(this.relative(), this.rect.size);
					this._cache_Rect = rect;
				}
			} else {
				if (this._cache_baseRect) {
					rect = this._cache_baseRect;
				} else {
					rect = new Andesine.Rectangle(this.relative(false), this.rect.size);
					this._cache_baseRect = rect;
				}
			}
			return rect.isInside(obj, isFull);
		}

		/**
		 * キャンバス内か判定
		 * @returns {boolean}
		 */
		isInCanvas() {
			if (this._cache_isInCanvas !== null) {
				return this._cache_isInCanvas;
			}

			const rect = this.canvasObject?.size;

			if (!rect) {
				return false;
			}
			if (!this._cache_Rect) {
				this._cache_Rect = new Andesine.Rectangle(this.relative(), this.rect.size);
			}
			const ds = this._cache_drawSizeScale;
			const myRect = this._cache_Rect.clone();
			myRect.position.mul(ds);
			myRect.size.mul(ds);
			let ndAngle = this.normalizeDisplayAngle;
			if (ndAngle >= Andesine.PI) {
				ndAngle -= Andesine.PI;
			}
			if (Andesine.DEBUG) {
				Andesine._debug_collision_detection_setting(this.ctx, ds);
			}
			if (Jasc.isRadiansEqual(ndAngle, 0, 0.01, true)) {
				// 0度 or 180度
				if (Andesine.DEBUG) {
					this.ctx.strokeRect(myRect.x, myRect.y, myRect.width, myRect.height);
					Andesine._debug_restore_data_setting();
				}
				return rect.isInside(myRect);
			}
			if (Jasc.isRadiansEqual(ndAngle, Andesine.HALF_PI, 0.01, true)) {
				// 90度 or 270度
				const rotateRect = myRect.rotate90();
				if (Andesine.DEBUG) {
					this.ctx.strokeRect(rotateRect.x, rotateRect.y, rotateRect.width, rotateRect.height);
					Andesine._debug_restore_data_setting();
				}
				return rect.isInside(rotateRect);
			}
			// その他
			const circle = myRect.toCircle();
			if (Andesine.DEBUG) {
				const ctx = this.ctx;
				ctx.beginPath();
				ctx.arc(circle.x, circle.y, circle.radius, 0, Andesine.TAU);
				ctx.closePath();
				ctx.stroke();
				Andesine._debug_restore_data_setting();
			}
			const flag = circle.isInside(rect);
			this._cache_isInCanvas = flag;
			return flag;
		}

		/**
		 * 角が丸い四角形のパスを作成する
		 * @param  {CanvasRenderingContext2D} ctx コンテキスト
		 * @param  {Number} x   左上隅のX座標
		 * @param  {Number} y   左上隅のY座標
		 * @param  {Number} w   幅
		 * @param  {Number} h   高さ
		 * @param  {Number} r   半径
		 */
		createRoundRectPath(ctx, x, y, w, h, r) {
			[x, y, w, h, r] = this.ds_convertDrawScale(x, y, w, h, r);
			const xr = x + r;
			const yr = y + r;
			const xw = x + w;
			const yh = y + h;
			ctx.beginPath();
			ctx.moveTo(xr, y);
			ctx.lineTo(xw - r, y);
			ctx.arc(xw - r, yr, r, Andesine.THREE_HALF_PI, 0, false);
			ctx.lineTo(xw, yh - r);
			ctx.arc(xw - r, yh - r, r, 0, Andesine.HALF_PI, false);
			ctx.lineTo(xr, yh);
			ctx.arc(xr, yh - r, r, Andesine.HALF_PI, Andesine.PI, false);
			ctx.lineTo(x, yr);
			ctx.arc(xr, yr, r, Andesine.PI, Andesine.THREE_HALF_PI, false);
			ctx.closePath();
		}

		/**
		 * アニメーション作成
		 * @param {object} [opt] - オプション
		 * @param {string} [opt.name] - アニメーション名(外部参照用)
		 * @param {Andesine.Vector2 | null} [opt.position=null] - 終了座標(任意)
		 * @param {Andesine.Vector2 | null} [opt.size=null] - 終了サイズ(任意)
		 * @param {number | null} [opt.angle=null] - 終了角度(任意)
		 * @param {number | null} [opt.alpha=null] - 終了透明度(任意)
		 * @param {number} [opt.delay=0] - 開始までの待機時間(-で途中から開始可能)
		 * @param {number} [opt.frameTime=60] - 所要フレーム数
		 * @param {"smooth" | "leap"} [opt.type="smooth"] - 動作の種類
		 * @param {"set" | "add" | "addSet"} [opt.mode="add"] - 値の計算方法(add:[1->4]:4, addSet:[1->4]:1+2+3+4)
		 * @param {number | "infinite"} [opt.loop=1] - 繰り返し回数(infiniteの場合Promiseは解決されない)
		 * @param {function(InstanceType<typeof Andesine.AnimationEvent>):undefined} [opt.callback=null] - コールバック関数(通常時はpromiseを推奨)
		 * @returns {Promise<InstanceType<typeof Andesine.AnimationEvent>>}
		 */
		createAnimation({ name = "", position = null, size = null, angle = null, alpha = null, delay = 0, frameTime = 60, type = "smooth", mode = "add", loop = 1, callback = null } = {}) {
			return Andesine.Animation.createAnimation(this, 0, {
				name,
				position,
				size,
				angle,
				alpha,
				delay,
				frameTime,
				type,
				mode,
				loop,
				callback,
			});
		}

		/**
		 * 連続アニメーション作成
		 * @param {...Object} args - 設定データ
		 * @returns {Promise<InstanceType<typeof Andesine.AnimationEvent>>}
		 */
		createListAnimation(...args) {
			return Andesine.Animation.createListAnimation(this, 0, ...args);
		}

		/**
		 * アニメーション実行待機
		 * @param {string | string[]} [name] - アニメーション名(無しで全体待機)
		 * @returns {Promise<InstanceType<typeof Andesine.Box>> | Promise<InstanceType<typeof Andesine.Box>[]>}
		 */
		waitAnimation(name) {
			if (typeof name === "string") {
				if (this._animationObjData[name]) {
					return this._animationPromiseData[name];
				}
				return Promise.resolve(this);
			} else if (Array.isArray(name)) {
				const arr = [];
				name.forEach((n) => {
					if (this._animationObjData[n]) {
						arr.push(this._animationPromiseData[n]);
					}
				});
				return Promise.all(arr);
			} else if (name == null) {
				return Promise.all(Object.values(this._animationPromiseData));
			}
			return Promise.reject(new Error(`アニメーション名が不正です: ${name}`));
		}

		/**
		 * アニメーションオブジェクトを取得
		 * @returns {Object<string, InstanceType<typeof Andesine.Animation> | null>}
		 * @readonly
		 */
		get animation() {
			return this._animationObjData;
		}
	};

	/**
	 * 使用可能最大サイズを取得
	 * @param {InstanceType<typeof Andesine.Box>} _this
	 * @param {InstanceType<typeof Andesine.Box>} [_parent]
	 * @returns {InstanceType<typeof Andesine.Vector2>}
	 * @static
	 */
	static getFullSize(_this, _parent) {
		let w, h, size;
		if (_parent) {
			if (_parent.canvas) {
				size = _this.canvasObject.size.size;
			} else {
				size = _parent.rect;
			}
			w = size.width;
			h = size.height;
		} else {
			const can = _this.canvasObject;
			if (can) {
				size = can.size;
			} else {
				size = jasc.game.getCanvasSize(_this.ctx.canvas);
			}
			const ds = _this._cache_drawSizeScale;
			w = size.width / ds;
			h = size.height / ds;
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
	 * @param {InstanceType<typeof Andesine.DrawObject>} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {InstanceType<typeof Andesine.Mask>} [opt.mask] - クリッピングマスク
	 * @param {InstanceType<typeof Andesine.Vector2>} [opt.position] - 座標
	 * @param {InstanceType<typeof Andesine.Vector2> | "full"} [opt.size="full"] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {boolean} [opt.useInnerCanvas=false] - 子供を別キャンバスで描画する
	 * @param {"none" | "auto" | "scroll" | "dynamic" | "noBar"} [opt.overflowX="none"] - x座標の画面外の子供の表示方法を変更(useInnerCanvas: true の場合のみ有効)
	 * @param {"none" | "auto" | "scroll" | "dynamic" | "noBar"} [opt.overflowY="none"] - y座標の画面外の子供の表示方法を変更(useInnerCanvas: true の場合のみ有効)
	 * @param {"safari" | "chrome" | "custom"} [opt.scrollStyle="safari"] - スクロールバーのスタイル
	 * @param {string} [opt.scrollHandlePointer="default"] - スクロールバーのポインター(css cursor参照)
	 * @param {boolean} [opt.onScrollUpdate=false] - スクロール時以外コンテンツを更新しない
	 * @returns {InstanceType<typeof Andesine.Frame>}
	 * @static
	 */
	static createFrame(opt) {
		return new Andesine.Frame(opt);
	}
	/**
	 * 描画フレーム
	 * @memberof Andesine
	 * @extends {Andesine.Box}
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2 | "full"} [opt.size="full"] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @param {boolean} [opt.useInnerCanvas=false] - 子供を別キャンバスで描画する
	 * @param {"none" | "auto" | "scroll" | "dynamic" | "noBar"} [opt.overflowX="none"] - x座標の画面外の子供の表示方法を変更(useInnerCanvas: true の場合のみ有効)
	 * @param {"none" | "auto" | "scroll" | "dynamic" | "noBar"} [opt.overflowY="none"] - y座標の画面外の子供の表示方法を変更(useInnerCanvas: true の場合のみ有効)
	 * @param {"safari" | "chrome" | "custom"} [opt.scrollStyle="safari"] - スクロールバーのスタイル
	 * @param {string} [opt.scrollHandlePointer="default"] - スクロールバーのポインター(css cursor参照)
	 * @param {boolean} [opt.onScrollUpdate=false] - スクロール時以外コンテンツを更新しない
	 * @returns {Andesine.Frame}
	 */
	static Frame = class extends Andesine.Box {
		#_reset2draw = false;

		isInnerUpdate = true;

		canvas = null;

		// スクロールバー基点レイヤー(共通)
		static SCROLLBAR_BASE_LAYER = 1000;

		// 最小長さ
		minHandleSize = 30;
		// 太さ
		scrollbarWeight = 10;
		//スクロールバーをコンテンツに被せて描画
		overrideScrollContents = false;

		scrollbarObjData = {
			// スクロールバーのハンドル
			verticalHandle: null,
			horizontalHandle: null,
			// スクロールバーの背景部分
			verticalRails: null,
			horizontalRails: null,
			// スクロールバーの角
			corner: null,
		};

		// スクロールバー描画フラグ
		isScrollbarVerticalDraw = false;
		isScrollbarHorizontalDraw = false;

		// スクロール位置
		scrollOffset = Andesine.Vector2.zero;

		constructor({ ctx, layer = 0, parent = null, hiddenToDestroy = "off", mask = null, position = Andesine.Vector2.zero, size = "full", bg = "", bgBd = "", bgBdWidth = 1, radius = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1, useInnerCanvas = false, overflowX = "none", overflowY = "none", scrollStyle = "safari", scrollHandlePointer = "default", onScrollUpdate = false } = {}) {
			super({ ctx, layer, parent, hiddenToDestroy, mask, position, size, bg, bgBd, bgBdWidth, radius, boxAlign, boxBaseLine, alpha });

			this.useInnerCanvas = useInnerCanvas;
			this.overflow = [overflowX, overflowY];
			this.scrollHandlePointer = scrollHandlePointer; //this.canvasObject.setCursor(this.scrollHandlePointer);
			this.onScrollUpdate = onScrollUpdate;

			this.#canvasInit();
			this._setScrollStyle(scrollStyle);
		}

		/**
		 * キャンバス初期化
		 * @returns {undefined}
		 * @private
		 */
		#canvasInit() {
			if (this.useInnerCanvas) {
				const canvas = document.createElement("canvas");
				const ds = this._cache_drawSizeScale;
				canvas.width = this.rect.width * ds;
				canvas.height = this.rect.height * ds;
				this.canvas = canvas;
				this.manager._addCanvas(canvas, this.canvasObject);
				this._ctx = canvas.getContext("2d");

				this.#_reset2draw = true;
			}
		}

		/**
		 * スクロールバーのスタイル適用
		 * @param {string} scrollStyle - スクロールバーのスタイル
		 * @returns {undefined}
		 * @throws {Error} 不明なスクロールバーのスタイル
		 */
		_setScrollStyle(scrollStyle) {
			let handleData = null,
				railsData = null;
			const baseLayer = Andesine.Frame.SCROLLBAR_BASE_LAYER;
			const ctx = this.ctx;
			switch (scrollStyle) {
				case "safari":
					this.overrideScrollContents = true;
					// ハンドル
					handleData = {
						ctx: ctx,
						layer: baseLayer + 1,
						bg: "#0003",
						radius: "max",
						boxAlign: "right",
						boxBaseLine: "top",
					};
					this.scrollbarVerticalHandle = new Andesine.Box(handleData);
					handleData.boxAlign = "left";
					handleData.boxBaseLine = "bottom";
					this.scrollbarHorizontalHandle = new Andesine.Box(handleData);
					break;
				case "chrome":
					// ハンドル
					handleData = {
						ctx: ctx,
						layer: baseLayer + 1,
						bg: "#0003",
						boxAlign: "right",
						boxBaseLine: "top",
					};
					this.scrollbarVerticalHandle = new Andesine.Box(handleData);
					handleData.boxAlign = "left";
					handleData.boxBaseLine = "bottom";
					this.scrollbarHorizontalHandle = new Andesine.Box(handleData);
					// 背景
					railsData = {
						ctx: ctx,
						layer: baseLayer,
						bg: "#ddd",
						boxAlign: "right",
						boxBaseLine: "top",
					};
					this.scrollbarVerticalRails = new Andesine.Box(railsData);
					railsData.boxAlign = "left";
					railsData.boxBaseLine = "bottom";
					this.scrollbarHorizontalRails = new Andesine.Box(railsData);
					// 角
					railsData.boxAlign = "right";
					this.scrollbarCorner = new Andesine.Box(railsData);
					break;
				case "custom":
					// ユーザーにまかせる
					break;
				default:
					throw new Error("不明なスクロールバーのスタイル");
			}
		}

		/**
		 * キャンバス設定リセット
		 * @returns {undefined}
		 */
		canvasReset() {
			if (this.useInnerCanvas) {
				const canvas = this.canvas;
				const ds = this._cache_drawSizeScale;
				const dpr = window.devicePixelRatio || 1;
				const re = ds * dpr;
				canvas.width = this.rect.width * re;
				canvas.height = this.rect.height * re;
				this._ctx.scale(dpr, dpr);
				this.#_reset2draw = true;
			}
		}

		resetScrollObject() {}

		/**
		 * 描画オブジェクトのリセット
		 * @returns {undefined}
		 * @override
		 */
		resetting() {
			super.resetting();
			this.canvasReset();
		}

		update(skipCou) {
			super.update(skipCou);
			// スクロールバーの内部更新(一応)
			let doubleBar = false;
			switch (this.overflow[0]) {
				case "auto":
				case "scroll":
				case "dynamic":
					this.scrollbarHorizontalRails?.update(skipCou);
					this.scrollbarVerticalHandle?.update(skipCou);
					doubleBar = true;
					break;
			}
			switch (this.overflow[1]) {
				case "auto":
				case "scroll":
				case "dynamic":
					this.scrollbarVerticalRails?.update(skipCou);
					this.scrollbarVerticalHandle?.update(skipCou);
					if (doubleBar && this.scrollbarCorner) {
						this.scrollbarCorner.update(skipCou);
					}
					break;
			}
		}

		/**
		 * 全体描画ループ
		 * @returns {number}
		 * @override
		 */
		_systemDraw() {
			if (this.isDestroy || this.isHidden) {
				return 0;
			}

			if (this.isInnerUpdate || this.#_reset2draw) {
				return super._systemDraw();
			}
			const ctx = this.ctx;
			ctx.save();
			let count = +!this.draw();
			ctx.restore();
			return count;
		}

		draw() {
			if (super.draw()) {
				return true;
			}
			if (!this.useInnerCanvas) {
				return false;
			}
			this.#_reset2draw = false;
			const parCtx = this.ctx;
			const ctx = this._ctx;

			const pos = this.relative();
			const ds = this._cache_drawSizeScale;
			if (Andesine.DEBUG) {
				parCtx.globalAlpha = 0.8;
			}
			parCtx.save();
			const dpr = window.devicePixelRatio || 1;
			const inv = 1 / dpr;
			parCtx.scale(inv, inv);
			const re = ds * dpr;
			parCtx.drawImage(this.canvas, pos.x * re, pos.y * re, this.rect.width * re, this.rect.height * re);
			parCtx.restore();
			if (this.isInnerUpdate) {
				jasc.draw.canvasClear(ctx);
			}

			// スクロールバー設定
			this.isScrollbarHorizontalDraw = false;
			this.isScrollbarVerticalDraw = false;

			// TODO: スクロールバー表示判定

			// TODO: スクロール処理作成

			// TODO: スクロールバー位置計算

			return false;
		}
	};

	// ####################################################################################################

	/**
	 * 描画フレーム(ミラーリング)
	 *
	 * ※Andesine.Frame指定時はuseInnerCanvas: true の場合のみ有効。
	 *
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {InstanceType<typeof Andesine.DrawObject>} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {InstanceType<typeof Andesine.Mask>} [opt.mask] - クリッピングマスク
	 * @param {InstanceType<typeof Andesine.Vector2>} [opt.position] - 座標
	 * @param {InstanceType<typeof Andesine.Vector2> | "full"} [opt.size="full"] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @param {InstanceType<typeof Andesine.Frame> | InstanceType<typeof Andesine._Canvas>} [opt.linkFrame] - 接続フレーム
	 * @param {boolean} [opt.isCascade=false] - 接続元削除で自身も削除
	 * @returns {InstanceType<typeof Andesine.FrameLink>}
	 */
	static createFrameLink(opt) {
		return new Andesine.FrameLink(opt);
	}

	/**
	 * 描画フレーム(ミラーリング)
	 *
	 * ※Andesine.Frame指定時はuseInnerCanvas: true の場合のみ有効。
	 *
	 * @memberof Andesine
	 * @extends {Andesine.Box}
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2 | "full"} [opt.size="full"] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @param {Andesine.Frame | Andesine._Canvas} [opt.linkFrame] - 接続フレーム
	 * @param {boolean} [opt.isCascade=false] - 接続元削除で自身も削除
	 * @returns {Andesine.FrameLink}
	 */
	static FrameLink = class extends Andesine.Box {
		constructor({ ctx, layer = 0, parent = null, hiddenToDestroy = "off", mask = null, position = Andesine.Vector2.zero, size = "full", bg = "", bgBd = "", bgBdWidth = 1, radius = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1, linkFrame = null, isCascade = false } = {}) {
			super({ ctx, layer, parent, hiddenToDestroy, mask, position, size, bg, bgBd, bgBdWidth, radius, boxAlign, boxBaseLine, alpha });
			this.linkFrame = linkFrame;
			this.isCascade = isCascade;
		}

		update(skipCou) {
			super.update(skipCou);
			if (this.linkFrame && this.isCascade && this.linkFrame.isDestroy) {
				this.isDestroy = true;
			}
		}

		draw() {
			if (super.draw()) {
				return true;
			}

			const canvas = this.linkFrame.canvas;
			if (!canvas) {
				return false;
			}

			const ctx = this.ctx;
			const pos = this.relative();
			const ds = this._cache_drawSizeScale;
			if (Andesine.DEBUG) {
				ctx.globalAlpha = 0.8;
			}
			ctx.save();
			const dpr = window.devicePixelRatio || 1;
			const inv = 1 / dpr;
			ctx.scale(inv, inv);
			const re = ds * dpr;
			ctx.drawImage(canvas, pos.x * re, pos.y * re, this.rect.width * re, this.rect.height * re);
			ctx.restore();
		}
	};

	// ####################################################################################################

	/**
	 * 矩形+テキスト(描画オブジェクト)
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {InstanceType<typeof Andesine.DrawObject>} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {InstanceType<typeof Andesine.Mask>} [opt.mask] - クリッピングマスク
	 * @param {InstanceType<typeof Andesine.Vector2>} [opt.position] - 座標
	 * @param {InstanceType<typeof Andesine.Vector2>} [opt.size] - サイズ
	 * @param {string} [opt.text=""] - テキスト
	 * @param {string} [opt.fg="#000"] - 文字色
	 * @param {string} [opt.fgBd=""] - 文字縁取り
	 * @param {number} [opt.fgBdWidth=1] - 文字縁取りの太さ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {number} [opt.angle=0] - 角度
	 * @param {string} [opt.align="left"] - テキストの配置
	 * @param {number} [opt.lineHeight=0] - 行間
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {"manual" | "auto" | "max" | "none"} [opt.returnType="max"] - 改行の設定
	 * @param {InstanceType<typeof Andesine.Font>} [opt.font] - フォント
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
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.text=""] - テキスト
	 * @param {string} [opt.fg="#000"] - 文字色
	 * @param {string} [opt.fgBd=""] - 文字縁取り
	 * @param {number} [opt.fgBdWidth=1] - 文字縁取りの太さ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {number} [opt.angle=0] - 角度
	 * @param {string} [opt.align="left"] - テキストの配置
	 * @param {number} [opt.lineHeight=0] - 行間
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {"manual" | "auto" | "max" | "none"} [opt.returnType="max"] - 改行の設定
	 * @param {InstanceType<typeof Andesine.Font>} [opt.font=new Andesine.Font()] - フォント
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {Andesine.TextBox}
	 */
	static TextBox = class extends Andesine.Box {
		constructor({ ctx, layer = 0, parent = null, hiddenToDestroy = "off", mask = null, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, text = "", fg = "#000", fgBd = "", fgBdWidth = 1, bg = "", bgBd = "", bgBdWidth = 1, radius = 0, angle = 0, align = "left", lineHeight = 0, boxAlign = "left", boxBaseLine = "top", returnType = "max", font = new Andesine.Font(), alpha = 1 }) {
			super({ ctx, layer, parent, hiddenToDestroy, mask, position, size, bg, bgBd, bgBdWidth, radius, angle, boxAlign, boxBaseLine, alpha });
			this.text = text;
			this.fg = fg;
			this.fgBd = fgBd;
			this.fgBdWidth = fgBdWidth;
			this.align = align;
			this.lineHeight = lineHeight;
			this.returnType = returnType;
			this.font = font;
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
			const ds = this._cache_drawSizeScale;
			const pos = this.relative();
			if (this.fg) {
				ctx.fillStyle = this.fg;
				if (this.fg === "transparent") {
					this.fg = "";
				}
			}
			if (this.fgBd) {
				ctx.strokeStyle = this.fgBd;
				if (this.fgBd === "transparent") {
					this.fgBd = "";
				}
				ctx.lineWidth = this.fgBdWidth;
			}
			ctx.font = this.font.fontStr(ds);

			// 描画するかのフラグ
			const isDrawFG = !!this.fg;
			const isDrawFGBd = this.fgBd && this.fgBdWidth > 0;

			// 描くものが無ければ描画しない
			if (!isDrawFG && !isDrawFGBd) {
				return false;
			}

			const width = this.rect.width;
			switch (this.returnType) {
				case "manual":
					// 手動改行
					this._manualFillText(pos, width, isDrawFG, isDrawFGBd);
					break;
				case "auto":
					// 自動改行
					this._fixedFillText(pos, width, isDrawFG, isDrawFGBd);
					break;
				case "max":
					// 横幅制限(改行なし)
					if (Andesine.DEBUG) {
						Andesine._debug_text_size_setting(ctx, ds);
						const textData = ctx.measureText(this.text);
						ctx.strokeRect(ctx, pos.x * ds, pos.y * ds, width * ds, textData.actualBoundingBoxDescent);
						Andesine._debug_restore_data_setting();
					}
					if (isDrawFGBd) {
						this.ds_strokeText(ctx, this.text, pos.x, pos.y, width);
					}
					if (isDrawFG) {
						this.ds_fillText(ctx, this.text, pos.x, pos.y, width);
					}
					break;
				case "none":
				default:
					// 改行なし
					if (Andesine.DEBUG) {
						Andesine._debug_text_size_setting(ctx, ds);
						const textData = ctx.measureText(this.text);
						this.ds_strokeRect(ctx, pos.x * ds, pos.y * ds, textData.actualBoundingBoxRight, textData.actualBoundingBoxDescent);
						Andesine._debug_restore_data_setting();
					}
					if (isDrawFGBd) {
						this.ds_strokeText(ctx, this.text, pos.x, pos.y);
					}
					if (isDrawFG) {
						this.ds_fillText(ctx, this.text, pos.x, pos.y);
					}
					break;
			}
			return false;
		}

		/**
		 * テキスト内の\nで改行
		 * @param {InstanceType<typeof Andesine.Vector2>} pos
		 * @param {number} width
		 * @param {boolean} [isDrawFG=true]
		 * @param {boolean} [isDrawFGBd=false]
		 * @returns {undefined}
		 */
		_manualFillText(pos, width, isDrawFG = true, isDrawFGBd = false) {
			const ctx = this.ctx;
			const ds = this._cache_drawSizeScale;
			const _pos = Andesine.Vector2.convert(pos).mul(ds);
			width *= ds;
			ctx.textBaseline = "top";
			ctx.textAlign = "left";
			const spText = this.text.split("\n");
			let padding,
				_sumLineHight = 0;
			const base_lineHight = ctx.measureText("あ").actualBoundingBoxDescent;
			for (let i = 0, li = spText.length; i < li; i++) {
				const t = spText[i];
				const textSize = ctx.measureText(t);
				let addHeight = textSize.actualBoundingBoxDescent;
				if (t == "") {
					addHeight = base_lineHight;
				}
				_sumLineHight += addHeight + this.lineHeight;
				if (t == "") {
					continue;
				}
				const lineWidth = textSize.actualBoundingBoxRight;
				if (this.align == "right") {
					padding = width - lineWidth;
				} else if (this.align == "center") {
					padding = (width - lineWidth) / 2;
				} else {
					padding = 0;
				}
				const x = _pos.x + padding;
				const y = _pos.y + _sumLineHight - addHeight;
				if (Andesine.DEBUG) {
					Andesine._debug_text_size_setting(ctx, ds);
					ctx.strokeRect(x, y, lineWidth, addHeight);
					Andesine._debug_restore_data_setting();
				}
				if (isDrawFGBd) {
					ctx.strokeText(t, x, y);
				}
				if (isDrawFG) {
					ctx.fillText(t, x, y);
				}
			}
		}

		/**
		 * テキストを自動改行
		 * 改行は"\n"で可能
		 * @param {InstanceType<typeof Andesine.Vector2>} pos
		 * @param {number} width
		 * @param {boolean} [isDrawFG=true]
		 * @param {boolean} [isDrawFGBd=false]
		 * @returns {undefined}
		 */
		_fixedFillText(pos, width, isDrawFG = true, isDrawFGBd = false) {
			const ctx = this.ctx;
			const column = [
				{
					text: "",
					width: 0,
					height: 0,
				},
			];
			let line = 0;

			const ds = this._cache_drawSizeScale;
			const _pos = Andesine.Vector2.convert(pos).mul(ds);
			width *= ds;

			ctx.textBaseline = "top";
			ctx.textAlign = "left";
			for (let i = 0; i < this.text.length; i++) {
				const char = this.text.charAt(i);
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
				const addHeight = column[i].height + this.lineHeight;
				_sumLineHight += addHeight;
				if (column[i].text == "") {
					continue;
				}
				const lineWidth = column[i].width;
				if (this.align == "right") {
					padding = width - lineWidth;
				} else if (this.align == "center") {
					padding = (width - lineWidth) / 2;
				} else {
					padding = 0;
				}
				const x = _pos.x + padding;
				const y = _pos.y + _sumLineHight - addHeight;
				if (Andesine.DEBUG) {
					Andesine._debug_text_size_setting(ctx, ds);
					ctx.strokeRect(x, y, lineWidth, addHeight);
					Andesine._debug_restore_data_setting();
				}
				if (isDrawFGBd) {
					ctx.strokeText(column[i].text, x, y, width);
				}
				if (isDrawFG) {
					ctx.fillText(column[i].text, x, y, width);
				}
			}
		}
	};

	// ####################################################################################################

	/**
	 * 円形(描画オブジェクト)
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {number | Andesine.Vector2} [opt.radius] - 半径
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number} [opt.angle=0] - 角度
	 * @param {"left" | "center" | "right"} [opt.boxAlign="center"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="middle"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @returns {Andesine.Disc}
	 */
	static Disc = class extends Andesine.DrawObject {
		_animationObjList = [];

		constructor({ ctx, layer = 0, parent = null, hiddenToDestroy = "off", mask = null, position = Andesine.Vector2.zero, radius = Andesine.Vector2.zero, bg = "", bgBd = "", bgBdWidth = 1, angle = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1 }) {
			super({ ctx, layer, parent, hiddenToDestroy, mask });
		}

		// TODO: 円形を作る
	};

	// ####################################################################################################

	/**
	 * 画像(描画オブジェクト)
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @param {"origin" | "manual" | "max" | "min" | "width" | "height"} [opt.aspectType="width"] - アスペクト比計算方法
	 * @returns {InstanceType<typeof Andesine.ImageBox>}
	 */
	static createImageBox(opt) {
		return new Andesine.ImageBox(opt);
	}
	/**
	 * 画像(描画オブジェクト)
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {CanvasRenderingContext2D | String} [opt.ctx]
	 * @param {number} [opt.layer] - レイヤー番号
	 * @param {Andesine.DrawObject} [opt.parent] - 親オブジェクト
	 * @param {"off" | "gc" | "on"} [opt.hiddenToDestroy="off"] - 非表示時に強制削除(自身が非表示の時点で削除)
	 * @param {Andesine.Mask} [opt.mask] - クリッピングマスク
	 * @param {Andesine.Vector2} [opt.position] - 座標
	 * @param {Andesine.Vector2} [opt.size] - サイズ
	 * @param {string} [opt.bg=""] - 背景色
	 * @param {string} [opt.bgBd=""] - 枠線
	 * @param {number} [opt.bgBdWidth=1] - 枠線の太さ
	 * @param {number | "max"} [opt.radius=0] - 丸角
	 * @param {number} [opt.angle=0] - 角度
	 * @param {"left" | "center" | "right"} [opt.boxAlign="left"] - 描画起点位置
	 * @param {"top" | "middle" | "bottom"} [opt.boxBaseLine="top"] - 描画起点位置
	 * @param {number} [opt.alpha=1] - 透明度
	 * @param {"origin" | "manual" | "max" | "min" | "width" | "height"} [opt.aspectType="width"] - アスペクト比計算方法
	 * @returns {Andesine.ImageBox}
	 */
	static ImageBox = class extends Andesine.Box {
		img = null;

		constructor({ ctx, layer = 0, parent = null, hiddenToDestroy = "off", mask = null, position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, bg = "", bgBd = "", bgBdWidth = 1, radius = 0, angle = 0, boxAlign = "left", boxBaseLine = "top", alpha = 1, aspectType = "width" } = {}) {
			super({ ctx, layer, parent, hiddenToDestroy, mask, position, size, bg, bgBd, bgBdWidth, radius, angle, boxAlign, boxBaseLine, alpha });

			this.aspectType = aspectType;
		}

		/**
		 * 画像の指定
		 * @param {object} [opt] - オプション
		 * @param {string} [opt.url] - URL
		 * @param {string} [opt.name] - 指定用名称
		 * @returns {Promise<InstanceType<typeof Andesine.ImageBox>>}
		 */
		setImage({ url, name = "" }) {
			return new Promise((resolve, reject) => {
				this.manager.asset
					.getImage({ url, name })
					.then((img) => {
						this.img = img;
						resolve(this);
					})
					.catch((e) => {
						this.bg = Andesine._ERROR_COLOR;
						reject(this);
					});
			});
		}

		draw() {
			if (super.draw()) {
				return true;
			}
			if (!this.img) {
				return false;
			}
			const ctx = this.ctx;
			const pos = this.relative();
			let sw = 0,
				sh = 0;
			const rect = this.rect;
			let af = "";
			switch (this.aspectType) {
				case "origin":
					sw = this.img.width;
					sh = this.img.height;
					break;
				case "manual":
					sw = rect.width;
					sh = rect.height;
					break;
				case "max":
					if (rect.width == rect.height) {
						if (this.img.width > this.img.height) {
							af = "width";
						} else {
							af = "height";
						}
					} else if (rect.width > rect.height) {
						af = "width";
					} else {
						af = "height";
					}
					break;
				case "min":
					if (rect.width == rect.height) {
						if (this.img.width < this.img.height) {
							af = "width";
						} else {
							af = "height";
						}
					} else if (rect.width < rect.height) {
						af = "width";
					} else {
						af = "height";
					}
					break;
				case "width":
				case "height":
					af = this.aspectType;
					break;
			}
			switch (af) {
				case "width":
					sw = rect.width;
					sh = rect.width * (this.img.height / this.img.width);
					break;
				case "height":
					sw = rect.height * (this.img.width / this.img.height);
					sh = rect.height;
					break;
			}
			rect.size.x = sw;
			rect.size.y = sh;

			let rad = this.radius;
			if (rad === "max") {
				rad = Math.min(sw, sh) / 2;
			}
			if (rad > 0) {
				// 丸角
				ctx.save();
				this.createRoundRectPath(ctx, ...pos.array, sw, sh, rad);
				ctx.clip();
			}
			const ds = this._cache_drawSizeScale;
			ctx.drawImage(this.img, pos.x * ds, pos.y * ds, sw * ds, sh * ds);
			if (rad > 0) {
				ctx.restore();
			}
			return false;
		}
	};

	// ####################################################################################################

	/**
	 * 待機
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {InstanceType<typeof Andesine.DrawObject>} [opt.parent] - 親オブジェクト
	 * @param {function():undefined} [opt.func] - コールバック
	 * @param {number} [opt.frameTime=1000] - 待機時間(fps)
	 * @returns {InstanceType<typeofAndesine.WaitObj>}
	 */
	createWait(opt) {
		return new Andesine.WaitObj(opt);
	}
	/**
	 * 待機
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {InstanceType<typeof Andesine.DrawObject>} [opt.parent] - 親オブジェクト
	 * @param {function():undefined} [opt.func] - コールバック
	 * @param {number} [opt.frameTime=1000] - 待機時間(fps)
	 * @returns {Andesine.WaitObj}
	 */
	static WaitObj = class extends Andesine.DrawObject {
		anim = 0;

		constructor({ parent = null, func, frameTime = 1000 }) {
			super({ parent });
			this.func = func;
			this.wait = frameTime;
		}

		update(skipCou) {
			this.anim += skipCou;
			if (this.anim > this.wait) {
				this.wait = Infinity;
				this.isDestroy = true;
				this.func?.();
			}
		}
	};

	// ####################################################################################################

	/**
	 * フォント
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {number} [opt.size=10] - サイズ
	 * @param {string[]} [opt.family=["sans-serif"]] - フォント名配列
	 * @param {"normal" | "italic" | "oblique"} [opt.style="normal"] - スタイル
	 * @param {"normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"} [opt.weight="normal"] - 太さ
	 * @returns {InstanceType<typeof Andesine.Font>}
	 */
	createFont(opt) {
		return new Andesine.Font(opt);
	}

	/**
	 * フォント
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {number} [opt.size=10] - サイズ
	 * @param {string[]} [opt.family=["sans-serif"]] - フォント名配列
	 * @param {"normal" | "italic" | "oblique"} [opt.style="normal"] - スタイル
	 * @param {"normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"} [opt.weight="normal"] - 太さ
	 * @returns {Andesine.Font}
	 */
	static Font = class {
		#size = 10;
		#family = ["sans-serif"];
		#style = "normal";
		#weight = "normal";

		#_cache_family = null;
		#_cache_font = null;
		#_cache_drawSizeScale = 1;

		constructor({ size = 10, family = ["sans-serif"], style = "normal", weight = "normal" } = {}) {
			this.size = size;

			this.family = family;
			this.style = style;
			this.weight = weight;
		}

		/**
		 * フォント作成(cache保存)
		 * @param {number} ds - 描画サイズスケール
		 * @returns {string}
		 */
		_createFont(ds) {
			let str = "";
			if (this.#style && this.#style !== "normal") {
				str = `${this.#style} `;
			}
			if (this.#weight && this.#weight !== "normal") {
				str += `${this.#weight} `;
			}
			str += `${this.#size * ds}px ${this.#_cache_family}`;
			this.#_cache_font = str;
			this.#_cache_drawSizeScale = ds;
			return str;
		}

		/**
		 * フォント文字列
		 * @returns {string}
		 */
		fontStr(ds = 1) {
			if (!this.#_cache_font || this.#_cache_drawSizeScale !== ds) {
				return this._createFont(ds);
			}
			return this.#_cache_font;
		}

		/**
		 * フォントサイズ
		 * @returns {number}
		 * @readonly
		 */
		get size() {
			return this.#size;
		}
		/**
		 * フォントサイズ
		 * @param {number} v - サイズ
		 */
		set size(v) {
			if (typeof v !== "number") {
				return;
			}
			this.#size = v;
			this._createFont();
		}

		/**
		 * フォントファミリー
		 * @returns {string[]}
		 * @readonly
		 */
		get family() {
			return this.#family;
		}
		/**
		 * フォントファミリー
		 * @param {string[]} v - フォント名配列
		 */
		set family(arr) {
			if (!Array.isArray(arr)) {
				return;
			}
			this.#family = arr;

			this.#_cache_family = arr.join(",");
			this._createFont();
		}

		/**
		 * フォントファミリー(文字列)
		 * @returns {string}
		 * @readonly
		 */
		get familyStr() {
			return this.#_cache_family;
		}

		/**
		 * フォントのスタイル
		 * @returns {"normal" | "italic" | "oblique"}
		 * @readonly
		 */
		get style() {
			return this.#style;
		}
		/**
		 * フォントのスタイル
		 * @param {"normal" | "italic" | "oblique"} v - スタイル
		 */
		set style(v) {
			if (typeof v !== "string") {
				return;
			}
			this.#style = v;
			this._createFont();
		}

		/**
		 * フォントの太さ
		 * @returns {"normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"}
		 * @readonly
		 */
		get weight() {
			return this.#weight;
		}
		/**
		 * フォントの太さ
		 * @param {"normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"} v - 太さ
		 */
		set weight(v) {
			if (typeof v !== "string") {
				return;
			}
			this.#weight = v;
			this._createFont();
		}
	};

	// ####################################################################################################

	/**
	 * アニメーション
	 * @memberof Andesine
	 * @param {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @param {object} [opt] - オプション
	 * @param {Andesine.Vector2 | null} [opt.position=null] - 終了座標(任意)
	 * @param {Andesine.Vector2 | null} [opt.size=null] - 終了サイズ(任意)
	 * @param {number | null} [opt.angle=null] - 終了角度(任意)
	 * @param {number | null} [opt.alpha=null] - 終了透明度(任意)
	 * @param {number} [opt.delay=0] - 開始までの待機時間(-で途中から開始可能)
	 * @param {number} [opt.frameTime=60] - 所要フレーム数
	 * @param {string} [opt.type="smooth"] - アニメーションタイプ (smooth | leap)
	 * @param {"set" | "add" | "addSet"} [opt.mode="add"] - 値の計算方法(add:[1->4]:4, addSet:[1->4]:1+2+3+4)
	 * @param {number | "infinite"} [opt.loop=1] - 繰り返し回数(infiniteの場合Promiseは解決されない)
	 * @param {function(number):undefined} [opt.callback] - 終了時コールバック
	 * @returns {Andesine.Animation}
	 */
	static Animation = class {
		#callback = null;
		#oldT = 0;

		isDestroy = false;
		objType = null;
		nowFrame = 0;

		constructor(_this, { position = null, size = null, angle = null, alpha = null, delay = 0, frameTime = 60, type = "smooth", mode = "add", loop = 1, callback } = {}) {
			this.animObj = _this;
			if (this.animObj instanceof Andesine.Box) {
				this.objType = "box";
			}
			this.mode = mode;
			switch (this.mode) {
				case "set":
					switch (this.objType) {
						case "box":
							this.startPosition = this.animObj.rect.position.clone();
							this.startSize = this.animObj.rect.size.clone();
							break;
						default:
							this.startPosition = Andesine.Vector2.zero;
							this.startSize = Andesine.Vector2.zero;
					}

					this.startAngle = this.animObj.angle;
					this.startAlpha = this.animObj.alpha;
					break;
				case "add":
				case "addSet":
					this.startPosition = Andesine.Vector2.zero;
					this.startSize = Andesine.Vector2.zero;
					this.startAngle = 0;
					this.startAlpha = 0;
			}
			this.position = Andesine.Vector2.convert(position);
			this.size = Andesine.Vector2.convert(size);
			this.angle = angle;
			this.alpha = alpha;
			//
			if (loop === "infinite") {
				loop = Infinity;
			}
			this.nowLoop = loop;
			//
			this.frameTime = frameTime;
			this.type = type;
			this.#callback = callback;

			this.nowFrame = -delay;
		}

		/**
		 * フレームごと実行
		 * @param {number} [addFrame=1] - フレーム増加量
		 * @returns {undefined}
		 */
		update(addFrame = 1) {
			if (this.isDestroy) {
				return;
			}
			this.nowFrame += addFrame;
			if (this.nowFrame < 0) {
				return;
			}
			let t = 1;
			if (this.nowFrame < this.frameTime) {
				t = this.nowFrame / this.frameTime;
			}
			let functionType;
			switch (this.mode) {
				case "set":
					functionType = "set";
					break;
				case "add":
				case "addSet":
					functionType = "add";
					break;
			}
			if (this.position != null) {
				const pos = this.#calcVectorAnim(this.startPosition, this.position, t);
				switch (this.objType) {
					case "box":
						this.animObj.rect.position[functionType](pos);
						break;
				}
			}
			if (this.size != null) {
				const size = this.#calcVectorAnim(this.startSize, this.size, t);
				switch (this.objType) {
					case "box":
						this.animObj.rect.size[functionType](size);
						break;
				}
			}
			if (this.angle != null) {
				const angle = this.#calcValueAnim(this.startAngle, this.angle, t);
				switch (this.mode) {
					case "set":
						this.animObj.angle = angle;
						break;
					case "add":
					case "addSet":
						this.animObj.angle += angle;
				}
			}
			if (this.alpha != null) {
				const alpha = this.#calcValueAnim(this.startAlpha, this.alpha, t);
				switch (this.mode) {
					case "set":
						this.animObj.alpha = alpha;
						break;
					case "add":
					case "addSet":
						this.animObj.alpha += alpha;
						break;
				}
			}
			this.#oldT = t;
			if (this.nowFrame >= this.frameTime) {
				this.isDestroy = true;
				this.#_finish(addFrame);
				return;
			}
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
		 * @param {function():undefined} [callback] - 終了時コールバック(再設定する場合)
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
		 * @param {number} [addFrame=0] - フレーム増加量
		 * @returns {undefined}
		 * @private
		 */
		#_finish(addFrame = 0) {
			if (addFrame !== 0) {
				this.update(0);
			}
			const diff = this.nowFrame - this.frameTime;
			this.nowFrame = -Infinity;

			this.#callback?.(diff);
			this.#callback = null;
		}

		/**
		 * ベクトルアニメーション計算
		 * @param {InstanceType<typeof Andesine.Vector2>} start - 開始座標
		 * @param {InstanceType<typeof Andesine.Vector2>} end - 終了座標
		 * @param {number} t - 進捗率(0~1)
		 * @param {boolean} [f=true] - 内部計算用
		 * @returns {InstanceType<typeof Andesine.Vector2>} - 結果座標
		 * @private
		 */
		#calcVectorAnim(start, end, t, f = true) {
			let pos = null;
			switch (this.type) {
				case "smooth":
					pos = Andesine.Vector2.smoothDamp(start, end, t);
					break;
				case "leap":
					pos = Andesine.Vector2.leap(start, end, t);
					break;
			}
			if (f && this.mode === "add") {
				pos.sub(this.#calcVectorAnim(start, end, this.#oldT, false));
			}
			return pos;
		}

		/**
		 * 数値アニメーション計算
		 * @param {number} start - 開始値
		 * @param {number} end - 終了値
		 * @param {number} t - 進捗率(0~1)
		 * @param {boolean} [f=true] - 内部計算用
		 * @returns {number} - 結果値
		 * @private
		 */
		#calcValueAnim(start, end, t, f = true) {
			let val = null;
			switch (this.type) {
				case "smooth":
					val = Jasc.animationSmoothDamp(start, end, t);
				case "leap":
					val = Jasc.animationLeap(start, end, t);
			}
			if (f && this.mode === "add") {
				val -= this.#calcValueAnim(start, end, this.#oldT, false);
			}
			return val;
		}

		/**
		 * アニメーション作成
		 * @param {InstanceType<typeof Andesine.DrawObj>} drawObj - 描画オブジェクト
		 * @param {number} diffFrame - 延長フレーム
		 * @param {object} opt - オプション
		 * @returns {Promise<InstanceType<typeof Andesine.AnimationEvent>>}
		 * @static
		 */
		static createAnimation(drawObj, diffFrame = 0, opt) {
			let { name, callback } = opt;
			if (!name) {
				name = Jasc.setAssociativeAutoName(drawObj._animationPromiseData, null, "andesine");
			}
			if (drawObj._animationObjData[name]) {
				drawObj._animationObjData[name].stop(true);
			}
			let _callback = null;
			if (typeof callback === "function") {
				_callback = callback;
			}

			const pro = new Promise((resolve) => {
				const setting = Jasc.deepCopy(opt, { cloneClass: true });
				setting.delay = (setting.delay ?? 0) - diffFrame;
				setting.callback = function (diffFrame) {
					delete drawObj._animationObjData[name];
					delete drawObj._animationPromiseData[name];
					drawObj._checkChangeObject();
					const data = new Andesine.AnimationEvent({
						drawObj: drawObj,
						diffFrame,
					});
					resolve(data);
					_callback?.(data);
				};
				drawObj._animationObjData[name] = new Andesine.Animation(drawObj, setting);
			});
			drawObj._animationPromiseData[name] = pro;
			return pro;
		}

		/**
		 * createListAnimationを共通作成する用
		 * @param {InstanceType<typeof Andesine.DrawObj>} drawObj - 描画オブジェクト
		 * @param {number} diffFrame - 延長フレーム
		 * @param {...Object} args - 設定データ
		 * @returns {Promise<InstanceType<typeof Andesine.AnimationEvent>>} 1つ目のアニメーションのイベント
		 * @static
		 */
		static createListAnimation(drawObj, diffFrame = 0, ...args) {
			if (args.length === 1 && Array.isArray(args[0])) {
				args = args[0];
			}
			let cb = null;
			for (let i = args.length - 1; i >= 0; i--) {
				cb = createCallback(args[i], cb);
			}

			return cb(
				new Andesine.AnimationEvent({
					drawObj,
					diffFrame,
				})
			);

			function createCallback(arg, callback) {
				if (typeof arg === "function") {
					if (callback) {
						return (e) => {
							arg(e);
							return callback(e);
						};
					} else {
						return arg;
					}
				} else if (Jasc.isAssociative(arg)) {
					return (e) => {
						const setting = Jasc.deepCopy(arg);
						// いらない
						//setting.delay = (setting.delay ?? 0) - (e.diffFrame ?? 0);
						setting.callback = callback;
						return e.createAnimation(setting);
					};
				}
			}
		}
	};

	// ####################################################################################################

	static AnimationEvent = class {
		#_target;

		constructor({ drawObj, diffFrame = 0 }) {
			this.#_target = drawObj;
			this.diffFrame = diffFrame;
		}

		/**
		 * アニメーション対象取得
		 * @returns {InstanceType<typeof Andesine.DrawObject>} 対象
		 * @readonly
		 */
		get target() {
			return this.#_target;
		}

		/**
		 * アニメーション作成
		 * @param {object} [opt] - オプション
		 * @param {string} [opt.name] - アニメーション名(外部参照用)
		 * @param {number | null} [opt.alpha=null] - 終了透明度(任意)
		 * @param {number} [opt.delay=0] - 開始までの待機時間(-で途中から開始可能)
		 * @param {number} [opt.frameTime=60] - 所要フレーム数
		 * @param {"smooth" | "leap"} [opt.type="smooth"] - 動作の種類
		 * @param {"set" | "add" | "addSet"} [opt.mode="add"] - 値の計算方法(add:[1->4]:4, addSet:[1->4]:1+2+3+4)
		 * @param {number | "infinite"} [opt.loop=1] - 繰り返し回数(infiniteの場合Promiseは解決されない)
		 * @param {function(InstanceType<typeof Andesine.AnimationEvent>):undefined} [opt.callback=null] - コールバック関数(通常時はpromiseを推奨)
		 * @returns {Promise<InstanceType<typeof Andesine.AnimationEvent>>}
		 */
		createAnimation(opt) {
			return Andesine.Animation.createAnimation(this.#_target, this.diffFrame, opt);
		}

		/**
		 * 連続アニメーション作成
		 * @param {...Object} args - 設定データ
		 * @returns {Promise<InstanceType<typeof Andesine.AnimationEvent>>}
		 */
		createListAnimation(...args) {
			return Andesine.Animation.createListAnimation(this.#_target, this.diffFrame, ...args);
		}
	};

	// ####################################################################################################

	/**
	 * マスクの生成
	 * @param {Object} [opt]
	 * @param {number[] | InstanceType<typeof Andesine.Vector2>} [opt.position] - マスクの位置(相対)
	 * @param {number | number[] | string[] | InstanceType<typeof Andesine.Vector2>} [opt.size] - マスクのサイズ
	 * @param {boolean} [opt.isCircle] - 円形で処理するか(circleモード)
	 * @param {number} [opt.startAngle=0] - 開始角度
	 * @param {number} [opt.endAngle=Andesine.TAU] - 終了角度
	 * @param {boolean} [opt.counterclockwise=false] - false:時計回り true:反時計回り
	 * @param {function(this,ctx):undefined} [opt.pathFunc] - マスクの境界処理用の代替関数
	 * @returns {InstanceType<typeof Andesine.Mask>}
	 */
	static createMask(opt) {
		return new Andesine.Mask(opt);
	}

	/**
	 * マスク
	 * @memberof Andesine
	 * @param {Object} [opt]
	 * @param {number[] | InstanceType<typeof Andesine.Vector2>} [opt.position] - マスクの位置(相対)
	 * @param {number | number[] | string[] | InstanceType<typeof Andesine.Vector2>} [opt.size] - マスクのサイズ
	 * @param {boolean} [opt.isCircle] - 円形で処理するか(circleモード)
	 * @param {number} [opt.startAngle=0] - 開始角度
	 * @param {number} [opt.endAngle=Andesine.TAU] - 終了角度
	 * @param {boolean} [opt.counterclockwise=false] - false:時計回り true:反時計回り
	 * @param {function(this,CanvasRenderingContext2D,InstanceType<typeof Andesine.Vector2>):undefined} [opt.pathFunc] - マスクの境界処理用の代替関数
	 * @returns {Andesine.Mask}
	 */
	static Mask = class {
		#_parent = null;

		setting = {};

		constructor({ position = Andesine.Vector2.zero, size = Andesine.Vector2.zero, isCircle = false, startAngle = 0, endAngle = Andesine.TAU, counterclockwise = false, pathFunc = null } = {}) {
			// マスクの種類
			let type = "rect";
			if (isCircle) {
				type = "circle";
			} else if (pathFunc !== null) {
				type = "path";
			}
			this.type = type;

			this.setting.size = size;
			if (this.type === "rect") {
				this.rect = new Andesine.Rectangle(position, this._updateSize(false));
			} else if (this.type === "circle") {
				this.circle = new Andesine.Circle({
					xy: position,
					radius: size,
					startAngle,
					endAngle,
					counterclockwise,
				});
			} else if (this.type === "path") {
				this.func = pathFunc;
			}
		}

		/**
		 * マスクをクリップする
		 * @param {CanvasRenderingContext2D} ctx
		 * @param {InstanceType<typeof Andesine.Vector2>} pos
		 * @returns {undefined}
		 */
		clip(ctx, pos) {
			ctx.beginPath();
			switch (this.type) {
				case "rect":
					ctx.rect(pos.x + this.rect.x, pos.y + this.rect.y, this.rect.width, this.rect.height);
					break;
				case "circle":
					const w = this.circle.radiusW;
					const h = this.circle.radiusH;
					const x = pos.x + this.circle.position.x + w;
					const y = pos.y + this.circle.position.y + h;
					if (this.circle.isEllipse) {
						ctx.ellipse(x, y, w, h, 0, this.circle.startAngle, this.circle.endAngle, this.circle.counterclockwise);
					} else {
						ctx.arc(x, y, w, this.circle.startAngle, this.circle.endAngle, this.circle.counterclockwise);
					}
					break;
				case "path":
					this.func?.(this, ctx, pos);
					break;
			}
			ctx.clip();
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
					switch (this.type) {
						case "rect":
							this.rect.width = size.x;
							this.rect.height = size.y;
							break;
						case "circle":
							this.circle.radius = size;
							break;
					}
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
			const pos = this.parent?.rect.size ?? Andesine.Vector2.MAX_VECTOR;
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
				switch (this.type) {
					case "rect":
						this.rect.width = v.x;
						this.rect.height = v.y;
						break;
					case "circle":
						this.circle.radius = v;
						break;
				}
			}
			return v;
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
				this._updateSize();
			} else if (parent === null) {
				this.#_parent = null;
			} else {
				console.warn("親オブジェクト指定エラー");
			}
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
		 * @readonly
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

		/**
		 * 絶対座標を取得
		 * @param {boolean} [toCanvas=false] - キャンバス単位で取得(falseなら最上位キャンバスからの絶対座標)
		 * @returns {InstanceType<typeof Andesine.Vector2> | null}
		 */
		relative(toCanvas = false) {
			const t = this.target;
			if (t.relative) {
				return t.relative(toCanvas);
			}
			return null;
		}

		/**
		 * キャンバスオブジェクトを取得する
		 * @returns {InstanceType<typeof Andesine._Canvas>}
		 * @readonly
		 */
		get canvasObject() {
			return this.target.canvasObject;
		}

		/**
		 * 最上位キャンバスオブジェクトを取得する
		 * @returns {InstanceType<typeof Andesine._Canvas>}
		 * @readonly
		 */
		get topCanvasObject() {
			return this.target.topCanvasObject;
		}

		/**
		 * カーソルを設定
		 * @param {string} cursor
		 * @returns {undefined}
		 */
		setCursor(cursor) {
			this.topCanvasObject.setCursor(cursor);
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
		#_isThisEnable = null;

		constructor(_this, es, deepList) {
			super(_this);
			this._es = es;
			this.#_deepList = deepList.slice();
		}

		/**
		 * タッチイベントリストを取得
		 * @returns {Object[]}
		 * @readonly
		 */
		get eventList() {
			return this._es;
		}

		/**
		 * タッチタイプを取得
		 * @returns {"mouse" | "touch"}
		 * @readonly
		 */
		get touchType() {
			return this._es[0].type;
		}

		get isThisEnable() {
			if (this.#_isThisEnable !== null) {
				return this.#_isThisEnable;
			}
			this.#_isThisEnable = false;
			for (const d of this.#_deepList) {
				if (d == 0) {
					this.#_isThisEnable = true;
					break;
				}
			}
			return this.#_isThisEnable;
		}

		/**
		 * 指定の深さまでのイベントを取得
		 * @param  {number} [deep=0] - 深さ
		 * @returns {Object[]}
		 */
		getDeepList(deep = 0) {
			const list = [];
			this.#_deepList.forEach((d, i) => {
				if (d <= deep) {
					list.push(this._es[i]);
				}
			});
			return list;
		}
	};

	// ==================================================

	/**
	 * ゲームタッチスタートイベント
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @param  {Object[]} es - タッチイベントリスト
	 * @param  {number[]} deepTouch - タッチ中の深さ
	 * @returns {Andesine.GameTouchStartEvent}
	 */
	static GameTouchStartEvent = class extends Andesine.GameTouchEvent {
		// 継承するだけ
	};

	/**
	 * ゲームホバーイベント
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @param  {Object[]} es - タッチイベントリスト
	 * @param  {boolean} isNewHoverEvent - 新規ホバーイベントか
	 * @param  {number[]} deepHover - ホバー中の深さ
	 * @returns {Andesine.GameHoverEvent}
	 */
	static GameHoverEvent = class extends Andesine.GameTouchEvent {
		constructor(_this, es, deepHover, isNewHoverEvent = true) {
			super(_this, es, deepHover);
			this.isNewHoverEvent = isNewHoverEvent;
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
		// 継承するだけ
	};

	// ==================================================

	/**
	 * ゲームリセットイベント
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @returns {Andesine.GameResettingEvent}
	 */
	static GameResettingEvent = class extends Andesine.GameEvent {
		// 継承するだけ
	};

	/**
	 * ゲーム更新イベント
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @returns {Andesine.GameUpdateEvent}
	 */
	static GameUpdateEvent = class extends Andesine.GameEvent {
		// 継承するだけ
	};

	/**
	 * ゲーム描画イベント
	 * @memberof Andesine
	 * @param  {InstanceType<typeof Andesine.DrawObject>} _this - 対象オブジェクト
	 * @returns {Andesine.GameDrawEvent}
	 */
	static GameDrawEvent = class extends Andesine.GameEvent {
		// 継承するだけ
	};

	/**
	 *
	 */
	static GameChangeEvent = class extends Andesine.GameEvent {
		// 継承するだけ
	};

	// ####################################################################################################

	/**
	 * キャンバスデータ保存用
	 * @memberof Andesine
	 * @param {HTMLCanvasElement} canvas - キャンバス
	 * @returns {Andesine._Canvas}
	 */
	static _Canvas = class {
		#_manager;
		#parentCanvas = null;
		#children = {};
		#layerList = [];

		#_event_name = "andesine_canvas";

		#_cache_size;
		#_nowQuality = "__NONE__";
		#nowScale = 1;

		defaultCursor = "default";
		#displayCursor = null;

		#_cache_event_touchStart = null;
		#_cache_event_hover = null;
		#_isNewHoverEvent = false;
		#_cache_event_click = null;

		/**
		 * 描画サイズスケール
		 * @type {number}
		 * @readonly
		 */
		drawSizeScale = 1;

		constructor(canvas) {
			this.canvas = canvas;

			this.#setEvent();
		}

		/**
		 * イベント設定
		 * @param {boolean} remove - イベント解除
		 * @returns {undefined}
		 * @private
		 */
		#setEvent(remove = false) {
			let ev_name = this.#_event_name;
			if (remove) {
				jasc.offEx("touchstart", ev_name);
				jasc.offEx("touchmove", ev_name);
				jasc.offEx("touchend", ev_name);
				return;
			}
			const canvas = this.canvas;
			ev_name = jasc.onEx("touchstart", (es) => (this.#_cache_event_touchStart = setPos(es, canvas)), canvas, ev_name, true);
			jasc.onEx(
				"touchmove",
				(es) => {
					this.#_cache_event_hover = setPos(es, canvas);
					this.#_isNewHoverEvent = true;
				},
				canvas,
				ev_name
			);
			jasc.onEx("touchend", (es) => (this.#_cache_event_click = setPos(es, canvas)), canvas, ev_name);

			this.#_event_name = ev_name;
			return;
			function setPos(es, canvas) {
				const rect = canvas.getBoundingClientRect();
				es.forEach((e) => {
					e.pos = new Andesine.Vector2(e.clientX - rect.left, e.clientY - rect.top);
				});
				return es;
			}
		}

		get manager() {
			return this.#_manager;
		}

		set manager(manager) {
			if (this.#_manager) {
				throw new Error("already set manager");
			}
			if (manager instanceof Andesine.GameManager) {
				this.#_manager = manager;
			}
		}

		/**
		 * クオリティレベルの更新
		 * @param {string} - クオリティ
		 * @returns {undefined}
		 */
		_updateQuality(quality) {
			if (this.#_nowQuality === quality) {
				return;
			}
			this.#_nowQuality = quality;

			const ctx = this.canvas.getContext("2d");

			let scale = 1,
				imageSmoothingEnabled = true,
				imageSmoothingQuality = "low",
				textRendering = "auto";
			switch (quality) {
				case "potato":
					imageSmoothingEnabled = false;
					textRendering = "optimizeSpeed";
					break;
				case "low":
					break;
				case "medium":
					imageSmoothingQuality = "medium";
					break;
				case "high":
					imageSmoothingQuality = "high";
					textRendering = "optimizeLegibility";
					break;
				case "ultra":
					scale = 2;
					imageSmoothingQuality = "medium";
					textRendering = "optimizeSpeed";
					break;
				case "extreme":
					scale = 2;
					imageSmoothingQuality = "high";
					textRendering = "optimizeLegibility";
					break;
				case "abnormality":
					scale = 4;
					imageSmoothingQuality = "high";
					textRendering = "optimizeLegibility";
					break;
			}

			ctx.imageSmoothingEnabled = imageSmoothingEnabled;
			ctx.imageSmoothingQuality = imageSmoothingQuality;
			ctx.textRendering = textRendering;

			const factor = scale / this.#nowScale;
			if (factor !== 1) {
				this.canvas.width *= factor;
				this.canvas.height *= factor;
				const dpr = window.devicePixelRatio || 1;
				ctx.scale(dpr, dpr);
				this.#nowScale = scale;
				this.drawSizeScale = scale;
				this.resetting();
			}
		}

		/**
		 * レイヤーリストを更新
		 * @returns {undefined}
		 */
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
			for (const name of this.#layerList) {
				count += this.#children[name].releaseResources();
			}
			return count;
		}

		/**
		 * 全体描画オブジェクトのリセット
		 * @param {boolean} [isReScale=true] - スケールを再設定するか
		 * @returns {undefined}
		 */
		resetting(isReScale = false) {
			if (isReScale) {
				if (this.#nowScale) {
					const ctx = this.canvas.getContext("2d");
					this.canvas.width *= this.#nowScale;
					this.canvas.height *= this.#nowScale;
					const dpr = window.devicePixelRatio || 1;
					ctx.scale(dpr, dpr);
				}
			}
			this.#_cache_size = null;
			this.#_cache_event_hover = null;
			for (const name of this.#layerList) {
				this.#children[name]._systemResetting();
			}
		}

		/**
		 * 全体オブジェクト更新ループ
		 * @param {number} [gcf=1] - ゲーム内時間(フレーム)
		 * @returns {undefined}
		 */
		_update(gcf) {
			const es = {
				gcf,
			};
			const deeps = {};
			if (this.#_cache_event_touchStart) {
				es.touchStart = {
					event: this.#_cache_event_touchStart,
				};
				deeps.touchStart = Array.from(this.#_cache_event_touchStart.length).fill(0);
				this.#_cache_event_touchStart = null;
			}
			if (this.#_cache_event_hover) {
				es.hover = {
					event: this.#_cache_event_hover,
					isNew: this.#_isNewHoverEvent,
				};
				deeps.hover = Array.from(this.#_cache_event_hover.length).fill(0);
				this.#_isNewHoverEvent = false;
			}
			if (this.#_cache_event_click) {
				es.click = {
					event: this.#_cache_event_click,
				};
				deeps.click = Array.from(this.#_cache_event_click.length).fill(0);
				this.#_cache_event_click = null;
			}

			let count = 0;
			for (const name of this.#layerList) {
				count += this.#children[name]._systemUpdate(es, deeps, 1, false);
			}
			return count;
		}

		/**
		 * 全体描画ループ
		 * @returns {undefined}
		 */
		_draw() {
			if (this.#displayCursor) {
				this.canvas.style.cursor = this.#displayCursor;
				if (this.#displayCursor === this.defaultCursor) {
					this.#displayCursor = null;
				} else {
					this.#displayCursor = this.defaultCursor;
				}
			}

			let count = 0;
			for (const name of this.#layerList) {
				count += this.#children[name]._systemDraw();
			}
			return count;
		}

		/**
		 * キャンバスサイズ
		 * @returns {InstanceType<typeof Andesine.Rectangle>}
		 * @readonly
		 */
		get size() {
			if (this.#_cache_size) {
				return this.#_cache_size.clone();
			}
			const size = jasc.game.getCanvasSize(this.canvas);
			const rect = new Andesine.Rectangle([0, 0], [size.width, size.height]);
			this.#_cache_size = rect.clone();
			return rect;
		}

		/**
		 * 描画オブジェクトを追加
		 * @param {InstanceType<typeof Andesine.DrawObject>} child
		 * @param {string} [name=""]
		 * @returns {string} 設定されたオブジェクト名
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
			child.manager = this.#_manager;
			child.canvasObject = this;
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
			//TODO: 実装方法を考えておく
			throw new Error("Not Implemented");
		}

		/**
		 * 子オブジェクト数を取得
		 * @returns {number}
		 */
		get childLength() {
			return this.#layerList.length;
		}

		/**
		 * 親キャンバス取得
		 * @returns {InstanceType<typeof Andesine._Canvas> | null}
		 * @readonly
		 */
		get parentCanvas() {
			return this.#parentCanvas;
		}

		/**
		 * 親キャンバス追加(システム用)
		 * @param {InstanceType<typeof Andesine._Canvas> | null} canvas
		 * @returns {undefined}
		 */
		_setParentCanvas(canvas) {
			if (canvas instanceof Andesine._Canvas) {
				this.#parentCanvas = canvas;
				this.#setEvent(true);
			} else if (canvas == null) {
				this.#parentCanvas = null;
				this.#setEvent();
			} else {
				console.warn("親キャンバス指定エラー");
				return;
			}
			this.manager._updateDeepsList();
		}

		/**
		 * キャンバス内キャンバスか
		 * @returns {boolean}
		 * @readonly
		 */
		get isInner() {
			return !!this.#parentCanvas;
		}

		/**
		 * キャンバス深度取得
		 * @returns {number}
		 * @readonly
		 */
		get deeps() {
			const par = this.#parentCanvas;
			if (par) {
				return par.deeps + 1;
			}
			return 0;
		}

		/**
		 * カーソルを設定
		 * @param {string} cursor
		 * @returns {undefined}
		 */
		setCursor(cursor) {
			if (typeof cursor === "string" && cursor !== this.defaultCursor) {
				this.#displayCursor = cursor;
			}
		}
	};

	// ####################################################################################################

	/**
	 * ゲームマネージャーを作成
	 * @param {object} [opt] - オプション
	 * @param {boolean} [opt.debug] - デバッグログを使用するか
	 * @param {boolean} [opt.useGC] - 独自GCを使用するか
	 * @param {"potato" | "low" | "medium" | "high" | "ultra" | "extreme" | "abnormality"} [opt.quality] - クオリティ
	 * @returns {InstanceType<typeof Andesine.GameManager>}
	 * @static
	 */
	static createGameManager(opt) {
		return new Andesine.GameManager(opt);
	}
	/**
	 * ゲームマネージャー
	 * @memberof Andesine
	 * @param {object} [opt] - オプション
	 * @param {boolean} [opt.debug] - デバッグログを使用するか
	 * @param {boolean} [opt.useGC] - 独自GCを使用するか
	 * @param {"potato" | "low" | "medium" | "high" | "ultra" | "extreme" | "abnormality"} [opt.quality] - クオリティ
	 * @returns {Andesine.GameManager}
	 */
	static GameManager = class {
		#canvasDict = {};
		#assetManager;
		#_deepsList = [];
		#logger;
		#quality = "high";

		drawObjCount = 0;
		objCount = 0;

		_gameClockFrame = 0;

		constructor({ debug = false, useGC = true, quality = "high" } = {}) {
			this.#assetManager = new Jasc.AssetsManager();
			this.#logger = new Jasc.ConsoleCustomLog({
				prefix: "andesine",
				debug: debug,
			});

			const _this = this;
			if (useGC) {
				const game = jasc.readonly.game;
				jasc.on("gameSecondUpdate", (gameData) => {
					// 軽量化処理(gc)
					if (gameData.isOverFrame || gameData.nowFps < game.maxFps >> 2) {
						const rCou = _this.releaseResources();
						if (rCou > 0) {
							_this.#logger.log(`[GC]release: ${rCou}`, "data");
						}
					}
				});
			}

			this.quality = quality;
		}

		/**
		 * 深度リストを更新
		 * @returns {undefined}
		 */
		_updateDeepsList() {
			const dict = this.#canvasDict;
			const keys = Object.keys(dict);
			keys.sort((a, b) => {
				return dict[b].deeps - dict[a].deeps;
			});
			this.#_deepsList = keys;
		}

		/**
		 * クオリティレベルの取得
		 * @returns {"potato" | "low" | "medium" | "high" | "ultra" | "extreme" | "abnormality"}
		 * @readonly
		 */
		get quality() {
			return this.#quality;
		}

		/**
		 * クオリティレベルの設定
		 * @param {"potato" | "low" | "medium" | "high" | "ultra" | "extreme" | "abnormality"} - クオリティ
		 */
		set quality(quality) {
			quality = quality.toLowerCase();
			switch (quality) {
				case "potato":
				case "low":
				case "medium":
				case "high":
				case "ultra":
				case "extreme":
				case "abnormality":
					this.#quality = quality;
					break;
			}
			this._updateQuality();
		}

		/**
		 * クオリティレベルの適用
		 * @returns {undefined}
		 */
		_updateQuality() {
			const quality = this.quality;
			this.#_deepsList.forEach((key) => {
				this.#canvasDict[key]._updateQuality(quality);
			});
		}

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
		 * 使用されていない変数域を解放
		 * @returns {number} 解放した数
		 */
		releaseResources() {
			let count = 0;
			this.#_deepsList.forEach((key) => {
				count += this.#canvasDict[key].releaseResources();
			});
			return count;
		}

		/**
		 * 全体描画オブジェクトのリセット
		 * @param {boolean} [isReScale=true] - スケールを再設定するか
		 * @returns {undefined}
		 */
		resetting(isReScale = false) {
			this.#_deepsList.forEach((key) => {
				this.#canvasDict[key].resetting(isReScale);
			});
		}
		/**
		 * 全体オブジェクト更新ループ
		 * @returns {undefined}
		 */
		update() {
			this._gameClockFrame += 1;
			if (this._gameClockFrame > Andesine._CLOCK_MAX_FRAME) {
				this._gameClockFrame = 0;
			}
			const gcf = this._gameClockFrame;
			let count = 0;
			this.#_deepsList.forEach((key) => {
				count += this.#canvasDict[key]._update(gcf);
			});
			this.objCount = count;
		}

		/**
		 * 全体描画ループ
		 * @param {boolean} [isDraw] - 描画するか
		 * @returns {undefined}
		 */
		draw(isDraw) {
			if (!isDraw) {
				return;
			}
			let count = 0;
			this.#_deepsList.forEach((key) => {
				count += this.#canvasDict[key]._draw(isDraw);
			});
			this.drawObjCount = count;
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
		 * @param {InstanceType<typeof Andesine._Canvas>} [parent] - 親
		 * @returns {string}
		 */
		_addCanvas(canvas, parent = null) {
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
			obj.manager = this;
			if (parent) {
				obj._setParentCanvas(parent);
			} else {
				this._updateDeepsList();
			}
			obj._updateQuality(this.#quality);
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
			if (name instanceof CanvasRenderingContext2D) {
				name = name.canvas;
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

		/**
		 * アセット管理
		 * @returns {InstanceType<typeof Jasc.AssetManager>}
		 * @readonly
		 */
		get asset() {
			return this.#assetManager;
		}

		/**
		 * ログ管理
		 * @returns {InstanceType<typeof Jasc.ConsoleCustomLog>}
		 * @readonly
		 */
		get logger() {
			return this.#logger;
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
					value.forEach((v) => {
						list.push(toString(v, nesting - 1));
					});
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

		/**
		 * フレームスキップを実行
		 * @param {InstanceType<typeof Andesine.DrawObject>} _this - オブジェクト
		 * @param {number} skipCou - スキップ回数
		 * @param {number} gcf - gameClockFrame
		 * @returns {number} - スキップしたフレーム数
		 * @private
		 */
		static calcDoFrame(_this, skipCou, gcf) {
			if (_this._cache_gcf == null) {
				_this._cache_gcf = gcf - 1;
			}

			if (skipCou <= Andesine.MAX_SKIP_FRAME) {
				const nsf = _this._nextSkipFrame;
				if (nsf > 1 || _this._skipCounter) {
					const sc = _this._skipCounter++;
					if (sc === 0) {
						_this._cache_nsf = nsf;
					}
					if (sc % _this._cache_nsf !== 0) {
						return 0;
					} else if (sc !== 0) {
						_this._skipCounter = 0;
					}
				}
			}
			const skipFrameCou = this.diffClockFrame(gcf, _this._cache_gcf);
			_this._cache_gcf = gcf;
			return skipFrameCou;
		}

		/**
		 * clockFrameの差分を正常に計算する為の関数
		 * @param {number} a
		 * @param {number} b
		 * @returns {number}
		 * @private
		 */
		static diffClockFrame(a, b) {
			if (a < b) {
				a += Andesine._CLOCK_MAX_FRAME;
			}
			return a - b;
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

	// ####################################################################################################

	// 計算用キャッシュ
	static _CACHE_VEC2_ZERO = Andesine.Vector2.zero;
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
