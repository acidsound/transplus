function sM(a) {
  var b, c;
  if (null !== yr)
    b = yr;
  else {
    b = wr(String.fromCharCode(84));
    c = wr(String.fromCharCode(75));
    b = [b(), b()];
    b[1] = c();
    b = (yr = window[b.join(c())] || "") || ""
  }
  var d = wr(String.fromCharCode(116));
  c = wr(String.fromCharCode(107));
  d = [d(), d()];
  d[1] = c();
  c = "&" + d.join("") + "=";
  d = b.split(".");
  b = Number(d[0]) || 0;
  for (var e = [], f = 0, g = 0; g < a.length; g++) {
    var l = a.charCodeAt(g);
    128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 === (l & 64512) && g + 1 < a.length && 56320 === (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
      e[f++] = l >> 18 | 240,
      e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
      e[f++] = l >> 6 & 63 | 128),
      e[f++] = l & 63 | 128)
  }
  a = b;
  for (f = 0; f < e.length; f++) {
    a += e[f];
    a = xr(a, "+-a^+6");
  }
  a = xr(a, "+-3^+b+-f");
  a ^= Number(d[1]) || 0;
  0 > a && (a = (a & 2147483647) + 2147483648);
  a %= 1E6;
  return c + (a.toString() + "." + (a ^ b))
}

var yr = null;
var wr = function (a) {
  return function () {
    return a;
  }
};
var xr = function (a, b) {
  for (var c = 0; c < b.length - 2; c += 3) {
    var d = b.charAt(c + 2);
    d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d)
    d = "+" === b.charAt(c + 1) ? a >>> d : a << d;
    a = "+" === b.charAt(c) ? a + d & 4294967295 : a ^ d
  }
  return a;
};

var TKK = "0.0";

function updateTKK() {
  return new Promise(function (resolve, reject) {
    var now = Math.floor(Date.now() / 3600000);

    if (Number(window.TKK.split('.')[0]) === now) {
      resolve();
    } else {
      fetch('https://goxcors.appspot.com/cors?method=GET&url=https://translate.google.com').then(function (o) {
        o.text().then(function (res) {
          var code = res.match(/TKK=(.*?)\(\)\)'\);/g);
          if (code) {
            eval(code[0]);
            window.TKK = TKK;
          }
          resolve();
        });
      }).catch(function (err) {
        var e = new Error();
        e.code = 'BAD_NETWORK';
        e.message = err.message;
        reject(e);
      });
    }
  });
}

function translateCore(text) {
  return updateTKK().then(function () {
    var tk = sM(text);
    tk = tk.replace('&tk=', '');
    return {name: 'tk', value: tk};
  }).catch(function (err) {
    throw err;
  });
}

function translate(text, sl, tl) {
  return new Promise(function (resolve, reject) {
    translateCore(text).then(function (o) {
      var tk = sM(text);
      var proxy = "https://goxcors.appspot.com/cors?method=GET&url=";
      var url = "https://translate.google.com/translate_a/single?client=t&sl=" + sl + "&tl=" + tl + "&hl=" + tl + "&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&ssel=0&tsel=3&kc=7&tk=" + tk + "&q=" + encodeURIComponent(text);
      fetch(proxy + encodeURIComponent(url)).then( function(o) {
        o.text().then(
          function(p) {
            var r = eval(p);
            resolve(r[0].map(function(s) { return s[0]; }).join(""));
          }
        );
      });
    });
  });
}