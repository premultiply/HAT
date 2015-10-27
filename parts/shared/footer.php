<?php /*
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
*/
?>

<footer>
	<?php
	$locations = get_nav_menu_locations();
	if (isset($locations['primary-menu']) && !empty($locations['primary-menu'])){
	?>
	<div id="menu-toggle">
		<?php $btn = get_post_meta(1,'_main_menu_button',true); if(empty($btn)) {$btn = '5';}?>
		<img src="<?php echo get_bloginfo('template_url').'/assets/button'.$btn.'.png'; ?>">
		<div class="menuText"><?php echo get_theme_mod( 'menu_text') ; ?></div>
	</div>
	<script>
		$(document).ready(function(){
			$generalNav.nav('<?php echo $btn; ?>',function(){
					if (!$('#menu-toggle').hasClass('primary-menu')){
						$('#menu-toggle').activate();
					} else {
						$('#menu-toggle').destroy();
						$('.navigable').eq(0).activate();
					}
			});
		});
	</script>
	<?php 
	wp_nav_menu( array('container_id' => 'primary-menu-wrap', 'theme_location' => 'primary-menu', 'walker' => new hat_walker_primary_menu  ) );
	}

if (isset($locations['footer-menu']) && !empty($locations['footer-menu']) ){
	wp_nav_menu( array( 'theme_location' => 'footer-menu','depth'=>-1,'walker'=> new hat_walker_footer_menu ) ); 
} else {
	?>
		<div id="hide-button">
		<img src="<?php echo get_bloginfo('template_url').'/assets/buttonRed.png' ?>">
		<div><?php echo get_theme_mod( 'hide_text'); ?></div>
	</div>
	<?php
}

?>
</footer>

<?php
class hat_walker_primary_menu extends Walker_Nav_Menu {
			// add main/sub classes to li's and links
	function start_el( &$output, $item, $depth, $args ) {
		global $wp_query;
	    $indent = ( $depth > 0 ? str_repeat( "\t", $depth ) : '' ); // code indent

	    // depth dependent classes
	    $depth_classes = array(
	    	( $depth == 0 ? 'main-menu-item' : 'sub-menu-item' ),
	    	( $depth >=2 ? 'sub-sub-menu-item' : '' ),
	    	( $depth % 2 ? 'menu-item-odd' : 'menu-item-even' ),
	    	'menu-item-depth-' . $depth
	    	);
	    $depth_class_names = esc_attr( implode( ' ', $depth_classes ) );

	    // passed classes
	    $classes = empty( $item->classes ) ? array() : (array) $item->classes;
	    $class_names = esc_attr( implode( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item ) ) );

	    // build html
	    $output .= $indent . '<li id="nav-menu-item-'. $item->ID . '" class="' . $depth_class_names . ' ' . $class_names . '">';

	    // link attributes
	    $attributes  = ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) .'"' : '';
	    $attributes .= ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) .'"' : '';
	    $attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) .'"' : '';
	    $attributes .= ! empty( $item->url )        ? ' href="'   . esc_attr( $item->url        ) .'"' : '';
	    $attributes .= ' class="menu-link ' . ( $depth > 0 ? 'sub-menu-link' : 'main-menu-link' ) . '"';

	    $item_output = $args->before;
	    $item_output .= '<p style="onclick="$(this).navEnter()" '. $attributes .'>';
	    $item_output .= $args->link_before .apply_filters( 'the_title', $item->title, $item->ID );
	    $item_output .= $description.$args->link_after;
	    $item_output .= '</p>';

	    $item_output .= '<script> $(document).ready(function(){'.'$generalNav.nav("'.$button.'",function(){$("#menu-item-'.$item->ID.'").navEnter()});});</script>';
	    if ($item->object==='hat_function'){
	    	$func = get_post($item->object_id);
	    	$item_output .= '<script> $(document).ready(function(){if (!userFunctions) {userFunctions = new Object();} userFunctions.func'.$func->ID.' = function(){'.get_post_meta($func->ID,'_hat_functionContent',true).'};});</script>';
	    }

	    $item_output .= $args->after;
	    $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}

class hat_walker_footer_menu extends Walker_Nav_Menu {

	function start_el(&$output, $item, $depth, $args) {
		$is_hide = get_post_meta($item->ID,'_menu_item_is_hide',true);
		$show = (get_post_meta($item->ID,'_menu_item_show_footer',true)==='true')?' ':'style="display:none !important;" ';
		global $wp_query;
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$class_names = $value = '';

		$classes = empty( $item->classes ) ? array() : (array) $item->classes;

		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item ) );
		$class_names = ' class="'. esc_attr( $class_names ) . '"';

		$output .= $indent . '<li '.$show.'id="menu-item-'. $item->ID . '" object-id="'.$item->object_id.'"' . $value . $class_names .'>';
		$button = get_post_meta($item->ID,'_menu_item_hat_button',true);
		$attributes  = ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) .'"' : '';
		$attributes .= ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) .'"' : '';
		$attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) .'"' : '';
		$attributes .= ! empty( $item->url )        ? ' href="'   . esc_attr( $item->url        ) .'"' : '';

		//$prepend = '<strong>';
		//$append = '</strong>';
		$description  = ! empty( $item->description ) ? '<span>'.esc_attr( $item->description ).'</span>' : '';

		/*if($depth != 0)
		{
			$description = $append = $prepend = "";
		}*/
		$item_output = $args->before;
		$item_output .= '<img src="'. get_template_directory_uri().'/assets/button'.$button.'.png"></img><p style="float:left" onclick="$(this).navEnter()" '. $attributes .'>';
		//$item_output .= $args->link_before .$prepend.apply_filters( 'the_title', $item->title, $item->ID ).$append;
		if ($is_hide==='true'){
			$hide_txt = get_theme_mod( 'hide_text');
			if (empty($hide_txt)){
				$item_output .= 'Hide';
			} else {
				$item_output .= $hide_txt;
			}
		} else {
			$item_output .= $args->link_before .apply_filters( 'the_title', $item->title, $item->ID );
			$item_output .= $description.$args->link_after;
		}

		$item_output .= '</p>';
		if ($item->object==='hat_function'){
			$func = get_post($item->object_id);
			$item_output .= '<script> jQuery(document).ready(function(){console.log("userFunc registered");if (!userFunctions) {userFunctions = new Object();} userFunctions["func'.$func->ID.'"] = function(){'.get_post_meta($func->ID,'_hat_functionContent',true).'};});</script></li>';
		}

		$item_output .= '<script> jQuery(document).ready(function(){'.
			'$generalNav.nav("'.$button.'",function(){$("#menu-item-'.$item->ID.'").navEnter()});});</script>';

		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

}
?>