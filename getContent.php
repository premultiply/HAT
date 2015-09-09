<!--
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
-->

<?php
/*
 * Author - Rob Thomson <rob@marotori.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 */

//session_start();
ob_start();

error_reporting(E_ERROR | E_PARSE);

/* First screen base URL */
$base = "http://";

$ckfile = '/tmp/simpleproxy-cookie-' . session_id(); //this can be set to anywhere you fancy!  just make sure it is secure.


/* all system code happens below - you should not need to edit it! */

//work out cookie domain
$cookiedomain = str_replace("http://www.", "", $base);
$cookiedomain = str_replace("https://www.", "", $cookiedomain);
$cookiedomain = str_replace("www.", "", $cookiedomain);

$url = $base . $_GET['url'];

$urlArr = parse_url($url);

$url = $urlArr["scheme"] .'://'. $urlArr["host"] . $urlArr["path"];



if(!empty($urlArr["query"])){
    $url .= '?';
    $gets = explode("&",$urlArr["query"]);
    $len = sizeof($gets);
    $i = 0;
    foreach($gets as $k => $v){
        $keyVal = explode("=",$v);
        $url .= $keyVal[0] ."=". rawurlencode($keyVal[1]);
        $url .= ($i < ($len - 1)) ? '&' : '';
        $i++;
    }
}

//exit($url);

if (array_key_exists('HTTPS', $_SERVER) && $_SERVER['HTTPS'] == 'on') {
    // $mydomain = 'https://' . $_SERVER['HTTP_HOST'];
    $mydomain = 'https://';
} else {
    $mydomain = 'http://' . $_SERVER['HTTP_HOST'];
    // $mydomain = 'http://';
}

// Open the cURL session
$curlSession = curl_init();

curl_setopt($curlSession, CURLOPT_URL, $url);
curl_setopt($curlSession, CURLOPT_HEADER, 1);


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    curl_setopt($curlSession, CURLOPT_POST, 1);
    curl_setopt($curlSession, CURLOPT_POSTFIELDS, $_POST);
}

curl_setopt($curlSession, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curlSession, CURLOPT_TIMEOUT, 30);
curl_setopt($curlSession, CURLOPT_SSL_VERIFYHOST, 1);
curl_setopt($curlSession, CURLOPT_COOKIEJAR, $ckfile);
curl_setopt($curlSession, CURLOPT_COOKIEFILE, $ckfile);

//handle other cookies cookies
foreach ($_COOKIE as $k => $v) {
    if (is_array($v)) {
        $v = serialize($v);
    }
    curl_setopt($curlSession, CURLOPT_COOKIE, "$k=$v; domain=.$cookiedomain ; path=/");
}

//Send the request and store the result in an array
$response = curl_exec($curlSession);

// Check that a connection was made
if (curl_error($curlSession)) {
    // If it wasn't...
	header('HTTP/1.0 500 Internal Server Error');
	print curl_error($curlSession);
} else {

    //clean duplicate header that seems to appear on fastcgi with output buffer on some servers!!
    $response = str_replace("HTTP/1.1 100 Continue\r\n\r\n", "", $response);

    $ar = explode("\r\n\r\n", $response, 2);


    $header = $ar[0];
    $body = $ar[1];

    //handle headers - simply re-outputing them
    $header_ar = split(chr(10), $header);
    foreach ($header_ar as $k => $v) {
        if (!preg_match("/^Transfer-Encoding/", $v)) {
            $v = str_replace($base, $mydomain, $v); //header rewrite if needed
            header(trim($v));
        }
    }

    //rewrite all hard coded urls to ensure the links still work!

    $mydomain = str_replace('http://localhost', '', $mydomain); 
    $body = str_replace($base, $mydomain, $body);

    print $body;

}

curl_close($curlSession);


?>