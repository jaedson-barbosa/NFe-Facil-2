<?php

// include __DIR__ . '\vendor\autoload.php';
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Psr7\Response;
use NFePHP\DA\NFe\Danfce;
// use NFePHP\DA\NFe\Danfe;

function helloHttp(ServerRequestInterface $request): ResponseInterface
{
    // $body = json_decode($request->getBody(), true);
    // $logo = 'data://text/plain;base64,'. base64_encode(file_get_contents("C:/Users/jaeds/Downloads/logo.jpeg"));
    // $logo = 'C:/Users/jaeds/Downloads/logo-nfce.png';
    $xml = file_get_contents("C:/Users/jaeds/Downloads/anfce112.xml");//$body['xml'];

    $danfe = new Danfce($xml);//new Danfe($xml);
    // $danfe->debugMode(true);//seta modo debug, deve ser false em produção
    // $danfe->setPaperWidth(80); //seta a largura do papel em mm max=80 e min=58
    // $danfe->setMargins(2);//seta as margens
    // $danfe->setOffLineDoublePrint(true); //ativa ou desativa a impressão conjunta das via do consumidor e da via do estabelecimento qnado a nfce for emitida em contingência OFFLINE
    // $danfe->setDefaultFont('arial');//altera o font pode ser 'times' ou 'arial'
    // $danfe->creditsIntegratorFooter('WEBNFe Sistemas - http://www.webnfe.com.br');
    // echo 'kk';
    $pdf = $danfe->render();
    return (new Response())
        ->withBody(GuzzleHttp\Psr7\stream_for($pdf))
        ->withStatus(200)
        ->withHeader('Content-type', 'application/pdf')
        ->withHeader('Access-Control-Allow-Origin', '*');
}

//$env:FUNCTION_TARGET='helloHttp'
//$env:FUNCTION_SOURCE='index.php'
//vendor/bin/router.php.bat
//php -S localhost:8080 vendor/google/cloud-functions-framework/router.php
//gcloud functions deploy helloWorld --runtime=php74 --entry-point='helloHttp' --trigger-http