var dmp = new diff_match_patch();
$("form").on('submit', function(e) {
  e.preventDefault();
  var message = {
    texts: $("#sourceText").val().match(/.*[\n]*/g),
    userlang: $("#userLang").val(),
    interlang: $("#interLang").val(),
    targetlang: $("#targetLang").val()
  };
  // message.texts = message.texts.reduce(function(a,b,i) {
  //   return i%2 &&
  //     (typeof a==='string' &&
  //       [a+b] ||
  //       (a[a.length-1] = a[a.length-1]+b, a)
  //     ) ||
  //     [].concat(a,b);
  // });

  $("#translateDirectResult").text("translating....");
  $("#translateResult").text("translating....");
  $("#translateInterResult").text("translating....");

  function diffMatchPath(a,b) {
    var d = dmp.diff_main(a, b);
    dmp.diff_cleanupEfficiency(d);
    var ds = dmp.diff_prettyHtml(d);
    $("#diff").html(ds);
  }

  Promise.all(message.texts.map(function(text) {
    return translate(text, message.userlang, message.targetlang);
  })).then(function(o) {
    $("#translateDirectResult").text(o.join("\n"));
  }).catch(function() {
    $("#translateDirectResult").text("fail");
  });
  Promise.all(message.texts.map(function(text) {
    return translate(text, message.userlang, message.interlang);
  })).then(function(o) {
    $("#translateResult").text(o.join("\n"));
    Promise.all(o.map(function(text) {
      return translate(text, message.interlang, message.targetlang);
    })).then(function(p) {
      $("#translateInterResult").text(p.join("\n"));
      diffMatchPath(
        $("#translateDirectResult").text(),
        $("#translateInterResult").text()
      );
    }).catch(function() {
      $("#translateInterResult").text("fail");
    });
  }).catch(function() {
    $("#translateResult").text("fail");
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