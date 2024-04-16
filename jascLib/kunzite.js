/*
? 使用ライブラリ
* katex.js
* Marked.js
* Prism.js(.css)
* Purify.js

*/
/*
? MEMO
Prismダウンロードリンク
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+clike+diff&plugins=autolinker+custom-class+autoloader+normalize-whitespace+toolbar+copy-to-clipboard+diff-highlight
*/

/**
 * kunziteライブラリ
 * @returns {kunzite}
 */
function kunzite() {
	let is_err = false;
	if (typeof katex != "object") {
		console.error("ライブラリ: katex.js が見つかりませんでした");
		is_err = true;
	}
	if (typeof marked != "object") {
		console.error("ライブラリ: marked.js が見つかりませんでした");
		is_err = true;
	}
	if (typeof Prism != "object") {
		console.error("ライブラリ: Prism.js が見つかりませんでした");
		is_err = true;
	}
	if (typeof DOMPurify != "function") {
		console.error("ライブラリ: DOMPurify.js が見つかりませんでした");
		is_err = true;
	}

	this.is_jasc = typeof jasc == "object";

	if (is_err) {
		console.warn("エラーの為、処理を中断します");
		return;
	}

	this.marked = marked.options({
		breaks: true,
		silent: true,
	});
}

kunzite.prototype = {
	/**
	 * markdown→html(markdown内のhtmlは削除)
	 * @param {string} str - 対象文字列
	 * @returns {string} HTML文字列
	 */
	md2Html(str) {
		tmpStr = str.toString();

		//改行文字の統一
		tmpStr = tmpStr.replace(/\r?\n/g, "\n").replace(/\r/g, "\n");

		// エスケープ
		tmpStr = this.escape_html(tmpStr);
		// 生き残ったタグは削除
		tmpStr = this.cleanHtml(tmpStr);

		// コードブロック内のKaTeXのエスケープ
		tmpStr = tmpStr.replace(/(?:```[\S\s]+?```|`[^`\n]+?`)/g, function (m) {
			return m.replace(/\$/g, "&#36;");
		});

		// KaTeXでのmath内のエスケープの解除
		tmpStr = tmpStr.replace(/(?:\$\$([\S\s]+?)\$\$|\$([^\$\n]+?)\$)/g, function (m, a, b) {
			let tmp = a ?? b ?? "";
			tmp = Kunzite.unescape_html(tmp);
			// 不明なhtmlタグは削除
			tmp = Kunzite.cleanHtml(tmp);
			if (Kunzite.is_jasc) {
				tmp = jasc.uspTosp(tmp);
			}
			if (tmp.replace(/[ \r\n]/g, "") == "") {
				tmp = "\\KaTeX Error!";
			}
			return katex.renderToString(tmp, {
				throwOnError: false,
				macros: {
					"\\f": "#1f(#2)",
				},
			});
		});

		// Markdownで使用される"&gt;"を">"に
		tmpStr = tmpStr.replace(/(?:^|\n) *?&gt;(&gt;| )*/g, function (m) {
			return m.replace(/&gt;/g, ">");
		});
		// コードブロック内のエスケープの解除
		tmpStr = tmpStr.replace(/(?:```[\S\s]+?```|`[^`\n]+?`)/g, function (m) {
			let tmp = Kunzite.cleanHtml(m).replace(/&#36;/g, "$");
			return Kunzite.unescape_html(tmp);
		});

		// markdown→html変換
		tmpStr = this.marked.parse(tmpStr);

		// 虚無を変更前に戻す
		tmpStr = tmpStr
			.replace(/<h1><\/h1>/g, "#")
			.replace(/<h2><\/h2>/g, "##")
			.replace(/<h3><\/h3>/g, "###")
			.replace(/<h4><\/h4>/g, "####")
			.replace(/<h5><\/h5>/g, "#####")
			.replace(/<h6><\/h6>/g, "######");

		// 一部のDOM要素を禁止 & インジェクション要素を削除
		tmpStr = DOMPurify.sanitize(tmpStr, {
			FORBID_TAGS: ["audio", "iframe", "img", "link", "meta", "noscript", "object", "script", "style", "textarea", "title", "video"],
			FORBID_ATTR: ["id", "src"],
			ADD_TAGS: ["annotation", "semantics"],
		});

		return tmpStr;
	},

	/**
	 * インジェクション無効化出力
	 * @param {string} str - 対象文字列
	 * @returns {string} 結果文字列
	 */
	clear(str) {
		return this.cleanHtml(this.escape_html(str));
	},

	/**
	 * PrismのDOM変更検知
	 * @returns {undefined}
	 */
	domChange() {
		Prism.highlightAll();
	},

	/**
	 * XSS対策にタグ文字を全削除
	 * @param {string} str - 対象文字列
	 * @returns {string} 結果文字列
	 */
	cleanHtml(str) {
		return DOMPurify.sanitize(str, {
			ALLOWED_TAGS: [],
		});
	},

	/**
	 * html文字列はエスケープ
	 * @param {string} s - 対象文字列
	 * @returns {string} 結果文字列
	 */
	escape_html(s) {
		if (typeof s !== "string") {
			s = s.toString();
		}
		return s.replace(
			/[&'"<>!]/g,
			(m) =>
				({
					"&": "&amp;",
					"'": "&apos;",
					'"': "&quot;",
					"<": "&lt;",
					">": "&gt;",
					"!": "&#33;",
				}[m])
		);
	},
	/**
	 * エスケープ文字を復元
	 * @param {string} s - 対象文字列
	 * @returns {string} 結果文字列
	 */
	unescape_html(s) {
		if (typeof s !== "string") {
			s = s.toString();
		}
		return s
			.replace(/&amp;/g, "&")
			.replace(/&apos;/g, "'")
			.replace(/&quot;/g, '"')
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#33;/g, "!");
	},
};

// 初期化
/**
 * Kunzite インスタンス
 * @class kunzite
 * @classdesc md→html変換ライブラリ
 * @returns {kunzite}
 */
var Kunzite = new kunzite();
