// jasc.js Ver.1.12.4

/*
! ！！注意！！
! scriptタグをdeferで読み込むとjasc.settingが動作しない場合があります
!

? jascのコメントについて
jascのコメントはVScode拡張機能「Better Comments」を利用して書かれています

? 関数名一覧の取得方法
* 関数以外も含む
+ jasc.getObjectPropertyNames(jasc,3)
* 関数のみ
+ jasc.readonly._jPro

*/

/*
? 読み込み時自動動作

* DOMContentLoaded時実行
.twitter-timelineクラスが存在する場合、
　twitterのwidgets.jsを自動読み込みする

* DOMChange時実行
<img class="jascNotImgErrGet">は読み込みエラー時に
　jasc.addEventListener("imageLoadError")を実行しない

<a class="jascNotExLinkGet">は外部リンク時に
　jasc.addEventListener("exLinkGet")と
　jasc.addEventListener("exTextLinkGet")を実行しない

*/

/*
? jasc使用html class
+ .jascNotImgErrGet	: [ユーザー付与]imgタグエラー時自動処理の巡回拒否用
- .jascImgErrGetter	: imgタグエラー時自動処理の巡回確認用
+ .jascNotExLinkGet	: [ユーザー付与]外部リンク時自動処理の巡回拒否用
- .jascExLinkGetter	: 外部リンク時自動処理の巡回確認用
- .jascExLink		: 外部リンク(cssで処理する用)
- .jascExTextLink	: 外部リンク(文字に対してのリンクのみ)(cssで処理する用)


*/

/*
? jasc動作関連
* jasc.initSetting = args												//jasc初期設定(DOMContentLoaded以降変更不可)
* jasc.setting = args													//jasc設定
* jasc.addEventListener(eventType = "", callback, name = "")			//jasc内イベント設定
* jasc.removeEventListener(eventType = "", name = "")					//jasc内イベント解除

* jasc.on()																//jasc.addEventListenerと同じ
* jasc.off()															//jasc.removeEventListenerと同じ
- 読み取り専用
* jasc.readonly															//jasc内静的変数一覧

*/
/*
? 機能
- 基本構成(DOM)
* jasc.acq(str, par = document) 										//要素取得
* jasc.toggleClass(name, str)											//クラス反転
* jasc.cssVariableIO(name, val)											//css変数取得&書き換え
* jasc.scrollbarXVisible(elem = document.body)							//スクロールバー存在判定X
* jasc.scrollbarYVisible(elem = document.body)							//スクロールバー存在判定Y
* jasc.getScrollVerticalPosition(e, margin = 0)							//スクロール位置判定
* jasc.loadFile(src, callback)											//ファイル動的読み込み
* jasc.isExternalLink(elem)												//外部リンク判定
* jasc.isTextNode(elem)													//テキストノード判定
* jasc.waitForElement(selector, text = null, timeoutMs = 0, par = document)			//dom出現待機
* jasc.jQueryObjToDOM(obj)												//jQueryオブジェクト→DOM変換
- 基本構成(その他)
* jasc.ajax(options = {})												//jQuery.ajaxの下位互換
* jasc.historyPush(url, title = "", history = true)						//動的url
* jasc.getUrlVars(data)													//urlパラメータ分解
* jasc.absolutePath(path)												//相対url(絶対url)→絶対url
* jasc.autoUrlShare(json)												//Url共有
* jasc.copy2Clipboard(data)												//クリップボードにコピー
- canvas描画
* jasc.draw.text(ctx, x, y, text, size, color, align = "center", base = "middle")	//canvasテキスト描画
* jasc.draw.line(ctx, x1, y1, x2, y2, color)										//canvas線描画
* jasc.draw.rect(ctx, x, y, w, h, color)											//canvas四角形描画
* jasc.draw.circle(ctx, x, y, r, color1, color2 = null)								//canvas円描画
* jasc.draw.triangle(ctx, x1, y1, x2, y2, x3, y3, color)							//canvas三角形描画
- game動作
* jasc.game.canvasResize(width = 0, height = 0)							//ゲーム画面リサイズ
- 連想配列計算
* jasc.isAssociative(obj)												//連想配列判定
* jasc.overwriteAssociative(parents, child = {})						//連想配列を結合(上書き)[破壊的関数]
* jasc.setAssociativeAutoName(obj = {}, data = null, baseName = "", prefix = "-")		//連想配列自動名前付け
- 文字計算
* jasc.uspTosp(str)														//不明な空白を半角スペースに変換
* jasc.othToHira(str)													//全ての文字を共通化
* jasc.escapeRegExp(str)												//正規表現文字列エスケープ
* jasc.similarString(str, list)											//類似文字列検索
* jasc.levenshteinDistance(str1, str2)									//レーベンシュタイン距離
* jasc.calcNgram(a, b, n)												//N-gram
- 数学計算
* jasc.totp(key)														//自作ワンタイムパスワード
* jasc.formatDate(date, format)											//GASのUtilities.formatDateの下位互換
* jasc.formatTime(ti)													//msを y年 mヶ月 d日 h時間 m分 s秒 に変換
* jasc.permutation(arr, number = 0)										//組み合わせ列挙
* jasc.compareFloats(a, b)												//小数丸め誤差を無視して比較
* jasc.isNumber(n)														//厳格な数値比較
* jasc.map(val, fromMin, fromMax, toMin, toMax)							//Arduinoのmapの移植
* jasc.sum(...data)														//数値、配列の合計
* jasc.range(start, end, step = 1)										//Pythonのrangeの移植
* jasc.divideEqually(val, cou)											//均等に数値を分割
* jasc.chunk(arr, size)													//配列を分割(n個ずつ)
* jasc.chunkDivide(arr, size)											//配列を分割(n個に)
- ファイル
* jasc.showOpenFileDialog(accept = "*", multiple = false, timeout = 180000, directory = false)	//ファイル選択画面表示
* jasc.getDropFilesEvent(dom = "body", callback)						//ドロップされたファイルを取得
* jasc.getFileType(fileObj)												//ファイルの種類を判定
* jasc.getMimeType(ext)													//拡張子からMIMEタイプを取得
- 通知
* jasc.allowNotification()												//通知許可 判定&取得
* jasc.sendNotification(title, text, icon)								//通知送信
- 既存関数を使いやすく
* jasc.replaceAsync(str, regex, asyncFn)								//replaceの非同期版
* jasc.objDefineProperty(obj, name, opt = {})							//definePropertyを使いやすく
* jasc.getObjectPropertyNames(obj, depth = 0, isEnumerable = false)		//definePropertyをprototypeに使用した際の問題対策
* jasc.objHasOwnProperty(obj, key)										//hasOwnPropertyを使いやすく
* jasc.getCookie(name)													//クッキー取得
* jasc.removeCookie(name)												//クッキー削除
* jasc.setCookie(name, value, opt = {})									//クッキー設定
* jasc.pressKey(code, type = "keydown", opt = {}, elem = window)		//キーを押す

* jasc.requestAnimationFrame()											//表記ブレを纏めただけ
* jasc.getTime()														//表記ブレを纏めただけ

- class
* new jasc.ConsoleCustomLog(arg = {})									//コンソール出力の色付け
* new jasc.AssetsManager(urls = {})										//画像先行読み込み管理

*/
/*
? jasc.readonlyの内容
- 起動時自動設定
* os							//実行os
* browser						//ブラウザ名
* isMobile						//モバイル端末か
* ieVersion						//IEのバージョン
* isBot							//閲覧者がクローラー(bot)か
* pagePath						//現在のページの読み込み時URL
* pageBaseUrl					//現在のページの読み込み時URL(.htmlの前部分)
* jascBaseUrl					//jascの読み込み階層URL
* urlQuery						//URLのクエリ文字列(dict)
* isIframe						//読み込み環境がiframeであるか
* iframeDepth					//読み込み環境の階層位置
* parentJasc					//親frameのJascObj
* topJasc						//topFrameのJascObj
* sysList.***					//システムで使用する配列構成
* _eventListener.***			//jasc独自イベントのコールバック保存場所
* _jPro.***						//jasc定義関数の本体
- 動的変更
* pressKeySet					//現在の押下キー
- ゲームエンジン動作時
* isDrawing						//描画可能か
* doFps							//現在のFPS
* game._canvas					//ゲームに使用されているcanvas
* game.ctx						//ゲームに使用されているctx

*/
/*
? jasc起動時読み込みライブラリ(jasc.initSetting.useLib)
- 自作
* andesine					//jasc拡張ゲームライブラリ
* kunzite					//html → markdown(KaTeX)
* gitrine					//localStorageの保存時に圧縮
* zircon					//暗号化
* beryl						//圧縮
- 他作 - kunzite
* katex-auto				//katex-jsの自動処理用(kunziteでは未使用)
* katex-js					//KaTeXをhtmlで表示する
	* katex-css				//KaTeXのCSS
* marked					//html → markdown
* prism-js					//codeブロックの自動ハイライト
	* prism-css				//PrismのCSS
* purify					//html文字列の削除
- 他作 - beryl
* base64urlEncoder			//base64urlに変換
* cheep-compressor			//文字列の圧縮・解凍
* deflate					//文字列の圧縮
* inflate					//文字列の解凍
* lzbase62					//文字列の圧縮・解凍
* lz-string					//文字列の圧縮・解凍
* url-comp					//URLの圧縮・解凍
* URLpercentEncoder			//URLのパーセントエンコード

*/
/*
? 独自eventListenerの種類
- 基本イベント
* type						//イベントリスナー 一覧
* interactive				//DOM読み込み最初期実行
* DOMContentLoaded			//jascライブラリ読み込み完了時
* load						//ページ読み込み完了時
* windowResize				//ウィンドウサイズ変更時
* changeDOM					//DOM変更検知時
* keyPress					//キーボード入力時(ゲームエンジン使用時動作変更)
* imageLoadError			//画像読み込みエラー検知時
* exLinkGet					//外部リンク検知時
* exTextLinkGet				//外部テキストリンク検知時
- jascゲームエンジン
* gameInit					//ゲーム初期化時
* gameRequestAnimationFrame	//RequestAnimationFrameのタイミングで実行
* gameFrameUpdate			//ゲーム(仮想)フレーム更新時
* canvasResize				//キャンバスサイズ変更時

? 自動イベント実行順
* jasc.on("interactive")			//※実行タイミング後設定で動作しない
* document.addEventListener("DOMContentLoaded")
	* jasc.on("imageLoadError")		//※複数実行
	* jasc.on("DOMContentLoaded")	//※実行タイミング後設定で設定した瞬間(同期)実行
	* jasc.on("exTextLinkGet")		//※複数実行
	* jasc.on("exLinkGet")			//※複数実行
* window.addEventListener("load")
	* jasc.on("load")				//※実行タイミング後設定で設定した瞬間(同期)実行
	* jasc.on("gameInit")			//※実行タイミング後設定で動作しない

*/

// 説明書はここまで

