<?php

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\Utils;
use NFePHP\DA\NFe\Danfe;

function helloHttp(ServerRequestInterface $request): ResponseInterface
{
    $origBody = $request->getBody();
    $body = json_decode($origBody, true);
    // $logo = 'data://text/plain;base64,'. base64_encode(file_get_contents("C:/Users/jaeds/Downloads/logo.jpeg"));
    // $logo = 'C:/Users/jaeds/Downloads/logo-nfce.png';
    $xml = $body['xml'];
    $orientacao = $body['orientacao'];
    $papel = 'A4';//$body['papel'];
    $margSup = $body['margSup'];
    $margEsq = $body['margEsq'];

    $danfe = new Danfe($xml);
    $danfe->debugMode(true); //seta modo debug, deve ser false em produção
    $danfe->printParameters($orientacao, $papel, $margSup, $margEsq);
    $danfe->creditsIntegratorFooter('NFe Fácil - https://nfefacil.net');
    $pdf = $danfe->render();
    return (new Response())
        ->withBody(Utils::streamFor($pdf))
        ->withStatus(200)
        ->withHeader('Content-type', 'application/pdf')
        ->withHeader('Access-Control-Allow-Origin', '*');
}
/*
O codigo no servidor está com debug ativado e rodando nos EUA
Pode ser usado assim apenas na versão alpha

DANFE NFC-e necessita do pacote "opcional" nfephp-org/posprint
Geração dos DANFES já estão funcionando, mas ainda é preciso implementar personalização.
Usar JSON com suporte a geração única:
{
    nfe/nfce: xml
    personalizações...
}
Comandos úteis:
$env:FUNCTION_TARGET='helloHttp'                                            Define a entrada
vendor/bin/router.php.bat                                                   Roda o programa uma vez
php -S localhost:8080 vendor/google/cloud-functions-framework/router.php    Inicia o server local
gcloud functions deploy helloWorld --runtime=php74 --entry-point='helloHttp' --trigger-http
*/