function addslashes(str) {
    return (str + '').replace(/([\\'])/g, "\\$1").replace(/\0/g, "\\0");
}

var message = {
  text: "안녕하세요",
  userlang: "ko"
};

var interLang = "ja";
var targetLang = "en";

var setQueryString = function(message, targetLang) {
  return "http://query.yahooapis.com/v1/public/yql?q=" +
    encodeURIComponent("select json from google.translate where q='" + addslashes(message.text) + "' and source='" + message.userlang + "' and target='" + targetLang + "' limit 1") +
      "&format=json&env=store://datatables.org/alltableswithkeys&callback=?";
};

var extractResult = function(data) {
  return data.query.results.json.json.json.length && ""+$.map(data.query.results.json.json.json, function(v) { return v.json[0]; }).join('') || data.query.results.json.json.json.json[0];
};

var translateFinalLang=function(data) {
  var post=extractResult(data);
  console.log(post);
  $(".translateResult").text(post);
};
var translateInterLang=function(data) {
  var post=extractResult(data);
  console.log(post);
  message.text = post;
  message.userlang = interLang;
  $(".translateJapanResult").text(post);
  $.getJSON(setQueryString(message, targetLang), translateFinalLang);
};

var translateDirectLang=function(data) {
  var post=extractResult(data);
  $(".translateDirectResult").text(post);
};

$("form").submit(function() {
  message = {
    text: $(".sourceText").val(),
    userlang: $("#userLang").val()
  };
  console.log("번역시작");
  console.log(message);
  targetLang = $("#targetLang").val();
  $.getJSON(setQueryString(message, interLang), translateInterLang);
  $.getJSON(setQueryString(message, targetLang), translateDirectLang);
  return false;
});

/* ? 이후에 문장이 있으면 반영 */
$(".sourceText").val(decodeURIComponent(document.location.search.substr(1)));
