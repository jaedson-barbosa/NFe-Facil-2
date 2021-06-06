<?php

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\Utils;
use NFePHP\DA\NFe\Danfce;
// use NFePHP\DA\NFe\Danfe;

function helloHttp(ServerRequestInterface $request): ResponseInterface
{
    // $origBody = $request->getBody();
    // return (new Response())
    //     ->withBody($origBody)
    //     ->withStatus(200)
    //     ->withHeader('Content-type', 'text/plain')
    //     ->withHeader('Access-Control-Allow-Origin', '*');
    // $body = json_decode($origBody, true);
    // $logo = 'data://text/plain;base64,'. base64_encode(file_get_contents("C:/Users/jaeds/Downloads/logo.jpeg"));
    // $logo = 'C:/Users/jaeds/Downloads/logo-nfce.png';
    $xml = file_get_contents("/home/jaedson/Downloads/nfce112_1.xml");//$body['xml'];//;
    // $orientacao = $body['orientacao'];
    // $papel = 'A4';//$body['papel'];
    // $margSup = $body['margSup'];
    // $margEsq = $body['margEsq'];

    $danfe = new Danfce($xml);//new Danfce($xml);
    $danfe->debugMode(true);//seta modo debug, deve ser false em produção
    $danfe->setPaperWidth(58); //seta a largura do papel em mm max=80 e min=58
    $danfe->setMargins(3);//seta as margens
    $danfe->setOffLineDoublePrint(false); //ativa ou desativa a impressão conjunta das via do consumidor e da via do estabelecimento qnado a nfce for emitida em contingência OFFLINE
    $danfe->setDefaultFont('arial');//altera o font pode ser 'times' ou 'arial'
    // $danfe->printParameters($orientacao, $papel, $margSup, $margEsq);
    // $danfe->creditsIntegratorFooter('NFe Fácil - https://nfefacil.net');
    $pdf = $danfe->render();
    return (new Response())
        ->withBody(Utils::streamFor($pdf))
        ->withStatus(200)
        ->withHeader('Content-type', 'application/pdf')
        ->withHeader('Access-Control-Allow-Origin', '*');
}
/*
Em relação a este aqui, foi testada a impressão e ela tem uma qualidade razoável
Porém no caso dessa aqui é preciso gerar um QR code que leva a um site que exibe a nota
O formato do link não pode ser PDF, sendo necessário usar um conversor
Devem ser analisadas alternativas, mas para esta aqui provavelmente não tem outra opção
De preferência, se for gerado no formato HTML será perfeito
*/