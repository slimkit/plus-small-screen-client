<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="api-basename" content="{{ $api }}" >
  <meta name="gold-name" content="{{ $goldName }}" >
  <meta name="keywords" content="{{ $siteKeywords }}">
  <meta name="socket-url" content="{{ $webSocktUrl }}" >
  <meta name="description" content="{{ $siteDescription }}">
  
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="format-detection" content="telephone=no">
  <meta name="screen-orientation" content="portrait">
  <meta name="x5-fullscreen" content="true">
  <meta name="full-screen" content="yes">
  <title>{{ $siteName }}</title>
  <script src="{{ $jssdkAmap }}"></script>
<!--   <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css?v=20171120" rel="stylesheet"> -->
  <link rel="stylesheet" href="{{ mix('css/app.css', 'assets/h5') }}?v=20171120" />
</head>
<body>
  <div id="app">
    <router-view></router-view>
  </div>
  <script src="{{ mix('/js/manifest.js', 'assets/h5') }}?v=20171120"></script>
  <script src="{{ mix('/js/vendor.js', 'assets/h5') }}?v=20171120"></script>
  <script src="{{ mix('js/app.js', 'assets/h5') }}?v=20171120"></script>
</body>
</html>