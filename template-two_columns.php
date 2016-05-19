<?php
/**
 * Template Name: Two Columns
 * A custom left sidebar template for the HAT Two-Columns-Template.
 */

/*
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
*/

	$boxview = $_GET['boxview'];
	$hpc = get_post_meta($post->ID,'_hat_pageContent',TRUE); 
	if(!$hpc) { $hpc = array(); }

	if($boxview){
		echo generateContentBox($hpc[$boxview]);
	}else{

		Hat_Utilities::get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); 
?>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); echo '/js/column-template'.Hat_Utilities::minified().'.js'?>"></script>
		<div id="content">
			<div class="content_twoColumn left <?php echo $hpc['box1']['navigable']; ?>" data-type="<?php echo $hpc['box1']['contenttype'] ?>">
				<?php generateContentBox($hpc['box1']) ?>
			</div>
			<div class="content_twoColumn right <?php echo $hpc['box2']['navigable']; ?>" data-type="<?php echo $hpc['box2']['contenttype'] ?>">
				<?php generateContentBox($hpc['box2']) ?>
			</div>
		</div>
<?php 
		Hat_Utilities::get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer') );
	
	}
?>
