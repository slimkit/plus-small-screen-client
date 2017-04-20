<!DOCTYPE html>
<html lang="en" id="html-root">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Demo</title>
  <link rel="stylesheet" href="/zhiyicx/plus-component-web/css/user.css" />
  <script>
  	window.TS_WEB = {!! json_encode([
      'api' => $api,
      'url' => $base_url
    ]) !!}
  </script>
</head>
<body id="body-root">
  <div id="app"></div>
  <script src="/zhiyicx/plus-component-web/js/user.js" type="text/javascript" ></script>
  <!-- <script src="http://localhost:8080/user.js" type="text/javascript" ></script> -->
</body>
</html>