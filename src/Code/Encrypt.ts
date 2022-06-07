window['System'] = {
	__namespace: true,
	__typeName: 'System',
	getName () {
		return 'System';
	},
	__upperCaseTypes: {},
};
const System = window['System']
System.__rootNamespaces = [System];
System.__registeredTypes = {};
System.__registerNameSpace = function (namespacePath) {
	let rootObject = window as any;
	const namespaceParts = namespacePath.split('.');
	for (let i = 0; i < namespaceParts.length; i++) {
		const currentPart = namespaceParts[i];
		let ns = rootObject[currentPart];
		if (!ns) {
			ns = rootObject[currentPart] = {
				__namespace: true,
				__typeName: namespaceParts.slice(0, i + 1).join('.'),
			};
			// tslint:disable-next-line: no-eval
			const parsedName = eval(ns.__typeName);
			ns.getName = function ns$getName() {
				return this.__typeName;
			};
		}
		rootObject = ns;
	}
};
System.Type = {};
System.Type.RegisterNamespace = System.__registerNameSpace;
System.TypeCode = {
	Empty: 0,
	Object: 1,
	DBNull: 2,
	Boolean: 3,
	Char: 4,
	SByte: 5,
	Byte: 6,
	Int16: 7,
	UInt16: 8,
	Int32: 9,
	UInt32: 10,
	Int64: 11,
	UInt64: 12,
	Single: 13,
	Double: 14,
	Decimal: 15,
	DateTime: 16,
	String: 18,
};
System.Text = System.Text ? System.Text : {};
System.Text.Trim = function (valText, valSymbols) {
	if (valSymbols == null) valSymbols = ' ';
	const trimS = new RegExp('^[' + valSymbols + ']+', 'g');
	const trimE = new RegExp('[' + valSymbols + ']+$', 'g');
	let newText = new String();
	newText = valText.replace(trimS, '');
	newText = newText.replace(trimE, '');
	return newText;
};
System.Text.ToCamelCase = function (valText) {
	const r1 = new RegExp('([A-Z])([A-Z]+)', 'ig');
	function ConvertCase(a, b, c) {
		return b.toUpperCase() + c.toLowerCase();
	}
	const results = valText.replace(r1, ConvertCase);
	return results;
};
System.Extensions = function () {
	this.Apply = function () {
		let isServerSide = false;
		if (typeof Response == 'object') isServerSide = true;
		String.prototype['Trim'] = function (string) {
			return System.Text.Trim(this, string);
		};
		String.prototype['ToCamelCase'] = function () {
			return System.Text.ToCamelCase(this);
		};
		Array.prototype['Clone'] = function () {
			const buffer = this.slice(0, this.length);
			for (let i = 0; i < this.length; i++) buffer[i] = this[i];
			return buffer;
		};
	};
};
System.Extensions = new System.Extensions();
System.Type.Class = System.Type.Class ? System.Type.Class : {};
System.Type.Class.Root = this;
System.Type.Class.Register = function (typeName, baseType) {
	const classType = eval(typeName);
	System.Type.Class._registerClass.apply(classType, arguments);
	classType.IsAbstract = true;
	classType.prototype.GetType = function () {
		return eval(typeName);
	};
};
System.Type.Class._registerClass = function (typeName, baseType, interfaceType) {
	this.FullName = typeName;
	const typeArray = typeName.split('.');
	this.Name = typeArray[typeArray.length - 1];
};
System.Class = System.Class ? System.Class : {};
System.Class.Inherit = System.Type.Class.Inherit;
System.Class.RegisterClass = System.Type.Class.Register;
System.Class.Root = this;
System.EventItem = function () {
	this.Node;
	this.Name;
	this.Handler;
	this.Capture;
};
System.EventHandler = function (target, method, timeout) {
	const me = this;
	this.Type = 'System.EventHandler';
	this.Method = null;
	this.Target = null;
	this.Timeout = null;
	this.InvokeNative = function () {
		const e = arguments[0] || window.event;
		const sender = e.target || e.srcElement;
		const args = new Array(2);
		args[0] = sender;
		args[1] = e;
		if (typeof timeout == 'number') {
			setTimeout(function () {
				return method.apply(target, args);
			}, timeout);
		} else {
			return method.apply(target, args);
		}
	};
	this.Initialize = function () {
		this.Target = target;
		this.Method = method;
	};
	this.Initialize();
};
System.EventsManager = function (context) {
	this.Type = 'System.EventsManager';
	this.Items = null;
	this.Context = null;
	const me = this;
	this.Add = function (node, eventName, eventHandler, capture) {
		const success = true;
		const id = node.id;
		if (node) {
			if (eventHandler.Type == 'System.EventHandler') eventHandler = eventHandler.InvokeNative;
			if (node.addEventListener) node.addEventListener(eventName, eventHandler, capture);
			this.AddItem(node, eventName, eventHandler, capture);
		}
		return success;
	};
	this.AddItem = function (node, eventName, eventHandler, capture) {
		const ev = new System.EventItem();
		ev.Node = node;
		ev.Name = eventName;
		ev.Handler = eventHandler;
		ev.Capture = capture;
		this.Items.push(ev);
	};
	this.Dispose = function () {
		let i, item;
		for (i = me.Items.length - 1; i >= 0; i = i - 1) {
			item = me.Items[i];
			let eventHandler = item.Handler;
			if (eventHandler.Type == 'System.EventHandler') eventHandler = eventHandler.InvokeNative;
			if (item.Node.removeEventListener)
				item.Node.removeEventListener(item.Name, item.Handler, item.Capture);
		}
	};
	this.InitializeClass = function () {
		this.Context = context ? context : window;
		this.Items = new Array();
		this.Add(this.Context, 'unload', new System.EventHandler(this, this.Dispose), false);
	};
	this.InitializeClass();
};
if (typeof Response != 'object') {
	const Events = new System.EventsManager();
	System.EventsManager.Current = new System.EventsManager();
}
System.Class.Properties = {};
System.Random = function () {
	this.Next = function (maxValue) {};
	this.Next = function (minValue, maxValue) {
		let number = minValue;
		if (maxValue > minValue) number = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
		return number;
	};
	this.InitializeClass = function () {};
	this.InitializeClass.apply(this, arguments);
};
System.Array = function () {};
System.Array.Reverse = function (array, index, length) {
	index = index ? index : 0;
	length = length ? length : array.length;
	const iArray = array.slice(index, index + length).reverse();
	for (let i = 0; i < length; i++) array[i + index] = iArray[i];
};
System.Array.FillMultiDimensional = function (array, dimensions, value) {
	for (let x = 0; x < array.length; x++) array[x] = value;
	return array;
};
System.Array.GetMultiDimensional = function (dimensions, value) {
	const array = new Array(dimensions[0]);
	return System.Array.FillMultiDimensional(array, dimensions.slice(1), value);
};
System.Array.Clear = function (array, index, length) {
	for (let i = 0; i < length; i++) array[i + index] = 0;
};
System.Buffer = function () {};
System.Buffer.BlockCopy = function (src, srcOffset, dst, dstOffset, count) {
	for (let i = 0; i < count; i++) {
		dst[dstOffset + i] = src[srcOffset + i];
	}
};
System.Byte = function () {
	const dims = new Array();
	for (let i = 0; i < arguments.length; i++) {
		dims.push(arguments[i]);
	}
	return System.Array.GetMultiDimensional(dims, 0);
};
System.UInt32 = System.Byte;
System.Text.HtmlSymbolCodes = {
	0x0022: 'quot',
	0x0026: 'amp',
	0x003c: 'lt',
	0x003e: 'gt',
	0x00a0: 'nbsp',
	0x00a1: 'iexcl',
	0x00a2: 'cent',
	0x00a3: 'pound',
	0x00a4: 'curren',
	0x00a5: 'yen',
	0x00a6: 'brvbar',
	0x00a7: 'sect',
	0x00a8: 'uml',
	0x00a9: 'copy',
	0x00aa: 'ordf',
	0x00ab: 'laquo',
	0x00ac: 'not',
	0x00ad: 'shy',
	0x00ae: 'reg',
	0x00af: 'macr',
	0x00b0: 'deg',
	0x00b1: 'plusmn',
	0x00b2: 'sup2',
	0x00b3: 'sup3',
	0x00b4: 'acute',
	0x00b5: 'micro',
	0x00b6: 'para',
	0x00b7: 'middot',
	0x00b8: 'cedil',
	0x00b9: 'sup1',
	0x00ba: 'ordm',
	0x00bb: 'raquo',
	0x00bc: 'frac14',
	0x00bd: 'frac12',
	0x00be: 'frac34',
	0x00bf: 'iquest',
	0x00c0: 'Agrave',
	0x00c1: 'Aacute',
	0x00c2: 'Acirc',
	0x00c3: 'Atilde',
	0x00c4: 'Auml',
	0x00c5: 'Aring',
	0x00c6: 'AElig',
	0x00c7: 'Ccedil',
	0x00c8: 'Egrave',
	0x00c9: 'Eacute',
	0x00ca: 'Ecirc',
	0x00cb: 'Euml',
	0x00cc: 'Igrave',
	0x00cd: 'Iacute',
	0x00ce: 'Icirc',
	0x00cf: 'Iuml',
	0x00d0: 'ETH',
	0x00d1: 'Ntilde',
	0x00d2: 'Ograve',
	0x00d3: 'Oacute',
	0x00d4: 'Ocirc',
	0x00d5: 'Otilde',
	0x00d6: 'Ouml',
	0x00d7: 'times',
	0x00d8: 'Oslash',
	0x00d9: 'Ugrave',
	0x00da: 'Uacute',
	0x00db: 'Ucirc',
	0x00dc: 'Uuml',
	0x00dd: 'Yacute',
	0x00de: 'THORN',
	0x00df: 'szlig',
	0x00e0: 'agrave',
	0x00e1: 'aacute',
	0x00e2: 'acirc',
	0x00e3: 'atilde',
	0x00e4: 'auml',
	0x00e5: 'aring',
	0x00e6: 'aelig',
	0x00e7: 'ccedil',
	0x00e8: 'egrave',
	0x00e9: 'eacute',
	0x00ea: 'ecirc',
	0x00eb: 'euml',
	0x00ec: 'igrave',
	0x00ed: 'iacute',
	0x00ee: 'icirc',
	0x00ef: 'iuml',
	0x00f0: 'eth',
	0x00f1: 'ntilde',
	0x00f2: 'ograve',
	0x00f3: 'oacute',
	0x00f4: 'ocirc',
	0x00f5: 'otilde',
	0x00f6: 'ouml',
	0x00f7: 'divide',
	0x00f8: 'oslash',
	0x00f9: 'ugrave',
	0x00fa: 'uacute',
	0x00fb: 'ucirc',
	0x00fc: 'uuml',
	0x00fd: 'yacute',
	0x00fe: 'thorn',
	0x00ff: 'yuml',
	0x0152: 'OElig',
	0x0153: 'oelig',
	0x0160: 'Scaron',
	0x0161: 'scaron',
	0x0178: 'Yuml',
	0x0192: 'fnof',
	0x02c6: 'circ',
	0x02dc: 'tilde',
	0x0391: 'Alpha',
	0x0392: 'Beta',
	0x0393: 'Gamma',
	0x0394: 'Delta',
	0x0395: 'Epsilon',
	0x0396: 'Zeta',
	0x0397: 'Eta',
	0x0398: 'Theta',
	0x0399: 'Iota',
	0x039a: 'Kappa',
	0x039b: 'Lambda',
	0x039c: 'Mu',
	0x039d: 'Nu',
	0x039e: 'Xi',
	0x039f: 'Omicron',
	0x03a0: 'Pi',
	0x03a1: 'Rho',
	0x03a3: 'Sigma',
	0x03a4: 'Tau',
	0x03a5: 'Upsilon',
	0x03a6: 'Phi',
	0x03a7: 'Chi',
	0x03a8: 'Psi',
	0x03a9: 'Omega',
	0x03b1: 'alpha',
	0x03b2: 'beta',
	0x03b3: 'gamma',
	0x03b4: 'delta',
	0x03b5: 'epsilon',
	0x03b6: 'zeta',
	0x03b7: 'eta',
	0x03b8: 'theta',
	0x03b9: 'iota',
	0x03ba: 'kappa',
	0x03bb: 'lambda',
	0x03bc: 'mu',
	0x03bd: 'nu',
	0x03be: 'xi',
	0x03bf: 'omicron',
	0x03c0: 'pi',
	0x03c1: 'rho',
	0x03c2: 'sigmaf',
	0x03c3: 'sigma',
	0x03c4: 'tau',
	0x03c5: 'upsilon',
	0x03c6: 'phi',
	0x03c7: 'chi',
	0x03c8: 'psi',
	0x03c9: 'omega',
	0x03d1: 'thetasym',
	0x03d2: 'upsih',
	0x03d6: 'piv',
	0x2002: 'ensp',
	0x2003: 'emsp',
	0x2009: 'thinsp',
	0x200c: 'zwnj',
	0x200d: 'zwj',
	0x200e: 'lrm',
	0x200f: 'rlm',
	0x2013: 'ndash',
	0x2014: 'mdash',
	0x2018: 'lsquo',
	0x2019: 'rsquo',
	0x201a: 'sbquo',
	0x201c: 'ldquo',
	0x201d: 'rdquo',
	0x201e: 'bdquo',
	0x2020: 'dagger',
	0x2021: 'Dagger',
	0x2022: 'bull',
	0x2026: 'hellip',
	0x2030: 'permil',
	0x2032: 'prime',
	0x2033: 'Prime',
	0x2039: 'lsaquo',
	0x203a: 'rsaquo',
	0x203e: 'oline',
	0x2044: 'frasl',
	0x20ac: 'euro',
	0x2111: 'image',
	0x2118: 'weierp',
	0x211c: 'real',
	0x2122: 'trade',
	0x2135: 'alefsym',
	0x2190: 'larr',
	0x2191: 'uarr',
	0x2192: 'rarr',
	0x2193: 'darr',
	0x2194: 'harr',
	0x21b5: 'crarr',
	0x21d0: 'lArr',
	0x21d1: 'uArr',
	0x21d2: 'rArr',
	0x21d3: 'dArr',
	0x21d4: 'hArr',
	0x2200: 'forall',
	0x2202: 'part',
	0x2203: 'exist',
	0x2205: 'empty',
	0x2207: 'nabla',
	0x2208: 'isin',
	0x2209: 'notin',
	0x220b: 'ni',
	0x220f: 'prod',
	0x2211: 'sum',
	0x2212: 'minus',
	0x2217: 'lowast',
	0x221a: 'radic',
	0x221d: 'prop',
	0x221e: 'infin',
	0x2220: 'ang',
	0x2227: 'and',
	0x2228: 'or',
	0x2229: 'cap',
	0x222a: 'cup',
	0x222b: 'int',
	0x2234: 'there4',
	0x223c: 'sim',
	0x2245: 'cong',
	0x2248: 'asymp',
	0x2260: 'ne',
	0x2261: 'equiv',
	0x2264: 'le',
	0x2265: 'ge',
	0x2282: 'sub',
	0x2283: 'sup',
	0x2284: 'nsub',
	0x2286: 'sube',
	0x2287: 'supe',
	0x2295: 'oplus',
	0x2297: 'otimes',
	0x22a5: 'perp',
	0x22c5: 'sdot',
	0x2308: 'lceil',
	0x2309: 'rceil',
	0x230a: 'lfloor',
	0x230b: 'rfloor',
	0x2329: 'lang',
	0x232a: 'rang',
	0x25ca: 'loz',
	0x2660: 'spades',
	0x2663: 'clubs',
	0x2665: 'hearts',
	0x2666: 'diams',
};
System.Text.HtmlChars = {};
for (const property in System.Text.HtmlSymbolCodes) {
	const name = System.Text.HtmlSymbolCodes[property];
	System.Text.HtmlChars[name] = String.fromCharCode(parseInt(property));
}
System.Text.StringArray = {};
System.Text.StringArray.ToArray = function (values) {};
System.Extensions.Apply.apply(this);
System.Type.RegisterNamespace('System.IO');

