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
require_once("../../../wp-load.php");
if (isset($_GET) && !empty($_GET) && isset($_GET['action']) && !empty($_GET['action']) && isset($_GET['args']) && !empty($_GET['args'])){

	$action = $_GET['action'];
	$args = $_GET['args'];
	switch ($action) {
		case 'get_gallery_item_info':
			get_gallery_item_info($args);
			break;
	}
} else {
	error();
}

function get_gallery_item_info($id){
	$info = get_post_meta($id,'_hat_galleryItemContent',true);
	if ($info && !empty($info)){
		$info['title']=get_the_title($id);
		echo json_encode($info);
	} else {
		error("No Gallery Item Found");
	}
}

function error($msg){
	header('HTTP/1.1 400 Bad Request');
	echo $msg;
	exit(0);
}

?>