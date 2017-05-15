<!DOCTYPE html>
<html lang="en" id="html-root">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>ThinkSNS+</title>
  <link rel="stylesheet" href="{{ \Zhiyi\Component\ZhiyiPlus\PlusComponentWeb\mix('css/app.css') }}" />
  <script>
  	window.TS_WEB = {!! json_encode([
      'api' => $api,
      'url' => $base_url,
      'socketUrl' => $webSocktUrl,
      'im_token' => '',
      'webSocket' => null,
      'loaded' => false
    ]) !!}
  </script>
</head>
<body id="body-root">
  <div id="app"></div>
  <script src="{{ \Zhiyi\Component\ZhiyiPlus\PlusComponentWeb\mix('js/app.js') }}"></script>
</body>
</html>