System.IO.MemoryStream = function (buffer) {
	this.Type = 'System.IO.MemoryStream';
	this.Buffer = new Array();
	this.Capacity = 0;
	this.Length = 0;
	this.Position = 0;
	const isServerSide = false;
	let stream = null;
	const adTypeBinary = 1,
		adTypeText = 2,
		adSaveCreateOverWrite = 2;
	this.ToArray = function () {
		let array = new Array();
		if (isServerSide) {
		} else {
			array = this.Buffer.slice(0, this.Buffer.length);
		}
		return array;
	};
	this.Flush = function () {
		if (isServerSide) {
		} else {
		}
	};
	this.Write = function (buffer, offset, count) {
		if (isServerSide) {
		} else {
			for (let i = 0; i < count; i++) {
				this.Buffer[this.Position + i] = buffer[offset + i];
			}
			this.Position += count;
		}
	};
	this.Close = function () {
		if (isServerSide) {
			stream.Close();
		}
	};
	this.Initialize = function () {
		// if (isServerSide) {
		// 	stream = Server.CreateObject('ADODB.Stream');
		// 	stream.Type = adTypeBinary;
		// 	stream.Open();
		// } else {
			if (arguments[0]) {
				const buffer = arguments[0];
				this.Write(buffer, 0, buffer.length);
			}
		// }
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterNamespace('System.Text');
System.Text.ControlChars = {
	Tab: 0x9,
	Vt: 0xb,
	Ff: 0xc,
	Space: 0x20,
	Lf: 0xa,
	Bs: 0x8,
	Ht: 0x9,
	Dq: 0x22,
	Sq: 0x27,
	Bh: 0x5c,
};
System.Text.UtfSignatures = { Utf16Le: 0xffff, Utf16Be: 0xfeff, Utf8: 0xefbbbf };
System.Type.RegisterNamespace('System.Text.Encoding');
System.Text.Encoding.UTF8Encoder = function () {
	this.Type = 'System.Text.Encoding.UTF8Encoder';
	const me = this;
	this.GetBytes = function (s) {
		const bytes = new Array();
		let c: number;
		for (let i = 0; i < s.length; i++) {
			c = s.charCodeAt(i);
			if (c < 0x80) {
				bytes.push(c);
			} else if (c < 0x800) {
				bytes.push(0xc0 | (c >> 6));
				bytes.push(0x80 | (c & 0x3f));
			} else if (c < 0x10000) {
				bytes.push(0xe0 | (c >> 12));
				bytes.push(0x80 | ((c >> 6) & 0x3f));
				bytes.push(0x80 | (c & 0x3f));
			} else if (c < 0x200000) {
				bytes.push(0xf0 | (c >> 18));
				bytes.push(0x80 | ((c >> 12) & 0x3f));
				bytes.push(0x80 | ((c >> 6) & 0x3f));
				bytes.push(0x80 | (c & 0x3f));
			} else {
				bytes.push(0x3f);
			}
		}
		return bytes;
	};
	this.InitializeClass = function () {};
	this.InitializeClass();
};
System.Text.Encoding.UTF8 = new System.Text.Encoding.UTF8Encoder();
System.Type.RegisterNamespace('System.Text.Encoding');
System.Text.Encoding.UnicodeEncoder = function () {
	this.Type = 'System.Text.Encoding.UnicodeEncoder';
	const me = this;
	this.GetBytes = function (s) {
		const bytes = new Array();
		let c: number;
		for (let i = 0; i < s.length; i++) {
			c = s.charCodeAt(i);
			if (c > 0xffff) {
				bytes.push(0xdc00 | (c & 0x3ff));
				bytes.push(0xd7c0 + (c >> 10));
			} else {
				bytes.push(c & 0xff);
				bytes.push(c >> 8);
			}
		}
		return bytes;
	};
	this.GetString = function (bytes) {
		let s = new String();
		const b = new Number();
		let b1: number;
		let b2: number;
		for (let i = 0; i < bytes.length; i++) {
			b1 = bytes[i];
			i++;
			b2 = bytes[i];
			s += String.fromCharCode((b2 << 8) | b1);
		}
		return s;
	};
	this.InitializeClass = function () {};
	this.InitializeClass();
};
System.Text.Encoding.Unicode = new System.Text.Encoding.UnicodeEncoder();
System.Type.RegisterNamespace('System.Text.Encoding');
System.Text.Encoding.ASCIIEncoder = function () {
	this.Type = 'System.Text.Encoding.ASCIIEncoder';
	const me = this;
	this.InitializeClass = function () {};
	this.InitializeClass();
};
System.Text.Encoding.ASCII = new System.Text.Encoding.ASCIIEncoder();
System.Type.RegisterNamespace('System.Convert');
System.Convert.Base64Array = function () {
	this.S = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	this.CA = new Array();
	this.IA = new Array();
	this.InitializeClass = function () {
		let c: string;
		for (let i = 0; i < this.S.length; i++) {
			c = this.S.charAt(i);
			this.CA[i] = c;
			this.IA[c] = i;
		}
	};
	this.InitializeClass();
};
System.Convert.ToBase64String = function (b, wrap) {
	const B64 = new System.Convert.Base64Array();
	const bLen = b ? b.length : 0;
	if (bLen == 0) return new Array(0);
	const eLen = Math.floor(bLen / 3) * 3;
	const cCnt = ((bLen - 1) / 3 + 1) << 2;
	const dLen = cCnt + (wrap ? ((cCnt - 1) / 76) << 1 : 0);
	const dArr = new Array(dLen);
	for (let s = 0, d = 0, cc = 0; s < eLen; ) {
		const i = ((b[s++] & 0xff) << 16) | ((b[s++] & 0xff) << 8) | (b[s++] & 0xff);
		dArr[d++] = B64.CA[(i >>> 18) & 0x3f];
		dArr[d++] = B64.CA[(i >>> 12) & 0x3f];
		dArr[d++] = B64.CA[(i >>> 6) & 0x3f];
		dArr[d++] = B64.CA[i & 0x3f];
		if (wrap && ++cc == 19 && d < dLen - 2) {
			dArr[d++] = '\r';
			dArr[d++] = '\n';
			cc = 0;
		}
	}
	const left = bLen - eLen;
	if (left > 0) {
		const j = ((b[eLen] & 0xff) << 10) | (left == 2 ? (b[bLen - 1] & 0xff) << 2 : 0);
		dArr[dLen - 4] = B64.CA[j >> 12];
		dArr[dLen - 3] = B64.CA[(j >>> 6) & 0x3f];
		dArr[dLen - 2] = left == 2 ? B64.CA[j & 0x3f] : '=';
		dArr[dLen - 1] = '=';
	}
	return dArr.join('');
};
System._bitConverter = function () {
	this.IsLittleEndian;
	const cMask = {};
	cMask[System.TypeCode.Boolean] = 0x1;
	cMask[System.TypeCode.Byte] = 0xff;
	cMask[System.TypeCode.SByte] = 0x7f;
	cMask[System.TypeCode.Int16] = 0x7fff;
	cMask[System.TypeCode.Int32] = 0x7fffffff;
	cMask[System.TypeCode.UInt16] = 0xffff;
	cMask[System.TypeCode.UInt32] = 0xffffffff;
	const sBits = {};
	sBits[System.TypeCode.Boolean] = 1;
	sBits[System.TypeCode.Byte] = 8;
	sBits[System.TypeCode.SByte] = 8;
	sBits[System.TypeCode.Int16] = 16;
	sBits[System.TypeCode.Int32] = 32;
	sBits[System.TypeCode.UInt16] = 16;
	sBits[System.TypeCode.UInt32] = 32;
	this.GetBytes = function (value, typeCode) {
		switch (typeof value) {
			case 'number':
				switch (typeCode) {
					case System.TypeCode.Single:
						return this.GetBytesFromNumber(value, 32);
						break;
					case System.TypeCode.Double:
						return this.GetBytesFromNumber(value, 64);
						break;
					case System.TypeCode.Int16:
					case System.TypeCode.UInt16:
						return this.GetBytesFromInt16Le(value);
						break;
					case System.TypeCode.Int32:
					case System.TypeCode.UInt32:
						return this.GetBytesFromInt32Le(value);
						break;
					default:
						return this.GetBytesFromInt32Le(value);
						break;
				}
		}
	};
	this.ToInt32Le = function (value, startIndex) {
		return this.ToInt32ArrayLe(value, startIndex, 4)[0];
	};
	this.ToInt32Be = function (value, startIndex) {
		return this.ToInt32ArrayBe(value, startIndex, 4)[0];
	};
	this.ToInt32 = this.ToInt32Le;
	this._GetBytesFromInt = function (value, typeCode, bigEndian) {
		const sizeBits = sBits[typeCode];
		const sizeBytes = (sizeBits ? sizeBits : 32) / 8;
		const bytes = new Array(4);
		for (let b = 0; b < sizeBytes; b++) {
			const m = bigEndian ? sizeBytes - 1 - b : b;
			bytes[m] = (value >> (b * 8)) & 0xff;
		}
		return bytes;
	};
	this.GetBytesFromInt32Le = function (value) {
		return this._GetBytesFromInt(value, System.TypeCode.Int32, false);
	};
	function _GetBytesFromIntArray(array, startIndex, count, typeCode, bigEndian) {
		const sizeBits = sBits[typeCode];
		const sizeBytes = (sizeBits ? sizeBits : 32) / 8;
		startIndex = startIndex ? startIndex : 0;
		count = count ? count : array.length - startIndex;
		const bytes = new Array(count * sizeBytes);
		let i, b, m;
		const length = startIndex + count;
		for (i = startIndex; i < length; i++) {
			for (b = 0; b < sizeBytes; b++) {
				m = bigEndian ? i * sizeBytes + sizeBytes - 1 - b : i * sizeBytes + b;
				bytes[m] = (array[i] >> (b * 8)) & 0xff;
			}
		}
		return bytes;
	}
	this.GetBytesFromInt16ArrayBe = function (value, startIndex, count) {
		return _GetBytesFromIntArray(value, startIndex, count, System.TypeCode.Int16, true);
	};
	function _ToIntArray(bytes, startIndex, count, typeCode, bigEndian) {
		const sizeBits = sBits[typeCode];
		const sizeBytes = (sizeBits ? sizeBits : 32) / 8;
		startIndex = startIndex ? startIndex : 0;
		count = count ? count : bytes.length - startIndex;
		const mask = (1 << 8) - 1;
		const array = Array();
		let v, m;
		for (let i = 0; i < count; i++) {
			const bi = (i - (i % sizeBytes)) / sizeBytes;
			v = bytes[startIndex + i] & mask;
			m = (i % sizeBytes) * 8;
			if (bigEndian) m = sizeBits - 8 - m;
			array[bi] |= v << m;
		}
		return array;
	}
	this.ToInt32ArrayLe = function (value, startIndex, count) {
		return _ToIntArray(value, startIndex, count, System.TypeCode.Int32, false);
	};
	this.ToInt32ArrayBe = function (value, startIndex, count) {
		return _ToIntArray(value, startIndex, count, System.TypeCode.Int32, true);
	};
	this.SemDoubleToBytes = function (sign, exponent, mantissa) {
		const B = new Array(4);
		mantissa = Math.pow(2, 52) * mantissa;
		B[3] = 0xffff & mantissa;
		B[2] = 0xffff & (mantissa >> 16);
		mantissa /= Math.pow(2, 32);
		B[1] = 0xffff & mantissa;
		B[0] = (sign << 15) | (exponent << 4) | (0x000f & (mantissa >> 16));
		return this.GetBytesFromInt16ArrayBe(B, 0, B.length);
	};
	this.GetBytesFromNumber = function (Qty, NumW) {
		this.Number = Qty;
		let Bin;
		this.nb01 = '';
		const Inf = { 32: { d: 0x7f, c: 0x80, b: 0, a: 0 }, 64: { d: 0x7ff0, c: 0, b: 0, a: 0 } };
		const ExW = { 32: 8, 64: 11 }[NumW];
		const MtW = NumW - ExW - 1;
		let sign;
		let exponent;
		let mantissa;
		if (isNaN(Qty)) {
			Bin = Inf[NumW];
			Bin.a = 1;
			sign = false;
			exponent = Math.pow(2, ExW) - 1;
			mantissa = Math.pow(2, -MtW);
		}
		if (!Bin) {
			sign = Qty < 0 || 1 / Qty < 0;
			if (!isFinite(Qty)) {
				Bin = Inf[NumW];
				if (this.Sign) Bin.d += 1 << (NumW / 4 - 1);
				exponent = Math.pow(2, ExW) - 1;
				mantissa = 0;
			}
		}
		if (!Bin) {
			exponent = { 32: 127, 64: 1023 }[NumW];
			mantissa = Math.abs(Qty);
			while (mantissa >= 2) {
				exponent++;
				mantissa /= 2;
			}
			while (mantissa < 1 && this.Exponent > 0) {
				exponent--;
				mantissa *= 2;
			}
			if (exponent <= 0) {
				mantissa /= 2;
			}
			if (NumW == 32 && this.Exponent > 254) {
				Bin = { d: sign ? 0xff : 0x7f, c: 0x80, b: 0, a: 0 };
				exponent = Math.pow(2, ExW) - 1;
				mantissa = 0;
			}
		}
		let array;
		if (!Bin) {
			if (NumW == 32) array = this.SemSingleToBytes(sign, exponent, mantissa);
			if (NumW == 64) array = this.SemDoubleToBytes(sign, exponent, mantissa);
		} else {
			array = [Bin.a, Bin.b, Bin.c, Bin.d];
			if (NumW == 64) array = this.GetBytesFromInt16ArrayBe(array, 0, array.length);
		}
		return array.reverse();
	};
	this._isLittleEndian = function () {
		const bytes = this.GetBytes(-1.5, System.TypeCode.Double);
		return bytes[0] == 0;
	};
	this.Initialize = function () {
		this.IsLittleEndian = this._isLittleEndian();
	};
	this.Initialize.apply(this, arguments);
};
System.BitConverter = new System._bitConverter();
System.Type.RegisterNamespace('System.Security.Cryptography');
System.Security.Cryptography.Rfc2898DeriveBytes = function (password, salt, iterations) {
	this.IterationCount = 1000;
	this.Password;
	this.Salt;
	this.Hmac;
	this.HmacLength = 20;
	let _buffer;
	let _pos = 0;
	let _f = 0;
	this.F = function (s, c, i) {
		let data = new Array(s.length + 4);
		System.Buffer.BlockCopy(s, 0, data, 0, s.length);
		for (let b = 0; b < 4; b++) data[s.length + b] = 0;
		const int4 = System.BitConverter.GetBytes(i);
		System.Array.Reverse(int4, 0, 4);
		System.Buffer.BlockCopy(int4, 0, data, s.length, 4);
		const u1 = this.Hmac.ComputeHash(this.Password, data);
		data = u1;
		for (let j = 1; j < c; j++) {
			const un = this.Hmac.ComputeHash(this.Password, data);
			for (let k = 0; k < this.HmacLength; k++) {
				u1[k] = (u1[k] ^ un[k]) & 0xff;
			}
			data = un;
		}
		return u1;
	};
	this.GetBytes = function (cb) {
		let l = Math.floor(cb / this.HmacLength);
		let r = Math.floor(cb % this.HmacLength);
		if (r != 0) l++;
		const result = new Array(cb);
		let rpos = 0;
		if (_pos > 0) {
			const count = Math.min(this.HmacLength - _pos, cb);
			System.Buffer.BlockCopy(_buffer, _pos, result, 0, count);
			if (count >= cb) return result;
			_pos = 0;
			rpos = (rpos + count) % cb;
			r = cb - rpos;
		}
		for (let i = 1; i <= l; i++) {
			_buffer = this.F(this.Salt, this.IterationCount, ++_f);
			const count = i == l ? r : this.HmacLength;
			System.Buffer.BlockCopy(_buffer, _pos, result, rpos, count);
			const bpos = rpos;
			rpos = (rpos + _pos + count) % cb;
			_pos = count == this.HmacLength ? 0 : count;
			if (bpos + count >= cb) return result;
		}
		return result;
	};
	this.Initialize = function () {
		let password = arguments[0];
		let salt = arguments[1];
		const iterations = arguments[2];
		if (typeof password == 'string') password = System.Text.Encoding.UTF8.GetBytes(password);
		if (typeof salt == 'string') salt = System.Text.Encoding.UTF8.GetBytes(salt);
		this.Password = password;
		this.Salt = salt;
		if (iterations) this.IterationCount = iterations;
		this.Hmac = new System.Security.Cryptography.HMACSHA1();
	};
	this.Initialize.apply(this, arguments);
};
System.Security.Cryptography.ICryptoTransform = function (algorithm, encryption, rgbIV) {
	const iv = new Array();
	let algo = null;
	let encrypt = false;
	let blockSizeByte = 0;
	let temp = new Array();
	let temp2 = new Array();
	let workBuff = new Array();
	let workout = new Array();
	let feedBackByte = 0;
	let feedBackIter = 0;
	let m_disposed = false;
	let lastBlock = false;
	let _rng;
	this.InputBlockSize = 0;
	this.OutputBlockSize = 0;
	this.CanTransformMultipleBlocks = true;
	this.CanReuseTransform = false;
	this._Transform = function (input, output) {
		switch (algo.Mode) {
			case System.Security.Cryptography.CipherMode.CBC:
				CBC(input, output);
				break;
		}
	};
	function ECB(input, output) {
		const outputBuffer = algo.Encrypt(algo.Key, input, System.Security.Cryptography.CipherMode.ECB);
		System.Buffer.BlockCopy(outputBuffer, 0, output, 0, blockSizeByte);
	}
	function CBC(input, output) {
		for (let i = 0; i < blockSizeByte; i++) temp[i] ^= input[i];
		ECB(temp, output);
		System.Buffer.BlockCopy(output, 0, temp, 0, blockSizeByte);
	}
	function CheckInput(inputBuffer, inputOffset, inputCount) {
		if (!inputBuffer) throw new Error("inputBuffer is can't be null");
		if (inputOffset < 0) throw new Error('inputOffset is out of range');
		if (inputCount < 0) throw new Error('inputCount is out of range');
		if (inputOffset > inputBuffer.length - inputCount) {
			throw new Error('inputBuffer is out of range (overflow)');
		}
	}
	this.TransformBlock = function (
		inputBuffer,
		inputOffset,
		inputCount,
		outputBuffer,
		outputOffset
	) {
		CheckInput(inputBuffer, inputOffset, inputCount);
		return this._InternalTransformBlock(
			inputBuffer,
			inputOffset,
			inputCount,
			outputBuffer,
			outputOffset
		);
	};
	function KeepLastBlock() {
		return (
			!encrypt &&
			algo.Padding != System.Security.Cryptography.PaddingMode.Zeros &&
			algo.Padding != System.Security.Cryptography.PaddingMode.None
		);
	}
	this._InternalTransformBlock = function (
		inputBuffer,
		inputOffset,
		inputCount,
		outputBuffer,
		outputOffset
	) {
		let offs = inputOffset;
		let full = 0;
		if (inputCount != blockSizeByte) {
			if (inputCount % blockSizeByte != 0) {
				throw new System.Security.Cryptography.CryptographicException('Invalid input block size.');
			}
			full = inputCount / blockSizeByte;
		} else {
			full = 1;
		}
		if (KeepLastBlock()) full--;
		let total = 0;
		if (lastBlock) {
			this._Transform(workBuff, workout);
			System.Buffer.BlockCopy(workout, 0, outputBuffer, outputOffset, blockSizeByte);
			outputOffset += blockSizeByte;
			total += blockSizeByte;
			lastBlock = false;
		}
		for (let i = 0; i < full; i++) {
			System.Buffer.BlockCopy(inputBuffer, offs, workBuff, 0, blockSizeByte);
			this._Transform(workBuff, workout);
			System.Buffer.BlockCopy(workout, 0, outputBuffer, outputOffset, blockSizeByte);
			offs += blockSizeByte;
			outputOffset += blockSizeByte;
			total += blockSizeByte;
		}
		if (KeepLastBlock()) {
			System.Buffer.BlockCopy(inputBuffer, offs, workBuff, 0, blockSizeByte);
			lastBlock = true;
		}
		return total;
	};
	this._Padding = function (inputBuffer, inputOffset, inputCount) {
		const rem = blockSizeByte - inputCount;
		const paddingSize = rem > 0 ? rem : blockSizeByte;
		const paddedInput = new System.Byte(paddingSize);
		let blocksCount = 1;
		const newBlock = new Array();
		switch (algo.Padding) {
			case System.Security.Cryptography.PaddingMode.PKCS7:
				for (let i = 0; i < paddedInput.length; i++) {
					paddedInput[i] = paddingSize;
				}
				if (rem == 0) blocksCount = 2;
				break;
		}
		const iBuffer = new System.Byte(blockSizeByte * blocksCount);
		const oBuffer = new System.Byte(blockSizeByte * blocksCount);
		if (newBlock.length == 0) {
			System.Buffer.BlockCopy(inputBuffer, inputOffset, iBuffer, 0, inputCount);
			if (rem > 0 || (rem == 0 && blocksCount == 2)) {
				System.Buffer.BlockCopy(paddedInput, 0, iBuffer, inputCount, paddingSize);
			}
		} else {
			System.Buffer.BlockCopy(newBlock, inputOffset, iBuffer, 0, inputCount + paddingSize);
		}
		const result: any = {};
		result.blocksCount = blocksCount;
		result.iBuffer = iBuffer;
		result.oBuffer = oBuffer;
		return result;
	};
	function ConvertIntToByteArray(dwInput, counter) {
		const bytes = System.BitConverter.GetBytesFromInt32Be(dwInput);
		System.Buffer.BlockCopy(bytes, 0, counter, 0, bytes.length);
	}
	this._FinalEncrypt = function (inputBuffer, inputOffset, inputCount) {
		const result = this._Padding(inputBuffer, inputOffset, inputCount);
		const blocksCount = result.blocksCount;
		const iBuffer = result.iBuffer;
		const oBuffer = result.oBuffer;
		for (let i = 0; i < blocksCount; i++) {
			const offset = i * blockSizeByte;
			this._InternalTransformBlock(iBuffer, offset, blockSizeByte, oBuffer, offset);
		}
		return oBuffer;
	};
	this.TransformFinalBlock = function (inputBuffer, inputOffset, inputCount) {
		// if (m_disposed) throw new ObjectDisposedException('Object is disposed');
		CheckInput(inputBuffer, inputOffset, inputCount);
		if (encrypt) {
			return this._FinalEncrypt(inputBuffer, inputOffset, inputCount);
		} else {
			return this._FinalDecrypt(inputBuffer, inputOffset, inputCount);
		}
	};
	this.Initialize = function (algorithm, encryption) {
		algo = algorithm;
		encrypt = encryption;
		if (algo) {
			blockSizeByte = algo.BlockSize >> 3;
			this.InputBlockSize = blockSizeByte;
			this.OutputBlockSize = blockSizeByte;
			temp = new System.Byte(blockSizeByte);
			System.Buffer.BlockCopy(algo.IV, 0, temp, 0, Math.min(blockSizeByte, algo.IV.length));
			temp2 = new System.Byte(blockSizeByte);
			feedBackByte = algo.FeedbackSize >> 3;
			if (feedBackByte != 0) feedBackIter = blockSizeByte / feedBackByte;
			workBuff = new System.Byte(blockSizeByte);
			workout = new System.Byte(blockSizeByte);
		}
	};
	this.Initialize.apply(this, arguments);
};
System.Security.Cryptography.RNGCryptoServiceProvider = function () {
	let rnd;
	this.GetBytes = function (data) {
		const length = data.length;
		for (let i = 0; i < length; i++) {
			data[i] = rnd.Next(0, 256);
		}
	};
	this.Initialize = function () {
		rnd = new System.Random();
	};
	this.Initialize.apply(this, arguments);
};
System.Security.Cryptography.CryptoStream = function (stream, transform, mode) {
	this.Type = 'System.Security.Cryptography.CryptoStream';
	let _stream;
	let _transform;
	let _mode;
	let _currentBlock = new Array();
	let _disposed = false;
	let _flushedFinalBlock = false;
	let _partialCount = 0;
	let _endOfStream = false;
	let _waitingBlock = new Array();
	let _waitingCount = 0;
	let _transformedBlock = new Array();
	let _transformedPos = 0;
	let _transformedCount = 0;
	let _workingBlock = new Array();
	let _workingCount = 0;
	this.Write = function (buffer, offset, count) {
		if (_partialCount > 0 && _partialCount != _transform.InputBlockSize) {
			let remainder = _transform.InputBlockSize - _partialCount;
			remainder = count < remainder ? count : remainder;
			System.Buffer.BlockCopy(buffer, offset, _workingBlock, _partialCount, remainder);
			_partialCount += remainder;
			offset += remainder;
			count -= remainder;
		}
		let bufferPos = offset;
		while (count > 0) {
			if (_partialCount == _transform.InputBlockSize) {
				const len = _transform.TransformBlock(_workingBlock, 0, _partialCount, _currentBlock, 0);
				_stream.Write(_currentBlock, 0, len);
				_partialCount = 0;
			}
			if (_transform.CanTransformMultipleBlocks) {
				const numBlock = Math.floor((_partialCount + count) / _transform.InputBlockSize);
				const multiSize = numBlock * _transform.InputBlockSize;
				if (numBlock > 0) {
					const multiBlocks = new System.Byte(multiSize);
					const len = _transform.TransformBlock(buffer, offset, multiSize, multiBlocks, 0);
					_stream.Write(multiBlocks, 0, len);
					_partialCount = count - multiSize;
					System.Buffer.BlockCopy(buffer, offset + multiSize, _workingBlock, 0, _partialCount);
				} else {
					System.Buffer.BlockCopy(buffer, offset, _workingBlock, _partialCount, count);
					_partialCount += count;
				}
				count = 0;
			} else {
				const len = Math.min(_transform.InputBlockSize - _partialCount, count);
				System.Buffer.BlockCopy(buffer, bufferPos, _workingBlock, _partialCount, len);
				bufferPos += len;
				_partialCount += len;
				count -= len;
			}
		}
	};
	this.Flush = function () {
		if (_stream != null) _stream.Flush();
	};
	this.FlushFinalBlock = function () {
		_flushedFinalBlock = true;
		const finalBuffer = _transform.TransformFinalBlock(_workingBlock, 0, _partialCount);
		if (_stream != null) {
			_stream.Write(finalBuffer, 0, finalBuffer.length);
			if (_stream.Type == 'System.Security.Cryptography.CryptoStream') {
				_stream.FlushFinalBlock();
			}
			_stream.Flush();
		}
		System.Array.Clear(finalBuffer, 0, finalBuffer.length);
	};
	this.ToArray = function () {
		return stream.ToArray();
	};
	this.Close = function () {
		if (!_flushedFinalBlock && _mode == System.Security.Cryptography.CryptoStreamMode.Write) {
			this.FlushFinalBlock();
		}
		if (_stream != null) _stream.Close();
	};
	this.Initialize = function () {
		_stream = arguments[0];
		_transform = arguments[1];
		_mode = arguments[2];
		_disposed = false;
		if (_transform) {
			_workingBlock = new System.Byte(_transform.InputBlockSize);
			if (_mode == System.Security.Cryptography.CryptoStreamMode.Read) {
				_currentBlock = new System.Byte(_transform.InputBlockSize);
			} else if (_mode == System.Security.Cryptography.CryptoStreamMode.Write) {
				_currentBlock = new System.Byte(_transform.OutputBlockSize);
			}
		}
	};
	this.Initialize.apply(this, arguments);
};
System.Security.Cryptography.HashAlgorithm = function () {
	this.CanReuseTransform = true;
	this.CanTransformMultipleBlocks = true;
	this.InputBlockSize = 1;
	this.OutputBlockSize = 1;
	this.HashSizeValue = 0;
	this.HashValue = new System.Byte();
	this.State = 0;
	this.HashSize = this.HashSizeValue;
	this._ComputeHash1 = function (buffer) {
		return this._ComputeHash2(buffer, 0, buffer.length);
	};
	this._ComputeHash2 = function (buffer, offset, count) {
		this.HashCore(buffer, offset, count);
		this.HashValue = this.HashFinal();
		const buffer2 = this.Hash();
		this.Initialize();
		return buffer2;
	};
	this.ComputeHash = function () {
		if (arguments.length == 1) {
			let value = arguments[0];
			if (typeof value == 'string') value = System.Text.Encoding.UTF8.GetBytes(value);
			const args = new Array(0);
			args[0] = value;
			return this._ComputeHash1.apply(this, args);
		}
		if (arguments.length == 3) return this._ComputeHash2.apply(this, arguments);
	};
	this.HashCore = function (array, ibStart, cbSize) {};
	this.HashFinal = function () {};
	this.Initialize = function () {};
	this.Hash = function () {
		return this.HashValue.Clone();
	};
};
System.Security.Cryptography.Utils = {};
System.Security.Cryptography.CipherMode = { CBC: 1, ECB: 2, OFB: 3, CFB: 4, CTS: 5 };
System.Security.Cryptography.PaddingMode = {
	None: 1,
	PKCS7: 2,
	Zeros: 3,
	ANSIX923: 4,
	ISO10126: 5,
	RsaEsPkcs: 6,
	RsaEsOaep: 7,
};
System.Security.Cryptography.CryptoStreamMode = { Read: 0, Write: 1 };
System.Type.RegisterNamespace('System.Security.Cryptography');
System.Security.Cryptography.SHA1 = function () {
	this.Type = 'System.Security.Cryptography.SHA1';
	this.Name = 'SHA1';
	this.chrsz = 8;
	this._buffer = new System.Byte();
	this._count = 0;
	this._expandedBuffer = new Array();
	this._stateSHA1 = new Array();
	this.ComputeHashAsHex = function (value) {
		const bytes = this.ComputeHash(value);
		return System.BitConverter.ToString(bytes, '');
	};
	this.ComputeHashAsBase64 = function (value) {
		const bytes = this.ComputeHash(value);
		return System.Convert.ToBase64String(bytes, false);
	};
	this._HashData = function (partIn, ibStart, cbSize) {
		let count = cbSize;
		let srcOffset = ibStart;
		let dstOffset = this._count & 0x3f;
		this._count += count;
		if (dstOffset > 0 && dstOffset + count >= 0x40) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, dstOffset, 0x40 - dstOffset);
			srcOffset += 0x40 - dstOffset;
			count -= 0x40 - dstOffset;
			this.SHATransform(this._expandedBuffer, this._stateSHA1, this._buffer);
			dstOffset = 0;
		}
		while (count >= 0x40) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, 0, 0x40);
			srcOffset += 0x40;
			count -= 0x40;
			this.SHATransform(this._expandedBuffer, this._stateSHA1, this._buffer);
		}
		if (count > 0) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, dstOffset, count);
		}
	};
	this.HashCore = function (rgb, ibStart, cbSize) {
		this._HashData(rgb, ibStart, cbSize);
	};
	this._EndHash = function () {
		const block = new System.Byte(20);
		let num = (0x40 - this._count) & 0x3f;
		if (num <= 8) num += 0x40;
		const partIn = new System.Byte(num);
		partIn[0] = 0x80;
		const num2 = this._count * 0x8;
		let n = num2;
		for (let i = 1; i <= 8; i++) {
			partIn[num - i] = n & 0xff;
			n = n >> 0x08;
		}
		this._HashData(partIn, 0, partIn.length);
		this.DWORDToBigEndian(block, this._stateSHA1, 5);
		this.HashValue = block;
		return block;
	};
	this.HashFinal = function () {
		return this._EndHash();
	};
	this.SHATransform = function (expandedBuffer, state, block) {
		this.DWORDFromBigEndian(expandedBuffer, 0x10, block);
		this.SHAExpand(expandedBuffer);
		const v = new Array(5);
		let i = 0;
		for (i = 0; i < 5; i++) v[4 - i] = state[i];
		for (i = 0; i < 80; i += 5) {
			for (let j = 0; j < 5; j++) {
				const x0 = _tf(i, v[(j + 3) % 5], v[(j + 2) % 5], v[(j + 1) % 5]);
				const x1 = as(_rotate(v[(j + 4) % 5], 5), x0);
				const x2 = expandedBuffer[i + ((j + 0) % 5)];
				const x3 = as(x1, x2);
				const x4 = as(x3, _ac(i));
				const x5 = v[(j + 0) % 5];
				const x6 = as(x4, x5);
				v[(j + 0) % 5] = x6;
				v[(j + 3) % 5] = _rotate(v[(j + 3) % 5], 30);
			}
		}
		for (i = 0; i < 5; i++) state[i] = as(state[i], v[4 - i]);
	};
	function as(x, y) {
		const lsw = (x & 0xffff) + (y & 0xffff);
		const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xffff);
	}
	function _rotate(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}
	function _tf(i, b, c, d) {
		return i < 20
			? d ^ (b & (c ^ d))
			: i < 40
			? b ^ c ^ d
			: i < 60
			? (b & c) | (d & (b | c))
			: b ^ c ^ d;
	}
	function _ac(i) {
		return i < 20 ? 0x5a827999 : i < 40 ? 0x6ed9eba1 : i < 60 ? 0x8f1bbcdc : 0xca62c1d6;
	}
	this.SHAExpand = function (x) {
		for (let i = 0x10; i < 80; i++) {
			x[i] = _rotate(x[i - 3] ^ x[i - 8] ^ x[i - 14] ^ x[i - 16], 1);
		}
	};
	this.DWORDFromBigEndian = function (x, digits, block) {
		let index = 0;
		for (let i = 0; index < digits; i += 4) {
			const n = (block[i] << 0x18) | (block[i + 1] << 0x10) | (block[i + 2] << 8) | block[i + 3];
			x[index] = n;
			index++;
		}
	};
	this.DWORDToBigEndian = function (block, x, digits) {
		let index = 0;
		for (let i = 0; index < digits; i += 4) {
			block[i] = (x[index] >> 0x18) & 0xff;
			block[i + 1] = (x[index] >> 0x10) & 0xff;
			block[i + 2] = (x[index] >> 8) & 0xff;
			block[i + 3] = x[index] & 0xff;
			index++;
		}
	};
	this.Initialize = function () {
		this.InitializeState();
		System.Array.Clear(this._buffer, 0, this._buffer.length);
		System.Array.Clear(this._expandedBuffer, 0, this._expandedBuffer.length);
	};
	this.InitializeState = function () {
		this._count = 0;
		this._stateSHA1[0] = 0x67452301;
		this._stateSHA1[1] = 0xefcdab89;
		this._stateSHA1[2] = 0x98badcfe;
		this._stateSHA1[3] = 0x10325476;
		this._stateSHA1[4] = 0xc3d2e1f0;
	};
	this._initialize = function () {
		const base = new System.Security.Cryptography.HashAlgorithm();
		for (const property in base) {
			if (typeof this[property] == 'undefined') {
				this[property] = base[property];
			}
		}
		this.HashSizeValue = 160;
		this.HashSize = 160;
		this._stateSHA1 = new System.Byte(5);
		this._buffer = new System.Byte(0x40);
		this._expandedBuffer = new System.Byte(80);
		this.InitializeState();
	};
	this._initialize.apply(this, arguments);
};
System.Security.Cryptography.SHA1CryptoServiceProvider = System.Security.Cryptography.SHA1;
System.Type.RegisterNamespace('System.Security.Cryptography');
System.Security.Cryptography.HMACSHA1 = function (key) {
	this.Type = 'System.Security.Cryptography.HMACSHA1';
	this.Name = 'HMACSHA1';
	this.Algorithm;
	this.Key;
	this.HashSize = 160;
	this.HashName = 'SHA1';
	this.ComputeHash = function (key, data) {
		if (!data) {
			data = key;
			key = this.Key;
		}
		if (typeof key == 'string') key = System.Text.Encoding.UTF8.GetBytes(key);
		if (typeof data == 'string') data = System.Text.Encoding.UTF8.GetBytes(data);
		return this._ComputeHash(key, data);
	};
	this.ComputeHashAsHex = function (key, data) {
		const bytes = this.ComputeHash(key, data);
		return System.BitConverter.ToString(bytes, '');
	};
	this.ComputeHashAsBase64 = function (key, data) {
		const bytes = this.ComputeHash(key, data);
		return System.Convert.ToBase64String(bytes, false);
	};
	this._ComputeHash = function (key, data) {
		if (!data) {
			data = key;
			key = this.Key;
		}
		if (key.length > 64) key = this.Algorithm.ComputeHash(key);
		const ipad = new Array(64),
			opad = new Array(64);
		for (let i = 0; i < 64; i++) {
			ipad[i] = key[i] ^ 0x36;
			opad[i] = key[i] ^ 0x5c;
		}
		const hash = this.Algorithm.ComputeHash(ipad.concat(data));
		return this.Algorithm.ComputeHash(opad.concat(hash));
	};
	this.Initialize = function () {
		this.Algorithm = new System.Security.Cryptography.SHA1();
		this.Key = arguments[0];
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterNamespace('System.Security.Cryptography');
System.Security.Cryptography.RijndaelManaged = function () {
	this.KeySize = 256;
	this.BlockSize = 128;
	this.FeedbackSize = 128;
	this.IV;
	this.Key;
	this.Mode = System.Security.Cryptography.CipherMode.CBC;
	this.Padding = System.Security.Cryptography.PaddingMode.PKCS7;
	let rng;
	const Rcon = [
		0x01,
		0x02,
		0x04,
		0x08,
		0x10,
		0x20,
		0x40,
		0x80,
		0x1b,
		0x36,
		0x6c,
		0xd8,
		0xab,
		0x4d,
		0x9a,
		0x2f,
		0x5e,
		0xbc,
		0x63,
		0xc6,
		0x97,
		0x35,
		0x6a,
		0xd4,
		0xb3,
		0x7d,
		0xfa,
		0xef,
		0xc5,
		0x91,
	];
	const S5 = new Array(256);
	const T1 = new Array(256);
	const T2 = new Array(256);
	const T3 = new Array(256);
	const T4 = new Array(256);
	const T5 = new Array(256);
	const T6 = new Array(256);
	const T7 = new Array(256);
	const T8 = new Array(256);
	const U1 = new Array(256);
	const U2 = new Array(256);
	const U3 = new Array(256);
	const U4 = new Array(256);
	const S = [
		0x63,
		0x7c,
		0x77,
		0x7b,
		0xf2,
		0x6b,
		0x6f,
		0xc5,
		0x30,
		0x01,
		0x67,
		0x2b,
		0xfe,
		0xd7,
		0xab,
		0x76,
		0xca,
		0x82,
		0xc9,
		0x7d,
		0xfa,
		0x59,
		0x47,
		0xf0,
		0xad,
		0xd4,
		0xa2,
		0xaf,
		0x9c,
		0xa4,
		0x72,
		0xc0,
		0xb7,
		0xfd,
		0x93,
		0x26,
		0x36,
		0x3f,
		0xf7,
		0xcc,
		0x34,
		0xa5,
		0xe5,
		0xf1,
		0x71,
		0xd8,
		0x31,
		0x15,
		0x04,
		0xc7,
		0x23,
		0xc3,
		0x18,
		0x96,
		0x05,
		0x9a,
		0x07,
		0x12,
		0x80,
		0xe2,
		0xeb,
		0x27,
		0xb2,
		0x75,
		0x09,
		0x83,
		0x2c,
		0x1a,
		0x1b,
		0x6e,
		0x5a,
		0xa0,
		0x52,
		0x3b,
		0xd6,
		0xb3,
		0x29,
		0xe3,
		0x2f,
		0x84,
		0x53,
		0xd1,
		0x00,
		0xed,
		0x20,
		0xfc,
		0xb1,
		0x5b,
		0x6a,
		0xcb,
		0xbe,
		0x39,
		0x4a,
		0x4c,
		0x58,
		0xcf,
		0xd0,
		0xef,
		0xaa,
		0xfb,
		0x43,
		0x4d,
		0x33,
		0x85,
		0x45,
		0xf9,
		0x02,
		0x7f,
		0x50,
		0x3c,
		0x9f,
		0xa8,
		0x51,
		0xa3,
		0x40,
		0x8f,
		0x92,
		0x9d,
		0x38,
		0xf5,
		0xbc,
		0xb6,
		0xda,
		0x21,
		0x10,
		0xff,
		0xf3,
		0xd2,
		0xcd,
		0x0c,
		0x13,
		0xec,
		0x5f,
		0x97,
		0x44,
		0x17,
		0xc4,
		0xa7,
		0x7e,
		0x3d,
		0x64,
		0x5d,
		0x19,
		0x73,
		0x60,
		0x81,
		0x4f,
		0xdc,
		0x22,
		0x2a,
		0x90,
		0x88,
		0x46,
		0xee,
		0xb8,
		0x14,
		0xde,
		0x5e,
		0x0b,
		0xdb,
		0xe0,
		0x32,
		0x3a,
		0x0a,
		0x49,
		0x06,
		0x24,
		0x5c,
		0xc2,
		0xd3,
		0xac,
		0x62,
		0x91,
		0x95,
		0xe4,
		0x79,
		0xe7,
		0xc8,
		0x37,
		0x6d,
		0x8d,
		0xd5,
		0x4e,
		0xa9,
		0x6c,
		0x56,
		0xf4,
		0xea,
		0x65,
		0x7a,
		0xae,
		0x08,
		0xba,
		0x78,
		0x25,
		0x2e,
		0x1c,
		0xa6,
		0xb4,
		0xc6,
		0xe8,
		0xdd,
		0x74,
		0x1f,
		0x4b,
		0xbd,
		0x8b,
		0x8a,
		0x70,
		0x3e,
		0xb5,
		0x66,
		0x48,
		0x03,
		0xf6,
		0x0e,
		0x61,
		0x35,
		0x57,
		0xb9,
		0x86,
		0xc1,
		0x1d,
		0x9e,
		0xe1,
		0xf8,
		0x98,
		0x11,
		0x69,
		0xd9,
		0x8e,
		0x94,
		0x9b,
		0x1e,
		0x87,
		0xe9,
		0xce,
		0x55,
		0x28,
		0xdf,
		0x8c,
		0xa1,
		0x89,
		0x0d,
		0xbf,
		0xe6,
		0x42,
		0x68,
		0x41,
		0x99,
		0x2d,
		0x0f,
		0xb0,
		0x54,
		0xbb,
		0x16,
	];
	function B0(x) {
		return x & 255;
	}
	function B1(x) {
		return (x >> 8) & 255;
	}
	function B2(x) {
		return (x >> 16) & 255;
	}
	function B3(x) {
		return (x >> 24) & 255;
	}
	function F1(x0, x1, x2, x3) {
		return (
			B1(T1[x0 & 255]) |
			(B1(T1[(x1 >> 8) & 255]) << 8) |
			(B1(T1[(x2 >> 16) & 255]) << 16) |
			(B1(T1[x3 >>> 24]) << 24)
		);
	}
	function packBytes(octets) {
		let i, j;
		const len = octets.length;
		const b = new Array(len / 4);
		if (!octets || len % 4) return;
		for (i = 0, j = 0; j < len; j += 4) {
			b[i++] = octets[j] | (octets[j + 1] << 8) | (octets[j + 2] << 16) | (octets[j + 3] << 24);
		}
		return b;
	}
	function unpackBytes(packed) {
		let j;
		let i = 0,
			l = packed.length;
		const r = new Array(l * 4);
		for (j = 0; j < l; j++) {
			r[i++] = B0(packed[j]);
			r[i++] = B1(packed[j]);
			r[i++] = B2(packed[j]);
			r[i++] = B3(packed[j]);
		}
		return r;
	}
	const maxkc = 8;
	const maxrk = 14;
	class keyExpansion {
    public rounds;
    public rk;
    constructor(key){

      let kc, i, j, r, t;
      let rounds;
      const keySched = new Array(maxrk + 1);
      const keylen = key.length;
      const k = new Array(maxkc);
      const tk = new Array(maxkc);
      let rconpointer = 0;
      if (keylen == 16) {
        rounds = 10;
        kc = 4;
      } else if (keylen == 24) {
        rounds = 12;
        kc = 6;
      } else if (keylen == 32) {
        rounds = 14;
        kc = 8;
      } else {
        return;
      }
      for (i = 0; i < maxrk + 1; i++) keySched[i] = new Array(4);
      for (i = 0, j = 0; j < keylen; j++, i += 4) {
        k[j] = key[i] | (key[i + 1] << 8) | (key[i + 2] << 16) | (key[i + 3] << 24);
      }
      for (j = kc - 1; j >= 0; j--) tk[j] = k[j];
      r = 0;
      t = 0;
      for (j = 0; j < kc && r < rounds + 1; ) {
        for (; j < kc && t < 4; j++, t++) {
          keySched[r][t] = tk[j];
        }
        if (t == 4) {
          r++;
          t = 0;
        }
      }
      while (r < rounds + 1) {
        let temp = tk[kc - 1];
        tk[0] ^= S[B1(temp)] | (S[B2(temp)] << 8) | (S[B3(temp)] << 16) | (S[B0(temp)] << 24);
        tk[0] ^= Rcon[rconpointer++];
        if (kc != 8) {
          for (j = 1; j < kc; j++) tk[j] ^= tk[j - 1];
        } else {
          for (j = 1; j < kc / 2; j++) tk[j] ^= tk[j - 1];
          temp = tk[kc / 2 - 1];
          tk[kc / 2] ^= S[B0(temp)] | (S[B1(temp)] << 8) | (S[B2(temp)] << 16) | (S[B3(temp)] << 24);
          for (j = kc / 2 + 1; j < kc; j++) tk[j] ^= tk[j - 1];
        }
        for (j = 0; j < kc && r < rounds + 1; ) {
          for (; j < kc && t < 4; j++, t++) {
            keySched[r][t] = tk[j];
          }
          if (t == 4) {
            r++;
            t = 0;
          }
        }
      }
      this.rounds = rounds;
      this.rk = keySched;
    }
	}
	function AESencrypt(block, ctx) {
		let r;
		let t0, t1, t2, t3;
		const b = packBytes(block);
		const rounds = ctx.rounds;
		let b0 = b[0];
		let b1 = b[1];
		let b2 = b[2];
		let b3 = b[3];
		for (r = 0; r < rounds - 1; r++) {
			t0 = b0 ^ ctx.rk[r][0];
			t1 = b1 ^ ctx.rk[r][1];
			t2 = b2 ^ ctx.rk[r][2];
			t3 = b3 ^ ctx.rk[r][3];
			b0 = T1[t0 & 255] ^ T2[(t1 >> 8) & 255] ^ T3[(t2 >> 16) & 255] ^ T4[t3 >>> 24];
			b1 = T1[t1 & 255] ^ T2[(t2 >> 8) & 255] ^ T3[(t3 >> 16) & 255] ^ T4[t0 >>> 24];
			b2 = T1[t2 & 255] ^ T2[(t3 >> 8) & 255] ^ T3[(t0 >> 16) & 255] ^ T4[t1 >>> 24];
			b3 = T1[t3 & 255] ^ T2[(t0 >> 8) & 255] ^ T3[(t1 >> 16) & 255] ^ T4[t2 >>> 24];
		}
		r = rounds - 1;
		t0 = b0 ^ ctx.rk[r][0];
		t1 = b1 ^ ctx.rk[r][1];
		t2 = b2 ^ ctx.rk[r][2];
		t3 = b3 ^ ctx.rk[r][3];
		b[0] = F1(t0, t1, t2, t3) ^ ctx.rk[rounds][0];
		b[1] = F1(t1, t2, t3, t0) ^ ctx.rk[rounds][1];
		b[2] = F1(t2, t3, t0, t1) ^ ctx.rk[rounds][2];
		b[3] = F1(t3, t0, t1, t2) ^ ctx.rk[rounds][3];
		return unpackBytes(b);
	}
	function prepare_decryption(key) {
		let r, w;
		const rk2 = new Array(maxrk + 1);
		const ctx = new keyExpansion(key);
		const rounds = ctx.rounds;
		for (r = 0; r < maxrk + 1; r++) {
			rk2[r] = new Array(4);
			rk2[r][0] = ctx.rk[r][0];
			rk2[r][1] = ctx.rk[r][1];
			rk2[r][2] = ctx.rk[r][2];
			rk2[r][3] = ctx.rk[r][3];
		}
		for (r = 1; r < rounds; r++) {
			w = rk2[r][0];
			rk2[r][0] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
			w = rk2[r][1];
			rk2[r][1] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
			w = rk2[r][2];
			rk2[r][2] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
			w = rk2[r][3];
			rk2[r][3] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
		}
		this.rk = rk2;
		this.rounds = rounds;
		return this;
	}
	function AESdecrypt(block, ctx) {
		let r;
		let t0, t1, t2, t3;
		const rounds = ctx.rounds;
		const b = packBytes(block);
		for (r = rounds; r > 1; r--) {
			t0 = b[0] ^ ctx.rk[r][0];
			t1 = b[1] ^ ctx.rk[r][1];
			t2 = b[2] ^ ctx.rk[r][2];
			t3 = b[3] ^ ctx.rk[r][3];
			b[0] = T5[B0(t0)] ^ T6[B1(t3)] ^ T7[B2(t2)] ^ T8[B3(t1)];
			b[1] = T5[B0(t1)] ^ T6[B1(t0)] ^ T7[B2(t3)] ^ T8[B3(t2)];
			b[2] = T5[B0(t2)] ^ T6[B1(t1)] ^ T7[B2(t0)] ^ T8[B3(t3)];
			b[3] = T5[B0(t3)] ^ T6[B1(t2)] ^ T7[B2(t1)] ^ T8[B3(t0)];
		}
		t0 = b[0] ^ ctx.rk[1][0];
		t1 = b[1] ^ ctx.rk[1][1];
		t2 = b[2] ^ ctx.rk[1][2];
		t3 = b[3] ^ ctx.rk[1][3];
		b[0] = S5[B0(t0)] | (S5[B1(t3)] << 8) | (S5[B2(t2)] << 16) | (S5[B3(t1)] << 24);
		b[1] = S5[B0(t1)] | (S5[B1(t0)] << 8) | (S5[B2(t3)] << 16) | (S5[B3(t2)] << 24);
		b[2] = S5[B0(t2)] | (S5[B1(t1)] << 8) | (S5[B2(t0)] << 16) | (S5[B3(t3)] << 24);
		b[3] = S5[B0(t3)] | (S5[B1(t2)] << 8) | (S5[B2(t1)] << 16) | (S5[B3(t0)] << 24);
		b[0] ^= ctx.rk[0][0];
		b[1] ^= ctx.rk[0][1];
		b[2] ^= ctx.rk[0][2];
		b[3] ^= ctx.rk[0][3];
		return unpackBytes(b);
	}
	this.Test = function () {
		const key = [0x6b, 0x65, 0x79];
		const data = [0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38];
		const ciph = [0xed, 0xfd, 0x61, 0xca, 0xbc, 0x18, 0xc4, 0xfe];
		const encrypted = this.Encrypt(key, data);
		const decrypted = this.Decrypt(key, encrypted);
		const isSuccess = true;
		for (let i = 0; i < data.length; i++) {
			if (ciph[i] != encrypted[i] || data[i] != decrypted[i]) {
				const isSuccess = false;
				break;
			}
		}
		return isSuccess;
	};
	this.ExpandKey = function (key, bits) {};
	this.Encrypt = function (key, input, mode) {
		if (arguments.length == 2) {
		}
		let i, aBlock;
		const bpb = this.BlockSize / 8;
		let output = new Array();
		if (!key || !input) return;
		if (key.length * 8 != this.KeySize) return;
		const expandedKey = new keyExpansion(key);
		for (let b = 0; b < input.length / bpb; b++) {
			const block = input.slice(b * bpb, (b + 1) * bpb);
			switch (mode) {
				case System.Security.Cryptography.CipherMode.CBC:
					for (let i = 0; i < bpb; i++) {
						block[i] ^= this.IV[b * bpb + i];
					}
					break;
				default:
					break;
			}
			const dBlock = AESencrypt(block, expandedKey);
			output = output.concat(dBlock);
		}
		return output;
	};
	this.Decrypt = function (key, input, mode) {
		const bpb = this.BlockSize / 8;
		let output = new Array();
		let aBlock;
		let block;
		if (!key || !input) return;
		if (key.length * 8 != this.KeySize) return;
		if (!mode) mode = System.Security.Cryptography.CipherMode.ECB;
		const expandedKey = prepare_decryption(key);
		for (let b = 0; b < input.length / bpb; b++) {
			const block = input.slice(b * bpb, (b + 1) * bpb);
			const dBlock = AESdecrypt(block, expandedKey);
			if (mode == System.Security.Cryptography.CipherMode.CBC) {
				for (let i = 0; i < bpb; i++) {
					dBlock[i] ^= this.IV[b * bpb + i];
				}
			}
			output = output.concat(dBlock);
		}
		return output;
	};
	function CreateCryptor(rgbKey, rgbIV, encrypt) {
		const key = rgbKey ? rgbKey : this.Key;
		const newKey = new System.Byte(key.length);
		System.Buffer.BlockCopy(key, 0, newKey, 0, key.length);
		const iv = rgbIV ? rgbIV : this.IV;
		const newIv = new System.Byte(iv.length);
		System.Buffer.BlockCopy(iv, 0, newIv, 0, iv.length);
		const algorithm = new System.Security.Cryptography.RijndaelManaged();
		algorithm.Key = newKey;
		algorithm.IV = newIv;
		algorithm.Mode = this.Mode;
		algorithm.Padding = this.Padding;
		const cryptor = new System.Security.Cryptography.ICryptoTransform(algorithm, encrypt);
		return cryptor;
	}
	this.CreateEncryptor = function (rgbKey, rgbIV) {
		return CreateCryptor.call(this, rgbKey, rgbIV, true);
	};
	this.CreateDecryptor = function (rgbKey, rgbIV) {
		return CreateCryptor.call(this, rgbKey, rgbIV, false);
	};
	this.GenerateIV = function () {
		this.IV = new Array(16);
		rng.GetBytes(this.IV);
	};
	this.GenerateKey = function () {
		this.Key = new Array(this.KeySize / 8);
		rng.GetBytes(this.Key);
	};
	function InitTables() {
		const ROOT = 0x11b;
		let s, s2, s3;
		let i2, i4, i8, i9, ib, id, ie, t;
		const length = S.length;
		for (let i = 0; i < length; i++) {
			s = S[i] & 0xff;
			S5[s] = i;
			s2 = s << 1;
			if (s2 >= 0x100) s2 ^= ROOT;
			s3 = s2 ^ s;
			i2 = i << 1;
			if (i2 >= 0x100) i2 ^= ROOT;
			i4 = i2 << 1;
			if (i4 >= 0x100) i4 ^= ROOT;
			i8 = i4 << 1;
			if (i8 >= 0x100) i8 ^= ROOT;
			i9 = i8 ^ i;
			ib = i9 ^ i2;
			id = i9 ^ i4;
			ie = i8 ^ i4 ^ i2;
			T1[i] = System.BitConverter.ToInt32([s2, s, s, s3], 0);
			T2[i] = System.BitConverter.ToInt32([s3, s2, s, s], 0);
			T3[i] = System.BitConverter.ToInt32([s, s3, s2, s], 0);
			T4[i] = System.BitConverter.ToInt32([s, s, s3, s2], 0);
			t = System.BitConverter.ToInt32Be([ib, id, i9, ie], 0);
			T5[s] = t;
			U1[i] = t;
			t = System.BitConverter.ToInt32([ib, ie, i9, id], 0);
			T6[s] = t;
			U2[i] = t;
			t = System.BitConverter.ToInt32([id, ib, ie, i9], 0);
			T7[s] = t;
			U3[i] = t;
			t = System.BitConverter.ToInt32([i9, id, ib, ie], 0);
			T8[s] = t;
			U4[i] = t;
		}
	}
	this.Initialize = function () {
		rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
		InitTables();
		this.GenerateIV();
		this.GenerateKey();
	};
	this.Initialize.apply(this, arguments);
};
function SaltFromPassword(password) {
	const passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);
	const hmac = new System.Security.Cryptography.HMACSHA1(passwordBytes);
	const salt = hmac.ComputeHash(passwordBytes);
	return salt;
}
function GetTransform(password, encrypt) {
	const cipher = new System.Security.Cryptography.RijndaelManaged();
	const salt = SaltFromPassword(password);
	const secretKey = new System.Security.Cryptography.Rfc2898DeriveBytes(password, salt, 10);
	const key = secretKey.GetBytes(32);
	const iv = secretKey.GetBytes(16);
	let cryptor = null;
	if (encrypt) {
		cryptor = cipher.CreateEncryptor(key, iv);
	} else {
		cryptor = cipher.CreateDecryptor(key, iv);
	}
	return cryptor;
}
function CipherStreamWrite(cryptor, input) {
	const inputBuffer = new System.Byte(input.length);
	System.Buffer.BlockCopy(input, 0, inputBuffer, 0, inputBuffer.length);
	const stream = new System.IO.MemoryStream();
	const mode = System.Security.Cryptography.CryptoStreamMode.Write;
	const cryptoStream = new System.Security.Cryptography.CryptoStream(stream, cryptor, mode);
	cryptoStream.Write(inputBuffer, 0, inputBuffer.length);
	cryptoStream.FlushFinalBlock();
	const outputBuffer = stream.ToArray();
	stream.Close();
	cryptoStream.Close();
	return outputBuffer;
}

export function EncryptToBase64(password, s) {
	const bytes = System.Text.Encoding.Unicode.GetBytes(s);
	const encryptedBytes = Encrypt(password, bytes);
	const base64String = System.Convert.ToBase64String(encryptedBytes);
	return base64String;
}
function Encrypt(password, bytes) {
	const encryptor = GetTransform(password, true);
	return CipherStreamWrite(encryptor, bytes);
}
