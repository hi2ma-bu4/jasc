function base64encode(str,convertToUtf8=true)
{
	if(typeof str!=='string') {
		return null;
	}
	let utf8str;
	if(convertToUtf8) {
		utf8str=URLCompressor.encodeUtf8(str); // UTF8に変換
		if(utf8str===null) {
			return null;
		}
	} else {
		utf8str=str; // 無変換
	}
	try {
		return btoa(utf8str);
	} catch(e) {
		return null;
	}
}
function base64decode(str,convertToUtf16=true)
{
	if(typeof str!=='string') {
		return null;
	}
	let utf8str;
	try {
		utf8str=atob(str);
	} catch(e) {
		return null;
	}
	let decodedStr;
	if(convertToUtf16) {
		decodedStr=URLCompressor.decodeUtf8(utf8str);
	} else {
		decodedStr=utf8str;
	}
	return decodedStr;
}

function base64urlEncode(str,convertToUtf8=true)
{
	let utf8str;
	if(convertToUtf8) {
		utf8str=URLCompressor.encodeUtf8(str); // UTF8に変換
		if(utf8str==null) {
			return null;
		}
	} else {
		utf8str=str;
	}
	let base64str;
	try {
		base64str=btoa(utf8str);
	} catch(e) {
		return null;
	}
	let base64urlStr='';
	for(let len=base64str.length,i=0; i<len; i++) {
		if(base64str[i]==='+') {
			base64urlStr+='-';
		} else if(base64str[i]==='/') {
			base64urlStr+='_';
		} else if(base64str[i]!=='=') {
			base64urlStr+=base64str[i];
		}
	}
	return base64urlStr;
}
function base64urlDecode(str,convertToUtf16=true)
{
	if(typeof str!=='string') {
		return null;
	}
	let base64str='';
	for(let len=str.length,i=0; i<len; i++) {
		if(str[i]==='-') {
			base64str+='+';
		} else if (str[i]==='_') {
			base64str+='/';
		} else {
			base64str+=str[i];
		}
	}
	const decodedStr=base64decode(base64str,convertToUtf16);
	return decodedStr;
}