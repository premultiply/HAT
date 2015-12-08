
<?php
function is_valid($arg){
	return isset($arg) && !empty($arg);
}
ob_start();
require_once("../../../wp-load.php");
ob_end_clean();

if (is_valid($_GET) && is_valid($_GET['action']) && is_valid($_GET['args'])){
	$action = $_GET['action'];
	$args = $_GET['args'];
	switch ($action) {
		case 'get_gallery_item_info':
			get_gallery_item_info($args);
			break;
	}
} else {
	error("Not Found");
}

function get_gallery_item_info($id){
	$info = get_post_meta($id,'_hat_galleryItemContent',true);
	if (is_valid($info)){
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