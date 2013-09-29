function addslashes(str) {
    return (str + '').replace(/([\\'])/g, "\\$1").replace(/\0/g, "\\0");
}

var interlang = "ja";

var setQueryString = function(message) {
  var result = "http://localhost:8080/post?http://translate.google.com/translate_a/t?client=x"+
    "&sl="+message.userlang+"&tl="+message.targetlang+
    "&text="+encodeURIComponent(message.text)
  return result;
};

var extractResult = function(data) {
  return data && data.sentences && $.map(data.sentences, (function(v) { return v.trans })).join('');
};

var translateFinalLang=function(data) {
  var post=extractResult(data);
  $(".translateResult").text(post);
};
var translateInterLang=function(data) {
  var post=extractResult(data);
  message.text = post;
  message.userlang = interlang;
  message.targetlang = $("#targetLang").val();
  $(".translateJapanResult").text(post);
  $.getJSON(setQueryString(message, interlang), translateFinalLang);
};

var translateDirectLang=function(data) {
  var post=extractResult(data);
  $(".translateDirectResult").text(post);
};

$("form").submit(function() {
  message = {
    text: $(".sourceText").val(),
    userlang: $("#userLang").val(),
    targetlang: $("#targetLang").val()
  };
  $.getJSON(setQueryString(message), translateDirectLang);
  message.targetlang = interlang;
  $.getJSON(setQueryString(message), translateInterLang);
  return false;
});

/* ? 이후에 문장이 있으면 반영 */
$(".sourceText").val(decodeURIComponent(document.location.search.substr(1)));
