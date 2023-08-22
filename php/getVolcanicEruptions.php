<?php

	// remove for production

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

	$url = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=significant-volcanic-eruption-database&q=&facet=year&facet=tsu&facet=eq&facet=name&facet=location&facet=country&facet=type&facet=status&facet=total_damage_description&facet=total_houses_destroyed_description&facet=houses_damaged_description';

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $decode = json_decode($result,true);

	$volcanicEruptions = [];

	for ($i = 0; $i < count($decode['records']); $i++) {

	    if ($decode['records'][$i]['fields']['country'] == $_REQUEST['country']) 
        array_push($volcanicEruptions, $decode['records'][$i]);     
    };

	
     
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $volcanicEruptions;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
    ?>