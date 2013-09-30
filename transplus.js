var isCORSSupport = 'withCredentials' in new XMLHttpRequest();
var isIE = typeof XDomainRequest !== "undefined";
var xdr;

var getJSON = function(query, callback) {
  if (isCORSSupport) {
    $.getJSON(query, callback);
  } else if (isIE) {
    xdr = new XDomainRequest();
    if (xdr) {
      xdr.onload = callback;
      xdr.open("get", query);
      xdr.send();
    }
  } else {
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      jsonp: "callback",
      url: query,
      success: callback
    });
  }
}

var setQueryString = function(message) {
  var result = "http://goxcors.appspot.com/cors?method=GET" +
    "&url=" + encodeURIComponent("http://translate.google.com/translate_a/t?client=x" +
    "&sl=" + message.userlang + "&tl=" + message.targetlang+
    "&text=" + encodeURIComponent(message.text));
  return result;
};

var extractResult = function(data) {
  if (!isCORSSupport && isIE) {
    data = $.parseJSON(data.responseText);
  }
  return data && data.sentences && $.map(data.sentences, (function(v) { return v.trans })).join('');
};

var translateFinalLang=function(data) {
  var post=extractResult(data);
  $(".translateResult").text(post);
};
var translateInterLang=function(data) {
  var post=extractResult(data);
  message.text = post;
  message.userlang = $("#interLang").val();;
  message.targetlang = $("#targetLang").val();
  $(".translateInterResult").text(post);
  getJSON(setQueryString(message), translateFinalLang);
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
  getJSON(setQueryString(message), translateDirectLang);
  message.targetlang = $("#interLang").val();
  getJSON(setQueryString(message), translateInterLang);
  return false;
});