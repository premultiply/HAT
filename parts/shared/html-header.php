<!DOCTYPE html PUBLIC '-//HbbTV//1.1.1//EN' 'http://www.hbbtv.org/dtd/HbbTV-1.1.1.dtd'>
<!--
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
-->

<?php $min = Hat_Utilities::minified();?>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><?php bloginfo( 'name' ); ?><?php wp_title( '' ); ?></title>
		<meta charset="<?php bloginfo( 'charset' ); ?>"></meta>
	  	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"></meta>
	  	<!-- general functions and libs -->
	  	<script type='text/javascript' src="<?php bloginfo( 'template_url' ); echo '/js/general/jquery-1.11.3.js'; ?>"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); echo '/js/general/hbbtvlib'.$min.'.js'; ?>"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); echo '/js/general/keycodes'.$min.'.js'; ?>"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); echo '/js/general/hat_navigation'.$min.'.js'; ?>"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); echo '/js/nav-menu'.$min.'.js'; ?>"></script>
	  	<link rel="stylesheet" type="text/css" href="<?php bloginfo( 'template_url' ); echo '/style'.$min.'.css'; ?>" />

		<!-- Scribble -->
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/scribble/json2.js"></script>
		<script type="text/javascript" src="<?php bloginfo( 'template_url' ); echo '/js/modules/social'.$min.'.js'; ?>"></script>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); echo '/js/scribble/jquery.timeago'.$min.'.js'; ?>"></script>

	  
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
		<div id="hbbtv_app">
			<div id="safe_area">
