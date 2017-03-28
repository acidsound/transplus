var isCORSSupport = 'withCredentials' in new XMLHttpRequest();
var isIE = typeof XDomainRequest !== "undefined";
var xdr;
var interBuffer = [];
var finalBuffer = [];
var bufCnt = 0;

$("form").submit(function() {
  var message = {
    text: $("#sourceText").val(),
    userlang: $("#userLang").val(),
    interlang: $("#interLang").val(),
    targetlang: $("#targetLang").val()
  };
  translate(message.text, message.userlang, message.targetlang).then(function(o) {
    $("#translateDirectResult").text(o);
  });
  translate(message.text, message.userlang, message.interlang).then(function(o) {
    translate(o, message.interlang, message.targetlang).then(function(p) {
      $("#translateResult").text(o);
      $("#translateInterResult").text(p);
    });
  });
  return false;
});

$().ready(function() {
  var resizeTextArea=function() {
    var o = this;
    setTimeout(function() {
      o.style.cssText = 'height:auto; padding:0';
      o.style.cssText = 'height:' + (o.scrollHeight + parseFloat(getComputedStyle(o).fontSize))+ 'px';
    }, 0);
  };
  $("#sourceText").bind("paste", resizeTextArea);
  $("#sourceText").bind("cut", resizeTextArea);
  $("#sourceText").bind("keydown", resizeTextArea);
  $("#targetLang").val(navigator.userLanguage || navigator.language || "ko");
  $('#sourceText').focus();
});