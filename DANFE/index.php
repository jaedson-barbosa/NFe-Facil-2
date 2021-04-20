<?php

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Psr7\Response;
use NFePHP\DA\NFe\Danfe;

function helloHttp(ServerRequestInterface $request): ResponseInterface
{
    $body = json_decode($request->getBody(), true);
    $xml = $body['xml'];
    $danfe = new Danfe($xml);
    $pdf = $danfe->render();
    return (new Response())
        ->withBody(GuzzleHttp\Psr7\stream_for($pdf))
        ->withStatus(200)
        ->withHeader('Content-type', 'application/pdf')
        ->withHeader('Access-Control-Allow-Origin', '*');
}

//$env:FUNCTION_SOURCE='helloHttp'
//vendor/bin/router.php.bat
//php -S localhost:8080 vendor/google/cloud-functions-framework/router.php
//gcloud functions deploy helloWorld --runtime=php74 --entry-point='helloHttp' --trigger-http