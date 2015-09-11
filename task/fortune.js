// Node.jsでの通信などの簡単なサンプル
// Node.js単体での作業はHTMLの出力において，
// 割とめんどくさいことになる

// 必要なモジュールをロードする
var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');

// 出力するHTMLコードを用意する
var htmlHeader = '<!DOCTYPE html>\
<html lang="ja">\
<head>\
  <meta charset="utf-8">\
  <title>ノード占い</title>\
  <style>.body {\
    color: #F5F5F5;\
  }\
  .content {\
    width: 480px;\
    text-align: center;\
    border: 4px solid #0E7AC4;\
    padding: 4px;\
    margin: 16px auto;\
  }\
  .main-form div {margin-bottom: 4px;}\
  .result {\
    display: block;\
    font-size: 200%;\
    color: #DE4830;\
    margin: 4px auto;\
    border: 1px solid;\
    width: 4em;\
  }\
</style>\
</head>\
<body>\
<div class="content">\
<h1>fortnme-teller on Node</h1>';

var htmlMainForm = '<div class="main-form">\
  <form method="post" action="/">\
    <div>\
      <label>YourName：<input type="text" name="name" size="20"></label>\
    </div>\
    <div>\
      Birthday：\
      <label>Year<input type="text" name="year" size="5"></label>\
      <label>Month<input type="text" name="month" size="3"></label>\
      <label>Day<input type="text" name="day" size="3"></label>\
    </div>\
    <div>\
      Sex：\
      <label><input type="radio" name="sex" value="male">Male</label>\
      <label><input type="radio" name="sex" value="female">Female</label>\
    </div>\
    <input type="submit" value="Go">\
  </form>\
</div>';

var htmlFooter = '</div></body></html>';

// 「<」や「>」、「&」といった文字列をエンティティに変換する
function escapeHtmlSpecialChar(html) {
  if (html === undefined) {
    return '';
  } else {
    html = html.replace(/&/g, '&amp;');
    html = html.replace(/</g, '&lt;');
    html = html.replace(/>/g, '&gt;');
    return html;
  }
}

// http.Serverオブジェクトを作成する
var server = http.createServer(onRequest);

// requestイベントハンドラを定義する
function onRequest(request, response) {
  // リクエストされたパスが「/」以外の場合、404エラーを返す
  if (request.url != '/') {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('Error 404: Not Found.');
    return;
  }

  // POST以外のリクエストの場合、メインフォームを送信する
  if (request.method != 'POST') {
    response.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    response.write(htmlHeader);
    response.write(htmlMainForm);
    response.write(htmlFooter);
    response.end();
    return;
  }

  // POSTリクエストの場合、送信されたデータから占い結果を生成する
  if (request.method == 'POST') {
    // 送信されたデータを取得する
    request.data = '';
    request.on('data', function (chunk) {
      request.data += chunk;
    });
    request.on('end', sendResponse);
    return;
  }

  // データの受信が完了したら実行される関数
  function sendResponse() {
    var query = querystring.parse(request.data);
    var now = new Date();
    var date = now.getDate();

    // 取得したデータをすべて連結
    var seed = query.name + query.year + query.month
      + query.day + query.sex + date;
    var tommorowSeed = query.name + query.year + query.month
      + query.day + query.sex + (date + 1);

    // MD5ハッシュを計算する
    function createHash(seed){
      hash = crypto.createHash('md5');
      hash.update(seed);
      var hashValue = hash.digest('hex');

      // 16進数で表現されたMD5ハッシュの1、2文字目を取り出し
      // 整数に変換する
      var fortuneKey = Number('0x' + hashValue.slice(0, 2));
      return fortuneKey;
    }

    var fortuneKey = createHash(seed);
    var tommorowFortuneKey = createHash(tommorowSeed);

    // fortuneKeyの値に応じて占い結果を生成する
    // fortuneKeyにはデータに応じた0〜255の値が入っている
    function fortune (key) {
      if (key < 10) {
        result = '大凶';
      } else if (key < 50) {
        result = '凶';
      } else if (key < 100) {
        result = '末吉';
      } else if (key < 150) {
        result = '吉';
      } else if (key < 245) {
        result = '中吉';
      } else {
        result = '大吉';
      }
      return result;
    }

    var todayResult = fortune(fortuneKey);

    // 22時以降の場合、明日の運勢を出力
    if (now.getHours() >= 22) {
      var tommorowResult = "明日の運勢は<span class= 'result'>"+fortune(tommorowFortuneKey)+"</span>です。";
    }else{
      var tommorowResult = "";
    }

    // 占い結果から出力するHTMLを生成する
    var resultStr = '<div><p>'
      + escapeHtmlSpecialChar(query.year) + '年'
      + escapeHtmlSpecialChar(query.month) + '月'
      + escapeHtmlSpecialChar(query.day) + '日生まれの'
      + escapeHtmlSpecialChar(query.name) + 'さん（'
      + ((query.sex == 'male') ? '♂' : '♀')
      + '）の運勢は……'
      + '<span class="result">'
      + todayResult
      + '</span>'
      + 'です。<br>'
      + tommorowResult
      + '</p></div>'
      + '<a href="/">トップに戻る</a>';

    response.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    response.write(htmlHeader);
    response.write(resultStr);
    response.write(htmlFooter);
    response.end();
  }
}

// 待ち受けするポートとアドレスを指定
var PORT = 8080;
var ADDRESS = '127.0.0.1';

// 指定したポートで待ち受けを開始する
server.listen(PORT, ADDRESS);
console.log('Server running at http://' + ADDRESS + ':' + PORT + '/');
