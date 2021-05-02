<?php

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\Utils;
// use NFePHP\DA\NFe\Danfce;
use NFePHP\DA\NFe\Danfe;

function helloHttp(ServerRequestInterface $request): ResponseInterface
{
    $origBody = $request->getBody();
    // return (new Response())
    //     ->withBody($origBody)
    //     ->withStatus(200)
    //     ->withHeader('Content-type', 'text/plain')
    //     ->withHeader('Access-Control-Allow-Origin', '*');
    $body = json_decode($origBody, true);
    // $logo = 'data://text/plain;base64,'. base64_encode(file_get_contents("C:/Users/jaeds/Downloads/logo.jpeg"));
    // $logo = 'C:/Users/jaeds/Downloads/logo-nfce.png';
    $xml = $body['xml'];//file_get_contents("C:/Users/jaeds/Downloads/anfce112.xml");
    $orientacao = $body['orientacao'];
    $papel = 'A4';//$body['papel'];
    $margSup = $body['margSup'];
    $margEsq = $body['margEsq'];

    $danfe = new Danfe($xml);//new Danfce($xml);
    $danfe->debugMode(true);//seta modo debug, deve ser false em produção
    // $danfe->setPaperWidth(80); //seta a largura do papel em mm max=80 e min=58
    // $danfe->setMargins(2);//seta as margens
    // $danfe->setOffLineDoublePrint(true); //ativa ou desativa a impressão conjunta das via do consumidor e da via do estabelecimento qnado a nfce for emitida em contingência OFFLINE
    // $danfe->setDefaultFont('arial');//altera o font pode ser 'times' ou 'arial'
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