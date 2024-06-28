// jasc.js Ver.1.13.9

/*
! ！！注意！！
! scriptタグをdeferで読み込むとjasc.settingが動作しない場合があります
!

? jascのコメントについて
jascのコメントはVScode拡張機能「Better Comments」を利用して書かれています

? Github
https://github.com/hi2ma-bu4/jasc

? CDN
*- jasc.js
https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jasc.js
* minify版
https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jasc.min.js

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
*+ .jascNotImgErrGet	: [ユーザー付与]imgタグエラー時自動処理の巡回拒否用
*- .jascImgErrGetter	: imgタグエラー時自動処理の巡回確認用
*+ .jascNotExLinkGet	: [ユーザー付与]外部リンク時自動処理の巡回拒否用
*- .jascExLinkGetter	: 外部リンク時自動処理の巡回確認用
*- .jascExLink		: 外部リンク(cssで処理する用)
*- .jascExTextLink	: 外部リンク(文字に対してのリンクのみ)(cssで処理する用)


*/

/*
? jasc動作関連
* jasc.initSetting = args												//jasc初期設定(DOMContentLoaded以降変更不可)
* jasc.setting = args													//jasc設定
* jasc.addEventListener(eventType = "", callback, name = "", returnName = false)	//jasc内イベント設定
* jasc.on(eventType = "", callback, name = "", returnName = false)																//jasc.addEventListenerと同じ
* jasc.removeEventListener(eventType = "", name = "")					//jasc内イベント解除
* jasc.off(eventType = "", name = "")															//jasc.removeEventListenerと同じ
- jasc._dispatchEvent(eventType = "", args = [])						//jasc内イベント発火[システム使用用]

*- jasc開発者用関数
* jasc.develop.createEvent(name)										//jasc内イベントリスナーの追加
* jasc.develop.addPlugins(callback, name = "", opt = {})				//プラグインの登録
* jasc.develop.hasPlugins(name)											//プラグインが適用されているか

*- 読み取り専用
* jasc.readonly															//jasc内静的変数一覧

*/
/*
? 機能
*- 基本構成(DOM)
- Jasc.acq(str, par = document) 										//要素取得(jQuery非対応版)
* jasc.acq(str, par = document) 										//要素取得
* jasc.jQueryObjToDOM(obj)												//jQueryオブジェクト→DOM変換
- Jasc.toggleClass(name, str)											//クラス反転(jQuery非対応版)
* jasc.toggleClass(name, str)											//クラス反転
* Jasc.cssVariableIO(name, val)											//css変数取得&書き換え
- jasc.cssVariableIO(name, val)
* Jasc.scrollbarXVisible(elem = document.body)							//スクロールバー存在判定X
- jasc.scrollbarXVisible(elem = document.body)
* Jasc.scrollbarYVisible(elem = document.body)							//スクロールバー存在判定Y
- jasc.scrollbarYVisible(elem = document.body)
* Jasc.getScrollVerticalPosition(e, margin = 0)							//スクロール位置判定
- jasc.getScrollVerticalPosition(e, margin = 0)
* jasc.loadFile(src, opt = {})											//ファイル動的読み込み
* jasc.isExternalLink(elem)												//外部リンク判定
* jasc.isTextNode(elem)													//テキストノード判定
* jasc.waitForElement(selector, text = null, timeoutMs = 0, par = document)			//dom出現待機
*- 基本構成(その他)
* jasc.ajax(options = {})												//jQuery.ajaxの下位互換
* Jasc.historyPush(url, title = "", history = true)						//動的url
- jasc.historyPush(url, title = "", history = true)
* Jasc.getUrlVars(data)													//urlパラメータ分解
- jasc.getUrlVars(data)
* jasc.absolutePath(path = "", notElem = false)							//相対url(絶対url)→絶対url
* jasc.autoUrlShare(json)												//Url共有
* Jasc.copy2Clipboard(data)												//クリップボードにコピー
- jasc.copy2Clipboard(data)
* Jasc.dataTypeFormatting(data, nestingDepth = 0)						//型統一変換
- jasc.dataTypeFormatting(data, nestingDepth = 0)
*- canvas描画
* jasc.draw.text(ctx, xy, text, size, color, align = "center", base = "middle")	//canvasテキスト描画
* jasc.draw.line(ctx, xy1, xy2, color)										//canvas線描画
* jasc.draw.rect(ctx, xy, wh, color)											//canvas四角形描画
* jasc.draw.circle(ctx, xy, r, color1, color2 = null)								//canvas円描画
* jasc.draw.triangle(ctx, xy1, xy2, xy3, color)							//canvas三角形描画
*- game動作
* jasc.game.changeCurrentCanvas(key = "")								//現在のカレントキャンバスの管理
* jasc.game.canvasResize(width = 0, height = 0)							//ゲーム画面リサイズ
*- 連想配列計算
* Jasc.isAssociative(obj)												//連想配列判定
- jasc.isAssociative(obj)
* Jasc.overwriteAssociative(parents, child = {})						//連想配列を結合(上書き)[破壊的関数]
- jasc.overwriteAssociative(parents, child = {})
* Jasc.setAssociativeAutoName(obj = {}, data = null, baseName = "", prefix = "-")		//連想配列自動名前付け
- jasc.setAssociativeAutoName(obj = {}, data = null, baseName = "", prefix = "-")
*- 文字計算
* Jasc.uspTosp(str)														//不明な空白を半角スペースに変換
- jasc.uspTosp(str)
* Jasc.othToHira(str)													//全ての文字を共通化
- jasc.othToHira(str)
* Jasc.escapeRegExp(str)												//正規表現文字列エスケープ
- jasc.escapeRegExp(str)
* Jasc.similarString(str, list)											//類似文字列検索
- jasc.similarString(str, list)
* Jasc.levenshteinDistance(str1, str2)									//レーベンシュタイン距離
- jasc.levenshteinDistance(str1, str2)
* Jasc.calcNgram(a, b, n)												//N-gram
- jasc.calcNgram(a, b, n)
- Jasc._getToNgram(text, n = 3)											//N-gram計算
- Jasc._getValuesSum(object)											//valueが数値のobjectの数値の和を求める関数。
*- 数学計算
* Jasc.totp(key)														//自作ワンタイムパスワード
- jasc.totp(key)
* Jasc.formatDate(date, format)											//GASのUtilities.formatDateの下位互換
- jasc.formatDate(date, format)
* jasc.permutation(arr, number = 0)										//組み合わせ列挙
* Jasc.compareFloats(a, b)												//小数丸め誤差を無視して比較
- jasc.compareFloats(a, b)
* Jasc.isNumber(n)														//厳格な数値判定
- jasc.isNumber(n)
* Jasc.map(val, fromMin, fromMax, toMin, toMax)							//Arduinoのmapの移植
- jasc.map(val, fromMin, fromMax, toMin, toMax)
* Jasc.sum(...data)														//数値、配列の合計
- jasc.sum(...data)
* Jasc.range(start, end, step = 1)										//Pythonのrangeの移植
- jasc.range(start, end, step = 1)
* Jasc.divideEqually(val, cou)											//均等に数値を分割
- jasc.divideEqually(val, cou)
* Jasc.chunk(arr, size)													//配列を分割(n個ずつ)
- jasc.chunk(arr, size)
* Jasc.chunkDivide(arr, size)											//配列を分割(n個に)
- jasc.chunkDivide(arr, size)
*- ファイル
* Jasc.showOpenFileDialog(accept = "*", multiple = false, timeout = 180000, directory = false)	//ファイル選択画面表示
- jasc.showOpenFileDialog(accept = "*", multiple = false, timeout = 180000, directory = false)
* jasc.getDropFilesEvent(dom = "body", callback)						//ドロップされたファイルを取得
- async Jasc._getDropFilesEvent(items, callback)						//getDropFilesEventの内部処理用
* Jasc.getFileType(fileObj)												//ファイルの種類を判定
- jasc.getFileType(fileObj)
* Jasc.getMimeType(ext)													//拡張子からMIMEタイプを取得
- jasc.getMimeType(ext)
*- 通知
* Jasc.allowNotification()												//通知許可 判定&取得
- jasc.allowNotification()
* jasc.sendNotification(title, text, icon)								//通知送信
- jasc.sendNotification(title, text, icon)
*- class同士の演算補助
* Jasc.customOperator(obj, op = "+")											//class同士の演算補助
- jasc.customOperator(obj, op = "+")
*- cookie簡単操作
* Jasc.getCookie(name)													//クッキー取得
- jasc.getCookie(name)
* Jasc.removeCookie(name)												//クッキー削除
- jasc.removeCookie(name)
* Jasc.setCookie(name, value, opt = {})									//クッキー設定
- jasc.setCookie(name, value, opt = {})
*- オブジェクト操作
* async Jasc.replaceAsync(str, regex, asyncFn)								//replaceの非同期版
- async jasc.replaceAsync(str, regex, asyncFn)
* jasc.objDefineProperty(obj, name, opt = {})							//definePropertyを使いやすく
* Jasc.getObjectPropertyNames(obj, depth = 0, isEnumerable = false)		//definePropertyをprototypeに使用した際の問題対策
- jasc.getObjectPropertyNames(obj, depth = 0, isEnumerable = false)
* Jasc.objHasOwnProperty(obj, key)										//hasOwnPropertyを使いやすく
- jasc.objHasOwnProperty(obj, key)
* Jasc.isSetter(obj, key)												//メゾットがセッターかを判定
- jasc.isSetter(obj, key)
* Jasc.isGetter(obj, key)												//メゾットがゲッターかを判定
- jasc.isGetter(obj, key)

*- 標準関数を使いやすく
* jasc.pressKey(code, type = "keydown", opt = {}, elem = window)		//キーを押す

* Jasc.requestAnimationFrame()											//requestAnimationFrameの表記ブレを纏めただけ
- jasc.requestAnimationFrame()
* Jasc.now()															//performance.nowの表記ブレを纏めただけ
- jasc.now()
* Jasc.getTime()														//new Date().getTime()を環境別で動作させる
- jasc.getTime()


*- class
* new Jasc.Random(seed = 88675123)										//ランダム生成クラス[システム使用用]
* new Jasc.ConsoleCustomLog(arg = {})									//コンソール出力の色付け
- jasc.consoleCustomLog(arg = {})
* new Jasc.AssetsManager(urls = {})										//画像先行読み込み管理
- jasc.assetsManager(urls = {})

*/
/*
? jasc.readonlyの内容
*- 起動時自動設定
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
*- 動的変更
* pressKeySet					//現在の押下キー
*- ゲームエンジン動作時
* isDrawing						//描画可能か
* doFps							//現在のFPS
* game._canvas					//ゲームに使用されているcanvas
* game.ctx						//ゲームに使用されているctx

*/
/*
? jasc起動時読み込みライブラリ(jasc.initSetting.useLib)
*- 自作
* andesine					//jasc拡張ゲームライブラリ
* kunzite					//html → markdown(KaTeX)
* gitrine					//localStorageの保存時に圧縮
* zircon					//暗号化
* beryl						//圧縮
*- 他作 - kunzite
* katex-auto				//katex-jsの自動処理用(kunziteでは未使用)
* katex-js					//KaTeXをhtmlで表示する
	* katex-css				//KaTeXのCSS
* marked					//html → markdown
* prism-js					//codeブロックの自動ハイライト
	* prism-css				//PrismのCSS
* purify					//html文字列の削除
*- 他作 - beryl
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
*- 基本イベント
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
*- jascゲームエンジン
* gameInit					//ゲーム初期化時
* gameRequestAnimationFrame	//RequestAnimationFrameのタイミングで実行
* gameFrameUpdate			//ゲーム(仮想)フレーム更新時
* canvasAdd					//キャンバス追加時
* ctxAdd
* canvasResize				//キャンバスサイズ変更時
*- jasc開発者用イベント
* runNow					//即時実行
* dispatchEvent				//イベント発生時
* createEventType			//イベントタイプ生成時
* addPlugin					//プラグイン追加時
* methodAddPlugin			//プラグインメソッド追加時
* methodOverwritePlugin		//プラグインメソッド上書き時

? 自動イベント実行順
* jasc.on("interactive")			//※実行タイミング後設定で、動作しない
* document.addEventListener("DOMContentLoaded")
	* jasc.on("imageLoadError")		//※複数実行
	* jasc.on("DOMContentLoaded")	//※実行タイミング後設定で、設定した瞬間(同期)実行
	* jasc.on("exTextLinkGet")		//※複数実行
	* jasc.on("exLinkGet")			//※複数実行
* window.addEventListener("load")
	* jasc.on("load")				//※実行タイミング後設定で、設定した瞬間(同期)実行
	* jasc.on("gameInit")			//※実行タイミング後設定で、動作しない

*/

// 説明書はここまで

class Jasc {
	//##################################################
	// 内部使用静的プライベート定数
	//##################################################
	static #_RE_REGEXP = /[\\^$.*+?()[\]{}|]/g;

	static #_ACQ_REGEXP = /[ :\[\]+>]|^.+[\.#]/;

	// ファイルタイプ正規表現
	static #_FILETYPE_REG_LIST = [
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
	static #_FILETYPE_MIME_LIST = {
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
		// pgfはMIMEは存在しない
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

	//##################################################
	// 内部使用プライベート変数
	//##################################################
	_jasc_debug = false;
	_ccLog = new Jasc.ConsoleCustomLog({
		prefix: "jasc",
		debug: false,
	});

	#isFlags = {
		domLoad: false,
		domLoadSkip: false,
		windowLoad: false,
		windowLoadSkip: false,

