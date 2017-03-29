$("form").submit(function() {
  var message = {
    texts: $("#sourceText").val().match(/.*\n/g),
    userlang: $("#userLang").val(),
    interlang: $("#interLang").val(),
    targetlang: $("#targetLang").val()
  };
  $("#translateDirectResult").text("translating....");
  $("#translateResult").text("translating....");
  $("#translateInterResult").text("translating....");
  Promise.all(message.texts.map(function(text) {
    return translate(text, message.userlang, message.targetlang);
  })).then(function(o) {
    $("#translateDirectResult").text(o.join("\n"));
  });
  Promise.all(message.texts.map(function(text) {
    return translate(text, message.userlang, message.interlang);
  })).then(function(o) {
    Promise.all(o.map(function(text) {
      return translate(text, message.interlang, message.targetlang);
    })).then(function(p) {
      $("#translateResult").text(o.join("\n"));
      $("#translateInterResult").text(p.join("\n"));
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
  $("#targetLang").val((navigator.userLanguage || navigator.language || "ko").split("-")[0]);
  $('#sourceText').focus();
});