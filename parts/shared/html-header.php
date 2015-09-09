<!--
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
-->


<!DOCTYPE html PUBLIC '-//HbbTV//1.1.1//EN' 'http://www.hbbtv.org/dtd/HbbTV-1.1.1.dtd'>


<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><?php bloginfo( 'name' ); ?><?php wp_title( '' ); ?></title>
		<meta charset="<?php bloginfo( 'charset' ); ?>"></meta>
	  	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"></meta>
	  	<!-- general functions and libs -->
	  	<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/general/jquery-1.11.3.js"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/general/hbbtvlib.js"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/general/keycodes.js"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/general/hat_navigation.js"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/nav-menu.js"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/userFunctions/popup_functions.js"></script>
	  	<link rel="stylesheet" type="text/css" href="<?php bloginfo( 'template_url' ); ?>/style.css" />

		<!-- Scribble -->
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/scribble/json2.js"></script>
		<script type="text/javascript" src="<?php bloginfo( 'template_url' ); ?>/js/modules/social.js"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/scribble/jquery.timeago.js"></script>

	  
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
		<div id="hbbtv_app">
			<div id="safe_area">