		jQueryLoad: false,
	};

	#jascLibTree = {
		// 自作
		andesine: {
			isLoad: false,
			lnk: "andesine.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/andesine.min.js",
			relations: [],
		},
		kunzite: {
			isLoad: false,
			lnk: "kunzite.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/kunzite.min.js",
			relations: ["katex-js", "marked", "prism-js", "prism-css", "purify"],
		},
		gitrine: {
			isLoad: false,
			lnk: "gitrine.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/gitrine.min.js",
			relations: ["zircon"],
		},
		zircon: {
			isLoad: false,
			lnk: "zircon.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/zircon.min.js",
			relations: ["beryl"],
		},
		beryl: {
			isLoad: false,
			lnk: "beryl.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/beryl.min.js",
			relations: ["base64urlEncoder", "cheep-compressor", "deflate", "inflate", "lzbase62", "lz-string", "url-comp", "URLpercentEncoder"],
		},
		// 他作 - kunzite
		"katex-auto": {
			isLoad: false,
			lnk: "kunziteLib/katex/auto-render.min.js",
			alternative: "https://cdn.jsdelivr.net/npm/katex/dist/contrib/auto-render.min.js",
			relations: ["katex-js", "katex-css"],
		},
		"katex-js": {
			isLoad: false,
			lnk: "kunziteLib/katex/katex.min.js",
			alternative: "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js",
			relations: ["katex-css"],
		},
		"katex-css": {
			isLoad: false,
			lnk: "kunziteLib/katex/katex.min.css",
			alternative: "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css",
			relations: [],
		},
		marked: {
			isLoad: false,
			lnk: "kunziteLib/marked/marked.min.js",
			alternative: "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
			relations: [],
		},
		"prism-js": {
			isLoad: false,
			lnk: "kunziteLib/prism/prism.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/kunziteLib/prism/prism.js",
			relations: ["prism-css"],
		},
		"prism-css": {
			isLoad: false,
			lnk: "kunziteLib/prism/prism.css",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/kunziteLib/prism/prism.css",
			relations: [],
		},
		purify: {
			isLoad: false,
			lnk: "kunziteLib/purify/purify.min.js",
			alternative: "https://cdn.jsdelivr.net/gh/cure53/DOMPurify/dist/purify.min.js",
			relations: [],
		},
		// 他作 - beryl
		base64urlEncoder: {
			isLoad: false,
			lnk: "berylLib/base64urlEncoder.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/berylLib/base64urlEncoder.min.js",
			relations: [],
		},
		"cheep-compressor": {
			isLoad: false,
			lnk: "berylLib/cheep-compressor.min.js",
			alternative: "https://cdn.jsdelivr.net/gh/utubo/js-cheep-compressor/cheep-compressor.min.js",
			relations: [],
		},
		deflate: {
			isLoad: false,
			lnk: "berylLib/deflate.min.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/berylLib/deflate.min.js",
			relations: [],
		},
		inflate: {
			isLoad: false,
			lnk: "berylLib/inflate.min.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/berylLib/inflate.min.js",
			relations: [],
		},
		lzbase62: {
			isLoad: false,
			lnk: "berylLib/lzbase62.min.js",
			alternative: "https://cdn.jsdelivr.net/gh/polygonplanet/lzbase62/dist/lzbase62.min.js",
			relations: [],
		},
		"lz-string": {
			isLoad: false,
			lnk: "berylLib/lz-string.min.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/berylLib/lz-string.min.js",
			relations: [],
		},
		"url-comp": {
			isLoad: false,
			lnk: "berylLib/url-comp.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/berylLib/url-comp.min.js",
			relations: [],
		},
		URLpercentEncoder: {
			isLoad: false,
			lnk: "berylLib/URLpercentEncoder.js",
			alternative: "https://cdn.jsdelivr.net/gh/hi2ma-bu4/jasc/jascLib/berylLib/URLpercentEncoder.min.js",
			relations: [],
		},
	};

	// 設定
	#jasc_initSettingData = {
		openFuncList: ["jasc.acq", "Jasc.isAssociative"],
		libPath: "./jascLib/",

		useLib: {},

		isGame: false,
	};
	#jasc_settingData = {
		gameFps: 60, // 等倍速
		BBFCapacity: 30, // 1フレームの実行限界数(溢れは持ち越し)

		isCanvasAutoResize: false, // canvasを自動で画面サイズに合わせてresize
	};

	#jasc_gameData = {
		canvas: {},
		ctx: {},
	};

	// イベント
	static #jasc_add_events = new Set([
		// 基本
		"windowResize",
		"interactive",
		"DOMContentLoaded",
		"load",

		"keyPress",

		// dom関係
		"imageLoadError",
		"exLinkGet",
		"exTextLinkGet",
		"changeDOM",

		// game関連
		"canvasAdd",
		"ctxAdd",
		"canvasResize",
		"gameInit",
		"gameRequestAnimationFrame",
		"gameFrameUpdate",

		// jasc開発者用イベント
		"runNow",
		"dispatchEvent",
		"createEventType",
		"addPlugin",
		"methodAddPlugin",
		"methodOverwritePlugin",
	]);
	static #jasc_devAdd_events = new Set();
	#jasc_events = {};
	static #_devEventCount = 0;
	#_activeDevEventCount = -1;

	// プラグイン
	static #plugins = {};
	#_plugins_setting = {};
	static #_pluginCount = 0;
	#_activePluginCount = 0;

	#jasc_readonlyData = {
		nowFps: 0,
		doFps: 0,

		pressKeySet: new Set(),

		isDrawing: true,

		// ゲッター群
		get urlQuery() {
			return Jasc.getUrlVars(location.href);
		},
	};

	#jasc_sysListData = {
		fileTypeReg: Jasc.#_FILETYPE_REG_LIST,
		fileTypeMime: Jasc.#_FILETYPE_MIME_LIST,
	};

	// fps取得時使用
	#_fps_startTime = 0;

	#_fps_frameCount = 0;
	#_fps_doFrameCount = 0;

	#_fps_BBForward = 0;
	#_fps_frame;
	#_fps_oldFrame = 0;

	// game処理使用用
	#_activeCanvasName = null;
	#_activeCanvas = null;
	#_activeCtx = null;

	// textNode判定用
	_textNode_allowedTextTag = ["SPAN", "P"];
	_textNode_allowedNodeType = [Node.TEXT_NODE, Node.CDATA_SECTION_NODE, Node.COMMENT_NODE];

	//##################################################
	// 静的グローバル関数 組み込み上書き(機種別対応)
	//##################################################
	// 疑似fps作成用
	static requestAnimationFrame = (function () {
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
	static now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
	static getTime() {
		return (Jasc.now && Jasc.now.call(performance)) || new Date().getTime();
	}

	// 静的関数をインスタンスでも使用出来るように
	requestAnimationFrame = Jasc.requestAnimationFrame;
	now = Jasc.now;
	getTime = Jasc.getTime;

	//##################################################
	// グローバル ゲッター・セッター
	//##################################################

	/**
	 * 初期設定
	 * @returns {Object} json形式
	 */
	get initSetting() {
		return this.#jasc_initSettingData;
	}
	/**
	 * 初期設定
	 * @param {Object} args json形式
	 * @param {boolean} [args.isGame=false] - ゲームモードを使用するか
	 * @param {string} [args.libPath="./jascLib/"] - ライブラリのフォルダまでのpath
	 * @param {Object<string, boolean>} [args.useLib={}] - ライブラリを使用する場合に記述
	 * @param {Array<string|string[]>} [args.openFuncList=["jasc.acq", "Jasc.isAssociative"]] - グローバル関数化する関数名を記述する
	 * @returns {undefined}
	 */
	set initSetting(args) {
		if (this.#isFlags.domLoad) {
			this._ccLog.log("DOMContentLoadedより後に設定を変更する事は出来ません！", "error", true);
			return;
		}

		if (!Jasc.isAssociative(args)) {
			this._ccLog.log("連想配列以外の代入", "error");
			return;
		}

		Jasc.overwriteAssociative(this.#jasc_initSettingData, args);
	}

	/**
	 * 設定
	 * @returns {Object} json形式
	 */
	get setting() {
		return this.#jasc_settingData;
	}
	/**
	 * 設定
	 * @param {Object} args json形式
	 * @param {boolean} [args.logDebug=false] - デバッグログを出力するか
	 * @param {number} [args.gameFps=60] - ゲームのFPS最大値を指定
	 * @param {number} [args.BBFCapacity=30] - 1フレームの実行限界数(溢れは持ち越し)
	 * @param {number} [args.isCanvasAutoResize=false] - canvasを自動で画面サイズに合わせてresize
	 * @param {Object<string,HTMLCanvasElement>} [args.canvas] - 使用するcanvasを指定
	 * @returns {undefined}
	 */
	set setting(args) {
		if (!Jasc.isAssociative(args)) {
			this._ccLog.log("連想配列以外の代入", "error");
			return;
		}

		Jasc.overwriteAssociative(this.#jasc_settingData, args);
	}

	//##################################################
	// 起動時処理
	//##################################################
	constructor() {
		this._ccLog.time("jascLoad", true);
		// 起動前処理
		this.#_updateInitSettingUseLib();
		// イベントリスナー初期化
		this.#_eventListenerInit();

		//======================
		// イベントリスナー設置
		//======================
		// this疑似固定
		const _this = this;

		//* 画面サイズ変更
		window.addEventListener("resize", function (e) {
			_this._dispatchEvent("windowResize", [e]);
			if (_this.#jasc_settingData.isCanvasAutoResize) {
				_this.game.canvasResize();
			}
		});
		//* ウィンドウフォーカス
		window.addEventListener("focus", function () {
			_this.#jasc_readonlyData.pressKeySet.clear();
		});
		window.addEventListener("blur", function () {
			_this.#jasc_readonlyData.pressKeySet.clear();
		});
		document.addEventListener("visibilitychange", function () {
			_this.#jasc_readonlyData.pressKeySet.clear();
		});
		//* キー入力判定
		window.addEventListener("keydown", function (e) {
			// shift同時押しに弱いのでそれに対処(ゴリ押し)
			if (!e.shiftKey) {
				_this.#jasc_readonlyData.pressKeySet.delete("ShiftLeft");
				_this.#jasc_readonlyData.pressKeySet.delete("ShiftRight");
			}
			const code = e.code;
			if (code == "" || code == "Backquote" || code == "KanaMode") {
				return;
			}
			_this.#jasc_readonlyData.pressKeySet.add(code);
		});
		window.addEventListener("keyup", function (e) {
			// shift同時押しに弱いのでそれに対処(ゴリ押し)
			if (!e.shiftKey) {
				_this.#jasc_readonlyData.pressKeySet.delete("ShiftLeft");
				_this.#jasc_readonlyData.pressKeySet.delete("ShiftRight");
			}
			const code = e.code;
			if (code == "") {
				return;
			}
			_this.#jasc_readonlyData.pressKeySet.delete(code);
		});
		//* DOMContentLoadedより前に発火
		document.addEventListener("readystatechange", function () {
			if (document.readyState === "interactive") {
				//画像err取得
				_this.#_autoImageErrorGet();

				_this._dispatchEvent("interactive");
			}
		});

		//* DOMContentLoaded
		if (document.readyState == "loading") {
			document.addEventListener("DOMContentLoaded", this.#_DCL.bind(this));
		} else {
			this.#isFlags.domLoadSkip = true;
		}
		//* load
		if (document.readyState != "complete") {
			window.addEventListener("load", this.#_WL.bind(this));
		} else {
			this.#isFlags.windowLoadSkip = true;
		}

		//----------------------
		//* 初期化
		//----------------------
		this.#_initDefineProperty();

		// 再度実行
		setTimeout(
			async function () {
				if (this.#isFlags.domLoadSkip) {
					await this.#_DCL();
				}
				if (this.#isFlags.windowLoadSkip) {
					await this.#_WL();
				}
			}.bind(this),
			10
		);

		// キー判定
		const gk = function () {
			if (!this.#jasc_initSettingData.isGame) {
				this.#_jascAutoUpdate();
				Jasc.requestAnimationFrame(gk);
			}
		}.bind(this);
		gk();
	}

	//======================
	// イベントリスナー実行関数
	//======================

	//* DOMContentLoaded
	async #_DCL(e) {
		this.#isFlags.domLoad = true;
		this._ccLog.time("htmlDomLoad");

		//画像err取得
		this.#_autoImageErrorGet();

		//* DOM変更検知
		function obs(records) {
			//画像err取得
			this.#_autoImageErrorGet();
			//外部リンク判定
			this.#_autoExLinkGet();

			this._dispatchEvent("changeDOM", [records]);
		}
		const observer = new MutationObserver(obs.bind(this));
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		//* ライブラリ自動インポート
		for (let key in this.#jascLibTree) {
			if (this.#jasc_initSettingData.useLib?.[key] && !this.#jascLibTree[key].isLoad) {
				await this.#_jascLibLoad(key);
			}
		}
		this.#_updateInitSettingUseLib();

		// イベントリスナー更新
		this.#_eventListenerInit();
		// プラグイン更新
		this.#pluginInit();

		this.#_openFuncCreate();

		this._dispatchEvent("DOMContentLoaded", [e]);

		// 画像err取得
		this.#_autoImageErrorGet();
		// 外部リンク判定
		this.#_autoExLinkGet();
		// イベントリスナー更新
		this.#_eventListenerInit();
		// プラグイン更新
		this.#pluginInit();

		// 自動連携
		this.#_autoTwitterScriptLoad();

		this._ccLog.time("htmlDomLoad");
	}

	//* load
	async #_WL(e) {
		this.#isFlags.windowLoad = true;
		this._ccLog.time("htmlLoad");
		Jasc.#_touchHoverKill();

		// イベントリスナー更新
		this.#_eventListenerInit();
		// プラグイン更新
		this.#pluginInit();

		this._dispatchEvent("load", [e]);

		// jQuery存在判定
		if (typeof jQuery == "undefined") {
			this._ccLog.log("jQuery does not exist", "system");
		} else {
			this._ccLog.log("jQuery exists", "system");
			this.#isFlags.jQueryLoad = true;
		}

		// isGameがonの場合canvasのupdate開始
		if (this.#jasc_initSettingData.isGame) {
			this.#_gameInit();
		}

		// 画像err取得
		this.#_autoImageErrorGet();
		// 外部リンク判定
		this.#_autoExLinkGet();
		// イベントリスナー更新
		this.#_eventListenerInit();
		// プラグイン更新
		this.#pluginInit();

		this._ccLog.time("htmlLoad");
		this._ccLog.time("jascLoad", true);
	}

	//##################################################
	// 内部使用プライベート関数
	//##################################################

	#_initDefineProperty() {
		const _this = this;
		this.objDefineProperty(this.#jasc_settingData, "logDebug", {
			set(arg) {
				_this._jasc_debug = !!arg;
				_this._ccLog.debug = _this._jasc_debug;
			},
		});
		//----------------------
		//* jasc_readonlyDataの設定
		//----------------------

		//* url関連
		// ページ
		this.objDefineProperty(this.#jasc_readonlyData, "pageBaseUrl", {
			value: this.absolutePath(location.href).replace(/\/[^\/]*$/, "") + "/",
		});
		// ドメイン抜きのurl
		this.objDefineProperty(this.#jasc_readonlyData, "pagePath", {
			value: location.pathname,
		});
		// jascの設置位置
		{
			let tmp = "";
			if (document.currentScript) {
				tmp = document.currentScript.src;
			} else {
				let scripts = this.acq("script"),
					script = scripts[scripts.length - 1];
				if (script.src) {
					tmp = script.src;
				}
			}
			this.objDefineProperty(this.#jasc_readonlyData, "jascBaseUrl", {
				value: tmp.replace(/\/[^\/]*$/, "") + "/",
			});
		}

		//* 別オブジェクトの参照
		// event読み出し用
		this.objDefineProperty(this.#jasc_readonlyData, "_eventListener", {
			value: this.#jasc_events,
		});
		// システムで使用しているリスト系
		this.objDefineProperty(this.#jasc_readonlyData, "sysList", {
			value: this.#jasc_sysListData,
		});
		// plugin読み出し用
		this.objDefineProperty(this.#jasc_readonlyData, "plugins", {
			value: this.#_plugins_setting,
		});

		//* game用
		this.objDefineProperty(this.#jasc_readonlyData, "game", {
			value: {},
		});
		// canvas読み出し用
		this.objDefineProperty(this.#jasc_readonlyData.game, "_canvas", {
			value: this.#jasc_gameData.canvas,
		});
		// ctx読み出し用
		this.objDefineProperty(this.#jasc_readonlyData.game, "ctx", {
			value: this.#jasc_gameData.ctx,
		});

		//* iframe関連
		// このスクリプトがiframeで読み込まれているか
		this.objDefineProperty(this.#jasc_readonlyData, "isIframe", {
			value: window != window.parent,
		});
		// 現在のiframeの深度
		this.objDefineProperty(this.#jasc_readonlyData, "iframeDepth", {
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
		// 親のjascを取得
		this.objDefineProperty(this.#jasc_readonlyData, "parentJasc", {
			value: (function () {
				if (_this.#jasc_readonlyData.isIframe) {
					if (window.parent?.jasc) {
						return window.parent.jasc;
					}
				}
				return null;
			})(),
		});
		// 最上位のjascを取得
		this.objDefineProperty(this.#jasc_readonlyData, "topJasc", {
			value: (function () {
				if (window.top?.jasc) {
					return window.top.jasc;
				}
				return null;
			})(),
		});

		//* フラグ関連
		// bot(クローラー)か
		this.objDefineProperty(this.#jasc_readonlyData, "isBot", {
			value: /bot|crawler|spider|crawling/i.test(navigator.userAgent),
		});
		// モバイル端末か
		this.objDefineProperty(this.#jasc_readonlyData, "isMobile", {
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
			this.objDefineProperty(this.#jasc_readonlyData, "browser", {
				value: bs,
			});
			this.objDefineProperty(this.#jasc_readonlyData, "ieVersion", {
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
			this.objDefineProperty(this.#jasc_readonlyData, "os", {
				value: os,
			});
		}

		// readonlyデータ設定
		this.objDefineProperty(this, "readonly", {
			value: this.#jasc_readonlyData,
		});

		// canvas設定
		{
			const _canvas = this.#jasc_gameData.canvas;
			const _ctxUpdate = this.#ctxUpdate.bind(this);
			this.objDefineProperty(this.#jasc_settingData, "canvas", {
				set(args) {
					if (!Jasc.isAssociative(args)) {
						_this._ccLog.log("連想配列以外の代入", "error", true);
						return;
					}

					for (let key in args) {
						if (!(args[key] instanceof HTMLCanvasElement)) {
							_this._ccLog.log("HTMLCanvasElement以外の代入", "error");
							continue;
						}
						if (!_this.#jasc_gameData.canvas[key]) {
							_this.#jasc_gameData.canvas[key] = args[key];
							_this._dispatchEvent("canvasAdd", [key, args[key]]);
						}
					}
					_ctxUpdate();
				},
				get() {
					return _canvas;
				},
			});
		}
	}

	//======================
	// 自動実行(雑多)
	//======================

	// initSettingの読み込みライブラリ表示更新
	#_updateInitSettingUseLib() {
		for (let key in this.#jascLibTree) {
			this.#jasc_initSettingData.useLib[key] = this.#jascLibTree[key].isLoad;
		}
	}

	#_jascAutoUpdate() {
		if (this.#jasc_readonlyData.pressKeySet.size) {
			this._dispatchEvent("keyPress", [this.#jasc_readonlyData.pressKeySet]);
		}
		this.#_eventListenerInit();
		this.#pluginInit();
	}

	// jasc.の記述を省略しても実行出来る関数を作成
	#_openFuncCreate() {
		let list = this.#jasc_initSettingData.openFuncList;

		if (!list) {
			//なし
			return;
		}

		for (let name of list) {
			let rename;
			if (Array.isArray(name)) {
				name = name[0];
				rename = name[1].replace(/\./g, "_");
			} else {
				rename = name.split(".").pop();
			}
			let spName = name.split(".");
			if (window[rename] !== undefined) {
				this._ccLog.log(`${rename}変数(${name})が既に使用されています`, "error");
				continue;
			}
			let func;
			switch (spName[0]) {
				case "jasc":
					func = Jasc.getDotKey(this, spName.slice(1), null);
					break;
				case "Jasc":
				case "JASC":
					func = Jasc.getDotKey(Jasc, spName.slice(1), null);
					break;
				default:
					func = Jasc.getDotKey(Jasc, spName, null);
					if (!func) {
						func = Jasc.getDotKey(this, spName, null);
					}
					break;
			}
			if (func) {
				if (typeof func === "function") {
					window[rename] = func;
					this._ccLog.log(`${rename}変数(${name})を作成しました`, "pale");
				} else {
					this._ccLog.log(`${name}は関数(class)ではありません！`, "error");
				}
			} else {
				this._ccLog.log(`${name}関数(class)は存在しません`, "error");
			}
		}
	}

	// 作成、存在確認
	#_openFuncCreateSearch(base, spName, rename, ind = 0) {
		let name = spName[ind];
		if (spName.length == ind + 1) {
			if (base[name]) {
				let func = base[name];
				if (typeof func === "function") {
					window[rename] = func;
					return 0;
				}
				return 2;
			}
			return 1;
		}
		if (base[name]) {
			return this.#_openFuncCreateSearch(base[name], spName, rename, ind + 1);
		}
		return 1;
	}

	// jasc連携ライブラリの自動インポート
	#_jascLibLoad(name, d) {
		if (!d) {
			this._ccLog.time(`LibLoadTree(${name})`);
		}
		return new Promise(async (resolve) => {
			const _this = this;
			let data = Jasc.objHasOwnProperty(this.#jascLibTree, name);
			if (data[0]) {
				if (data[1].isLoad) {
					this._ccLog.log(`${name} is already loaded`, "pale");
					end(2);
					return;
				}
				this.#jascLibTree[name].isLoad = true;

				let rel = data[1].relations;
				let relCou = rel.length;
				let pro = [];
				if (this._jasc_debug && relCou > 1) {
					document.head.appendChild(document.createComment(`lib:${name} Start`));
				}
				for (let i = 0; i < relCou; i++) {
					pro.push(this.#_jascLibLoad(rel[i], 1));
				}
				let retPro = await Promise.all(pro);
				for (let i = 0; i < relCou; i++) {
					if (retPro[i] == 3) {
						end(3);
						return;
					}
				}
				if (this._jasc_debug && relCou > 1) {
					document.head.appendChild(document.createComment(`lib:${name} End`));
				}

				let loadUrl = this.absolutePath(this.#jasc_readonlyData.jascBaseUrl + this.#jasc_initSettingData.libPath + data[1].lnk);
				if (data[1].lnk.endsWith(".css")) {
					fetch(loadUrl)
						.then((res) => {
							if (res.ok) {
								_doLoadFile();
							} else {
								_redoLoadFile();
							}
						})
						.catch((err) => {
							_redoLoadFile();
						});
				} else {
					_doLoadFile();
				}

				function _doLoadFile() {
					_this
						.loadFile(loadUrl, {
							module: data[1].module ?? false,
							defer: true,
						})
						.then((err) => {
							if (err) {
								_redoLoadFile();
								return;
							}
							end(0);
						});
				}
				function _redoLoadFile() {
					if (!data[1].alternative) {
						end(3);
						return;
					}
					_this._ccLog.log(`${name}の読み込みに失敗しました。代替のファイルを読み込みます`, "error");
					_this
						.loadFile(data[1].alternative, {
							module: data[1].module ?? false,
							defer: true,
						})
						.then((err) => {
							if (err) {
								end(3);
								return;
							}
							end(0);
						});
				}
				return;
			}
			end(1);
			return;
			function end(f) {
				if (f == 3) {
					_this.#jascLibTree[name].isLoad = false;
				}
				if (!d) {
					_this._ccLog.time(`LibLoadTree(${name})`);
				}
				resolve(f);
			}
		});
	}

	// jascイベントリスナーの初期化
	#_eventListenerInit() {
		if (Jasc.#_devEventCount === this.#_activeDevEventCount) {
			return;
		}
		// 初期化
		if (this.#_activeDevEventCount === -1) {
			for (let key of Jasc.#jasc_add_events) {
				if (!this.#jasc_events[key]) {
					this.#jasc_events[key] = {};
				}
			}
		}
		this.#_activeDevEventCount = Jasc.#_devEventCount;

		// 新規を登録
		for (let key of Jasc.#jasc_devAdd_events) {
			let k = "_" + key;
			if (!this.#jasc_events[k]) {
				this.#jasc_events[k] = {};
				this._ccLog.log(`Jasc eventListener add: "${k}"`, "pale");
				this._dispatchEvent("createEventType", [k]);
			}
		}
	}

	// プラグインの初期化
	#pluginInit() {
		if (Jasc.#_pluginCount === this.#_activePluginCount) {
			return;
		}
		this.#_activePluginCount = Jasc.#_pluginCount;
		for (let key in Jasc.#plugins) {
			if (this.#_plugins_setting[key]) {
				continue;
			}
			const { func, opt, name } = Jasc.#plugins[key];
			const obj = {
				func: func.bind(this),
				event: {},
			};
			this.#_plugins_setting[key] = obj;

			this._dispatchEvent("addPlugin", [key, name]);

			// イベント登録
			if (opt.eventTypes) {
				let evTypes = opt.eventTypes;
				if (typeof evTypes == "string") {
					evTypes = [evTypes];
				}
				if (Array.isArray(evTypes)) {
					for (let i = 0, li = evTypes.length; i < li; i++) {
						let evT = evTypes[i];
						if (obj.event[evT]) {
							this._ccLog.warn(`(${key})${evT}イベントタイプのリスナーはすでに登録されています`, true);
							continue;
						}
						obj.event[evT] = this.addEventListener(evT, obj.func, key, true);
					}
				} else {
					this._ccLog.error("イベントタイプは文字型の配列です", true);
				}
			}

			// jascインスタンスに登録
			let n;
			if (opt.overwrite) {
				n = name;
			} else {
				n = key;
			}
			if (opt.jascJoin) {
				let w = 1;
				let n = "";
				if (opt.overwrite) {
					n = name;
					w = 2;
				} else {
					n = key;
				}
				let base = Jasc.getDotKey(this, n, "", true);
				w *= !!base;
				if (w != 1) {
					let p = n.split(".");
					let par, t;
					if (p.length > 1) {
						t = p.pop();
						par = Jasc.getDotKey(this, p.join("."));
					} else {
						t = n;
						par = this;
					}
					par[t] = obj.func.bind(this);
				}
				switch (w) {
					case 0:
						this._ccLog.log(`プラグイン(jasc.${n})を登録しました`, "pale");
						this._dispatchEvent("methodAddPlugin", [key, n]);
						break;
					case 1:
						this._ccLog.warn(`(jasc.${n})は既に使用されています！`, true);
						break;
					case 2:
						this._ccLog.log(`プラグイン${key}が関数(jasc.${n})を上書きしました`, "pale");
						this._dispatchEvent("methodOverwritePlugin", [key, n]);
						break;
				}
			}
		}
	}

	// スマホでは:hoverではなく:active
	static #_touchHoverKill() {
		var touch = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

		if (touch) {
			try {
				for (let si in document.styleSheets) {
					let styleSheet = document.styleSheets[si];
					if (!styleSheet.cssRules) continue;

					for (let ri = styleSheet.cssRules.length - 1; ri >= 0; ri--) {
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

	// Twitterのウェジット表示補助
	#_autoTwitterScriptLoad() {
		if (this.acq(".twitter-timeline").length) {
			const _this = this;
			this.loadFile("https://platform.twitter.com/widgets.js", {
				async: true,
				defer: true,
			}).then((err) => {
				if (err) return;
				_this._ccLog.log("twitter script loaded", "system");

				_this.waitForElement(".twitter-timeline-rendered iframe", null, 60 * 1000).then(function (e) {
					e[0].addEventListener("load", () => {
						twLoad();
						function twLoad() {
							if (e[0].clientHeight) {
								_this._ccLog.log("twitter loaded end", "system");
								return;
							}
							setTimeout(twLoad, 10);
						}
					});
				});
			});
		} else {
			this._ccLog.log("not twitter widgets", "system");
		}
	}

	// imgタグエラー時自動処理
	#_autoImageErrorGet() {
		let setCou = 0;
		let skipCou = 0;
		let imgs = this.acq("!img:not(.jascNotImgErrGet)");
		for (let elem of imgs) {
			if (elem.classList.contains("jascImgErrGetter")) {
				skipCou++;
				continue;
			}
			elem.classList.add("jascImgErrGetter");
			const _this = this;
			if (!elem.onerror) {
				elem.onerror = function (e) {
					_this._dispatchEvent("imageLoadError", [e]);

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
			this._ccLog.log(`onErrSetImage[${setCou}/${imgLen - skipCou}(${imgLen})]`, "data");
		}
	}

	// 外部リンク判定
	#_autoExLinkGet() {
		let setCou = 0;
		let skipCou = 0;
		let links = this.acq("!a:not(.jascNotExLinkGet)");
		for (let elem of links) {
			if (elem.classList.contains("jascExLinkGetter")) {
				skipCou++;
				continue;
			}
			elem.classList.add("jascExLinkGetter");
			if (this.isExternalLink(elem)) {
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
				if (this.isTextNode(elem)) {
					elem.classList.add("jascExTextLink");
					this._dispatchEvent("exTextLinkGet", [elem]);
				}
				this._dispatchEvent("exLinkGet", [elem]);
			}
			setCou++;
		}
		let linkLen = links.length;
		if (linkLen - skipCou > 0) {
			this._ccLog.log(`onSetExLink[${setCou}/${linkLen - skipCou}(${linkLen})]`, "data");
		}
	}

	//======================
	// 自動実行(game)
	//======================
	#_gameInit() {
		this._ccLog.log("gameInit do", "system");
		this._dispatchEvent("gameInit");

		this.#_fps_startTime = Jasc.getTime();

		this.#gameRAFrame();
	}

	#gameRAFrame = function () {
		let times = this.getTime() - this.#_fps_startTime;
		this.#_fps_frame = (times / (1000 / this.#jasc_settingData.gameFps)) | 0;

		let cou = this.#_fps_frame - this.#_fps_oldFrame + this.#_fps_BBForward;
		if (cou >= 1) {
			if (cou > this.#jasc_settingData.BBFCapacity) {
				this.#_fps_BBForward = cou - this.#jasc_settingData.BBFCapacity;
				cou = this.#jasc_settingData.BBFCapacity;
				if (this.#_fps_BBForward > 50) {
					this.#_fps_BBForward = 50;
				}
			} else {
				this.#_fps_BBForward = 0;
			}

			this.#jasc_readonlyData.isDrawing = false;

			for (let i = cou - 1; i >= 0; i--) {
				if (!i) {
					this.#jasc_readonlyData.isDrawing = true;
				}
				if (this.#gameFrameUpdate()) {
					return;
				}
			}
			this.#_fps_frameCount++;
			this.#_fps_doFrameCount += cou;
			this.#_fps_oldFrame = this.#_fps_frame;
		}
		if (times >= 1000) {
			this.#jasc_readonlyData.nowFps = this.#_fps_frameCount;
			this.#jasc_readonlyData.doFps = this.#_fps_doFrameCount;
			this.#_fps_frameCount = 0;
			this.#_fps_doFrameCount = 0;
			this.#_fps_startTime = this.getTime();
			this.#_fps_oldFrame = 0;
		}

		this._dispatchEvent("gameRequestAnimationFrame", [this.#_fps_frameCount, this.#_fps_doFrameCount]);
		requestAnimationFrame(this.#gameRAFrame);
	}.bind(this);

	#gameFrameUpdate() {
		this.#_jascAutoUpdate();

		this._dispatchEvent("gameFrameUpdate", [this.#jasc_readonlyData.isDrawing]);

		return;
	}

	//======================
	// gameシステム動作
	//======================

	#ctxUpdate() {
		for (let key in this.#jasc_gameData.canvas) {
			if (!this.#jasc_gameData.ctx[key]) {
				let ctx = this.#jasc_gameData.canvas[key].getContext("2d");
				this.#jasc_gameData.ctx[key] = ctx;
				if (this.#_activeCanvasName === null) {
					this.game.changeCurrentCanvas(key);
				}
				this._dispatchEvent("ctxAdd", [key, ctx]);
			}
		}
		if (this.#jasc_settingData.isCanvasAutoResize) {
			this.game.canvasResize();
		}
	}

	//##################################################
	// グローバル関数
	//##################################################

	//======================
	// 設定等(jasc)
	//======================

	/**
	 * 疑似イベントリスナー
	 * @param {string} [eventType=""] - イベントの種類
	 * @param {function} [callback] - イベントのコールバック関数
	 * @param {string} [name=auto] - 削除時の参照用名称
	 * @param {boolean} [returnName=false] - 登録した名称を返すか
	 * @returns {-1|0|1|string|string[]} -1:イベント登録成功(即時実行) 0:イベント登録成功 1:イベント登録失敗
	 */
	addEventListener = function (eventType = "", callback, name = "", returnName = false) {
		if (eventType === "type") {
			return ["type", ...Object.keys(this.#jasc_events)];
		}
		if (Jasc.objHasOwnProperty(this.#jasc_events, eventType)[0]) {
			if (callback && typeof callback == "function") {
				if (name === "") {
					name = Jasc.setAssociativeAutoName(this.#jasc_events[eventType], callback, "__jasc");
				} else {
					this.#jasc_events[eventType][name] = callback;
				}

				// 旬を逃しても一応実行はさせる
				if ((eventType === "DOMContentLoaded" && this.#isFlags.domLoad) || (eventType === "load" && this.#isFlags.windowLoad) || eventType === "runNow") {
					callback(null);
					if (returnName) {
						return name;
					}
					return -1;
				}
				if (returnName) {
					return name;
				}
				return 0;
			} else if (callback == null) {
				return this.#jasc_events[eventType];
			}
		}
		if (eventType.startsWith("_")) {
			return 1;
		}
		return this.addEventListener("_" + eventType, callback, name, returnName);
	}.bind(this);
	/**
	 * 疑似イベントリスナー
	 * @param {string} [eventType=""] - イベントの種類
	 * @param {function} [callback] - イベントのコールバック関数
	 * @param {string} [name=auto] - 削除時の参照用名称
	 * @param {boolean} [returnName=false] - 登録した名称を返すか
	 * @returns {-1|0|1|string|string[]} -1:イベント登録成功(即時実行) 0:イベント登録成功 1:イベント登録失敗
	 */
	on = this.addEventListener;

	/**
	 * 疑似イベントリスナーの削除
	 * @param {string} [eventType=""] - イベントの種類
	 * @param {string} [name] - 削除時の参照用名称
	 * @returns {0|1|2|string[]} 0:イベント削除成功 1:イベント削除失敗 2:イベント削除失敗(無効なイベント名)
	 */
	removeEventListener = function (eventType = "", name = "") {
		if (eventType == "type") {
			let list = {};
			let keys = Object.keys(this.#jasc_events);
			for (let i = 0, li = keys.length; i < li; i++) {
				len = Object.keys(this.#jasc_events[keys[i]]).length;
				if (len) {
					list[keys[i]] = len;
				}
			}
			return list;
		}
		if (Jasc.objHasOwnProperty(this.#jasc_events, eventType)[0]) {
			if (Jasc.isAssociative(this.#jasc_events?.[eventType])) {
				if (name != "") {
					if (typeof this.#jasc_events?.[eventType]?.[name] != "function") {
						return 2;
					}
					this.#jasc_events[eventType][name] = null;
					delete this.#jasc_events[eventType][name];
				} else {
					this.#jasc_events[eventType] = {};
				}
				return 0;
			}
			return 2;
		}
		if (eventType.startsWith("_")) {
			return 1;
		}
		return this.removeEventListener("_" + eventType, name);
	}.bind(this);
	/**
	 * 疑似イベントリスナーの削除
	 * @param {string} [eventType=""] - イベントの種類
	 * @param {string} [name] - 削除時の参照用名称
	 * @returns {0|1|2|string[]} 0:イベント削除成功 1:イベント削除失敗 2:イベント削除失敗(無効なイベント名)
	 */
	off = this.removeEventListener;

	/**
	 * 疑似イベントリスナーの発火
	 * @param {string} [eventType=""] - イベントの種類
	 * @param {list} [args=[]] - イベントの引数
	 * @returns {number} - 発火したイベント数
	 */
	_dispatchEvent(eventType = "", args = []) {
		if (eventType === "runNow") {
			return -1;
		}
		if (!Jasc.isAssociative(this.#jasc_events?.[eventType])) {
			eventType = "_" + eventType;
			if (!Jasc.isAssociative(this.#jasc_events?.[eventType])) {
				return -1;
			}
		}
		const e = this.#jasc_events[eventType];
		let c = 0;
		for (let key in e) {
			if (typeof e[key] == "function") {
				try {
					e[key]?.(...args);
					c++;
				} catch (e) {
					this._ccLog.error(e, true);
				}
			}
		}
		if (eventType !== "dispatchEvent") {
			this._dispatchEvent("dispatchEvent", [eventType, args, c]);
		}
		return c;
	}

	/**
	 * jasc改造機能
	 * @static
	 */
	static develop = {
		/**
		 * jascイベントリスナの種類を追加
		 * @param {string} name - イベント名
		 * @returns {0|1} 実行結果
		 */
		createEvent(name) {
			if (typeof name != "string") {
				return 1;
			}
			name = name.replace(/^_+/, "");

			if (name === "type" || Jasc.#jasc_add_events.has(name) || Jasc.#jasc_devAdd_events.has(name)) {
				return 1;
			}
			Jasc.#jasc_devAdd_events.add(name);
			Jasc.#_devEventCount++;
			return 0;
		},

		/**
		 * プラグインの登録
		 * @param {function} plugin - プラグイン
		 * @param {string} [name=""] - プラグイン名
		 * @param {object} [opt] - オプション
		 * @param {string|string[]} [opt.eventTypes] - プラグイン実行イベントタイプ
		 * @param {boolean} [opt.jascClassJoin] - プラグインをjascクラスに登録するか
		 * @param {boolean} [opt.jascJoin] - プラグインをjascインスタンスに登録するか
		 * @param {boolean} [opt.overwrite] - 登録インスタンス、クラスを上書きするか
		 * @returns {string|false} 登録プラグイン名
		 * @static
		 */
		addPlugins(plugin, name = "", opt = {}) {
			if (typeof plugin != "function") {
				return false;
			}

			const obj = {
				func: plugin,
				opt: opt,
			};

			// 名称自動設定
			let nopName = name.replace(/\./g, "_");
			if (name) {
				obj.name = name;
				if (Jasc.#plugins[nopName]) {
					nopName = Jasc.setAssociativeAutoName(Jasc.#plugins, obj, nopName, "_");
				} else {
					Jasc.#plugins[nopName] = obj;
				}
			} else {
				name = Jasc.setAssociativeAutoName(Jasc.#plugins, obj, "__plugin", "_");
				obj.name = name;
			}

			// 登録通知
			Jasc.#_pluginCount++;

			// jascクラスに登録
			if (opt.jascClassJoin) {
				let w = 1;
				let n = "";
				if (opt.overwrite) {
					n = obj.name;
					w = 2;
				} else {
					n = name;
				}
				let base = Jasc.getDotKey(Jasc, n, "", true);
				w *= !!base;
				if (w != 1) {
					let p = n.split(".");
					let par, t;
					if (p.length > 1) {
						t = p.pop();
						par = Jasc.getDotKey(Jasc, p.join("."));
					} else {
						t = n;
						par = Jasc;
					}
					par[t] = obj.func.bind(Jasc);
				}
				switch (w) {
					case 0:
						console.log(`%c[Jasc]プラグイン(Jasc.${n})を登録しました`, "color: #bbb;");
						break;
					case 1:
						console.warn(`(Jasc.${n})は既に使用されています！`);
						break;
					case 2:
						console.log(`%c[Jasc]プラグイン${name}が関数(Jasc.${n})を上書きしました`, "color: #bbb;");
						break;
				}
			}

			return name;
		},

		/**
		 * プラグインが適用されているか
		 * @param {string} name - プラグイン名
		 * @returns {boolean} プラグインが適用されているか
		 */
		hasPlugins(name) {
			return !!Jasc.#plugins[name];
		},
	};

	//======================
	// 基本構成(DOM)
	//======================

	/**
	 * DOM取得(jQuery非対応版)
	 * @param {string} [str] - 取得対象
	 * @param {Window|Document|HTMLElement} [par=document] - 取得対象の親
	 * @returns {Window|Document|HTMLElement|HTMLElement[]}
	 * @static
	 */
	static acq(str, par = document) {
		if (!str) {
			return window;
		}
		// 文字列以外は返却
		if (typeof str != "string") {
			return str;
		}
		switch (str) {
			case "window":
				return window;
			case "document":
				return document;
		}
		str = str.trim();
		let elem = [];
		if (par === window) {
			par = document;
		}
		if (par instanceof HTMLElement || par.nodeType >= 1) {
			par = [par];
		}
		let notArr = false;

		let chStr = str.slice(0, 1);
		let queryStr;
		if (chStr != "!" && Jasc.#_ACQ_REGEXP.test(str)) {
			chStr = "!";
			queryStr = str;
		} else {
			queryStr = str.slice(1);
		}
		par.forEach((p) => {
			switch (chStr) {
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
	}

	/**
	 * DOM取得
	 * @param {string} [str] - 取得対象
	 * @param {Window|Document|jQuery|HTMLElement} [par=document] - 取得対象の親
	 * @returns {Window|Document|HTMLElement|HTMLElement[]}
	 */
	acq = function (str, par = document) {
		if (!str) {
			return window;
		}
		// 文字列以外は返却
		if (typeof str != "string") {
			return this.jQueryObjToDOM(str);
		}
		switch (str) {
			case "window":
				return window;
			case "document":
				return document;
		}
		str = str.trim();
		let elem = [];
		par = this.jQueryObjToDOM(par);
		if (par === window) {
			par = document;
		}
		if (par instanceof HTMLElement || par.nodeType >= 1) {
			par = [par];
		}
		let notArr = false;

		let chStr = str.slice(0, 1);
		let queryStr;
		if (chStr != "!" && Jasc.#_ACQ_REGEXP.test(str)) {
			chStr = "!";
			queryStr = str;
		} else {
			queryStr = str.slice(1);
		}
		par.forEach((p) => {
			switch (chStr) {
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
	}.bind(this);

	/**
	 * jQueryオブジェクト→DOM変換
	 * @param {Window|Document|jQuery|HTMLElement|HTMLElement[]} obj
	 * @returns {Window|Document|HTMLElement|HTMLElement[]}
	 */
	jQueryObjToDOM = function (obj) {
		if (!this.#isFlags.jQueryLoad) {
			return obj;
		}
		if (obj instanceof jQuery) {
			try {
				return obj.get();
			} catch (e) {
				this._ccLog.warn(e, true);
			}
			return obj;
		}
		return obj;
	}.bind(this);

	/**
	 * classを反転(jQuery非対応版)
	 * @param {string|HTMLElement|HTMLElement[]} name - class反転対象
	 * @param {string} str - class名
	 * @returns {undefined}
	 * @static
	 */
	static toggleClass(name, str) {
		let elem;
		if (typeof name == "string") {
			elem = this.acq(name);
		} else {
			elem = name;
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
	}
	/**
	 * classを反転
	 * @param {string|jQuery|HTMLElement|HTMLElement[]} name - class反転対象
	 * @param {string} str - class名
	 * @returns {undefined}
	 */
	toggleClass(name, str) {
		let elem;
		if (typeof name == "string") {
			elem = this.acq(name);
		} else {
			elem = this.jQueryObjToDOM(name);
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
	}

	/**
	 * css変数取得&書き換え
	 * @param {string} name - css変数名
	 * @param {string} [val] - css変数値
	 * @returns {string|false} css変数値
	 * @static
	 */
	static cssVariableIO(name, val) {
		if (typeof name == "string") {
			//先頭が--の場合削除
			if (name.slice(0, 2) != "--") {
				name = "--" + name;
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
	}
	/**
	 * css変数取得&書き換え
	 * @param {string} name - css変数名
	 * @param {string} [val] - css変数値
	 * @returns {string|false} css変数値
	 */
	cssVariableIO = Jasc.cssVariableIO;

	/**
	 * スクロールバー存在判定X
	 * @param {HTMLElement} [elem=document.body] - 対象
	 * @returns {boolean}
	 * @static
	 */
	static scrollbarXVisible(elem = document.body) {
		return elem.scrollHeight > elem.clientHeight;
	}
	/**
	 * スクロールバー存在判定X
	 * @param {HTMLElement} [elem=document.body] - 対象
	 * @returns {boolean}
	 */
	scrollbarXVisible = Jasc.scrollbarXVisible;

	/**
	 * スクロールバー存在判定Y
	 * @param {HTMLElement} [elem=document.body] - 対象
	 * @returns {boolean}
	 * @static
	 */
	static scrollbarYVisible(elem = document.body) {
		return elem.scrollWidth > elem.clientWidth;
	}
	/**
	 * スクロールバー存在判定Y
	 * @param {HTMLElement} [elem=document.body] - 対象
	 * @returns {boolean}
	 */
	scrollbarYVisible = Jasc.scrollbarYVisible;

	/**
	 * スクロール位置判定
	 * @param {Event} e - Scrollイベント
	 * @param {number} [margin=0] - 上限下限の許容値
	 * @returns {"top"|"bottom"|"scrolling"} 現在のスクロール位置
	 * @static
	 */
	static getScrollVerticalPosition(e, margin = 0) {
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
	}
	/**
	 * スクロール位置判定
	 * @param {Event} e - Scrollイベント
	 * @param {number} [margin=0] - 上限下限の許容値
	 * @returns {"top"|"bottom"|"scrolling"} 現在のスクロール位置
	 */
	getScrollVerticalPosition = Jasc.getScrollVerticalPosition;

	/**
	 * ファイル動的読み込み
	 * @param {string} src - ファイルurl
	 * @param {function} [callback] - 完了時コールバック
	 * @param {Object} [opt] - オプション
	 * @param {boolean} [opt.exp=""] - 設定タグ名(script,link)
	 * @param {string} [opt.srcType=""] - 設定タグ名(src,href)
	 * @param {string} [opt.module=false] - moduleかどうか
	 * @param {boolean} [opt.async=false] - 非同期読み込み(ダウンロード後実行(割込み))
	 * @param {boolean} [opt.defer=false] - 非同期読み込み(HTML読み込み後実行)
	 * @returns {Promise<number>} -1:重複 0:正常終了 1:異常終了
	 */
	loadFile(src, opt = {}) {
		return new Promise((resolve) => {
			if (typeof src != "string" || src.length < 1) {
				resolve(1);
				return;
			}
			src = this.absolutePath(src);
			let name = "(" + decodeURIComponent(src.replace(/^[^/]*:\/\/\/?/, "")) + ")";
			let done = false;

			let { exp = "", srcType = "" } = opt;

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
						this._ccLog.log("不明な拡張子", "error");
				}
			}

			let orthSrc = src.split("?")[0];
			let scList = this.acq(exp);
			for (let i = 0, li = scList.length; i < li; i++) {
				let tmpSrc = scList[i]?.[srcType].split("?")[0];
				if (tmpSrc == orthSrc) {
					this._ccLog.log(`${exp}重複読み込み${name}`, "error");
					resolve(-1);
					return;
				}
			}

			this._ccLog.time("fileLoad" + name);

			let head = this.acq("head")[0];
			let elem = document.createElement(exp);
			if (exp == "link") {
				elem.rel = "stylesheet";
			}
			if (exp == "script") {
				if (opt.module) {
					elem.type = "module";
				}
				if (opt.async) {
					elem.async = true;
				}
			}

			const _this = this;
			elem.onload = elem.onreadystatechange = function () {
				if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
					done = true;
					_this._ccLog.time("fileLoad" + name);
					resolve(0);

					elem.onload = elem.onreadystatechange = elem.onerror = null;
				}
			};
			elem.onerror = function () {
				_this._ccLog.log(`FileLoadError${name}`, "error");
				_this._ccLog.time("fileLoad" + name);

				resolve(1);

				elem.onload = elem.onreadystatechange = elem.onerror = null;
				if (head && elem.parentNode) {
					head.removeChild(elem);
				}
			};

			elem[srcType] = src;
			head.appendChild(elem);

			if (done) {
				this._ccLog.time("fileLoad" + name);
				resolve(0);
				elem.onload = elem.onreadystatechange = elem.onerror = null;
			}
		});
	}

	/**
	 * 外部リンク判定
	 * @param {jQuery|HTMLElement} elem - 対象(href属性が存在すること)
	 * @returns {boolean}
	 */
	isExternalLink(elem) {
		elem = this.jQueryObjToDOM(elem);
		return !(elem.href === "" || elem.href.startsWith(`http://${window.location.hostname}`) || elem.href.startsWith(`https://${window.location.hostname}`) || elem.href.startsWith("javascript:") || elem.href.startsWith("mailto:"));
	}

	/**
	 * テキストノード判定
	 * @param {jQuery|HTMLElement} elem - 対象
	 * @returns {boolean}
	 */
	isTextNode(elem) {
		elem = this.jQueryObjToDOM(elem);
		const _this = this;
		return Array.from(elem.childNodes).every((e) => {
			if (textNode_allowedNodeType.indexOf(e.nodeType) >= 0) return true;
			return e.nodeType === Node.ELEMENT_NODE && textNode_allowedTextTag.indexOf(e.tagName) >= 0 && _this.isTextNode(e);
		});
	}

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
					let node = this.acq("!" + selector, par);
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
				const nodes = this.acq("!" + selector, par);
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
	}

	//======================
	// 基本構成(その他)
	//======================

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
	ajax = function (opt = {}) {
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
							this._ccLog.error(e);
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
			this._ccLog.error("XMLHttpRequest is not supported.");
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
		const timer = setTimeout(function () {
			clearTimeout(timer);
			xhr.onload = xhr.onerror = xhr.ontimeout = null;
			xhr.abort();
			error(xhr, "timeout", event);
			complete(xhr, xhr.responseType);
		}, timeout + 200);

		xhr.onload = function (event) {
			clearTimeout(timer);
			xhr.onload = xhr.onerror = xhr.ontimeout = null;
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					success(xhr.response, dataType);
				} else {
					error(xhr, event.target.response.message, event);
				}
				complete(xhr, xhr.responseType);
			}
		};
		xhr.ontimeout = function (event) {
			clearTimeout(timer);
			xhr.onload = xhr.onerror = xhr.ontimeout = null;
			error(xhr, "timeout", event);
			complete(xhr, xhr.responseType);
		};
		xhr.onerror = function (event) {
			clearTimeout(timer);
			xhr.onload = xhr.onerror = xhr.ontimeout = null;
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
	}.bind(this);

	/**
	 * 動的url
	 * @param {string} url - 変更後url
	 * @param {object} [data] - 保持するデータ
	 * @param {boolean} [log] - ブラウザの履歴に書き込むか
	 * @returns {undefined}
	 * @static
	 */
	static historyPush(url, data = {}, log = true) {
		if (log) {
			history.pushState(data, "", url);
		} else {
			history.replaceState(data, "", url);
		}
	}
	/**
	 * 動的url
	 * @param {string} url - 変更後url
	 * @param {object} [data] - 保持するデータ
	 * @param {boolean} [log] - ブラウザの履歴に書き込むか
	 * @returns {undefined}
	 */
	historyPush = Jasc.historyPush;

	/**
	 * urlパラメータ分解
	 * @param {string} data - url
	 * @returns {object}
	 * @static
	 */
	static getUrlVars(url) {
		var vars = {};
		const urlObj = new URL(url);
		const param = urlObj.searchParams;
		new Set(param.keys()).forEach((key) => {
			const arr = param.getAll(key);
			let val;
			if (Array.isArray(arr) && arr.length == 1) {
				val = arr[0];
			} else {
				val = arr;
			}
			vars[key] = Jasc.dataTypeFormatting(val, 5);
		});
		return vars;
	}
	/**
	 * urlパラメータ分解
	 * @param {string} data - url
	 * @returns {object}
	 */
	getUrlVars = Jasc.getUrlVars;

	/**
	 * 相対url(絶対url)→絶対url
	 * @param {string} path - 相対url
	 * @param {boolean} [notElem=false] - aタグを使用しない方式(new URL)
	 * @returns {string} 絶対url
	 */
	absolutePath(path = "", notElem = false) {
		if (notElem) {
			const u = new URL(path, this.#jasc_readonlyData.pageBaseUrl);
			return u.toString();
		} else {
			const e = document.createElement("a");
			e.href = path;
			return e.href;
		}
	}

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
		url = this.absolutePath(url);

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
				Jasc.copy2Clipboard(url).then(resolve).catch(reject);
			}
		});
	}

	/**
	 * クリップボードにコピー
	 * @param {string} data - コピーするデータ
	 * @returns {Promise<undefined>} 完了後実行
	 * @static
	 */
	static copy2Clipboard(data) {
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
	}
	/**
	 * クリップボードにコピー
	 * @param {string} data - コピーするデータ
	 * @returns {Promise<undefined>} 完了後実行
	 */
	copy2Clipboard = Jasc.copy2Clipboard;

	/**
	 * 変数の型統一変換[破壊的関数]
	 * @param {object} data - 変数
	 * @param {number} [nestingDepth=0] - 再帰する深さ
	 * @returns {object} 変数
	 * @static
	 */
	static dataTypeFormatting(data, nestingDepth = 0) {
		let isInternal = false;
		if (nestingDepth > 0) {
			nestingDepth--;
			isInternal = true;
		}
		if (Array.isArray(data)) {
			if (isInternal) {
				for (let i = 0, li = data.length; i < li; i++) {
					data[i] = Jasc.dataTypeFormatting(data[i], nestingDepth);
				}
			}
		} else if (Jasc.isAssociative(data)) {
			if (isInternal) {
				for (const k in data) {
					data[k] = Jasc.dataTypeFormatting(data[k], nestingDepth);
				}
			}
		} else {
			switch (typeof data) {
				case "string":
					// 文字列を数値に
					if (data !== "" && !isNaN(data)) {
						if (Number.isSafeInteger(Number(data))) {
							data = Number(data);
						} else {
							data = BigInt(data);
						}
					}
					break;
				case "number":
				case "bigint":
				case "boolean":
				case "function":
				case "object":
				case "undefined":
					break;
				default:
					// 非対応
					break;
			}
		}
		return data;
	}
	/**
	 * 変数の型統一変換[破壊的関数]
	 * @param {object} data - 変数
	 * @param {number} [nestingDepth=0] - 再帰する深さ
	 * @returns {object} 変数
	 */
	dataTypeFormatting = Jasc.dataTypeFormatting;

	//======================
	// 基本構成(canvas)
	//======================

	/**
	 * canvas描画関係
	 */
	draw = {
		/**
		 * 文字描画
		 *
		 * ※ctxにnullを代入するとカレントctxが使用されます。
		 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
		 * @param {number[]} xy - xy座標
		 * @param {string} text - 描画する文字
		 * @param {number} size - 文字サイズ
		 * @param {string} color - 文字色
		 * @param {string} [align="center"] - 文字描画位置
		 * @param {string} [base="middle"] - 文字描画位置
		 * @returns {undefined}
		 */
		text: function (ctx, xy, text, size, color, align = "center", base = "middle") {
			if (ctx == null) {
				ctx = this.#_activeCtx;
			}
			ctx.font = "bold " + size + 'px "太ゴシック","Arial Black"';
			ctx.textAlign = align;
			ctx.textBaseline = base;
			ctx.fillStyle = color;
			ctx.fillText(text, ...xy);
		}.bind(this),
		/**
		 * 線描画
		 *
		 * ※ctxにnullを代入するとカレントctxが使用されます。
		 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
		 * @param {number[]} xy1 - xy1
		 * @param {number[]} xy2 - xy2
		 * @param {string} color - 線色
		 * @returns {undefined}
		 */
		line: function (ctx, xy1, xy2, color) {
			if (ctx == null) {
				ctx = this.#_activeCtx;
			}
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(...xy1);
			ctx.lineTo(...xy2);
			ctx.stroke();
		}.bind(this),

		/**
		 * 四角描画
		 *
		 * ※ctxにnullを代入するとカレントctxが使用されます。
		 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
		 * @param {number[]} xy - xy座標
		 * @param {number[]} wh - 幅・高さ
		 * @param {string} color - 色
		 */
		rect: function (ctx, xy, wh, color) {
			if (ctx == null) {
				ctx = this.#_activeCtx;
			}
			ctx.fillStyle = color;
			ctx.fillRect(...xy, ...wh);
		}.bind(this),
		/**
		 * 円描画
		 *
		 * ※ctxにnullを代入するとカレントctxが使用されます。
		 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
		 * @param {number[]} xy - x座標
		 * @param {number} r - 半径
		 * @param {string} color1 - 塗り
		 * @param {string} color2 - 線
		 * @returns {undefined}
		 */
		circle: function (ctx, xy, r, color1, color2 = null) {
			if (ctx == null) {
				ctx = this.#_activeCtx;
			}
			ctx.fillStyle = color1;
			ctx.strokeStyle = color2;
			ctx.beginPath();
			ctx.arc(...xy, r, 0, Math.PI * 2);
			if (color2 != null) ctx.stroke();
			if (color1 != null) ctx.fill();
		}.bind(this),
		/**
		 * 三角描画
		 *
		 * ※ctxにnullを代入するとカレントctxが使用されます。
		 * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
		 * @param {number[]} xy1 - x1
		 * @param {number[]} xy2 - x2
		 * @param {number[]} xy3 - x3
		 * @param {string} color - 色
		 * @returns {undefined}
		 */
		triangle: function (ctx, xy1, xy2, xy3, color) {
			if (ctx == null) {
				ctx = this.#_activeCtx;
			}
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(...xy1);
			ctx.lineTo(...xy2);
			ctx.lineTo(...xy3);
			ctx.closePath();
			ctx.fill();
		}.bind(this),
	};

	//======================
	// game外部操作
	//======================

	/**
	 * jascゲームエンジン関係
	 */
	game = {
		/**
		 * 現在のカレントキャンバスの管理
		 * @param {string} [key=""] キー
		 * @returns {string} 現在のキー
		 */
		changeCurrentCanvas: function (key = "") {
			if (!key) {
				return this.#_activeCanvasName;
			}
			if (!this.#jasc_gameData.canvas[key]) {
				return false;
			}
			this.#_activeCanvasName = key;
			this.#_activeCanvas = this.#jasc_gameData.canvas[key];
			this.#_activeCtx = this.#jasc_gameData.ctx[key];
			return key;
		}.bind(this),

		/**
		 * カレントキャンバスを取得
		 * @returns {HTMLCanvasElement} キャンバスオブジェクト
		 */
		getCurrentCanvas: function () {
			return this.#_activeCanvas;
		}.bind(this),

		/**
		 * カレントctxを取得
		 * @returns {CanvasRenderingContext2D} ctxオブジェクト
		 */
		getCurrentCtx: function () {
			return this.#_activeCtx;
		}.bind(this),

		/**
		 * canvasリサイズ
		 * @param {number} [width=0] 横幅
		 * @param {number} [height=0] 高さ
		 * @returns {undefined}
		 */
		canvasResize: function (width = 0, height = 0) {
			const _jasc_gameData = this.#jasc_gameData;
			if (Object.keys(_jasc_gameData.canvas).length <= 0) {
				return;
			}

			let dpr = window.devicePixelRatio;

			if (width == 0 && height == 0) {
				let rect = document.body.getBoundingClientRect();
				[width, height] = [rect.width, rect.height];
			}
			for (let key in _jasc_gameData.canvas) {
				_jasc_gameData.canvas[key].width = width * dpr;
				_jasc_gameData.canvas[key].height = height * dpr;

				_jasc_gameData.ctx[key].scale(dpr, dpr);

				_jasc_gameData.canvas[key].style.width = width + "px";
				_jasc_gameData.canvas[key].style.height = height + "px";
			}

			this._dispatchEvent("canvasResize", [width, height, dpr]);
		}.bind(this),
	};

	//======================
	// 連想配列計算
	//======================

	/**
	 * 連想配列かどうか判定
	 * @param {object} obj - 連想配列
	 * @returns {boolean}
	 * @static
	 */
	static isAssociative(obj) {
		return obj?.constructor === Object;
	}
	/**
	 * 連想配列かどうか判定
	 * @param {object} obj - 連想配列
	 * @returns {boolean}
	 */
	isAssociative = Jasc.isAssociative;

	/**
	 * 連想配列を結合(上書き)[破壊的関数]
	 * @param {object} parents - 結合先
	 * @param {object} [child] - 結合元
	 * @returns {undefined}
	 * @static
	 */
	static overwriteAssociative(parents, child = {}) {
		for (let key in parents) {
			if (Jasc.objHasOwnProperty(child, key)[0]) {
				if (Jasc.isAssociative(parents[key]) && !Jasc.isSetter(parents, key)) {
					Jasc.overwriteAssociative(parents[key], child[key]);
				} else {
					parents[key] = child[key];
				}
			}
		}
	}
	/**
	 * 連想配列を結合(上書き)[破壊的関数]
	 * @param {object} parents - 結合先
	 * @param {object} [child] - 結合元
	 * @returns {undefined}
	 */
	overwriteAssociative = Jasc.overwriteAssociative;

	/**
	 * 連想配列に自動でkeyを作成、割り当て
	 * @param {object} obj - 連想配列
	 * @param {any} [data] - 代入内容
	 * @param {string} [baseName=""] - 基準名
	 * @param {string} [prefix="-"] - 通し番号結合文字
	 * @returns {string} 作成されたkey名
	 * @static
	 */
	static setAssociativeAutoName(obj = {}, data = null, baseName = "", prefix = "-") {
		if (!Jasc.isAssociative(obj)) {
			return false;
		}
		let maxNum = -1;
		for (let key in obj) {
			if (Jasc.objHasOwnProperty(obj, key)[0]) {
				let sp = key.split(prefix);
				let spl = sp.length;
				if (spl >= 2) {
					maxNum = Math.max(maxNum, +sp[spl - 1]);
				}
			}
		}

		let bn = baseName;
		if (baseName.indexOf(prefix) >= 0) {
			let tmp = baseName.split(prefix);
			if (!isNaN(tmp[tmp.length - 1])) {
				bn = tmp.slice(0, -1).join(prefix);
			}
		}

		maxNum++;
		const keyName = `${bn}${prefix}${maxNum}`;
		obj[keyName] = data;
		return keyName;
	}
	/**
	 * 連想配列に自動でkeyを作成、割り当て
	 * @param {object} obj - 連想配列
	 * @param {any} [data] - 代入内容
	 * @param {string} [baseName=""] - 基準名
	 * @param {string} [prefix="-"] - 通し番号結合文字
	 * @returns {string} 作成されたkey名
	 */
	setAssociativeAutoName = Jasc.setAssociativeAutoName;

	/**
	 * オブジェクトの断層を特定
	 *
	 * 例:
	 * "obj.a.b.c" => c
	 * @param {object} obj - オブジェクト
	 * @param {string|string[]} keys - キー
	 * @param {any} [notFound="__NOT_FOUND__"] - 存在しない場合やエラーの返り値
	 * @param {boolean} [createObj=false] - 存在しなかった場合にオブジェクトを作成
	 * @returns {any} 値
	 * @static
	 */
	static getDotKey(obj, keys, notFound = "__NOT_FOUND__", createObj = false) {
		if (typeof keys === "string") {
			keys = keys.split(".");
		} else if (Array.isArray(keys)) {
			keys = keys.slice();
		} else {
			return notFound;
		}
		return Jasc._getDotSearch(obj, keys, notFound, createObj);
	}
	/**
	 * オブジェクトの断層を特定
	 *
	 * 例:
	 * "obj.a.b.c" => c
	 * @param {object} obj - オブジェクト
	 * @param {string|string[]} keys - キー
	 * @param {any} [notFound="__NOT_FOUND__"] - 存在しない場合やエラーの返り値
	 * @param {boolean} [createObj=false] - 存在しなかった場合にオブジェクトを作成
	 * @returns {any} 値
	 */
	getDotKey = Jasc.getDotKey;

	static _getDotSearch(obj, keys, notFound, createObj = false) {
		const key = keys.shift();
		if (keys.length === 0) {
			return obj[key];
		}
		if (obj[key] === undefined) {
			if (!createObj) {
				return notFound;
			}
			obj[key] = {};
		}
		return Jasc._getDotSearch(obj[key], keys, notFound, createObj);
	}

	//======================
	// 文字計算
	//======================
	/**
	 * 不明なスペースを半角スペースに
	 * @param {string} str - 対象文字列
	 * @returns {string} 変換後
	 * @static
	 */
	static usp2sp(str) {
		return str.toString().replace(/[^\S\n\r]/g, " ");
		/* 旧仕様
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
		*/
	}
	/**
	 * 不明なスペースを半角スペースに
	 * @param {string} str - 対象文字列
	 * @returns {string} 変換後
	 */
	usp2sp = Jasc.usp2sp;
	/**
	 * 全ての文字を共通化
	 * @param {string} str - 対象文字列
	 * @returns {string} 変換後
	 * @static
	 */
	static othToHira(str, useLowerCase = true) {
		str = Jasc.usp2sp(str)
			.normalize("NFKC")
			.replace(/[ア-ヺ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
			.replace(/[”“″‶〝‟]/gu, '"')
			.replace(/[’‘′´‛‵＇]/gu, "'");
		if (useLowerCase) {
			str = str.toLowerCase();
		}
		return str;
	}
	/**
	 * 全ての文字を共通化
	 * @param {string} str - 対象文字列
	 * @returns {string} 変換後
	 */
	othToHira = Jasc.othToHira;

	/**
	 * 正規表現文字列エスケープ
	 * @param {string} str - 対象文字列
	 * @returns {string} 変換後
	 * @static
	 */
	static escapeRegExp(str) {
		return str && Jasc.#_RE_REGEXP.test(str) ? str.replace(Jasc.#_RE_REGEXP, "\\$&") : str;
	}
	/**
	 * 正規表現文字列エスケープ
	 * @param {string} str - 対象文字列
	 * @returns {string} 変換後
	 */
	escapeRegExp = Jasc.escapeRegExp;

	/**
	 * 類似文字列検索
	 * @param {string} str - 対象文字列
	 * @param {string[]} list - 比較文字列リスト
	 * @returns {[string, number]|false} 類似文字列と類似度
	 * @static
	 */
	static similarString(str, list) {
		str = Jasc.othToHira(str);
		let dist;
		let maxDist = 0,
			maxInd = -1;
		for (let i = 0, li = list.length; i < li; i++) {
			let stli = Jasc.othToHira(list[i]);

			//レーベンシュタイン距離
			dist = Jasc.levenshteinDistance(str, stli) * 25;

			//N-gram(3,2,1)
			dist += Jasc.calcNgram(str, stli, 3) * 10;
			dist += Jasc.calcNgram(str, stli, 2) * 20;
			dist += Jasc.calcNgram(str, stli, 1) * 45;

			if (dist > maxDist) {
				maxDist = dist;
				maxInd = i;
			}
		}
		if (maxInd == -1) {
			return false;
		}
		return [list[maxInd], ((maxDist * 100) | 0) / 100];
	}
	/**
	 * 類似文字列検索
	 * @param {string} str - 対象文字列
	 * @param {string[]} list - 比較文字列リスト
	 * @returns {[string, number]|false} 類似文字列と類似度
	 */
	similarString = Jasc.similarString;

	/**
	 * レーベンシュタイン距離
	 * @param {string} str1 - 対象文字列
	 * @param {string} str2 - 比較文字列
	 * @returns {number} 類似度
	 * @static
	 */
	static levenshteinDistance(str1, str2) {
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
	}
	/**
	 * レーベンシュタイン距離
	 * @param {string} str1 - 対象文字列
	 * @param {string} str2 - 比較文字列
	 * @returns {number} 類似度
	 */
	levenshteinDistance = Jasc.levenshteinDistance;

	/**
	 * N-gram
	 * @param {string} a - 対象文字列
	 * @param {string} b - 比較文字列
	 * @param {number} n - N-gramの長さ
	 * @returns {number} 類似度
	 * @static
	 */
	static calcNgram(a, b, n) {
		const aGram = Jasc._getToNgram(a, n);
		const bGram = Jasc._getToNgram(b, n);
		const keyOfAGram = Object.keys(aGram);
		const keyOfBGram = Object.keys(bGram);
		// aGramとbGramに共通するN-gramのkeyの配列
		const abKey = keyOfAGram.filter((n) => keyOfBGram.includes(n));

		let dot = abKey.reduce((prev, key) => prev + Math.min(aGram[key], bGram[key]), 0);

		const abLengthMul = Math.sqrt(Jasc._getValuesSum(aGram) * Jasc._getValuesSum(bGram));
		return dot / abLengthMul;
	}
	/**
	 * N-gram
	 * @param {string} a - 対象文字列
	 * @param {string} b - 比較文字列
	 * @param {number} n - N-gramの長さ
	 * @returns {number} 類似度
	 */
	calcNgram = Jasc.calcNgram;

	// N-gram計算
	static _getToNgram(text, n = 3) {
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
	static _getValuesSum(object) {
		return Object.values(object).reduce((prev, current) => prev + current, 0);
	}

	//======================
	// 数学計算
	//======================

	/**
	 * 自作ワンタイムパスワード
	 * @param {number} key - キーのseed
	 * @returns {number} 結果
	 * @static
	 */
	static totp(key) {
		let rnd = new Jasc.Random(key * ((Date.now() / 30000) | 0));
		return rnd.nextInt(0, 99) * rnd.nextInt(0, 99) + rnd.nextInt(0, 99) * rnd.nextInt(0, 99);
	}
	/**
	 * 自作ワンタイムパスワード
	 * @param {number} key - キーのseed
	 * @returns {number} 結果
	 */
	totp = Jasc.totp;

	/**
	 * GASのUtilities.formatDateの移植(弱体)
	 * @param {Date} date - 日付
	 * @param {string} format - フォーマット
	 * @returns {string} フォーマット結果
	 * @static
	 */
	static formatDate(date, format) {
		return format
			.replace(/yyyy/g, date.getFullYear())
			.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2))
			.replace(/dd/g, ("0" + date.getDate()).slice(-2))
			.replace(/HH/g, ("0" + date.getHours()).slice(-2))
			.replace(/mm/g, ("0" + date.getMinutes()).slice(-2))
			.replace(/ss/g, ("0" + date.getSeconds()).slice(-2))
			.replace(/SSS/g, ("00" + date.getMilliseconds()).slice(-3));
	}
	/**
	 * GASのUtilities.formatDateの移植(弱体)
	 * @param {Date} date - 日付
	 * @param {string} format - フォーマット
	 * @returns {string} フォーマット結果
	 */
	formatDate = Jasc.formatDate;

	/**
	 * 組み合わせ列挙
	 * @param {array} arr - 配列
	 * @param {number} [number=0] - 組み合わせ数
	 * @returns {array|false} 組み合わせ
	 */
	permutation = function (arr, number = 0) {
		let ans = [];
		if (number <= 0) {
			number = arr.length;
		} else if (arr.length < number) {
			this._ccLog.log("第2引数は第1引数の配列数より少なくして下さい", "error");
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
				let row = this.permutation(parts, number - 1);
				for (let j = 0, lj = row.length; j < lj; j++) {
					ans.push([arr[i]].concat(row[j]));
				}
			}
		}
		return ans;
	}.bind(this);

	/**
	 * jsの小数丸め誤差を無視して比較する
	 * @param {number} a - 比較数値
	 * @param {number} b - 比較数値
	 * @returns {boolean} 比較結果
	 * @static
	 */
	static compareFloats(a, b) {
		if (typeof a === "number" && typeof b === "number") {
			return Math.abs(a - b) < Number.EPSILON;
		} else {
			return a === b;
		}
	}
	/**
	 * jsの小数丸め誤差を無視して比較する
	 * @param {number} a - 比較数値
	 * @param {number} b - 比較数値
	 * @returns {boolean} 比較結果
	 */
	compareFloats = Jasc.compareFloats;

	/**
	 * 厳格な数値チェック
	 * @param {number} n - 数値
	 * @returns {boolean} 数値かどうか
	 * @static
	 */
	static isNumber(n) {
		return typeof n === "number" || n instanceof Number;
	}
	/**
	 * 厳格な数値チェック
	 * @param {number} n - 数値
	 * @returns {boolean} 数値かどうか
	 */
	isNumber = Jasc.isNumber;

	/**
	 * 数値変換
	 * @param {any} n - 数値に変換する
	 * @param {boolean} [noNaN=false] - NaNを0にするか
	 * @returns {number} 数値
	 * @static
	 */
	static toNumber(n, noNaN = false) {
		let num;
		switch (typeof n) {
			case "number":
				num = n;
				break;
			case "bigint":
			case "string":
			case "boolean":
				num = Number(n);
				break;
			case "object":
				if (n instanceof Number) {
					num = +n;
					break;
				} else if (n === null) {
					num = 0;
					break;
				}
				num = NaN;
				break;
			default:
				num = NaN;
		}
		if (noNaN && isNaN(num)) {
			return 0;
		}
		return num;
	}
	/**
	 * 数値変換
	 * @param {any} n - 数値に変換する
	 * @param {boolean} [noNaN=false] - NaNを0にするか
	 * @returns {number} 数値
	 */
	toNumber = Jasc.toNumber;

	/**
	 * Arduinoのmapの移植
	 * @param {number} val - 値
	 * @param {number} fromMin - 現在の最小値
	 * @param {number} fromMax - 現在の最大値
	 * @param {number} toMin - 結果の最小値
	 * @param {number} toMax - 結果の最大値
	 * @returns {number} 結果
	 * @static
	 */
	static map(val, fromMin, fromMax, toMin, toMax) {
		if (val <= fromMin) {
			return toMin;
		}
		if (val >= fromMax) {
			return toMax;
		}
		let ratio = (toMax - toMin) / (fromMax - fromMin);
		return (val - fromMin) * ratio + toMin;
	}
	/**
	 * Arduinoのmapの移植
	 * @param {number} val - 値
	 * @param {number} fromMin - 現在の最小値
	 * @param {number} fromMax - 現在の最大値
	 * @param {number} toMin - 結果の最小値
	 * @param {number} toMax - 結果の最大値
	 * @returns {number} 結果
	 */
	map = Jasc.map;

	/**
	 * 数値、配列の合計
	 * @param {...number|number[]} data - 数値
	 * @returns {number} 合計
	 * @static
	 */
	static sum(...data) {
		return data.reduce((a, b) => a + (Array.isArray(b) ? b.reduce((b1, b2) => b1 + b2) : b), 0);
	}
	/**
	 * 数値、配列の合計
	 * @param {...number|number[]} data - 数値
	 * @returns {number} 合計
	 */
	sum = Jasc.sum;

	/**
	 * Pythonのrangeの移植
	 * @param {number} start - 開始
	 * @param {number} [end] - 終了
	 * @param {number} [step=1] - ステップ
	 * @returns {array} 結果
	 * @static
	 */
	static range(start, end, step = 1) {
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
	}
	/**
	 * Pythonのrangeの移植
	 * @param {number} start - 開始
	 * @param {number} [end] - 終了
	 * @param {number} [step=1] - ステップ
	 * @returns {array} 結果
	 */
	range = Jasc.range;

	/**
	 * 均等に数値を分割
	 * @param {number} val - 全体数
	 * @param {number} cou - 分割数
	 * @returns {array} 分割結果
	 * @static
	 */
	static divideEqually(val, cou) {
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
	}
	/**
	 * 均等に数値を分割
	 * @param {number} val - 全体数
	 * @param {number} cou - 分割数
	 * @returns {array} 分割結果
	 */
	divideEqually = Jasc.divideEqually;

	/**
	 * 配列を分割(n個ずつ)
	 * @param {array} arr - 配列
	 * @param {number} size - 分割数
	 * @returns {array} 分割結果
	 * @static
	 */
	static chunk(arr, size) {
		const len = arr.length;
		if (size <= 0 || len === 0) return [];

		const chunks = new Array(Math.ceil(len / size));
		let ind = 0;
		for (let i = 0; i < len; i += size) {
			chunks[ind++] = arr.slice(i, i + size);
		}
		return chunks;
	}
	/**
	 * 配列を分割(n個ずつ)
	 * @param {array} arr - 配列
	 * @param {number} size - 分割数
	 * @returns {array} 分割結果
	 */
	chunk = Jasc.chunk;

	/**
	 * 配列を分割(n個に)
	 * @param {array} arr - 配列
	 * @param {number} size - 分割数
	 * @returns {array} 分割結果
	 * @static
	 */
	static chunkDivide(arr, size) {
		arr = arr.slice();
		let ans = [];
		let de = Jasc.divideEqually(arr.length, size);
		for (let i = 0; i < de.length; i++) {
			ans.push(arr.splice(0, de[i]));
		}
		return ans;
	}
	/**
	 * 配列を分割(n個に)
	 * @param {array} arr - 配列
	 * @param {number} size - 分割数
	 * @returns {array} 分割結果
	 */
	chunkDivide = Jasc.chunkDivide;

	//======================
	// ファイル
	//======================

	/**
	 * ファイル選択画面表示
	 * @param {string} [accept="*"] - 受け付ける拡張子
	 * @param {boolean} [multiple=false] - 複数選択
	 * @param {number} [timeout=180000] - タイムアウト(ms)
	 * @param {boolean} [directory=false] - ディレクトリ選択
	 * @returns {Promise<FileList>} 選択結果
	 * @static
	 */
	static showOpenFileDialog(accept = "*", multiple = false, timeout = 180000, directory = false) {
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
	}
	/**
	 * ファイル選択画面表示
	 * @param {string} [accept="*"] - 受け付ける拡張子
	 * @param {boolean} [multiple=false] - 複数選択
	 * @param {number} [timeout=180000] - タイムアウト(ms)
	 * @param {boolean} [directory=false] - ディレクトリ選択
	 * @returns {Promise<FileList>} 選択結果
	 */
	showOpenFileDialog = Jasc.showOpenFileDialog;

	/**
	 * ドロップされたファイルを取得
	 * @param {string|jQuery|HTMLElement} dom - DOMオブジェクト
	 * @param {function} callback - コールバック
	 * @returns {undefined}
	 */
	getDropFilesEvent(dom = "body", callback) {
		if (typeof dom == "string") {
			dom = this.acq(dom)[0];
		} else {
			dom = this.jQueryObjToDOM(dom);
		}
		dom.addEventListener("drop", async function (event) {
			event.preventDefault();
			event.stopPropagation();

			Jasc._getDropFilesEvent(event.dataTransfer.items, callback);
		});
		dom.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
	}

	// getDropFilesEventの内部処理用
	static async _getDropFilesEvent(items, callback) {
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

	/**
	 * ファイルの種類を判定
	 * @param {File} fileObj - ファイルオブジェクト
	 * @returns {Promise<array>} ファイルタイプ
	 * @static
	 */
	static getFileType(fileObj) {
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
				for (let data of Jasc.#_FILETYPE_REG_LIST) {
					if (data[0].test(header)) {
						ret.push(data[1].split("_"));
						break;
					}
				}
				resolve(ret);
			};
			fileReader.readAsArrayBuffer(fileObj);
		});
	}
	/**
	 * ファイルの種類を判定
	 * @param {File} fileObj - ファイルオブジェクト
	 * @returns {Promise<array>} ファイルタイプ
	 */
	getFileType = Jasc.getFileType;

	/**
	 * ファイルのMINEタイプ取得
	 * @param {string} ext - 拡張子
	 * @returns {string|array} ファイルタイプ
	 * @static
	 */
	static getMimeType(ext) {
		ext = ext.toString().toLowerCase();
		let lst = Jasc.#_FILETYPE_MIME_LIST?.[ext] ?? "application/octet-stream";
		if (!Array.isArray(lst)) {
			return [lst];
		}
		return lst;
	}
	/**
	 * ファイルのMINEタイプ取得
	 * @param {string} ext - 拡張子
	 * @returns {string|array} ファイルタイプ
	 */
	getMimeType = Jasc.getMimeType;

	//======================
	// 通知
	//======================

	/**
	 * 通知許可
	 * @returns {Promise<boolean>} 許可状態
	 * @static
	 */
	static allowNotification() {
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
	}
	/**
	 * 通知許可
	 * @returns {Promise<boolean>} 許可状態
	 */
	allowNotification = Jasc.allowNotification;

	/**
	 * 通知送信
	 * @param {string} title - タイトル
	 * @param {string} text - 本文
	 * @param {object} opt - オプション
	 * @returns {Notification} 通知オブジェクト
	 * @static
	 */
	static sendNotification(title, text, opt = {}) {
		Jasc.isAssociative(opt) || (opt = {});
		opt.text = text;
		return new Notification(title, opt);
	}
	/**
	 * 通知送信
	 * @param {string} title - タイトル
	 * @param {string} text - 本文
	 * @param {object} opt - オプション
	 * @returns {Notification} 通知オブジェクト
	 */
	sendNotification = Jasc.sendNotification;

	//======================
	// class同士の演算補助
	//======================

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
	 * @static
	 */
	static customOperator(obj, op = "+") {
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
	}
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
	customOperator = Jasc.customOperator;

	//======================
	// cookie簡単操作
	//======================
	/**
	 * cookieの値を取得
	 * @param {string} name - 名前
	 * @returns {string|null} 値
	 * @static
	 */
	static getCookie(name) {
		let result = null;
		let cookieName = name + "=";
		let all_cookies = document.cookie;
		let position = all_cookies.indexOf(cookieName);
		if (position != -1) {
			let startIndex = position + cookieName.length;
			let endIndex = all_cookies.indexOf(";", startIndex);
			if (endIndex == -1) {
				endIndex = all_cookies.length;
			}
			result = decodeURIComponent(all_cookies.substring(startIndex, endIndex));
		}
		return result;
	}
	/**
	 * cookieの値を取得
	 * @param {string} name - 名前
	 * @returns {string|null} 値
	 */
	getCookie = Jasc.getCookie;

	/**
	 * cookieの値を削除
	 * @param {string} name - 名前
	 * @returns {boolean} 成功したか
	 * @static
	 */
	static removeCookie(name) {
		if (Jasc.getCookie(name)) {
			document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
			return true;
		}
		return false;
	}
	/**
	 * cookieの値を削除
	 * @param {string} name - 名前
	 * @returns {boolean} 成功したか
	 */
	removeCookie = Jasc.removeCookie;

	/**
	 * cookieを追加・更新
	 * @param {string} name - 名前
	 * @param {string} value - 値
	 * @param {object} [opt] - オプション
	 * @param {number} [opt.days=3] - 日数
	 * @returns {boolean} 成功したか
	 * @static
	 */
	static setCookie(name, value, opt = {}) {
		let date = new Date();
		date.setTime(date.getTime() + (opt?.days ?? 3) * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
	}
	/**
	 * cookieを追加・更新
	 * @param {string} name - 名前
	 * @param {string} value - 値
	 * @param {object} [opt] - オプション
	 * @param {number} [opt.days=3] - 日数
	 * @returns {boolean} 成功したか
	 */
	setCookie = Jasc.setCookie;

	//======================
	// オブジェクト操作
	//======================
	/**
	 * replaceのPromises対応版
	 * @param {string} str - 文字列
	 * @param {RegExp} regex - 正規表現
	 * @param {function} asyncFn - replace時実行非同期関数
	 * @returns {Promise<string>} 変換後
	 * @async
	 * @static
	 */
	static async replaceAsync(str, regex, asyncFn) {
		let promises = [];
		str.replace(regex, (match, ...args) => {
			const promise = asyncFn(match, ...args);
			promises.push(promise);
		});
		const data = await Promise.all(promises);
		promises = null;
		return str.replace(regex, () => data.shift());
	}
	/**
	 * replaceのPromises対応版
	 * @param {string} str - 文字列
	 * @param {RegExp} regex - 正規表現
	 * @param {function} asyncFn - replace時実行非同期関数
	 * @returns {Promise<string>} 変換後
	 * @async
	 */
	replaceAsync = Jasc.replaceAsync;

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
			this._ccLog.error(e, true);
		}
		return 1;
	}

	/**
	 * definePropertyをprototypeに使用した際の問題対策
	 * - prototypeを探るにはdepthを3にすると良い
	 * @param {object} obj - オブジェクト
	 * @param {number} [depth=0] - 深さ
	 * @param {boolean} [isEnumerable=false] - enumerableを取得するか
	 * @returns {string[]} 名前
	 * @static
	 */
	static getObjectPropertyNames(obj, depth = 0, isEnumerable = false) {
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
	}
	/**
	 * definePropertyをprototypeに使用した際の問題対策
	 * - prototypeを探るにはdepthを3にすると良い
	 * @param {object} obj - オブジェクト
	 * @param {number} [depth=0] - 深さ
	 * @param {boolean} [isEnumerable=false] - enumerableを取得するか
	 * @returns {string[]} 名前
	 */
	getObjectPropertyNames = Jasc.getObjectPropertyNames;

	/**
	 * hasOwnPropertyを使いやすく
	 * @param {object} obj - オブジェクト
	 * @param {string} key - 名前
	 * @returns {[boolean, any]} 結果
	 * @static
	 */
	static objHasOwnProperty(obj, key) {
		if (key in obj && Object.prototype.hasOwnProperty.call(obj, key)) {
			return [true, obj[key]];
		}
		return [false, null];
	}
	/**
	 * hasOwnPropertyを使いやすく
	 * @param {object} obj - オブジェクト
	 * @param {string} key - 名前
	 * @returns {[boolean, any]} 結果
	 */
	objHasOwnProperty = Jasc.objHasOwnProperty;

	/**
	 * メゾットがセッターかを判定
	 * @param {object} obj - オブジェクト
	 * @param {string} key - 名前
	 * @returns {boolean} 結果
	 * @static
	 */
	static isSetter(obj, key) {
		const descriptor = Object.getOwnPropertyDescriptor(obj, key);
		return !!descriptor && typeof descriptor.set === "function";
	}
	/**
	 * メゾットがセッターかを判定
	 * @param {object} obj - オブジェクト
	 * @param {string} key - 名前
	 * @returns {boolean} 結果
	 */
	isSetter = Jasc.isSetter;

	/**
	 * メゾットがゲッターかを判定
	 * @param {object} obj - オブジェクト
	 * @param {string} key - 名前
	 * @returns {boolean} 結果
	 * @static
	 */
	static isGetter(obj, key) {
		const descriptor = Object.getOwnPropertyDescriptor(obj, key);
		return !!descriptor && typeof descriptor.get === "function";
	}
	/**
	 * メゾットがゲッターかを判定
	 * @param {object} obj - オブジェクト
	 * @param {string} key - 名前
	 * @returns {boolean} 結果
	 */
	isGetter = Jasc.isGetter;

	//======================
	// 標準関数を使いやすく
	//======================

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
	pressKey = function (code, opt = {}, elem = window) {
		let type = opt.type ?? "keydown";
		if (type == 0) {
			// Falsy の場合
			type = "keydown";
		} else if (type == 1) {
			// Truthy の場合
			type = "keyup";
		} else if (type !== "keydown" && type !== "keyup") {
			this._ccLog.warn("pressKey: type must be 'keydown' or 'keyup'");
			return 1;
		}
		if (Array.isArray(code)) {
			let ret = 0;
			for (const c of code) {
				ret |= this.pressKey(c, opt, elem);
			}
			return ret;
		}
		if (typeof code !== "string" || code.length < 1) {
			this._ccLog.warn("pressKey: code must be string");
			return 1;
		}
		const kEvent = new KeyboardEvent(type, {
			code: code,
			altKey: opt.altKey ?? false,
			shiftKey: opt.shiftKey ?? false,
			ctrlKey: opt.ctrlKey ?? false,
			metaKey: opt.metaKey ?? false,
		});
		let dom = this.acq(elem);
		if (!dom) {
			return 1;
		}
		if (dom?.[0]) {
			dom = dom[0];
		}
		dom.dispatchEvent(kEvent);
		if (type == "keydown" && opt.delay != null) {
			const _this = this;
			setTimeout(() => {
				opt.type = "keyup";
				_this.pressKey(code, opt, elem);
			}, opt.delay);
		}
		return 0;
	};

	//##################################################
	// 内部使用静的グローバルクラス
	//##################################################

	/**
	 * 乱数生成
	 * @param {number} [seed=88675123] - 乱数シード
	 * @returns {Jasc.Random} 乱数
	 * @static
	 */
	static Random = class {
		#x;
		#y;
		#z;
		#w;

		constructor(seed = 88675123) {
			this.#x = 123456789;
			this.#y = 362436069;
			this.#z = 521288629;
			this.#w = seed;
		}

		// XorShift
		next() {
			let t = this.#x ^ (this.#x << 11);
			this.#x = this.#y;
			this.#y = this.#z;
			this.#z = this.#w;
			return (this.#w = this.#w ^ (this.#w >>> 19) ^ (t ^ (t >>> 8)));
		}

		// min以上max以下の乱数を生成する
		nextInt(min = 0, max = 1) {
			const r = Math.abs(this.next());
			return min + (r % (max + 1 - min));
		}
	};
	//##################################################
	// 静的グローバルクラス
	//##################################################
	/**
	 * カスタムログ
	 * @param {object} [arg] - オプション
	 * @param {boolean} [arg.debug=false] - 通常表示を表示するか
	 * @param {boolean} [arg.oblInd=true] - 必須表示を表示するか
	 * @param {string} [arg.prefix=""] - 前に表示する名称
	 * @param {object} [arg.style] - カスタムスタイル
	 * @returns {Jasc.ConsoleCustomLog}
	 * @static
	 */
	static ConsoleCustomLog = class {
		#isDebug;
		#isOblInd;
		#prefix;
		#timeArr = {};
		constructor(arg = {}) {
			this.#isDebug = arg.debug ?? false;
			this.#isOblInd = arg.oblInd ?? true;
			this.style = {
				ccLogSys: "color: #00B7CE;",
				system: "color: #00d0d0;",
				time: "color: green;",
				error: "color: red;font-weight: bold;",
				pale: "color: #bbb;",
				data: "color:purple;",
			};
			this.#prefix = arg.prefix ?? "";
			if (arg.style) {
				this.style = Object.assign(this.style, arg.style);
			}
		}

		/**
		 * デバックモードON/OFF
		 * @param {boolean} flag - デバックモード
		 * @returns {undefined}
		 */
		set debug(flag) {
			this.#isDebug = flag;
			this.log(`DebugMode: ${flag ? "ON" : "OFF"}!`, "ccLogSys", true);
		}

		/**
		 * 必須表示ON/OFF
		 * @param {boolean} flag - 必須表示
		 * @returns {undefined}
		 */
		set obligationIndication(flag) {
			this.#isOblInd = flag;
			this.log(`OblInd is ${flag ? "ON" : "OFF"}!`, "ccLogSys", true);
		}

		/**
		 * 接頭語取得
		 * @returns {string}
		 */
		get head() {
			return this.#prefix;
		}
		/**
		 * 接頭語設定
		 * @param {string} str - 接頭語
		 * @returns {undefined}
		 */
		set head(str) {
			this.#prefix = str;
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
			if (!(this.#isDebug || (this.#isOblInd && obligation))) {
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
			if (this.#prefix) {
				pre = `[${this.#prefix}]`;
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
			if (!(this.#isDebug || (this.#isOblInd && obligation))) {
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
			if (!(this.#isDebug || (this.#isOblInd && obligation))) {
				return;
			}
			if (this._prefix) {
				console.error(`[${this.#prefix}]`, errObj);
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
			if (this.#timeArr[name]) {
				//終了
				let time = (performance.now() - this.#timeArr[name]) | 0;
				this.log(`${name}End: ${time}ms`, "time", obligation);
				this.#timeArr[name] = null;
				delete this.#timeArr[name];
				return time;
			} else {
				//開始
				this.#timeArr[name] = performance.now();
				this.log(`${name}Start`, "time", obligation);
				return false;
			}
		}
	};
	/**
	 * カスタムログ
	 * @param {object} [arg] - オプション
	 * @param {boolean} [arg.debug=false] - 通常表示を表示するか
	 * @param {boolean} [arg.oblInd=true] - 必須表示を表示するか
	 * @param {string} [arg.prefix=""] - 前に表示する名称
	 * @param {object} [arg.style] - カスタムスタイル
	 * @returns {Jasc.ConsoleCustomLog}
	 */
	consoleCustomLog(arg = {}) {
		return new Jasc.ConsoleCustomLog(arg);
	}

	/**
	 * 画像管理
	 * @param {object} urls - URL
	 * @returns {Jasc.AssetsManager}
	 * @static
	 */
	static AssetsManager = class {
		#promises = [];
		#imageMap = new Map();
		constructor(urls = {}) {
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
			this.#promises.push(
				new Promise((resolve, reject) => {
					img.addEventListener("load", () => {
						this.#imageMap.set(name, img);
						resolve();
					});
					img.addEventListener("error", (e) => {
						this.#imageMap.set(name, null);
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
			this.#imageMap.set(name, img);
		}
		/**
		 * 画像読み込み
		 * @returns {Promise<Map<string, HTMLImageElement>>}
		 */
		load() {
			return Promise.all(this.#promises).then(() => {
				return this.#imageMap;
			});
		}
		/**
		 * 画像取得
		 * @param {string} name - 画像呼び出し名
		 * @returns {HTMLImageElement}
		 */
		get(name) {
			return this.#imageMap.get(name);
		}
		/**
		 * 画像削除
		 * @param {string} name - 画像呼び出し名
		 * @returns {undefined}
		 */
		del(name) {
			this.#imageMap.delete(name);
		}
		/**
		 * 画像全削除
		 * @returns {undefined}
		 */
		clear() {
			this.#imageMap.clear();
		}
	};
	/**
	 * 画像管理
	 * @param {object} urls - URL
	 * @returns {Jasc.AssetsManager}
	 */
	assetsManager(urls = {}) {
		return new Jasc.AssetsManager(urls);
	}
}

// 初期化
if (typeof window?.jasc == "undefined") {
	var jasc = new Jasc();
} else {
	console.warn("[jasc]変数「jasc」は既に使用されています！");
}
