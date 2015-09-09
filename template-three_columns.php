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
/**
 * Template Name: Three Columns
 * A custom page template for the HAT Three-Columns-Template.
 */

	$boxview = $_GET['boxview'];
	$hpc = get_post_meta($post->ID,'_hat_pageContent',TRUE); 
	if(!$hpc) { $hpc = array(); }

	if($boxview){
		echo generateContentBox($hpc[$boxview]);
	}else{

		Hat_Utilities::get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); 
?>
		<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/column-template.js"></script>
		<div id="content">
			<div class="content_threeColumn left <?php echo $hpc['box1']['navigable']; ?>" data-type="<?php echo $hpc['box1']['contenttype'] ?>">
				<?php generateContentBox($hpc['box1']) ?>
			</div>
			<div class="content_threeColumn middle <?php echo $hpc['box2']['navigable']; ?>" data-type="<?php echo $hpc['box2']['contenttype'] ?>">
				<?php generateContentBox($hpc['box2']) ?>
			</div>
			<div class="content_threeColumn right <?php echo $hpc['box3']['navigable']; ?>" data-type="<?php echo $hpc['box3']['contenttype'] ?>">
				<?php generateContentBox($hpc['box3']) ?>
			</div>
		</div>
<?php 
		Hat_Utilities::get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer') );

	} 
?>


