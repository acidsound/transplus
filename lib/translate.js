function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
function translate(text, sl, tl) {
  return new Promise(function (resolve, reject) {
    var proxy = "https://goxcors.appspot.com/cors?method=GET&url=";
    var url = "https://translate.google.com/translate_a/single?client=at&sl="+sl+"&tl="+tl+"&dt=at&dt=bd&dt=t&dt=ld&dt=qc&dt=rm&dt=bd&ie=UTF-8&iid="+guid()+"&q="+encodeURIComponent(text);
    fetch(proxy + encodeURIComponent(url)).then( function(o) {
      o.text().then(
        function(p) {
          var r = eval(p);
          resolve(r[0].map(function(s) { return s[0]; }).join(""));
        }
      );
    });
  });
}