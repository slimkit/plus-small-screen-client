<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="api-basename" content="{{ $api }}" >
  <meta name="socket-url" content="{{ $webSocktUrl }}" >
  <meta name="gold-name" content="{{ $goldName }}" >
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="keywords" content="{{ $siteKeywords }}">
  <meta name="description" content="{{ $siteDescription }}">
  <title>{{ $siteName }}</title>
  <script src="https://webapi.amap.com/maps?v=1.3&key=abb777bcccf278aa589076944112267e"></script>
  <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css?v=20171120" rel="stylesheet">
  <link rel="stylesheet" href="{{ mix('css/app.css', 'assets/h5') }}?v=20171120" />
</head>
<body>
  <div id="app">
    <router-view></router-view>
    <svg-icon></svg-icon>
  </div>
  <script src="{{ mix('/js/vendor.js', 'assets/h5') }}?v=20171120"></script>
  <script src="{{ mix('js/app.js', 'assets/h5') }}?v=20171120"></script>
</body>
</html>