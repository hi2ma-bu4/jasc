function percentEncode(str)
{
	"use strict";
	const e=encodeURIComponent(str);
	return e.replace(/%20/g,'+');
}
function percentDecode(str)
{
	"use strict";
	try {
		str=str.replace(/\+/g,'%20');
		return decodeURIComponent(str);
	} catch(e) {
		return null;
	}
}