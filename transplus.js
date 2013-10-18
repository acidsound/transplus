var isCORSSupport = 'withCredentials' in new XMLHttpRequest();
var isIE = typeof XDomainRequest !== "undefined";
var xdr;
var interBuffer = [];
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
  return data && data.sentences && $.map(data.sentences, (function(v) { return v.trans }));
};

var translateLineByLine=function() {
  var post = interBuffer.shift(0);

  message.text = post + "|!";
  message.userlang = $("#interLang").val();
  message.targetlang = $("#targetLang").val();
  getJSON(setQueryString(message), translateFinalLang);
};

var translateFinalLang=function(data) {
  var post=extractResult(data).join('');
  // prevent to trim new line
  $(".translateResult").text($(".translateResult").text()+post.replace(/\|!/g, ""));
  if (interBuffer.length>0) {
    translateLineByLine();
  }
};

var translateInterLang=function(data) {
  interBuffer=extractResult(data);
  $(".translateInterResult").text(interBuffer.join(""));

  translateLineByLine();
};

var translateDirectLang=function(data) {
  var post=extractResult(data).join('');
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
  interBuffer.length = 0;
  $(".translateResult").text("");
  getJSON(setQueryString(message), translateInterLang);
  return false;
});