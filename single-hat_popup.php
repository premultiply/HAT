<?php
/*
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
*/

		$buttonFuncs = get_post_meta(get_post()->ID,'_hat_popupContent',true);
		if (isset($buttonFuncs) && isset($buttonFuncs['button_functions'])) {
			$buttonFuncs = $buttonFuncs['button_functions'];
		} else {
			$buttonFuncs = array();
		}


		function hbbTVButton($btn_name, $func_id){
			$title = get_the_title($func_id);
			?>
			<div  class="function_button">
				<img src="<?php echo (get_bloginfo('template_url').'/assets/button'. $btn_name.'.png') ?>"></img>
				<div class="label"><?php echo $title; ?></div>
				<script>
					if (!userFunctions['func'+<?php echo $func_id;?>]){
						userFunctions['func'+<?php echo $func_id;?>] = function(){
							<?php echo get_post_meta($func_id,'_hat_functionContent',true)?>;
						}
					}
				$('#popup').nav(<?php echo $btn_name?>,userFunctions['func'+<?php echo $func_id;?>]);
				</script>
			</div>
			<?php
		}
?>

<div class="popupcontent">
	<style>
		.function_button {
			float: left;
			margin-left: 10px;
		}
		.function_button img{
			float: left;
			margin-right: 5px;
		}
		.function_button .label{
			float: left;
		}


	</style>
	<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
		<div class="contentHeader"><?php wp_title(''); ?></div>
		<div class="textContent"><?php the_content(); ?></div>
		<div class="popupfooter contentHeader">
			<div style="float: left;">[OK] Close</div>
			<?php foreach ($buttonFuncs as $btn_name => $func) {
				hbbTVButton($btn_name, $func);
			} ?>
			<div class="arrow arrowdown"></div>
			<div class="arrow arrowup"></div>

		</div>
	<?php endwhile; ?>
</div>
