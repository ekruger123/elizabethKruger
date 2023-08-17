<?php

	// remove for production

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $url = 'https://api.weatherapi.com/v1/current.json?key=82fd07c6d96a410383d95753231608&q=' . $_REQUEST['city'];

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $decode = json_decode($result,true);

    $weather;

    for ($i = 0; $i < count($decode['location']); $i++) {
        if($decode['location'][$i]['name'] == $_REQUEST['city']) {
            $weather = $decode['location'][$i];
        }
    }
     
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $weather;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
    ?>