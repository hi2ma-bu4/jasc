/*
Gitrine.pass(num)
//データ保存時使用パスワード
Gitrine.save(id"str",data"str",bool)
//データの保存
Gitrine.load(id"str")
//データの呼出し
Gitrine.del(id"str")
//データの削除
*/

/**
 * gitrineインスタンス
 * @class gitrine
 * @classdesc localStorage圧縮保存ライブラリ
 * @returns {gitrine}
 */
var Gitrine = (function () {
	let password = 1;
	let ciwordSet = false;
	/**
	 * gitrineライブラリ
	 * @returns {gitrine}
	 */
	function gitrine() {
		if (typeof Beryl != "object") {
			console.error("ライブラリ: Beryl.js が見つかりませんでした");
		}
		if (typeof Zircon != "object") {
			console.error("ライブラリ: Zircon.js が見つかりませんでした");
		}

		//thisのバインド
		this.pass = this.pass.bind(this);
		this.characteristic = this.characteristic.bind(this);
	}

	gitrine.prototype = {
		/**
		 * データ保存時使用パスワード
		 * @param {number} id - データ保存時のパスワード
		 * @returns {0|1}
		 */
		pass(id) {
			password = id;

			this.pass = () => {
				console.error("パスワードは重複設定出来ません");
				return 1;
			};
			return 0;
		},
		/**
		 * 名称
		 * @param {string} name - 名称
		 * @returns {0|1}
		 */
		characteristic(name) {
			ciwordSet = true;
			Object.defineProperty(this, "ciword", {
				value: name + "_",
				writable: false,
			});

			this.characteristic = () => {
				console.error("名称は重複設定出来ません");
				return 1;
			};
			return 0;
		},
		/**
		 * データの保存
		 * @param {string} id - データ保存時の名称
		 * @param {string} data - データ
		 * @param {boolean} [type=true] - 暗号化するか
		 * @returns {0|1}
		 */
		save(id, data, type = true) {
			if (!ciwordSet) {
				console.error("名称を先に指定して下さい");
				return 1;
			}
			let tmp;
			let flag;
			if (type) {
				tmp = Zircon.encode(data, password);
				flag = "t";
			} else {
				tmp = Beryl.compress(data, false);
				flag = "f";
			}

			localStorage.setItem(this.ciword + id + "_" + flag, LZString.compressToUTF16(tmp));
			return 0;
		},
		/**
		 * データの呼出し
		 * @param {string} id - データ保存時の名称
		 * @returns {string} データ
		 * @returns {string|null} 結果
		 */
		load(id) {
			if (!ciwordSet) {
				console.error("名称を先に指定して下さい");
				return null;
			}
			let tmp = LZString.decompressFromUTF16(localStorage.getItem(this.ciword + id + "_t"));
			if (tmp) {
				return Zircon.decode(tmp, password);
			}
			tmp = LZString.decompressFromUTF16(localStorage.getItem(this.ciword + id + "_f"));
			if (tmp) {
				return Beryl.decompress(tmp);
			}
			return null;
		},
		/**
		 * データの削除
		 * @param {string} id - データ保存時の名称
		 * @returns {0|1}
		 */
		del(id) {
			if (!ciwordSet) {
				console.error("名称を先に指定して下さい");
				return 1;
			}
			delete localStorage[this.ciword + id + "_t"];
			delete localStorage[this.ciword + id + "_f"];
			return 0;
		},
		/*
		allLoad() {
			if (!ciwordSet) {
				console.error("名称を先に指定して下さい");
				return;
			}
			let tmpArr = {};
			for (let key in localStorage) {
				if (!key.indexOf(this.ciword)) {
					let tmp = key.slice(this.ciword.length).slice(0, -2);
					tmpArr[tmp] = this.load(tmp);
				}
			}
			return tmpArr;
		},
		*/
		/**
		 * 全データの削除
		 * @returns {0|1}
		 */
		allDel() {
			if (!ciwordSet) {
				console.error("名称を先に指定して下さい");
				return 1;
			}
			for (let key in localStorage) {
				if (!key.indexOf(this.ciword)) {
					delete localStorage[key];
				}
			}
			return 0;
		},
	};

	//初期化
	return new gitrine();
})();