(function () {
	//##################################################
	// 内部使用グローバル定数
	//##################################################
	// prettier-ignore
	const kanaMap = {
		// 半角→全角カタカナ
		ｶﾞ: "ガ", ｷﾞ: "ギ", ｸﾞ: "グ", ｹﾞ: "ゲ", ｺﾞ: "ゴ",
		ｻﾞ: "ザ", ｼﾞ: "ジ", ｽﾞ: "ズ", ｾﾞ: "ゼ", ｿﾞ: "ゾ",
		ﾀﾞ: "ダ", ﾁﾞ: "ヂ", ﾂﾞ: "ヅ", ﾃﾞ: "デ", ﾄﾞ: "ド",
		ﾊﾞ: "バ", ﾋﾞ: "ビ", ﾌﾞ: "ブ", ﾍﾞ: "ベ", ﾎﾞ: "ボ",
		ﾊﾟ: "パ", ﾋﾟ: "ピ", ﾌﾟ: "プ", ﾍﾟ: "ペ", ﾎﾟ: "ポ",
		ｳﾞ: "ヴ", ﾜﾞ: "ヷ", ｦﾞ: "ヺ",
		ｱ: "ア", ｲ: "イ", ｳ: "ウ", ｴ: "エ", ｵ: "オ",
		ｶ: "カ", ｷ: "キ", ｸ: "ク", ｹ: "ケ", ｺ: "コ",
		ｻ: "サ", ｼ: "シ", ｽ: "ス", ｾ: "セ", ｿ: "ソ",
		ﾀ: "タ", ﾁ: "チ", ﾂ: "ツ", ﾃ: "テ", ﾄ: "ト",
		ﾅ: "ナ", ﾆ: "ニ", ﾇ: "ヌ", ﾈ: "ネ", ﾉ: "ノ",
		ﾊ: "ハ", ﾋ: "ヒ", ﾌ: "フ", ﾍ: "ヘ", ﾎ: "ホ",
		ﾏ: "マ", ﾐ: "ミ", ﾑ: "ム", ﾒ: "メ", ﾓ: "モ",
		ﾔ: "ヤ", ﾕ: "ユ", ﾖ: "ヨ",
		ﾗ: "ラ", ﾘ: "リ", ﾙ: "ル", ﾚ: "レ", ﾛ: "ロ",
		ﾜ: "ワ", ｦ: "ヲ", ﾝ: "ン",
		ｧ: "ァ", ｨ: "ィ", ｩ: "ゥ", ｪ: "ェ", ｫ: "ォ",
		ｯ: "ッ", ｬ: "ャ", ｭ: "ュ", ｮ: "ョ",
		"｡": "。", "､": "、", ｰ: "ー", "｢": "「", "｣": "」",
		"･": "・",
	};
	const kanaReg = new RegExp("(" + Object.keys(kanaMap).join("|") + ")", "g");

	let reRegExp = /[\\^$.*+?()[\]{}|]/g,
		reHasRegExp = new RegExp(reRegExp.source);

	// ファイルタイプ正規表現
	const fileTypeRegList = [
		// 画像ファイル
		[/^424d/, "bmp"],
		[/^0{128}4449434d/, "dicom"], //!未検証
		[/^2521/, "eps"], //!未検証
		[/^474946383761/, "gif_87a"], //!未検証
		[/^474946383961/, "gif_89a"],
		[/^000002/, "ico_cursor"], //!未検証
		[/^000001/, "ico_icon"],
		[/^ffd8/, "jpeg"],
		[/^504746/, "pgf"], //!未検証
		[/^89504e47/, "png"],
		[/^38425053/, "psd"], //!未検証
		/*
			svgのやつはマジックナンバーではなくただの宣言文字
			そもそもsvgはテキストファイル
		*/
		[/^(.{2}){0,4}3c3f786d6c/, "svg"],
		[/^4d4d002a/, "tiff_big"], //!未検証
		[/^49492a00/, "tiff_little"], //!未検証
		[/^524946460{8}57454250/, "webp"], //!未検証
		// 音声ファイル
		/*
			mp3のやつはマジックナンバーではなくただのヘッダー情報
			/^544147/
			ID3v1ヘッダーの参照
			/^4944330[234]00/,
			ID3v2ヘッダーの参照v2.2-v2.4
		*/
		[/^(544147|4944330[234]00)/, "mp3"],
		[/^4d546864/, "mid"],
		[/^52494646.{8}57415645/, "wav"],
		// 動画ファイル
		[/^0{6}18667479703367703600000100/, "3gp"], //!未検証
		[/^3026b2758e66cf11a6d900aa0062ce6c/, "asf"], //!未検証
		[/^52494646/, "avi"], //!未検証
		[/^1a45dfa3010{12}2342868101/, "mkv"], //!未検証
		[/^0{6}146674797071742020{9}71742020{8}877696465/, "mov"], //!未検証
		[/^0{6}(18667479706d703432000000|206674797069736f6d000002)00/, "mp4"], //!検証数2
		[/^3026b2758e66cf11a6d900aa0062ce6c/, "wmv"], //!未検証
		// 圧縮(アーカイブ)
		[/^1f8b/, "gzip"],
		[/^504b0304/, "zip"],
		// フォントファイル
		[/^97140100b11301/, "eot"], //!検証数1
		[/^4f54544f/, "otf"], //!検証数1
		[/^00010{6}/, "ttf"],
		[/^774f4646/, "woff"],
		[/^774f4632/, "woff2"],
		// プログラムファイル
		[/^53514c69746520666f726d6174/, "db_sqlite"],
		[/^480{6}57696e/, "db_windows"],
		[/^4d5a/, "exe"],
		// その他
		[/^4954534603/, "chm"], //!検証数1
		[/^d0cf11e0a1b11ae1a5ec/, "doc"],
		[/^7f454c46/, "elf"], //!未検証
		[/^4c0{6}011402/, "lnk"], //!検証数3
		[/^255044462d/, "pdf"],
		[/^d0cf11e0a1b11ae1/, "ppt"],
		[/^7b5c727466/, "rtf"], //!検証数1,
		[/^d0cf11e0a1b11ae1/, "xls"],
	];
	// 拡張子に対応するmimeタイプ
	const fileTypeMimeList = {
		// 画像ファイル
		bmp: ["image/bmp", "image/x-bmp", "image/x-ms-bmp"],
		cgm: "image/cgm",
		dicom: "application/dicom",
		dwf: ["drawing/x-dwf", "image/vnd.dwg"],
		eps: "application/postscript",
		epsf: "application/postscript",
		fif: "image/fif",
		gif: "image/gif",
		ico: ["image/x-icon", "image/vnd.microsoft.icon"],
		jfi: "image/jpeg",
		jfif: "image/jpeg",
		jpe: "image/jpeg",
		jpeg: "image/jpeg",
		jpg: "image/jpeg",
		//pgfはMIMEは存在しない
		png: "image/png",
		ps: "application/postscript",
		psd: ["image/x-photoshop", "image/vnd.adobe.photoshop"],
		svg: "image/svg+xml",
		tif: "image/tiff",
		tiff: "image/tiff",
		webp: "image/webp",
		xbm: "image/x-bitmap",
		xpm: "image/x-xpixmap",
		// 音声ファイル
		aac: "audio/aac",
		au: "audio/basic",
		kar: ["audio/midi", "audio/x-midi"],
		mid: ["audio/midi", "audio/x-midi"],
		midi: ["audio/midi", "audio/x-midi"],
		m1a: ["audio/mpeg", "audio/x-mpeg"],
		m2a: ["audio/mpeg", "audio/x-mpeg"],
		m4a: "audio/aac",
		mp2: ["audio/mpeg", "audio/x-mpeg"],
		mp3: ["audio/mpeg", "audio/x-mpeg"],
		mpa: ["audio/mpeg", "audio/x-mpeg"],
		mpega: ["audio/mpeg", "audio/x-mpeg"],
		oga: "audio/ogg",
		opus: "audio/opus",
		ra: ["audio/x-realaudio", "audio/vnd.rn-realaudio"],
		smf: ["audio/midi", "audio/x-midi"],
		snd: "audio/basic",
		ulw: "audio/basic",
		wav: ["audio/wav", "audio/x-wav"],
		weba: "audio/webm",
		// 動画ファイル
		"3gp": ["audio/3gpp", "video/3gpp"],
		"3g2": ["audio/3gpp2", "video/3gpp2"],
		asf: "video/x-ms-asf",
		avi: "video/x-msvideo",
		m1s: ["video/mpeg", "video/x-mpeg"],
		m1v: ["video/mpeg", "video/x-mpeg"],
		m2s: ["video/mpeg", "video/x-mpeg"],
		m2v: ["video/mpeg", "video/x-mpeg"],
		mkv: "video/x-matroska",
		mov: "video/quicktime",
		moov: "video/quicktime",
		mp4: "video/mp4",
		mpe: ["video/mpeg", "video/x-mpeg"],
		mpeg: ["video/mpeg", "video/x-mpeg"],
		mpg: ["video/mpeg", "video/x-mpeg"],
		mpg4: "video/mp4",
		mpv: ["video/mpeg", "video/x-mpeg"],
		ogv: "video/ogg",
		ogg: ["audio/ogg", "video/ogg"],
		qt: "video/quicktime",
		vdo: "video/vdo",
		viv: "video/vnd.vivo",
		vivo: "video/vnd.vivo",
		webm: "video/webm",
		wmv: "video/x-ms-wmv",
		// 圧縮(アーカイブ)
		"7z": "application/x-7z-compressed",
		bz: "application/x-bzip",
		bz2: "application/x-bzip2",
		gz: ["application/gzip", "application/x-gzip"],
		rar: ["application/vnd.rar", "application/x-rar-compressed", "application/x-rar"],
		tar: "application/x-tar",
		zip: "application/zip",
		// フォントファイル
		eot: "application/vnd.ms-fontobject",
		otf: "font/otf",
		ttf: "font/ttf",
		woff: "font/woff",
		woff2: "font/woff2",
		// プログラムファイル
		cgi: "application/x-httpd-cgi",
		css: "text/css",
		csv: "text/csv",
		exe: ["application/exe", "application/x-msdownload"],
		htm: "text/html",
		html: "text/html",
		jar: "application/java-archive",
		js: "text/javascript",
		json: "application/json",
		mjs: "text/javascript",
		php: ["application/x-httpd-php", "text/x-php"],
		pl: "text/x-perl",
		swf: "application/x-shockwave-flash",
		tsv: "text/tab-separated-values",
		txt: "text/plain",
		vbs: "text/vbscript",
		vdb: "application/activexdocment",
		xhtml: "application/xhtml+xml",
		xml: ["application/xml", "text/xml"],
		// その他
		azw: "application/vnd.amazon.ebook",
		doc: ["application/msword", "application/vnd.ms-word"],
		docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		elf: "application/x-elf",
		ogx: "application/ogg",
		pdf: "application/pdf",
		ppt: ["application/mspowerpoint", "application/vnd.ms-powerpoint", "application/ppt"],
		pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		rtf: "application/rtf",
		xls: ["application/msexcel", "application/vnd.ms-excel"],
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	};

	class Random {
		constructor(seed = 88675123) {
			this.x = 123456789;
			this.y = 362436069;
			this.z = 521288629;
			this.w = seed;
		}

		// XorShift
		next() {
			let t = this.x ^ (this.x << 11);
			this.x = this.y;
			this.y = this.z;
			this.z = this.w;
			return (this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8)));
		}

		// min以上max以下の乱数を生成する
		nextInt(min = 0, max = 1) {
			const r = Math.abs(this.next());
			return min + (r % (max + 1 - min));
		}
	}

	function _jasc() {
		//##################################################
		// 内部使用グローバル変数
		//##################################################
		let ccLog = null;
		const isFlags = {
			domLoad: false,
			domLoadSkip: false,
			windowLoad: false,
			windowLoadSkip: false,

			jQueryLoad: false,
		};

		//ライブラリツリー
		const jascLibTree = {
			//自作
			andesine: {
				isLoad: false,
				lnk: "andesine.js",
				relations: [],
			},
			kunzite: {
				isLoad: false,
				lnk: "kunzite.js",
				relations: ["katex-js", "marked", "prism-js", "purify"],
			},
			gitrine: {
				isLoad: false,
				lnk: "gitrine.js",
				relations: ["zircon"],
			},
			zircon: {
				isLoad: false,
				lnk: "zircon.js",
				relations: ["beryl"],
			},
			beryl: {
				isLoad: false,
				lnk: "beryl.js",
				relations: ["base64urlEncoder", "cheep-compressor", "deflate", "inflate", "lzbase62", "lz-string", "url-comp", "URLpercentEncoder"],
			},
			//他作 - kunzite
			"katex-auto": {
				isLoad: false,
				lnk: "kunziteLib/katex/auto-render.min.js",
				relations: ["katex-js"],
			},
			"katex-js": {
				isLoad: false,
				lnk: "kunziteLib/katex/katex.min.js",
				relations: ["katex-css"],
			},
			"katex-css": {
				isLoad: false,
				lnk: "kunziteLib/katex/katex.min.css",
				relations: [],
			},
			marked: {
				isLoad: false,
				lnk: "kunziteLib/marked/marked.min.js",
				relations: [],
			},
			"prism-js": {
				isLoad: false,
				lnk: "kunziteLib/prism/prism.js",
				relations: ["prism-css"],
			},
			"prism-css": {
				isLoad: false,
				lnk: "kunziteLib/prism/prism.css",
				relations: [],
			},
			purify: {
				isLoad: false,
				lnk: "kunziteLib/purify/purify.min.js",
				relations: [],
			},
			//他作 - beryl
			base64urlEncoder: {
				isLoad: false,
				lnk: "berylLib/base64urlEncoder.js",
				relations: [],
			},
			"cheep-compressor": {
				isLoad: false,
				lnk: "berylLib/cheep-compressor.min.js",
				relations: [],
			},
			deflate: {
				isLoad: false,
				lnk: "berylLib/deflate.min.js",
				relations: [],
			},
			inflate: {
				isLoad: false,
				lnk: "berylLib/inflate.min.js",
				relations: [],
			},
			lzbase62: {
				isLoad: false,
				lnk: "berylLib/lzbase62.min.js",
				relations: [],
			},
			"lz-string": {
				isLoad: false,
				lnk: "berylLib/lz-string.min.js",
				relations: [],
			},
			"url-comp": {
				isLoad: false,
				lnk: "berylLib/url-comp.js",
				relations: [],
			},
			URLpercentEncoder: {
				isLoad: false,
				lnk: "berylLib/URLpercentEncoder.js",
				relations: [],
			},
		};

		//設定
		const jasc_initSettingData = {
			openFuncList: ["acq", "toggleClass", "cssVariableIO"],
			libPath: "./jascLib/",

			useLib: {},

			isGame: false,
		};
		const jasc_settingData = {
			gameFps: 60, //等倍速
			BBFCapacity: 30, //1フレームの実行限界数(溢れは持ち越し)

			isCanvasAutoResize: false, //canvasを自動で画面サイズに合わせてresize
		};
		const jasc_gameData = {
			canvas: [],
			ctx: [],
		};

		const jasc_events = {
			//基本
			windowResize: {},
			interactive: {},
			DOMContentLoaded: {},
			load: {},

			keyPress: {},

			//dom関係
			imageLoadError: {},
			exLinkGet: {},
			exTextLinkGet: {},
			changeDOM: {},

			//game関連
			canvasResize: {},
			gameInit: {},
			gameRequestAnimationFrame: {},
			gameFrameUpdate: {},
		};

		const jasc_readonlyData = {
			nowFps: 0,
			doFps: 0,

			urlQuery: {},
			pressKeySet: new Set(),

			isDrawing: true,
		};
		const jasc_sysListData = {
			fileTypeReg: fileTypeRegList,
			fileTypeMime: fileTypeMimeList,
		};

		//fps取得時使用
		let fps_startTime = 0;

		let fps_frameCount = 0;
		let fps_doFrameCount = 0;

		let fps_BBForward = 0;
		let fps_frame,
			fps_oldFrame = 0;

		// textNode判定用
		const textNode_allowedTextTag = ["SPAN", "P"];
		const textNode_allowedNodeType = [Node.TEXT_NODE, Node.CDATA_SECTION_NODE, Node.COMMENT_NODE];

		//##################################################
		// 機種別対応
		//##################################################

		//疑似fps作成用
		let requestAnimationFrame = (function () {
			return (
				window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000.0 / 60.0);
				}
			);
		})().bind(window);
		let now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
		function getTime() {
			return (now && now.call(performance)) || new Date().getTime();
		}

		//##################################################
		// 起動前処理
		//##################################################

		updateInitSettingUseLib();

		//##################################################
		// 起動構成
		//##################################################

		//* 画面サイズ変更
		window.addEventListener("resize", function (e) {
			doEventListener("windowResize", [e]);
			if (jasc_settingData.isCanvasAutoResize) {
				jPro.game.canvasResize();
			}
		});

		//* ウィンドウフォーカス
		window.addEventListener("focus", function () {});
		window.addEventListener("blur", function () {
			jasc_readonlyData.pressKeySet.clear();
		});

		//* キー入力判定
		window.addEventListener("keydown", function (e) {
			// shift同時押しに弱いのでそれに対処(ゴリ押し)
			if (!e.shiftKey) {
				jasc_readonlyData.pressKeySet.delete("ShiftLeft");
				jasc_readonlyData.pressKeySet.delete("ShiftRight");
			}
			const code = e.code;
			if (code == "") {
				return;
			}
			jasc_readonlyData.pressKeySet.add(code);
		});
		window.addEventListener("keyup", function (e) {
			// shift同時押しに弱いのでそれに対処(ゴリ押し)
			if (!e.shiftKey) {
				jasc_readonlyData.pressKeySet.delete("ShiftLeft");
				jasc_readonlyData.pressKeySet.delete("ShiftRight");
			}
			const code = e.code;
			if (code == "") {
				return;
			}
			jasc_readonlyData.pressKeySet.delete(code);
		});

		//* DOMContentLoadedより前に発火
		document.addEventListener("readystatechange", function () {
			if (document.readyState === "interactive") {
				//画像err取得
				autoImageErrorGet();

				doEventListener("interactive");
			}
		});

		//* DOMContentLoaded
		if (document.readyState == "loading") {
			document.addEventListener("DOMContentLoaded", DCL);
		} else {
			isFlags.domLoadSkip = true;
		}
		async function DCL(e) {
			isFlags.domLoad = true;
			ccLog.time("htmlDomLoad");

			//画像err取得
			autoImageErrorGet();

			//* DOM変更検知
			function obs(records) {
				//画像err取得
				autoImageErrorGet();
				//外部リンク判定
				autoExLinkGet();

				doEventListener("changeDOM", [records]);
			}
			const observer = new MutationObserver(obs);
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});

			//ライブラリ自動インポート
			for (let key in jascLibTree) {
				if (jasc_initSettingData.useLib?.[key]) {
					await jascLibLoad(key);
				}
			}
			updateInitSettingUseLib();

			openFuncCreate();

			doEventListener("DOMContentLoaded", [e]);

			//画像err取得
			autoImageErrorGet();
			//外部リンク判定
			autoExLinkGet();

			autoTwitterScriptLoad();
			ccLog.time("htmlDomLoad");
		}

		//* load
		if (document.readyState != "complete") {
			window.addEventListener("load", WL);
		} else {
			isFlags.windowLoadSkip = true;
		}
		async function WL(e) {
			isFlags.windowLoad = true;
			ccLog.time("htmlLoad");
			touchHoverKill();

			doEventListener("load", [e]);

			//jQuery存在判定
			if (typeof jQuery == "undefined") {
				ccLog.log("jQuery does not exist", "system");
			} else {
				ccLog.log("jQuery exists", "system");
				isFlags.jQueryLoad = true;
			}

			//isGameがonの場合canvasのupdate開始
			if (jasc_initSettingData.isGame) {
				gameInit();
			}

			//画像err取得
			autoImageErrorGet();
			//外部リンク判定
			autoExLinkGet();

			ccLog.time("htmlLoad");
			ccLog.time("jascLoad", true);
		}

		//初期化
		function JASC() {
			ccLog = new jPro.ConsoleCustomLog({
				prefix: "jasc",
				debug: false,
			});
			ccLog.time("jascLoad", true);

			jPro.objDefineProperty(jasc_settingData, "logDebug", {
				set(arg) {
					ccLog.debug = arg;
				},
			});

			//urlクエリ取得
			jasc_readonlyData.urlQuery = jPro.getUrlVars(location.search.replace(/^\?/, ""));

			//baseUrl取得
			(function () {
				//ページ
				jPro.objDefineProperty(jasc_readonlyData, "pageBaseUrl", {
					value: jPro.absolutePath(location.href).replace(/\/[^\/]*$/, "") + "/",
				});
				//ドメイン抜きのurl
				jPro.objDefineProperty(jasc_readonlyData, "pagePath", {
					value: location.pathname,
				});
				//jasc
				let tmp = "";
				if (document.currentScript) {
					tmp = document.currentScript.src;
				} else {
					var scripts = acq("script"),
						script = scripts[scripts.length - 1];
					if (script.src) {
						tmp = script.src;
					}
				}
				jPro.objDefineProperty(jasc_readonlyData, "jascBaseUrl", {
					value: tmp.replace(/\/[^\/]*$/, "") + "/",
				});
			})();

			//event読み出し用
			jPro.objDefineProperty(jasc_readonlyData, "_eventListener", {
				value: jasc_events,
			});

			//game用
			jPro.objDefineProperty(jasc_readonlyData, "game", {
				value: {},
			});
			//canvas読み出し用
			jPro.objDefineProperty(jasc_readonlyData.game, "_canvas", {
				value: jasc_gameData.canvas,
			});
			//ctx読み出し用
			jPro.objDefineProperty(jasc_readonlyData.game, "ctx", {
				value: jasc_gameData.ctx,
			});
			//このスクリプトがiframeで読み込まれているか
			jPro.objDefineProperty(jasc_readonlyData, "isIframe", {
				value: window != window.parent,
			});
			//現在のiframeの深度
			jPro.objDefineProperty(jasc_readonlyData, "iframeDepth", {
				value: (function () {
					let cou = 0;
					let tw = window.parent;
					while (tw != window.top) {
						tw = tw.parent;
						cou++;
					}
					return cou;
				})(),
			});
			//親のjascを取得
			jPro.objDefineProperty(jasc_readonlyData, "parentJasc", {
				value: (function () {
					if (jasc_readonlyData.isIframe) {
						if (window.parent?.jasc) {
							return window.parent.jasc;
						}
					}
					return null;
				})(),
			});
			//最上位のjascを取得
			jPro.objDefineProperty(jasc_readonlyData, "topJasc", {
				value: (function () {
					if (window.top?.jasc) {
						return window.top.jasc;
					}
					return null;
				})(),
			});

			// bot(クローラー)か
			jPro.objDefineProperty(jasc_readonlyData, "isBot", {
				value: /bot|crawler|spider|crawling/i.test(navigator.userAgent),
			});
			// モバイル端末か
			jPro.objDefineProperty(jasc_readonlyData, "isMobile", {
				value: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			});
			{
				// 使用ブラウザ種類
				let ua = navigator.userAgent.toLowerCase();
				let bs = "";
				let ieVersion = 0;
				switch (true) {
					case /fbios|fb_iab/.test(ua): // Facebook
						bs = "Facebook";
						break;
					case /instagram/.test(ua): // Instagram
						bs = "Instagram";
						break;
					case / line\//.test(ua): // LINE
						bs = "LINE";
						break;
					case /msie/.test(ua): // IE ~11
						ieVersion = parseInt(/msie (\d+)/.exec(ua)[1]);
					case /trident/.test(ua): // IE 11~
						bs = "Internet Explorer";
						break;
					case /edge/.test(ua):
					case /edg/.test(ua):
						bs = "Edge";
						break;
					case /chrome|crios/.test(ua): // Chrome for iOS
						bs = "Chrome";
						break;
					case /safari/.test(ua):
						bs = "Safari";
						break;
					case /firefox/.test(ua):
						bs = "Firefox";
						break;
					case /opera|opr/.test(ua):
						bs = "Opera";
						break;
				}
				jPro.objDefineProperty(jasc_readonlyData, "browser", {
					value: bs,
				});
				jPro.objDefineProperty(jasc_readonlyData, "ieVersion", {
					value: ieVersion,
				});
				// 使用端末
				let os = "";
				switch (true) {
					case /windows phone/.test(ua):
						os = "Windows Phone";
						break;
					case /win/.test(ua):
						os = "Windows";
						break;
					case /macintosh/.test(ua):
						os = "Macintosh";
						break;
					case /mac/.test(ua):
						os = "Mac";
						break;
					case /x11/.test(ua):
						os = "Unix";
						break;
					case /linux/.test(ua):
						os = "Linux";
						break;
					case /bsd/.test(ua):
						os = "BSD";
						break;
					case /iphone/.test(ua):
						os = "iPhone";
						break;
					case /ipad/.test(ua):
						os = "iPad";
						break;
					case /ipod/.test(ua):
						os = "iPod";
						break;
					case /android/.test(ua):
						os = "Android";
						break;
					case /blackberry/.test(ua):
						os = "BlackBerry";
						break;
					case /iemobile/.test(ua):
						os = "IEMobile";
						break;
					case /opera mini/.test(ua):
						os = "Opera Mini";
						break;
					case /opera mobi/.test(ua):
						os = "Opera Mobile";
						break;
					case /webos/.test(ua):
						os = "WebOS";
						break;
					case /nokia/.test(ua):
						os = "Nokia";
						break;
					case /symbian/.test(ua):
						os = "Symbian";
						break;
				}
				if (os == "") {
					os = navigator?.platform;
					if (!os) {
						os = "";
					}
				}
				jPro.objDefineProperty(jasc_readonlyData, "os", {
					value: os,
				});
			}

			//システムで使用しているリスト系
			jPro.objDefineProperty(jasc_readonlyData, "sysList", {
				value: jasc_sysListData,
			});

			//readonlyデータ設定
			jPro.objDefineProperty(this, "readonly", {
				value: jasc_readonlyData,
			});

			//initSetting設定(初期設定)
			jPro.objDefineProperty(this, "initSetting", {
				set(args) {
					if (isFlags.domLoad) {
						ccLog.log("DOMContentLoadedより後に設定を変更する事は出来ません！", "error", true);
						return;
					}

					if (!jPro.isAssociative(args)) {
						ccLog.log("連想配列以外の代入", "error");
						return;
					}

					jPro.overwriteAssociative(jasc_initSettingData, args);
				},
				get() {
					return jasc_initSettingData;
				},
			});
			//setting設定(共通設定)
			jPro.objDefineProperty(this, "setting", {
				set(args) {
					if (!jPro.isAssociative(args)) {
						ccLog.log("連想配列以外の代入", "error");
						return;
					}

					jPro.overwriteAssociative(jasc_settingData, args);
				},
				get() {
					return jasc_settingData;
				},
			});
			jPro.objDefineProperty(jasc_settingData, "canvas", {
				set(args) {
					if (!Array.isArray(args)) {
						ccLog.log("配列以外の代入", "error");
						return;
					}

					jasc_gameData.canvas = args;
					ctxUpdate();
				},
				get() {
					return jasc_gameData.canvas;
				},
			});

			//再度実行
			setTimeout(async function () {
				if (isFlags.domLoadSkip) {
					await DCL();
				}
				if (isFlags.windowLoadSkip) {
					await WL();
				}
			}, 10);

			// キー判定
			function gk() {
				if (!jasc_initSettingData.isGame) {
					if (jasc_readonlyData.pressKeySet.size) {
						doEventListener("keyPress", [jasc_readonlyData.pressKeySet]);
					}
					requestAnimationFrame(gk);
				}
			}
			gk();
		}

		let jPro = {
			//##################################################
			// 設定等(jasc)
			//##################################################

			/**
			 * 疑似イベントリスナー
			 * @param {string} [eventType=""] - イベントの種類
			 * @param {function} [callback] - イベントのコールバック関数
			 * @param {string} [name=auto] - 削除時の参照用名称
			 * @returns {-1|0|1|string[]} -1:イベント登録成功(即時実行) 0:イベント登録成功 1:イベント登録失敗
			 */
			addEventListener(eventType = "", callback, name = "") {
				if (eventType == "type") {
					return ["type", ...Object.keys(jasc_events)];
				}
				if (jPro.objHasOwnProperty(jasc_events, eventType)[0]) {
					if (callback && typeof callback == "function") {
						if (name == "") {
							name = jPro.setAssociativeAutoName(jasc_events[eventType], callback, "__jasc");
						} else {
							jasc_events[eventType][name] = callback;
						}

						// 旬を逃しても一応実行はさせる
						if ((eventType == "DOMContentLoaded" && isFlags.domLoad) || (eventType == "load" && isFlags.windowLoad)) {
							callback(null);
							return -1;
						}
						return 0;
					} else if (callback == null) {
						return jasc_events[eventType];
					}
				}
				return 1;
			},

			/**
			 * 疑似イベントリスナーの削除
			 * @param {string} [eventType=""] - イベントの種類
			 * @param {string} [name] - 削除時の参照用名称
			 * @returns {0|1|2|string[]} 0:イベント削除成功 1:イベント削除失敗 2:イベント削除失敗(無効なイベント名)
			 */
			removeEventListener(eventType = "", name = "") {
				if (eventType == "type") {
					let list = {};
					let keys = Object.keys(jasc_events);
					for (let i = 0, li = keys.length; i < li; i++) {
						len = Object.keys(jasc_events[keys[i]]).length;
						if (len) {
							list[keys[i]] = len;
						}
					}
					return list;
				}
				if (jPro.objHasOwnProperty(jasc_events, eventType)[0]) {
					if (jPro.isAssociative(jasc_events?.[eventType])) {
						if (name != "") {
							if (typeof jasc_events?.[eventType]?.[name] != "function") {
								return 2;
							}
							jasc_events[eventType][name] = null;
							delete jasc_events[eventType][name];
						} else {
							jasc_events[eventType] = {};
						}
						return 0;
					}
					return 2;
				}
				return 1;
			},

			//##################################################
			// 基本構成(DOM)
			//##################################################

			/**
			 * DOM取得
			 * @param {string} [str] - 取得対象
			 * @param {Window|Document|jQuery|HTMLElement} [par=document] - 取得対象の親
			 * @returns {Window|Document|HTMLElement|HTMLElement[]}
			 */
			acq(str, par = document) {
				if (!str) {
					return window;
				}
				// domはそのまま返却
				if (typeof str == "object") {
					return str;
				}
				switch (str) {
					case "window":
						return window;
					case "document":
						return document;
				}
				str = str.trim();
				const queryStr = str.slice(1);
				let elem = [];
				par = jPro.jQueryObjToDOM(par);
				if (par === window) {
					par = document;
				}
				if (par instanceof HTMLElement || par.nodeType >= 1) {
					par = [par];
				}
				let notArr = false;
				par.forEach((p) => {
					switch (str.slice(0, 1)) {
						case "#":
							elem.push(p.getElementById(queryStr));
							notArr = true;
							break;
						case ".":
							elem.push(...p.getElementsByClassName(queryStr));
							break;
						case "!":
							elem.push(...p.querySelectorAll(queryStr));
							break;
						default:
							elem.push(...p.getElementsByTagName(str));
					}
				});
				if (notArr && elem.length <= 1) {
					elem = elem[0];
				}
				return elem;
			},

			/**
			 * classを反転
			 * @param {jQuery|string|HTMLElement|HTMLElement[]} name - class反転対象
			 * @param {string} str - class名
			 * @returns {undefined}
			 */
			toggleClass(name, str) {
				let elem;
				if (typeof name == "string") {
					elem = jPro.acq(name);
				} else {
					elem = jPro.jQueryObjToDOM(name);
				}
				if (elem != null) {
					if (elem instanceof HTMLElement) {
						elem.classList.toggle(str);
					} else {
						for (let e of elem) {
							e.classList.toggle(str);
						}
					}
				}
			},

			/**
			 * css変数取得&書き換え
			 * @param {string} name - css変数名
			 * @param {string} [val] - css変数値
			 * @returns {string|false} css変数値
			 */
			cssVariableIO(name, val) {
				if (typeof name == "string") {
					//先頭が--の場合削除
					if (name.slice(0, 2) == "--") {
						name = name.slice(2);
					}
					if (val != null) {
						//上書き
						document.documentElement.style.setProperty(name, val);
					} else {
						//読み込み
						return getComputedStyle(document.documentElement).getPropertyValue(name);
					}
				}
				return false;
			},

			/**
			 * スクロールバー存在判定X
			 * @param {HTMLElement} [elem=document.body] - 対象
			 * @returns {boolean}
			 */
			scrollbarXVisible(elem = document.body) {
				return elem.scrollHeight > elem.clientHeight;
			},
			/**
			 * スクロールバー存在判定Y
			 * @param {HTMLElement} [elem=document.body] - 対象
			 * @returns {boolean}
			 */
			scrollbarYVisible(elem = document.body) {
				return elem.scrollWidth > elem.clientWidth;
			},

			// スクロール位置判定
			/**
			 * スクロール位置判定
			 * @param {Event} e - Scrollイベント
			 * @param {number} [margin=0] - 上限下限の許容値
			 * @returns {"top"|"bottom"|"scrolling"} 現在のスクロール位置
			 */
			getScrollVerticalPosition(e, margin = 0) {
				const t = e.target;

				const isScrollTop = t.scrollTop <= margin;
				const isScrollBottom = t.scrollTop + margin >= t.scrollHeight - t.clientHeight;

				if (isScrollTop) {
					return "top";
				} else if (isScrollBottom) {
					return "bottom";
				} else {
					return "scrolling";
				}
			},

			/**
			 * ファイル動的読み込み
			 * @param {string} src - ファイルurl
			 * @param {function} [callback] - 完了時コールバック
			 * @param {string} [exp=""] - 設定タグ名(script,link)
			 * @param {string} [srcType=""] - 設定タグ名(src,href)
			 * @returns {undefined}
			 */
			loadFile(src, callback, module = false, exp = "", srcType = "") {
				if (typeof src != "string" || src.length < 1) {
					return;
				}
				src = jPro.absolutePath(src);
				let name = "(" + src.replace(/^[^/]*:\/\/\/?/, "") + ")";
				let done = false;

				if (exp == "") {
					switch (src.split(".").pop()) {
						case "js":
							exp = "script";
							srcType = "src";
							break;
						case "css":
							exp = "link";
							srcType = "href";
							done = true;
							break;
						default:
							ccLog.log("不明な拡張子", "error");
					}
				}

				let orthSrc = src.split("?")[0];
				let scList = jPro.acq(exp);
				for (let i = 0, li = scList.length; i < li; i++) {
					tmpSrc = scList[i]?.[srcType].split("?")[0];
					if (tmpSrc == orthSrc) {
						ccLog.log(`${exp}重複読み込み${name}`, "error");
						return;
					}
				}

				ccLog.time("fileLoad" + name);

				let head = jPro.acq("head")[0];
				let elem = document.createElement(exp);
				if (exp == "link") {
					elem.rel = "stylesheet";
				}
				if (module) {
					elem.type = "module";
				}

				elem.onload = elem.onreadystatechange = function () {
					if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
						done = true;
						ccLog.time("fileLoad" + name);
						callback?.(0);

						elem.onload = elem.onreadystatechange = elem.onerror = null;
					}
				};
				elem.onerror = function () {
					ccLog.log(`FileLoadError${name}`, "error");
					ccLog.time("fileLoad" + name);

					callback?.(1);

					elem.onload = elem.onreadystatechange = elem.onerror = null;
					if (head && elem.parentNode) {
						head.removeChild(elem);
					}
				};

				elem[srcType] = src;
				head.appendChild(elem);

				if (done) {
					ccLog.time("fileLoad" + name);
					callback?.(0);
					elem.onload = elem.onreadystatechange = elem.onerror = null;
				}
			},

			/**
			 * 外部リンク判定
			 * @param {jQuery|HTMLElement} elem - 対象(href属性が存在すること)
			 * @returns {boolean}
			 */
			isExternalLink(elem) {
				elem = jPro.jQueryObjToDOM(elem);
				return !(elem.href === "" || elem.href.startsWith(`http://${window.location.hostname}`) || elem.href.startsWith(`https://${window.location.hostname}`) || elem.href.startsWith("javascript:") || elem.href.startsWith("mailto:"));
			},

			/**
			 * テキストノード判定
			 * @param {jQuery|HTMLElement} elem - 対象
			 * @returns {boolean}
			 */
			isTextNode(elem) {
				elem = jPro.jQueryObjToDOM(elem);
				return Array.from(elem.childNodes).every((e) => {
					if (textNode_allowedNodeType.indexOf(e.nodeType) >= 0) return true;
					return e.nodeType === Node.ELEMENT_NODE && textNode_allowedTextTag.indexOf(e.tagName) >= 0 && jPro.isTextNode(e);
				});
			},

			/**
			 * dom出現待機
			 * @param {string} selector - セレクタ
			 * @param {string} [text] - テキスト
			 * @param {number} [timeoutMs=0] - タイムアウト
			 * @param {document|HTMLElement} [par=document] - 対象
			 * @returns {Promise<HTMLElement|null>} 検出時実行
			 */
			waitForElement(selector, text = null, timeoutMs = 0, par = document) {
				return new Promise((resolve) => {
					if (timeoutMs) {
						const startTimeInMs = Date.now();
						findLoop();

						function findLoop() {
							let node = jPro.acq("!" + selector, par);
							if (node.length > 0) {
								resolve(node);
								return;
							} else {
								setTimeout(() => {
									if (timeoutMs && Date.now() - startTimeInMs > timeoutMs) {
										resolve(null);
										return;
									}
									findLoop();
								}, 100);
							}
						}
					} else {
						const nodes = jPro.acq("!" + selector, par);
						for (const node of nodes) {
							if (node.nodeType === 1 && (text === null || node.textContent === text)) {
								return resolve(node);
							}
						}
						const observer = new MutationObserver((mutations) => {
							for (const mutation of mutations) {
								for (const node of mutation.addedNodes) {
									if (node.nodeType !== 1) {
										continue;
									}

									if (node.matches(selector) && (text === null || node.textContent === text)) {
										observer.disconnect();
										return resolve(node);
									}
								}
							}
						});

						observer.observe(par, {
							childList: true,
							subtree: true,
							attributes: false,
							characterData: false,
						});
					}
				});
			},

			/**
			 * jQueryオブジェクト→DOM変換
			 * @param {jQuery|HTMLElement|HTMLElement[]} obj
			 * @returns {HTMLElement|HTMLElement[]}
			 */
			jQueryObjToDOM(obj) {
				if (!isFlags.jQueryLoad) {
					return obj;
				}
				if (obj instanceof jQuery) {
					try {
						return obj.get();
					} catch (e) {
						ccLog.warn(e, true);
					}
					return obj;
				}
				return obj;
			},

			//##################################################
			// 基本構成(その他)
			//##################################################

			/**
			 * jQueryのajaxを再現
			 * @param {object} opt - オプション
			 * @param {boolean} [opt.async=true] - 非同期
			 * @param {string} [opt.charset="UTF-8"] - 文字コード
			 * @param {string} [opt.contentType] - Content-Type
			 * @param {string} [opt.dataType="text"] - データタイプ
			 * @param {string} [opt.password] - パスワード
			 * @param {"GET"|"POST"} [opt.type="GET"] - GET/POST
			 * @param {string} [opt.url] - URL
			 * @param {string} [opt.username] - ユーザー名
			 * @param {object|string} [opt.data] - データ
			 * @param {number} [opt.timeout=0] - タイムアウト
			 * @param {function} [opt.complete] - 完了時コールバック
			 * @param {function} [opt.error] - エラー時コールバック
			 * @param {function} [opt.success] - 成功時コールバック
			 * @returns {undefined}
			 */
			ajax(opt = {}) {
				if (typeof opt != "object") {
					return;
				}
				// bool
				let async = opt?.async ?? true;
				// string
				let charset = opt?.charset ?? "UTF-8";
				let contentType = opt?.contentType ?? null;
				let dataType = opt?.dataType ?? "text";
				let password = opt?.password;
				let type = opt?.type ?? "GET";
				let url = opt?.url;
				let username = opt?.username;
				// object or string
				let data = opt?.data ?? {};
				// number
				let timeout = opt?.timeout ?? 0;
				// Event
				let complete = opt?.complete ?? function () {};
				let error = opt?.error ?? function () {};
				let success = opt?.success ?? function () {};

				if (!url) {
					return;
				}
				if (type == "GET") {
					if (typeof data == "object") {
						let tmp = "";
						for (let k in data) {
							if (Array.isArray(data[k])) {
								for (let v of data[k]) {
									tmp += "&" + k + "=" + encodeURIComponent(v);
								}
							} else if (typeof data[k] == "object") {
								try {
									d = JSON.stringify(data[k]);
									tmp += "&" + k + "=" + d;
								} catch (e) {
									ccLog.error(e);
								}
							} else {
								tmp += "&" + k + "=" + encodeURIComponent(data[k]);
							}
						}
						data = tmp.slice(1);
					}
				} else if (type == "POST") {
					if (contentType == null) {
						contentType = "application/x-www-form-urlencoded";
						if (typeof data == "object") {
							try {
								data = JSON.stringify(data);
								contentType = "application/json";
							} catch (e) {
								contentType = "multipart/form-data";
							}
						} else if (typeof data == "string" || typeof data == "number") {
							data = encodeURIComponent(data);
							contentType = "text/plain";
						}
					}
					contentType += ";charset=" + charset;
				}

				// 処理開始
				let xhr = new XMLHttpRequest();
				if (xhr == null) {
					ccLog.error("XMLHttpRequest is not supported.");
					return;
				}
				if (type == "GET") {
					if (data) {
						url += "?" + data;
					}
				}
				xhr.open(type, url, async, username, password);
				xhr.timeout = timeout;
				xhr.responseType = dataType;

				// Event
				xhr.onload = function (event) {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							success(xhr.response, dataType);
						} else {
							error(xhr, event.target.response.message, event);
						}
						complete(xhr, xhr.responseType);
					}
				};
				xhr.onerror = function (event) {
					error(xhr, event.target.response.message, event);
					complete(xhr, xhr.responseType);
				};

				// Header
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				xhr.setRequestHeader("Content-Type", contentType);
				//xhr.setRequestHeader("Cache-Control", "no-cache");

				// Body
				if (type == "POST") {
					xhr.send(data);
				} else {
					xhr.send(null);
				}
			},

			/**
			 * 動的url
			 * @param {string} url - 変更後url
			 * @param {object} [data] - 保持するデータ
			 * @param {boolean} [log] - ブラウザの履歴に書き込むか
			 * @returns {undefined}
			 */
			historyPush(url, data = {}, log = true) {
				if (log) {
					history.pushState(data, "", url);
				} else {
					history.replaceState(data, "", url);
				}
			},

			/**
			 * urlパラメータ分解
			 * @param {string} data - url
			 * @returns {object}
			 */
			getUrlVars(data) {
				var vars = {};
				var param = data.split("&");
				for (var i = 0; i < param.length; i++) {
					var keySearch = param[i].search(/=/);
					var key = "";
					if (keySearch != -1) key = param[i].slice(0, keySearch);
					var val = param[i].slice(param[i].indexOf("=", 0) + 1);
					if (key != "") vars[key] = decodeURIComponent(val);
				}
				return vars;
			},

			/**
			 * 相対url(絶対url)→絶対url
			 * @param {string} path - 相対url
			 * @returns {string} 絶対url
			 */
			absolutePath(path = "") {
				let e = document.createElement("a");
				e.href = path;
				return e.href;
			},

			/**
			 * Url共有
			 * @param {object} json - 共有するデータ
			 * @param {string} [json.title=document.title] - タイトル
			 * @param {string} [json.text=""] - テキスト
			 * @param {string} [json.url=""] - url
			 * @returns {Promise<undefined>} 完了後実行
			 */
			autoUrlShare(json) {
				let title = json?.title ?? document.title;
				let text = json?.text ?? "";
				let url = json?.url ?? "";
				if (text == "" && url != "") {
					text = title;
				} else if (url == "" && text != "") {
					url = window.location.href;
				}
				url = jPro.absolutePath(url);

				return new Promise((resolve, reject) => {
					if (navigator.share) {
						navigator
							.share({
								title: title,
								text: text,
								url: url,
							})
							.then(resolve)
							.catch(reject);
					} else {
						jasc.copy2Clipboard(url).then(resolve).catch(reject);
					}
				});
			},

			/**
			 * クリップボードにコピー
			 * @param {string} data - コピーするデータ
			 * @returns {Promise<undefined>} 完了後実行
			 */
			copy2Clipboard(data) {
				return new Promise((resolve, reject) => {
					try {
						if (navigator.clipboard) {
							navigator.clipboard.writeText(data).then(resolve, reject).catch(reject);
						} else if (window.clipboardData) {
							window.clipboardData.setData("Text", data);
							resolve();
						} else {
							const tempTextArea = document.createElement("textarea");
							tempTextArea.value = data;
							document.body.appendChild(tempTextArea);
							tempTextArea.select();
							document.execCommand("copy");
							document.body.removeChild(tempTextArea);
							resolve();
						}
					} catch (e) {
						reject(e);
					}
				});
			},

			//##################################################
			// 基本構成(canvas)
			//##################################################

			/**
			 * canvas描画関係
			 */
			draw: {
				/**
				 * 文字描画
				 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
				 * @param {number} x - x座標
				 * @param {number} y - y座標
				 * @param {string} text - 描画する文字
				 * @param {number} size - 文字サイズ
				 * @param {string} color - 文字色
				 * @param {string} [align="center"] - 文字描画位置
				 * @param {string} [base="middle"] - 文字描画位置
				 * @returns {undefined}
				 */
				text(ctx, x, y, text, size, color, align = "center", base = "middle") {
					ctx.font = "bold " + size + 'px "太ゴシック","Arial Black"';
					ctx.textAlign = align;
					ctx.textBaseline = base;
					ctx.fillStyle = color;
					ctx.fillText(text, x, y);
				},
				/**
				 * 線描画
				 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
				 * @param {number} x1 - x1
				 * @param {number} y1 - y1
				 * @param {number} x2 - x2
				 * @param {number} y2 - y2
				 * @param {string} color - 線色
				 * @returns {undefined}
				 */
				line(ctx, x1, y1, x2, y2, color) {
					ctx.strokeStyle = color;
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
				},

				/**
				 * 四角描画
				 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
				 * @param {number} x - x座標
				 * @param {number} y - y座標
				 * @param {number} w - 幅
				 * @param {number} h - 高さ
				 * @param {string} color - 色
				 */
				rect(ctx, x, y, w, h, color) {
					ctx.fillStyle = color;
					ctx.fillRect(x, y, w, h);
				},
				/**
				 * 円描画
				 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
				 * @param {number} x - x座標
				 * @param {number} y - y座標
				 * @param {number} r - 半径
				 * @param {string} color1 - 塗り
				 * @param {string} color2 - 線
				 * @returns {undefined}
				 */
				circle(ctx, x, y, r, color1, color2 = null) {
					ctx.fillStyle = color1;
					ctx.strokeStyle = color2;
					ctx.beginPath();
					ctx.arc(x, y, r, 0, Math.PI * 2);
					if (color2 != null) ctx.stroke();
					if (color1 != null) ctx.fill();
				},
				/**
				 * 三角描画
				 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
				 * @param {number} x1 - x1
				 * @param {number} y1 - y1
				 * @param {number} x2 - x2
				 * @param {number} y2 - y2
				 * @param {number} x3 - x3
				 * @param {number} y3 - y3
				 * @param {string} color - 色
				 * @returns {undefined}
				 */
				triangle(ctx, x1, y1, x2, y2, x3, y3, color) {
					ctx.fillStyle = color;
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.lineTo(x3, y3);
					ctx.closePath();
					ctx.fill();
				},
			},

			//##################################################
			// 基本構成(canvas)
			//##################################################

			requestAnimationFrame,
			getTime,

			//##################################################
			// game外部操作
			//##################################################

			/**
			 * jascゲームエンジン関係
			 */
			game: {
				/**
				 * canvasリサイズ
				 * @param {number} [width=0] 横幅
				 * @param {number} [height=0] 高さ
				 * @returns {undefined}
				 */
				canvasResize(width = 0, height = 0) {
					let li = jasc_gameData.canvas.length;
					if (li <= 0) {
						return;
					}

					let dpr = window.devicePixelRatio;

					if (width == 0 && height == 0) {
						let rect = document.body.getBoundingClientRect();
						[width, height] = [rect.width, rect.height];
					}

					for (let i = 0; i < li; i++) {
						jasc_gameData.canvas[i].width = width * dpr;
						jasc_gameData.canvas[i].height = height * dpr;

						jasc_gameData.ctx[i].scale(dpr, dpr);

						jasc_gameData.canvas[i].style.width = width + "px";
						jasc_gameData.canvas[i].style.height = height + "px";
					}

					doEventListener("canvasResize", [width, height, dpr]);
				},
			},

			//##################################################
			// 連想配列計算
			//##################################################

			/**
			 * 連想配列かどうか判定
			 * @param {object} obj - 連想配列
			 * @returns {boolean}
			 */
			isAssociative(obj) {
				return obj?.constructor === Object;
			},

			/**
			 * 連想配列を結合(上書き)[破壊的関数]
			 * @param {object} parents - 結合先
			 * @param {object} [child] - 結合元
			 * @returns {undefined}
			 */
			overwriteAssociative(parents, child = {}) {
				for (let key in parents) {
					if (jPro.objHasOwnProperty(child, key)[0]) {
						if (jPro.isAssociative(parents[key])) {
							jPro.overwriteAssociative(parents[key], child[key]);
						} else {
							parents[key] = child[key];
						}
					}
				}
			},

			/**
			 * 連想配列に自動でkeyを作成、割り当て
			 * @param {object} obj - 連想配列
			 * @param {any} [data] - 代入内容
			 * @param {string} [baseName=""] - 基準名
			 * @param {string} [prefix="-"] - 通し番号結合文字
			 * @returns {string} 作成されたkey名
			 */
			setAssociativeAutoName(obj = {}, data = null, baseName = "", prefix = "-") {
				if (!this.isAssociative(obj)) {
					ccLog.error("setAssociativeAutoNameError:引数1が連想配列ではありません");
					return null;
				}
				maxNum = -1;
				for (let key in obj) {
					if (jPro.objHasOwnProperty(obj, key)[0]) {
						let sp = key.split(prefix);
						if (sp.length == 2 && sp[0] == baseName) {
							maxNum = Math.max(maxNum, +sp[1]);
						}
					}
				}
				maxNum++;
				keyName = `${baseName}${prefix}${maxNum}`;
				obj[keyName] = data;
				return keyName;
			},

			//##################################################
			// 文字計算
			//##################################################
			/**
			 * 不明なスペースを半角スペースに
			 * @param {string} str - 対象文字列
			 * @returns {string} 変換後
			 */
			uspTosp(str) {
				return (
					str
						.toString()
						.replace(/[ 　\t]/gu, " ")
						.replace(/[\u00A0\u00AD\u034F\u061C]/gu, " ")
						.replace(/[\u115F\u1160\u17B4\u17B5\u180E]/gu, " ")
						// \u200Dが合成時に消失したため部分対処
						.replace(/[\u2000-\u200C\u200E-\u200F\u202F\u205F\u2060-\u2064\u206A-\u206F\u2800]/gu, " ")
						.replace(/[\u3000\u3164]/gu, " ")
						.replace(/[\uFEFF\uFFA0]/gu, " ")
						.replace(/[\u{1D159}\u{1D173}-\u{1D17A}]/gu, " ")
				);
			},
			/**
			 * 全ての文字を共通化
			 * @param {string} str - 対象文字列
			 * @returns {string} 変換後
			 */
			othToHira(str) {
				return jPro
					.uspTosp(str)
					.replace(kanaReg, (ch) => kanaMap[ch])
					.replace(/ﾞ/g, "゛")
					.replace(/ﾟ/g, "゜")
					.replace(/[ア-ヺ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
					.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
					.replace(/[”“″‶〝‟]/gu, '"')
					.replace(/[’‘′´‛‵＇]/gu, "'")
					.replace(/￥/g, "\\")
					.replace(/〜/g, "~")
					.toLowerCase();
			},

			/**
			 * 正規表現文字列エスケープ
			 * @param {string} str - 対象文字列
			 * @returns {string} 変換後
			 */
			escapeRegExp(str) {
				return str && reHasRegExp.test(str) ? str.replace(reRegExp, "\\$&") : str;
			},

			/**
			 * 類似文字列検索
			 * @param {string} str - 対象文字列
			 * @param {string[]} list - 比較文字列リスト
			 * @returns {[string, number]|false} 類似文字列と類似度
			 */
			similarString(str, list) {
				str = jPro.othToHira(str);
				let dist;
				let maxDist = 0,
					maxInd = -1;
				for (let i = 0, li = list.length; i < li; i++) {
					let stli = jPro.othToHira(list[i]);

					//レーベンシュタイン距離
					dist = jPro.levenshteinDistance(str, stli) * 25;

					//N-gram(3,2,1)
					dist += jPro.calcNgram(str, stli, 3) * 10;
					dist += jPro.calcNgram(str, stli, 2) * 20;
					dist += jPro.calcNgram(str, stli, 1) * 45;

					if (dist > maxDist) {
						maxDist = dist;
						maxInd = i;
					}
				}
				if (maxInd == -1) {
					return false;
				}
				return [list[maxInd], ((maxDist * 100) | 0) / 100];
			},

			/**
			 * レーベンシュタイン距離
			 * @param {string} str1 - 対象文字列
			 * @param {string} str2 - 比較文字列
			 * @returns {number} 類似度
			 */
			levenshteinDistance(str1, str2) {
				let r,
					c,
					cost,
					lr = str1.length,
					lc = str2.length,
					d = [];

				for (r = 0; r <= lr; r++) {
					d[r] = [r];
				}
				for (c = 0; c <= lc; c++) {
					d[0][c] = c;
				}
				for (r = 1; r <= lr; r++) {
					for (c = 1; c <= lc; c++) {
						cost = str1.charCodeAt(r - 1) == str2.charCodeAt(c - 1) ? 0 : 1;
						d[r][c] = Math.min(d[r - 1][c] + 1, d[r][c - 1] + 1, d[r - 1][c - 1] + cost);
					}
				}
				return 1 - d[lr][lc] / Math.max(lr, lc);
			},

			/**
			 * N-gram
			 * @param {string} a - 対象文字列
			 * @param {string} b - 比較文字列
			 * @param {number} n - N-gramの長さ
			 * @returns {number} 類似度
			 */
			calcNgram(a, b, n) {
				const aGram = getToNgram(a, n);
				const bGram = getToNgram(b, n);
				const keyOfAGram = Object.keys(aGram);
				const keyOfBGram = Object.keys(bGram);
				// aGramとbGramに共通するN-gramのkeyの配列
				const abKey = keyOfAGram.filter((n) => keyOfBGram.includes(n));

				let dot = abKey.reduce((prev, key) => prev + Math.min(aGram[key], bGram[key]), 0);

				const abLengthMul = Math.sqrt(getValuesSum(aGram) * getValuesSum(bGram));
				return dot / abLengthMul;
			},

			//##################################################
			// 数学計算
			//##################################################

			/**
			 * 自作ワンタイムパスワード
			 * @param {number} key - キーのseed
			 * @returns {number} 結果
			 */
			totp(key) {
				let rnd = new Random(key * ((Date.now() / 30000) | 0));
				return rnd.nextInt(0, 99) * rnd.nextInt(0, 99) + rnd.nextInt(0, 99) * rnd.nextInt(0, 99);
			},

			/**
			 * GASのUtilities.formatDateの移植(弱体)
			 * @param {Date} date - 日付
			 * @param {string} format - フォーマット
			 * @returns {string} フォーマット結果
			 */
			formatDate(date, format) {
				return format
					.replace(/yyyy/g, date.getFullYear())
					.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2))
					.replace(/dd/g, ("0" + date.getDate()).slice(-2))
					.replace(/HH/g, ("0" + date.getHours()).slice(-2))
					.replace(/mm/g, ("0" + date.getMinutes()).slice(-2))
					.replace(/ss/g, ("0" + date.getSeconds()).slice(-2))
					.replace(/SSS/g, ("00" + date.getMilliseconds()).slice(-3));
			},

			/**
			 * formatTime
			 * @param {number} ti - 時間(ms)
			 * @returns {string} フォーマット結果
			 */
			formatTime(ti) {
				ti = (ti / 1000) | 0;
				let y = (ti / 60 / 60 / 24 / 30 / 12) | 0;
				let mo = ((ti / 60 / 60 / 24 / 30) | 0) % 12;
				let d = ((ti / 60 / 60 / 24) | 0) % 30;
				let h = ((ti / 60 / 60) | 0) % 24;
				let mi = ((ti / 60) | 0) % 60;
				let s = ti % 60;

				let ans = "";
				if (y) {
					ans += `${y}年`;
				}
				if (mo) {
					ans += `${mo}ヶ月`;
				}
				if (d) {
					ans += `${d}日`;
				}
				if (h) {
					ans += `${h}時間`;
				}
				if (mi) {
					ans += `${mi}分`;
				}
				if (s) {
					ans += `${s}秒`;
				}

				return ans;
			},

			/**
			 * 組み合わせ列挙
			 * @param {array} arr - 配列
			 * @param {number} [number=0] - 組み合わせ数
			 * @returns {array|false} 組み合わせ
			 */
			permutation(arr, number = 0) {
				let ans = [];
				if (number <= 0) {
					number = arr.length;
				} else if (arr.length < number) {
					ccLog.log("第2引数は第1引数の配列数より少なくして下さい", "error");
					return false;
				}
				let li = arr.length;
				if (number === 1) {
					for (let i = 0; i < li; i++) {
						ans[i] = [arr[i]];
					}
				} else {
					for (let i = 0; i < li; i++) {
						let parts = arr.slice(0);
						parts.splice(i, 1)[0];
						let row = jPro.permutation(parts, number - 1);
						for (let j = 0, lj = row.length; j < lj; j++) {
							ans.push([arr[i]].concat(row[j]));
						}
					}
				}
				return ans;
			},

			/**
			 * jsの小数丸め誤差を無視して比較する
			 * @param {number} a - 比較数値
			 * @param {number} b - 比較数値
			 * @returns {boolean} 比較結果
			 */
			compareFloats(a, b) {
				if (typeof a === "number" && typeof b === "number") {
					return Math.abs(a - b) < Number.EPSILON;
				} else {
					return a === b;
				}
			},

			/**
			 * 厳格な数値チェック
			 * @param {number} n - 数値
			 * @returns {boolean} 数値かどうか
			 */
			isNumber(n) {
				return typeof n === "number" || n instanceof Number;
			},

			/**
			 * Arduinoのmapの移植
			 * @param {number} val - 値
			 * @param {number} fromMin - 現在の最小値
			 * @param {number} fromMax - 現在の最大値
			 * @param {number} toMin - 結果の最小値
			 * @param {number} toMax - 結果の最大値
			 * @returns {number} 結果
			 */
			map(val, fromMin, fromMax, toMin, toMax) {
				if (val <= fromMin) {
					return toMin;
				}
				if (val >= fromMax) {
					return toMax;
				}
				let ratio = (toMax - toMin) / (fromMax - fromMin);
				return (val - fromMin) * ratio + toMin;
			},

			/**
			 * 数値、配列の合計
			 * @param {...number|number[]} data - 数値
			 * @returns {number} 合計
			 */
			sum(...data) {
				return data.reduce((a, b) => a + (Array.isArray(b) ? b.reduce((b1, b2) => b1 + b2) : b), 0);
			},

			/**
			 * Pythonのrangeの移植
			 * @param {number} start - 開始
			 * @param {number} [end] - 終了
			 * @param {number} [step=1] - ステップ
			 * @returns {array} 結果
			 */
			range(start, end, step = 1) {
				if (step == 0) {
					return [];
				}
				if (end == null) {
					end = start;
					start = 0;
				}
				if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
					return [];
				}

				const size = Math.max(Math.ceil(Math.abs((end - start) / step)), 0);
				const result = new Array(size);
				for (let i = 0, value = start; i < size; i++, value += step) {
					result[i] = value;
				}
				return result;
			},

			/**
			 * 均等に数値を分割
			 * @param {number} val - 全体数
			 * @param {number} cou - 分割数
			 * @returns {array} 分割結果
			 */
			divideEqually(val, cou) {
				if (cou <= 0) {
					return [];
				}
				const arr = new Array(cou);
				const initialNum = Math.floor(val / cou);
				const remainder = val % cou;
				for (let i = 0; i < cou; i++) {
					arr[i] = initialNum + (i < remainder ? 1 : 0);
				}
				return arr;
			},

			/**
			 * 配列を分割(n個ずつ)
			 * @param {array} arr - 配列
			 * @param {number} size - 分割数
			 * @returns {array} 分割結果
			 */
			chunk(arr, size) {
				const len = arr.length;
				if (size <= 0 || len === 0) return [];

				const chunks = new Array(Math.ceil(len / size));
				let ind = 0;
				for (let i = 0; i < len; i += size) {
					chunks[ind++] = arr.slice(i, i + size);
				}
				return chunks;
			},
			/**
			 * 配列を分割(n個に)
			 * @param {array} arr - 配列
			 * @param {number} size - 分割数
			 * @returns {array} 分割結果
			 */
			chunkDivide(arr, size) {
				arr = arr.slice();
				let ans = [];
				let de = jPro.divideEqually(arr.length, size);
				for (let i = 0; i < de.length; i++) {
					ans.push(arr.splice(0, de[i]));
				}
				return ans;
			},

			//##################################################
			// ファイル
			//##################################################

			/**
			 * ファイル選択画面表示
			 * @param {string} [accept="*"] - 受け付ける拡張子
			 * @param {boolean} [multiple=false] - 複数選択
			 * @param {number} [timeout=180000] - タイムアウト(ms)
			 * @param {boolean} [directory=false] - ディレクトリ選択
			 * @returns {Promise<FileList>} 選択結果
			 */
			showOpenFileDialog(accept = "*", multiple = false, timeout = 180000, directory = false) {
				return new Promise((resolve, reject) => {
					const input = document.createElement("input");
					input.type = "file";
					input.accept = accept;
					input.multiple = multiple;
					input.webkitdirectory = directory;
					input.onchange = (event) => {
						resolve(event.target.files);
					};
					input.click();
					setTimeout(() => {
						reject("timeout!");
					}, timeout);
				});
			},

			/**
			 * ドロップされたファイルを取得
			 * @param {string|jQuery|HTMLElement} dom - DOMオブジェクト
			 * @param {function} callback - コールバック
			 * @returns {undefined}
			 */
			getDropFilesEvent(dom = "body", callback) {
				if (typeof dom == "string") {
					dom = jPro.acq(dom)[0];
				} else {
					dom = jPro.jQueryObjToDOM(dom);
				}
				dom.addEventListener("drop", async function (event) {
					event.preventDefault();
					event.stopPropagation();

					_getDropFilesEvent(event.dataTransfer.items, callback);
				});
				dom.addEventListener("dragover", (e) => {
					e.preventDefault();
					e.stopPropagation();
				});
			},

			/**
			 * ファイルの種類を判定
			 * @param {File} fileObj - ファイルオブジェクト
			 * @returns {Promise<array>} ファイルタイプ
			 */
			getFileType(fileObj) {
				return new Promise(function (resolve) {
					let fileReader = new FileReader();
					fileReader.onloadend = function (e) {
						let arr = new Uint8Array(e.target.result).subarray(0, 150);

						let header = "";
						for (let i = 0, li = arr.length; i < li; i++) {
							header += ("0" + arr[i].toString(16)).slice(-2);
						}

						// マジックナンバー比較
						let ret = [];
						for (let data of fileTypeRegList) {
							if (data[0].test(header)) {
								ret.push(data[1].split("_"));
								break;
							}
						}
						resolve(ret);
					};
					fileReader.readAsArrayBuffer(fileObj);
				});
			},

			/**
			 * ファイルのMINEタイプ取得
			 * @param {string} ext - 拡張子
			 * @returns {string|array} ファイルタイプ
			 */
			getMimeType(ext) {
				ext = ext.toString().toLowerCase();
				let lst = fileTypeMimeList?.[ext] ?? "application/octet-stream";
				if (!Array.isArray(lst)) {
					return [lst];
				}
				return lst;
			},

			//##################################################
			// 通知
			//##################################################

			/**
			 * 通知許可
			 * @returns {Promise<boolean>} 許可状態
			 */
			allowNotification() {
				return new Promise((resolve, reject) => {
					if (!window.Notification) {
						reject("このブラウザは通知機能をサポートしていません");
						return;
					}
					if (Notification.permission === "granted") {
						resolve(true);
						return;
					}
					if (Notification.permission !== "denied") {
						Notification.requestPermission()
							.then((permission) => {
								resolve(permission === "granted");
							})
							.catch(() => {
								resolve(false);
							});
						return;
					}
					resolve(false);
				});
			},

			/**
			 * 通知送信
			 * @param {string} title - タイトル
			 * @param {string} text - 本文
			 * @param {object} opt - オプション
			 * @returns {Notification} 通知オブジェクト
			 */
			sendNotification(title, text, opt = {}) {
				jPro.isAssociative(opt) || (opt = {});
				opt.text = text;
				return new Notification(title, opt);
			},

			//##################################################
			// 標準関数を使いやすく
			//##################################################

			/**
			 * replaceのPromises対応版
			 * @param {string} str - 文字列
			 * @param {RegExp} regex - 正規表現
			 * @param {function} asyncFn - replace時実行非同期関数
			 * @returns {Promise<string>} 変換後
			 */
			replaceAsync: async function (str, regex, asyncFn) {
				let promises = [];
				str.replace(regex, (match, ...args) => {
					const promise = asyncFn(match, ...args);
					promises.push(promise);
				});
				const data = await Promise.all(promises);
				promises = null;
				return str.replace(regex, () => data.shift());
			},

			/**
			 * definePropertyを使いやすく
			 * @param {object} obj - オブジェクト
			 * @param {string} name - 名前
			 * @param {object} [opt] - オプション
			 * @param {boolean} [opt.configurable=false] - 設定可能
			 * @param {boolean} [opt.enumerable=true] - 参照可能
			 * @param {function} [opt.get] - getter
			 * @param {function} [opt.set] - setter
			 * @param {any} [opt.value] - 値
			 * @param {boolean} [opt.writable=false] - 書き込み可能か
			 * @returns {0|1} 実行結果
			 */
			objDefineProperty(obj, name, opt = {}) {
				let da = {
					configurable: opt?.configurable ?? false,
					enumerable: opt?.enumerable ?? true,
				};
				if (opt?.get || opt?.set) {
					if (opt?.get) {
						da.get = opt?.get;
					}
					if (opt?.set) {
						da.set = opt?.set;
					}
				} else {
					da.value = opt?.value;
					da.writable = opt?.writable ?? false;
				}
				try {
					Object.defineProperty(obj, name, da);
					return 0;
				} catch (e) {
					ccLog.error(e, true);
				}
				return 1;
			},

			/**
			 * definePropertyをprototypeに使用した際の問題対策
			 * - prototypeを探るにはdepthを3にすると良い
			 * @param {object} obj - オブジェクト
			 * @param {number} [depth=0] - 深さ
			 * @param {boolean} [isEnumerable=false] - enumerableを取得するか
			 * @returns {string[]} 名前
			 */
			getObjectPropertyNames(obj, depth = 0, isEnumerable = false) {
				const method = isEnumerable ? "getOwnPropertyNames" : "keys";

				if (depth < 1) {
					return Object[method](obj);
				} else {
					return Array.from(
						Array.from({ length: depth }).reduce(
							(prevValue, e) => {
								if (prevValue.obj === null) return prevValue;
								Object[method](prevValue.obj).forEach((e) => prevValue.result.add(e));
								prevValue.obj = Object.getPrototypeOf(prevValue.obj);
								return prevValue;
							},
							{
								obj: obj,
								result: new Set(),
							}
						).result
					);
				}
			},

			/**
			 * hasOwnPropertyを使いやすく
			 * @param {object} obj - オブジェクト
			 * @param {string} key - 名前
			 * @returns {[boolean, any]} 結果
			 */
			objHasOwnProperty(obj, key) {
				if (key in obj && Object.prototype.hasOwnProperty.call(obj, key)) {
					return [true, obj[key]];
				}
				return [false, null];
			},

			//既存ではないけどある意味標準関数
			/**
			 * cookieの値を取得
			 * @param {string} name - 名前
			 * @returns {string|null} 値
			 */
			getCookie(name) {
				var result = null;
				var cookieName = name + "=";
				var all_cookies = document.cookie;
				var position = all_cookies.indexOf(cookieName);
				if (position != -1) {
					var startIndex = position + cookieName.length;
					var endIndex = all_cookies.indexOf(";", startIndex);
					if (endIndex == -1) {
						endIndex = all_cookies.length;
					}
					result = decodeURIComponent(all_cookies.substring(startIndex, endIndex));
				}
				return result;
			},
			/**
			 * cookieの値を削除
			 * @param {string} name - 名前
			 * @returns {boolean} 成功したか
			 */
			removeCookie(name) {
				if (jPro.getCookie(name)) {
					document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
					return true;
				}
				return false;
			},
			/**
			 * cookieを追加・更新
			 * @param {string} name - 名前
			 * @param {string} value - 値
			 * @param {object} [opt] - オプション
			 * @param {number} [opt.days=3] - 日数
			 * @returns {boolean} 成功したか
			 */
			setCookie(name, value, opt = {}) {
				let date = new Date();
				date.setTime(date.getTime() + (opt?.days ?? 3) * 24 * 60 * 60 * 1000);
				document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
			},

			// 既存ではないけどある意味あったら便利
			/**
			 * コード側でキー入力
			 * @param {string|string[]} code - キーコード
			 * @param {object} [opt] - オプション
			 * @param {0|1|"keydown"|"keyup"} [opt.type="keydown"] - イベントタイプ
			 * @param {boolean} [opt.altKey=false] - altKey
			 * @param {boolean} [opt.shiftKey=false] - shiftKey
			 * @param {boolean} [opt.ctrlKey=false] - ctrlKey
			 * @param {boolean} [opt.metaKey=false] - metaKey(Windowsキーとか)
			 * @param {number} [opt.delay] - キーを離すまでの待ち時間
			 * @param {Window|HTMLElement} [elem=window] - 対象DOM
			 */
			pressKey(code, opt = {}, elem = window) {
				let type = opt.type ?? "keydown";
				if (type == 0) {
					// Falsy の場合
					type = "keydown";
				} else if (type == 1) {
					// Truthy の場合
					type = "keyup";
				} else if (type !== "keydown" && type !== "keyup") {
					ccLog.warn("pressKey: type must be 'keydown' or 'keyup'");
					return 1;
				}
				if (Array.isArray(code)) {
					let ret = 0;
					for (const c of code) {
						ret |= jPro.pressKey(c, opt, elem);
					}
					return ret;
				}
				if (typeof code !== "string" || code.length < 1) {
					ccLog.warn("pressKey: code must be string");
					return 1;
				}
				const kEvent = new KeyboardEvent(type, {
					code: code,
					altKey: opt.altKey ?? false,
					shiftKey: opt.shiftKey ?? false,
					ctrlKey: opt.ctrlKey ?? false,
					metaKey: opt.metaKey ?? false,
				});
				let dom = jPro.acq(elem);
				if (!dom) {
					return 1;
				}
				if (dom?.[0]) {
					dom = dom[0];
				}
				dom.dispatchEvent(kEvent);
				if (type == "keydown" && opt.delay != null) {
					setTimeout(() => {
						opt.type = "keyup";
						jPro.pressKey(code, opt, elem);
					}, opt.delay);
				}
				return 0;
			},

			//##################################################
			// class同士の演算補助
			//##################################################

			/**
			 * class同士の演算補助
			 * オーバーロード方法1
			 *
			 * `customOperator(Object,"+")(a => b => a + b)`
			 * を定義で
			 * `1["+"](3) // => 4`
			 * となる
			 *
			 * @param {object} obj - 対象オブジェクト
			 * @param {string} [op="+"] - 演算子
			 * @returns {void}
			 */
			customOperator(obj, op = "+") {
				return function (f) {
					Object.defineProperty(obj.prototype, op, {
						value: function (a) {
							return f(this)(a);
						},
						enumerable: false,
						configurable: false,
						writable: false,
					});
				};
			},

			//##################################################
			// カスタムログ(class)
			//##################################################
			/**
			 * カスタムログ
			 * @param {object} [arg] - オプション
			 * @param {boolean} [arg.debug=false] - 通常表示を表示するか
			 * @param {boolean} [arg.oblInd=true] - 必須表示を表示するか
			 * @param {string} [arg.prefix=""] - 前に表示する名称
			 * @param {object} [arg.style] - カスタムスタイル
			 * @returns {ConsoleCustomLog}
			 */
			ConsoleCustomLog: class {
				constructor(arg = {}) {
					this._isDebug = arg.debug ?? false;
					this._isOblInd = arg.oblInd ?? true;
					this.style = {
						ccLogSys: "color: #00B7CE;",
						system: "color: #00d0d0;",
						time: "color: green;",
						error: "color: red;font-weight: bold;",
						pale: "color: #bbb;",
						data: "color:purple;",
					};
					this._prefix = arg.prefix ?? "";
					this._timeArr = {};
					if (arg.style) {
						this.style = Object.assign(this.style, arg.style);
					}

					//代入で関数実行
					jPro.objDefineProperty(this, "debug", {
						set(flag) {
							this._isDebug = flag;
							this.log(`DebugMode: ${flag ? "ON" : "OFF"}!`, "ccLogSys", true);
						},
					});
					jPro.objDefineProperty(this, "obligationIndication", {
						set(flag) {
							this._isOblInd = flag;
							this.log(`OblInd is ${flag ? "ON" : "OFF"}!`, "ccLogSys", true);
						},
					});
					jPro.objDefineProperty(this, "head", {
						set(str) {
							this._prefix = str;
						},
						get() {
							return this._prefix;
						},
					});
				}
				/**
				 * カスタムスタイルを追加
				 * @param {string} name - 名前
				 * @param {string} style - スタイル
				 * @returns {undefined}
				 */
				custom(name, style) {
					if (typeof name == "string") {
						this.style[name] = style;
					} else if (typeof name == "object") {
						this.style = Object.assign(this.style, name);
					} else {
						this.warn("不明なデータ設定");
					}
				}
				/**
				 * ログ表示
				 * @param {any} str - ログ
				 * @param {string} type - 表示スタイル名(又はcssスタイル)
				 * @param {boolean} [obligation=false] - 必須表示
				 * @returns {undefined}
				 */
				log(str, type, obligation = false) {
					if (!(this._isDebug || (this._isOblInd && obligation))) {
						return;
					}
					let logStyle = "";
					if (typeof type == "string") {
						if (this.style?.[type]) {
							logStyle = this.style[type];
						} else {
							logStyle = type;
						}
					}
					let pre = "";
					if (this._prefix) {
						pre = `[${this._prefix}]`;
					}
					console.log(`%c${pre}${str}`, logStyle);
				}
				/**
				 * 警告表示
				 * @param {any} errObj - ログ
				 * @param {boolean} [obligation=false] - 必須表示
				 * @returns {undefined}
				 */
				warn(errObj, obligation = false) {
					if (!(this._isDebug || (this._isOblInd && obligation))) {
						return;
					}
					if (this._prefix) {
						console.warn(`[${this._prefix}]`, errObj);
					} else {
						console.warn(errObj);
					}
				}
				/**
				 * エラー表示
				 * @param {any} errObj - ログ
				 * @param {boolean} [obligation=false] - 必須表示
				 * @returns {undefined}
				 */
				error(errObj, obligation = false) {
					if (!(this._isDebug || (this._isOblInd && obligation))) {
						return;
					}
					if (this._prefix) {
						console.error(`[${this._prefix}]`, errObj);
					} else {
						console.error(errObj);
					}
				}
				/**
				 * 時間計測
				 * @param {string} name - 名前
				 * @param {boolean} [obligation=false] - 必須表示
				 * @returns {number|false} 経過時間
				 */
				time(name, obligation = false) {
					if (this._timeArr[name]) {
						//終了
						let time = (performance.now() - this._timeArr[name]) | 0;
						this.log(`${name}End: ${time}ms`, "time", obligation);
						this._timeArr[name] = null;
						delete this._timeArr[name];
						return time;
					} else {
						//開始
						this._timeArr[name] = performance.now();
						this.log(`${name}Start`, "time", obligation);
						return false;
					}
				}
			},
			//##################################################
			// 画像管理(class)
			//##################################################
			/**
			 * 画像管理
			 * @param {object} urls - URL
			 * @returns {AssetsManager}
			 */
			AssetsManager: class {
				constructor(urls = {}) {
					this._promises = [];
					this._imageMap = new Map();

					//URLを追加
					for (const [name, url] of Object.entries(urls)) {
						this.add(name, url);
					}
				}
				/**
				 * 画像追加
				 * @param {string} name - 画像呼び出し名
				 * @param {string} url - 画像URL
				 * @returns {undefined}
				 */
				add(name, url) {
					const img = new Image();
					this._promises.push(
						new Promise((resolve, reject) => {
							img.addEventListener("load", () => {
								this._imageMap.set(name, img);
								resolve();
							});
							img.addEventListener("error", (e) => {
								this._imageMap.set(name, null);
								reject(e);
							});
						})
					);
					img.src = url;
				}
				/**
				 * キャッシュ追加
				 * @param {string} name - 画像呼び出し名
				 * @param {HTMLImageElement} img - 画像
				 * @returns {undefined}
				 */
				addCache(name, img) {
					this._imageMap.set(name, img);
				}
				/**
				 * 画像読み込み
				 * @returns {Promise<Map<string, HTMLImageElement>>}
				 */
				load() {
					return Promise.all(this._promises).then(() => {
						return this._imageMap;
					});
				}
				/**
				 * 画像取得
				 * @param {string} name - 画像呼び出し名
				 * @returns {HTMLImageElement}
				 */
				get(name) {
					return this._imageMap.get(name);
				}
				/**
				 * 画像削除
				 * @param {string} name - 画像呼び出し名
				 * @returns {undefined}
				 */
				del(name) {
					this._imageMap.delete(name);
				}
				/**
				 * 画像全削除
				 * @returns {undefined}
				 */
				clear() {
					this._imageMap.clear();
				}
			},
		};

		//##################################################
		// jasc関数を読み取り専用に
		//##################################################

		jPro.on = jPro.addEventListener;
		jPro.off = jPro.removeEventListener;

		//読み込み専用設定
		for (let key in jPro) {
			jPro.objDefineProperty(JASC.prototype, key, {
				value: jPro[key],
			});
			if (jPro.isAssociative(jPro[key])) {
				for (let ki in jPro[key]) {
					jPro.objDefineProperty(JASC.prototype[key], ki, {
						value: jPro[key][ki],
					});
				}
			}
		}
		//for...in用データ取得用
		jPro.objDefineProperty(jasc_readonlyData, "_jPro", {
			value: JASC.prototype,
		});

		//##################################################
		// 共通利用関数(private)
		//##################################################

		function doEventListener(eventType = "", args = []) {
			if (!jPro.isAssociative(jasc_events?.[eventType])) {
				return;
			}
			e = jasc_events[eventType];
			for (let key in e) {
				if (typeof e[key] == "function") {
					try {
						e[key]?.(...args);
					} catch (e) {
						ccLog.error(e, true);
					}
				}
			}
		}

		function getToNgram(text, n = 3) {
			let ret = {};
			for (let m = 0; m < n; m++) {
				for (let i = 0, li = text.length - m; i < li; i++) {
					const c = text.substring(i, i + m + 1);
					ret[c] = ret[c] ? ret[c] + 1 : 1;
				}
			}
			return ret;
		}
		// valueが数値のobjectの数値の和を求める関数。
		function getValuesSum(object) {
			return Object.values(object).reduce((prev, current) => prev + current, 0);
		}

		// 関数を複数回定義するのは無駄なのでここで定義

		// getDropFilesEventの内部処理用
		async function _getDropFilesEvent(items, callback) {
			const files = [];

			const searchFile = async (entry) => {
				if (entry.isFile) {
					const file = await new Promise((resolve) => {
						entry.file((file) => {
							resolve(file);
						});
					});
					files.push(file);
				} else if (entry.isDirectory) {
					const dirReader = entry.createReader();
					let allEntries = [];
					const getEntries = () =>
						new Promise((resolve) => {
							dirReader.readEntries((entries) => {
								resolve(entries);
							});
						});
					const readAllEntries = async () => {
						const entries = await getEntries();
						if (entries.length > 0) {
							allEntries = allEntries.concat(entries);
							await readAllEntries();
						}
					};
					await readAllEntries();
					for (const entry of allEntries) {
						await searchFile(entry);
					}
				}
			};

			const calcFullPathPerItems = Array.from(items).map((item) => {
				return new Promise((resolve, reject) => {
					const entry = item.webkitGetAsEntry();
					// nullの時は何もしない
					if (!entry) {
						resolve();
						return;
					}
					searchFile(entry).then(resolve).catch(reject);
				});
			});
			await Promise.all(calcFullPathPerItems);
			callback?.(files);
		}

		//##################################################
		// 自動実行(雑多)
		//##################################################

		//initSettingの読み込みライブラリ表示更新
		function updateInitSettingUseLib() {
			for (let key in jascLibTree) {
				jasc_initSettingData.useLib[key] = jascLibTree[key].isLoad;
			}
		}

		//jasc.の記述を省略しても実行出来る関数を作成
		function openFuncCreate() {
			let list = jasc_initSettingData.openFuncList;

			if (!list) {
				//なし
				return;
			}

			for (let val of list) {
				if (jPro.objHasOwnProperty(jPro, val)[0]) {
					window[val] = jPro[val]; //.bind(jasc);
				}
			}
		}

		//jasc連携ライブラリの自動インポート
		function jascLibLoad(name, d) {
			if (!d) {
				ccLog.time(`LibLoadTree(${name})`);
			}
			return new Promise(async (resolve, reject) => {
				let data = jPro.objHasOwnProperty(jascLibTree, name);
				if (data[0]) {
					if (data[1].isLoad) {
						ccLog.log(`${name} is already loaded`, "pale");
						end(2);
						return;
					}
					jascLibTree[name].isLoad = true;

					let rel = data[1].relations;
					for (let i = 0, li = rel.length; i < li; i++) {
						if ((await jascLibLoad(rel[i], 1)) == 3) {
							end(3);
							return;
						}
					}

					jPro.loadFile(
						jPro.absolutePath(jasc_readonlyData.jascBaseUrl + jasc_initSettingData.libPath + data[1].lnk),
						function (err) {
							if (err) {
								end(3);
								return;
							}
							end(0);
						},
						data[1].module ?? false
					);
					return;
				}
				end(1);
				return;
				function end(f) {
					if (f == 3) {
						jascLibTree[name].isLoad = false;
					}
					if (!d) {
						ccLog.time(`LibLoadTree(${name})`);
					}
					resolve(f);
				}
			});
		}

		//スマホでは:hoverではなく:active
		function touchHoverKill() {
			var touch = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

			if (touch) {
				try {
					for (var si in document.styleSheets) {
						var styleSheet = document.styleSheets[si];
						if (!styleSheet.cssRules) continue;

						for (var ri = styleSheet.cssRules.length - 1; ri >= 0; ri--) {
							let ssCr = styleSheet.cssRules[ri];
							if (!ssCr.selectorText) continue;

							ssCr.selectorText = ssCr.selectorText.replace(/:hover/g, ":active");
						}
					}
				} catch (ex) {}
			}

			//:active動作用
			if (!document.body.ontouchstart) {
				document.body.ontouchstart = "";
			}
		}

		//Twitterのウェジット表示補助
		function autoTwitterScriptLoad() {
			if (jPro.acq(".twitter-timeline").length) {
				jPro.loadFile("https://platform.twitter.com/widgets.js", function (err) {
					if (err) return;
					ccLog.log("twitter script loaded", "system");

					jPro.waitForElement(".twitter-timeline-rendered iframe", null, 60 * 1000).then(function (e) {
						e[0].addEventListener("load", () => {
							twLoad();
							function twLoad() {
								if (e[0].clientHeight) {
									scrollCssSet();
									ccLog.log("twitter loaded end", "system");
									return;
								}
								setTimeout(twLoad, 10);
							}
						});
					});
				});
			} else {
				ccLog.log("not twitter widgets", "system");
			}
		}

		//imgタグエラー時自動処理
		function autoImageErrorGet() {
			let setCou = 0;
			let skipCou = 0;
			let imgs = jPro.acq("!img:not(.jascNotImgErrGet)");
			for (let elem of imgs) {
				if (elem.classList.contains("jascImgErrGetter")) {
					skipCou++;
					continue;
				}
				elem.classList.add("jascImgErrGetter");
				if (!elem.onerror) {
					elem.onerror = function (e) {
						doEventListener("imageLoadError", [e]);

						elem.onerror = elem.onload = null;
					};
					elem.onload = function () {
						elem.onerror = elem.onload = null;
					};
					setCou++;
				}
			}
			let imgLen = imgs.length;
			if (imgLen - skipCou > 0) {
				ccLog.log(`onErrSetImage[${setCou}/${imgLen - skipCou}(${imgLen})]`, "data");
			}
		}

		//外部リンク判定
		function autoExLinkGet() {
			let setCou = 0;
			let skipCou = 0;
			let links = jPro.acq("!a:not(.jascNotExLinkGet)");
			for (let elem of links) {
				if (elem.classList.contains("jascExLinkGetter")) {
					skipCou++;
					continue;
				}
				elem.classList.add("jascExLinkGetter");
				if (jPro.isExternalLink(elem)) {
					// 別ウィンドウに飛ばす
					if (!elem?.target || elem.target != "_self") {
						elem.target = "_blank";
					}
					// セキュリティ対策
					if (elem.target == "_blank") {
						if (!elem?.rel) {
							elem.rel = "noopener noreferrer";
						}
					}
					elem.classList.add("jascExLink");
					// テキストの場合のみ
					if (jPro.isTextNode(elem)) {
						elem.classList.add("jascExTextLink");
						doEventListener("exTextLinkGet", [elem]);
					}
					doEventListener("exLinkGet", [elem]);
				}
				setCou++;
			}
			let linkLen = links.length;
			if (linkLen - skipCou > 0) {
				ccLog.log(`onSetExLink[${setCou}/${linkLen - skipCou}(${linkLen})]`, "data");
			}
		}

		//##################################################
		// 自動実行(game)
		//##################################################
		function gameInit() {
			ccLog.log("gameInit do", "system");
			doEventListener("gameInit");

			fps_startTime = getTime();

			gameRAFrame();
		}

		function gameRAFrame() {
			let times = getTime() - fps_startTime;
			fps_frame = (times / (1000 / jasc_settingData.gameFps)) | 0;

			let cou = fps_frame - fps_oldFrame + fps_BBForward;
			if (cou >= 1) {
				if (cou > jasc_settingData.BBFCapacity) {
					fps_BBForward = cou - jasc_settingData.BBFCapacity;
					cou = jasc_settingData.BBFCapacity;
					if (fps_BBForward > 50) {
						fps_BBForward = 50;
					}
				} else {
					fps_BBForward = 0;
				}

				jasc_readonlyData.isDrawing = false;

				for (let i = cou - 1; i >= 0; i--) {
					if (!i) {
						jasc_readonlyData.isDrawing = true;
					}
					if (gameFrameUpdate()) {
						return;
					}
				}
				fps_frameCount++;
				fps_doFrameCount += cou;
				fps_oldFrame = fps_frame;
			}
			if (times >= 1000) {
				jasc_readonlyData.nowFps = fps_frameCount;
				jasc_readonlyData.doFps = fps_doFrameCount;
				fps_frameCount = 0;
				fps_doFrameCount = 0;
				fps_startTime = getTime();
				fps_oldFrame = 0;
			}

			doEventListener("gameRequestAnimationFrame", [fps_frameCount, fps_doFrameCount]);
			requestAnimationFrame(gameRAFrame);
		}

		function gameFrameUpdate() {
			if (jasc_readonlyData.pressKeySet.size) {
				doEventListener("keyPress", [jasc_readonlyData.pressKeySet]);
			}

			doEventListener("gameFrameUpdate", [jasc_readonlyData.isDrawing]);

			return;
		}

		//##################################################
		// gameシステム動作
		//##################################################
		function ctxUpdate() {
			jasc_gameData.ctx = [];
			for (let i = 0; i < jasc_gameData.canvas.length; i++) {
				jasc_gameData.ctx[i] = jasc_gameData.canvas[i].getContext("2d");
			}
			jPro.game.canvasResize();
		}

		//##################################################
		// init用
		//##################################################

		return new JASC();
	}

	//##################################################
	// 重複実行等対処
	//##################################################
	if (typeof window?.Jasc == "undefined") {
		window.Jasc = _jasc;
	} else {
		console.warn("[jasc]変数「Jasc」は既に使用されています！");
	}
	if (typeof window?.jasc == "undefined") {
		window.jasc = _jasc();
	} else {
		console.warn("[jasc]変数「jasc」は既に使用されています！");
	}
})();
