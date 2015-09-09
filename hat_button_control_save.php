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

				//Main Menu Item
if (isset($_POST['main_menu_button'])){
	update_post_meta( 1, '_main_menu_button', $_POST['main_menu_button']);
}


if (isset($_POST['items']) or empty($_POST['items'])){
	$menu_args = array(
		'order'                  => 'ASC',
		'orderby'                => 'menu_order',
		'post_type'              => 'nav_menu_item',
		'post_status'            => 'publish',
		'output'                 => ARRAY_A,
		'output_key'             => 'menu_order',
		'nopaging'               => true,
		'update_post_term_cache' => false 
		);
	$menu_loc = 'footer-menu';
	if ( ( $locations = get_nav_menu_locations() )) {
		$menu = wp_get_nav_menu_object( $locations[ $menu_loc ] );
		if ($menu){
			$menu_objects = get_objects_in_term( $menu->term_id, 'nav_menu' );
			if ( ! empty( $menu_objects ) ) {
				foreach ( $menu_objects as $obj ) {
					wp_delete_post( $obj);
				}
			}
		} else {
			$menu_id = wp_create_nav_menu('FooterMenu');
			$menu = wp_get_nav_menu_object($menu_id);
			$locations[ $menu_loc ] = $menu_id;
			set_theme_mod('nav_menu_locations',$locations);
		}


		foreach($_POST['items'] as $index=>$item){
			if (isset($item['button_name']) && isset($item['show'])){
				//Hide Button Item
				if (isset($item['is_hide'])){
					$menu_item = array(
						'menu-item-position' => $index+1,
						'menu-item-status' => 'publish',
						'menu-item-title' => get_theme_mod( "hide_text"),
						);
					$id = wp_update_nav_menu_item($locations[$menu_loc], 0, $menu_item);
					add_post_meta( $id, '_menu_item_hat_button', 'Red', true );
					add_post_meta( $id, '_menu_item_is_hide', 'true', true );
					add_post_meta( $id, '_menu_item_show_footer', $item['show'], true );
				} else {
					$menu_item = array(
						'menu-item-object-id' => $item['post_id'],
						'menu-item-object' => get_post_type($item['post_id']),
						'menu-item-position' => $index+1,
						'menu-item-type' => 'post_type',
						'menu-item-status' => 'publish',
						);
					$id = wp_update_nav_menu_item($locations[$menu_loc], 0, $menu_item);
					add_post_meta( $id, '_menu_item_hat_button', $item['button_name'], true );
					add_post_meta( $id, '_menu_item_show_footer', $item['show'], true );
				}

			}
			
		}




	}
} else {
	header("HTTP/1.0 404 Not Found");
}

?>
