/*
vbsからの移植

Zircon.encode("string",num)
//暗号化
Zircon.decode("string",num)
//復号化

*/

/**
 * zirconライブラリ
 * @returns {zircon}
 */
function zircon() {
	if (typeof Beryl != "object") {
		console.error("ライブラリ: beryl.js が見つかりませんでした");
	}
}

zircon.prototype = {
	/**
	 * 暗号化
	 * @param {string} data - 対象文字列
	 * @param {number} [pass=1] - seed
	 * @returns {string} 暗号文字列
	 */
	encode(data, pass = 1) {
		data = "" + data;
		if (data == "") {
			return "";
		}
		data = data.split("");
		let ans = "";
		let ShoFlag = true;
		let OCodeTmp, CodeTmp;
		let Nseed = this.CreateSeed((Math.random() * 1000) | 0);

		for (let i = 0, li = data.length; i < li; i++) {
			if (ShoFlag) {
				OCodeTmp = CodeTmp = data[i].codePointAt(0);
				ShoFlag = false;
			} else {
				CodeTmp = data[i].codePointAt(0) - OCodeTmp;
			}
			ans += (CodeTmp - pass) * Nseed + "&";
		}

		let tmp = ans.match(/.{1,2}/g);
		ans = "";
		for (let i = 0, li = tmp.length; i < li; i++) {
			ans += this.B63En(tmp[i]);
		}

		ans = Nseed + "~" + ans;

		ans = this.NumDefender(ans, 0);
		ans = this.RLEEn(ans);

		ans = Beryl.compress(ans);
		return ans;
	},
	/**
	 * 復号化
	 * @param {string} data - 対象文字列
	 * @param {number} [pass=1] - seed
	 * @returns {string} 復号文字列
	 */
	decode(data, pass = 1) {
		data = "" + data;
		if (data == "") {
			return "";
		}
		let ans = "";
		let ShoFlag = true;
		let OCodeTmp, CodeTmp;
		let Nseed = 1;

		data = Beryl.decompress(data);

		data = this.RLEDe(data);
		data = this.NumDefender(data, 1);

		[Nseed, data] = data.split("~");

		data = data.split("");
		ans = "";
		for (let i = 0, li = data.length; i < li; i++) {
			ans += this.B63De(data[i]);
		}

		data = ans.split("&");
		ans = "";
		for (let i = 0, li = data.length - 1; i < li; i++) {
			data[i] = data[i] / Nseed + pass;

			if (ShoFlag) {
				OCodeTmp = data[i];
				CodeTmp = String.fromCodePoint(data[i]);
				ShoFlag = false;
			} else {
				CodeTmp = String.fromCodePoint(data[i] + OCodeTmp);
			}
			ans += CodeTmp;
		}

		return ans;
	},

	/**
	 * 63進数変換(テーブル方式)
	 * @param {string} data - 対象文字列
	 * @returns {string} 変換結果
	 */
	B63En(data) {
		for (let i = 0, li = this.B63Table2.length; i < li; i++) {
			if (this.B63Table2[i] == data) {
				return Beryl.hex66.encode(i);
			}
		}
		data = data.split("");
		let tmp = "";
		for (let i = 0, li = data.length; i < li; i++) {
			for (let j = 0, lj = this.B63Table1.length; j < lj; j++) {
				if (this.B63Table1[j] == data[i]) {
					tmp += Beryl.hex66.encode(this.B63Table2.length + j);
					break;
				}
			}
		}
		return tmp;
	},
	/**
	 * 63進数復号(テーブル方式)
	 * @param {string} data - 対象文字列
	 * @returns {string} 変換結果
	 */
	B63De(data) {
		let tmp = Beryl.hex66.decode(data);
		if (tmp < this.B63Table2.length) {
			return this.B63Table2[tmp];
		} else {
			return this.B63Table1[tmp - this.B63Table2.length];
		}
	},
	B63Table1: ["&", "-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
	B63Table2: ["&-", "00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56", "58", "60", "62", "64", "66", "68", "70", "72", "74", "76", "78", "80", "82", "84", "86", "88", "90", "92", "94", "96", "98"],
	/**
	 * ランレングス圧縮
	 * @param {string} data - 対象文字列
	 * @returns {string} 圧縮結果
	 */
	RLEEn(data) {
		let compressedText = [];
		let contiCounter = 0;
		let nonContiText = [];
		let nonContiCounter = 0;
		let currentChar = data[0];

		for (i = 0; i < data.length; i++) {
			if (currentChar == data[i]) {
				if (nonContiCounter > 0) {
					//XYYの最後のY部分に当たる出力処理
					minusNumber = nonContiCounter * -1;
					compressedText.push(minusNumber);
					for (j = 0; j < nonContiText.length; j++) {
						compressedText.push(nonContiText[j]);
					}
					nonContiText = [];
					nonContiCounter = 0;
				}
				contiCounter++;
			} else {
				if (contiCounter > 1) {
					//XXYの最後のYの部分に当たる出力処理
					compressedText.push(contiCounter, currentChar);
				}
				if (contiCounter == 1) {
					nonContiCounter++;
					nonContiText.push(currentChar);
				}
				contiCounter = 1;
				currentChar = data[i];
			}
		}

		if (contiCounter > 1) {
			//末尾が連続だった場合の出力処理
			compressedText.push(contiCounter, currentChar);
		} else {
			//末尾が不連続
			nonContiCounter++;
			minusNumber = nonContiCounter * -1;
			nonContiText.push(currentChar);
			compressedText.push(minusNumber);
			for (k = 0; k < nonContiText.length; k++) {
				compressedText.push(nonContiText[k]);
			}
		}
		return compressedText.join("");
	},
	/**
	 * ランレングス復号
	 * @param {string} data - 対象文字列
	 * @returns {string} 復号結果
	 */
	RLEDe(data) {
		var decompressedText = [];
		var minusFlag = false;
		var countStock = 0;
		var preNumStock = [];

		for (i = 0; i < data.length; i++) {
			if (data[i] == "-") {
				//マイナスの符号を検知
				minusFlag = true;
			} else if (data[i].match(/[0-9]/g)) {
				//数字だったら
				countStock = parseInt(data[i]); //int型に変換
				preNumStock.push(countStock); //2桁以上の場合に備えて保持しておく
			} else {
				//アルファベット
				if (minusFlag == true) {
					//不連続だったら
					countStock = parseInt(preNumStock.join(""));
					for (j = 0; j < countStock; j++) {
						decompressedText.push(data[i + j]); //不連続の文字の回数出力
					}
					i = i + countStock - 1; //ループを次の状態まで飛ばす
					minusFlag = false; //諸々初期化しとく
					preNumStock = [];
					countStock = 0;
				} else {
					//連続だったら
					countStock = parseInt(preNumStock.join(""));
					for (j = 0; j < countStock; j++) {
						decompressedText.push(data[i]); //連続の回数分、同じ文字を出力
					}
					preNumStock = []; //諸々初期化しとく
					countStock = 0;
				}
			}
		}
		return decompressedText.join("");
	},
	/**
	 * 数字保護
	 * @param {string} data - 対象文字列
	 * @param {boolean} type - true:数値→アルファベット false:アルファベット→数値
	 * @returns {string} 復号結果
	 */
	NumDefender(data, type) {
		if (data == "") {
			return "";
		}
		for (let i = 0, li = this.NumDefenderTable.length; i < li; i++) {
			if (type) {
				data = data.replace(new RegExp(this.NumDefenderTable[i], "g"), i);
			} else {
				data = data.replace(new RegExp(i, "g"), this.NumDefenderTable[i]);
			}
		}
		return data;
	},
	NumDefenderTable: ["@", "!", '"', "#", ",", "%", "&", "'", "<", ">"],

	/**
	 * seedの生成
	 * @param {number} seed
	 * @returns {number}
	 */
	CreateSeed(seed) {
		let tmp = "";
		seed = "" + seed;
		for (let i = 0, li = seed.length; i < li; i++) {
			m = seed[i];
			if (m >= 5) {
				m = m - 5;
			}
			let flag = true;
			for (let j = 0, lj = tmp.length; j < lj; j++) {
				if (tmp[j] == m) {
					flag = false;
					break;
				}
			}
			if (flag) {
				tmp += "" + m;
			}
		}
		if (tmp == "") {
			tmp = 1;
		} else {
			tmp++;
		}
		if (tmp >= 1000) {
			tmp /= 10;
		}
		return tmp;
	},
};

//初期化
/**
 * Zircon インスタンス
 * @class zircon
 * @classdesc 文字列圧縮ライブラリ
 * @returns {zircon}
 */
var Zircon = new zircon();
