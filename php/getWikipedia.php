<?php

	// remove for production

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

	$url = 'http://api.geonames.org/wikipediaBoundingBoxJSON?formatted=true&north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&west=' . $_REQUEST['west'] . '&username=ekruger&style=full';

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $decode = json_decode($result,true);

	$wikiData = [];

	for ($i = 0; $i < count($decode['geonames']); $i++) {

	    if ($decode['geonames'][$i]['title'] == $_REQUEST['country']) 
        array_push($wikiData, $decode['geonames'][$i]);     
    };

     
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $wikiData;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
    ?>