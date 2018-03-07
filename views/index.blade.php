<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="keywords" content="{{ $siteKeywords }}">
  <meta name="description" content="{{ $siteDescription }}">
  <title>{{ $siteName }}</title>
  <script src="{{ $jssdkAmap }}"></script>
  @if($ssl) 
    <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css?v=20171120" rel="stylesheet">
  @else
    <link href="http://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css?v=20171120" rel="stylesheet">
  @endif
  <link rel="stylesheet" href="{{ mix('css/app.css', 'assets/h5') }}?v=20171120" />
  <style>
    /*********************** markdown 样式重构 *******************/
    .editor-preview img {
      width: 100%;
    }
    .markdown-body {
      font-size: 14px;
    }
    .markdown-body * {
      box-sizing: border-box;
    }
    .markdown-body h2, .markdown-body h1 {
      border-bottom: none;
      margin-bottom: 8px;
    }
    .markdown-body blockquote {
      background: #EAEDF1;
      padding: .5em 1em;
    }
    .markdown-body blockquote>:first-child {
      margin-top: 0;
    }
    .markdown-body blockquote>:last-child {
      margin-bottom: 0;
    }
    .markdown-body img {
      width: 100vw;
      max-width: 100vw;
      height: auto;
      margin-left: -12px;
    }
    .markdown-body blockquote>:last-child {
      font-size: 14px;
    }
    .markdown-body ol {
      padding-left:  1em;
    }
    .markdown-body ul {
      padding-left: 1.2em;
    }
    .markdown-body ol li {
      list-style-type: decimal;
    }
    .markdown-body ul li {
      list-style-type: disc;
    }
    .markdown-body .highlight pre, .markdown-body pre {
      padding: 1em;
      overflow: auto;
      font-size: 100%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 3px;
    }
    .markdown-body p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .markdown-body table {
      display: block;
      width: 100%;
      overflow: auto;
    }
    .markdown-body blockquote, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .markdown-body table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }
    .markdown-body table td, .markdown-body table th {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    /********************* markdown 样式重构 end *******************/
    #spinner-root {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0; 
      z-index: 8;
      display: flex;
      justify-content: center;
      -webkit-justify-content: center;
      align-items: center;
      -webkit-align-items: center;
      background: #fff;
    }
    #spinner-root-parent {
      position: relative;
      width: 6vw;
      height: 6vw;
    }
    .spinner-root-double-bounce-bounce1, 
    .spinner-root-double-bounce-bounce2 {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      opacity: 0.6;
      background-color: #59b6d7;
      -webkit-animation: mint-root-spinner-double-bounce 2.0s infinite ease-in-out;
              animation: mint-root-spinner-double-bounce 2.0s infinite ease-in-out;
    }
    .spinner-root-double-bounce-bounce2 {
      -webkit-animation-delay: 1.0s;
              animation-delay: 1.0s;
    }
    @-webkit-keyframes mint-spinner-root-double-bounce {
      0%, 100% {
        -webkit-transform: scale(0.0);
                transform: scale(0.0);
      }
      50% {
        -webkit-transform: scale(1.0);
                transform: scale(1.0);
      }
    }
    @keyframes mint-root-spinner-double-bounce {
      0%, 100% {
        -webkit-transform: scale(0.0);
                transform: scale(0.0);
      }
      50% {
        -webkit-transform: scale(1.0);
                transform: scale(1.0);
      }
    }
  </style>
  <script>
    window.TS_WEB = {!! json_encode([
      'api' => $api,
      'apiv1' => $apiv1,
      'url' => $base_url,
      'socketUrl' => $webSocktUrl,
      'im_token' => '',
      'webSocket' => null,
      'loaded' => false,
      'isWeiXin' => false,
      'currentUserId' => 0,
      'dataBase' => null,
      'goldName' => $goldName
    ]) !!}
  </script>
</head>
<body onload="hideLoading()">
  <div id="app"></div>
  <section id="root-loading">
    <div id="spinner-root">
      <div id="spinner-root-parent">
        <div class="spinner-root-double-bounce-bounce2"></div>
        <div class="spinner-root-double-bounce-bounce1"></div>
      </div>
    </div>
  </section>
  <script>
    function hideLoading () {
      document.getElementById('root-loading').style.display = 'none';
    }
    // 判断微信浏览器
    function isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
      }
    }
    if(isWeiXin()) {
      TS_WEB.isWeiXin = true;
    }
  </script>

  <script src="{{ mix('/js/vendor.js', 'assets/h5') }}?v=20171120"></script>
  <script src="{{ mix('js/app.js', 'assets/h5') }}?v=20171120"></script>
</body>
</html>