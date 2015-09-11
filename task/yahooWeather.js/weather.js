// RSSの読み取り
// 画面は自分で作りましょう

// Yahoo!Japan 天気予報 RSS
var RSS = "http://rss.weather.yahoo.co.jp/rss/days/6110.xml";

// モジュールの取り込み
var http = require('http');
var parseString = require('xml2js').parseString;
var request = require('request');

// http.Serverオブジェクトを作成する
var server = http.createServer(onRequest);

function onRequest(request, response) {
  // リクエストされたパスが「/」以外の場合、404エラーを返す
  if (request.url != '/') {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('Error 404: Not Found.');
    return;
  }

  response.write(htmlHeader);
  response.write(htmlContents);
  response.write(htmlFooter);
  response.end();
}
// RSSダウンロード
request(RSS, function (error, response, body) {
  console.log(response.statusCode);
  if (!error && response.statusCode == 200) {
    analyzeRSS(body);
  }
});

function analyzeRSS(xml) {
  // XMLをJSのオブジェクトに変換
  parseString (xml, function (err, obj) {
    if (err) {
      console.log(err);
      return 0;
    }
    // 天気の表示

    // 変換の状況の確認用
    // console.log(JSON.stringGIFy(obj));

    var items = obj.rss.channel[0].item;
    for (var i in items) {
      var item = items[i];
      console.log(item["title"]);
      console.log(item["link"]);
    }
    console.log("flag1");
  });
}

// html
var htmlHeader = '<!DOCTYPE html>\
<html lang="ja">\
<head>\
  <meta charset="utf-8">\
  <title>京都の天気 by Yahoo天気</title>\
</head>';

var htmlContents = '<body>'
+ 'ここにRSSの内容'
+ '</body>';
console.log("flag2");

var htmlFooter = '</html>';

// 待ち受けするポートとアドレスを指定
var PORT = 8080;
var ADDRESS = '127.0.0.1';

// 指定したポートで待ち受けを開始する
server.listen(PORT, ADDRESS);
console.log('Server running at http://' + ADDRESS + ':' + PORT + '/');
