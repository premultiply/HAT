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
		$buttonFunc = get_post_meta(get_post()->ID,'_hat_popupContent',true);
		if (isset($buttonFunc) && isset($buttonFunc['button_functions'])) {
			$buttonFunc = $buttonFunc['button_functions'];
		} else {
			$buttonFunc = array();
		}


		function hbbTVButton($button, $func, $text){
			?>
			<div class="function_button">
				<img src="<?php echo (get_bloginfo('template_url').'/assets/button'. $button.'.png') ?>"></img>
				<div class="label"><?php echo $text; ?></div>
				<script>
				$('#popup').nav(<?php echo $button?>,function(){
					<?php echo $func;?>
				});
				</script>
			</div>
			<?php
		}
?>

<div class="popupcontent">
	<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
		<div class="contentHeader"><?php wp_title(''); ?></div>
		<div class="textContent"><?php the_content(); ?></div>
		<div class="popupfooter contentHeader">
			Drücken Sie OK zum Schließen
			<div class="arrow arrowdown"></div>
			<div class="arrow arrowup"></div>
			<?php foreach ($buttonFunc as $key => $value) {
				hbbTVButton($key, $value['func'], $value['desc']);
			} ?>
		</div>
	<?php endwhile; ?>
</div>

