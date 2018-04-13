<?php

require 'vendor/autoload.php';

$app = new \Slim\App();
$container = $app->getContainer();

$container['CALL_ROUTER_SECRET'] = 'testSecret';
$container['CALL_SDK_APP_ID'] = 'sample-application-C2';
$container['CALL_SDK_APP_TOKEN'] = 'KpPiqKGpoN';

$container['view'] = function($container) {
  return new \Slim\Views\PhpRenderer('./templates/');
};

$app->get('/', function($request, $response, $args) {
  return $this->view->render($response, 'index.html', [
    "API_KEY" => 'b4a507944ead681c7d2a4e578ac19f11'
  ]);
});

$app->get('/app', function($request, $response, $args) {
  $params = $request->getParams();
  $client = new \GuzzleHttp\Client();
  $res = $client->request('POST', 'https://rtc-api.qiscus.com/router/auth/login_or_register', [
    'headers' => [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->CALL_ROUTER_SECRET
    ],
    'json' => [
      'userId' => $params['userId'],
      'userName' => $params['userName'],
      'userAvatar' => '',
    ]
  ]);
  $resp = json_decode($res->getBody());

  return $this->view->render($response, 'app.html', [
    "API_KEY" => $resp->data->apiKey,
    "USER_NAME" => $resp->data->userName,
    "CALL_SDK_APP_ID" => $this->CALL_SDK_APP_ID,
    "CALL_SDK_APP_TOKEN" => $this->CALL_SDK_APP_TOKEN
  ]);
});

$app->run();

?>
