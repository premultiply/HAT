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
 * Template Name: Full Page
 * A custom page template for the HAT Full-Template.
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
			<div class="content_oneColumn <?php echo $hpc['box1']['navigable']; ?>" data-type="<?php echo $hpc['box1']['contenttype'] ?>">
				<?php generateContentBox($hpc['box1']) ?>
			</div>
			<style>
				.content_oneColumn {
					left: 0px;
					width: <?php echo $hpc['box1']['width'];?>%;
					<?php
					if ($hpc['box1']['align']==='left'){
						?>
					float: left;
						<?php
					} else if ($hpc['box1']['align']==='right'){
						?>
					float: right;
						<?php
					} else {
						?>
					float: none;
					margin: 0px auto;
						<?php
					}
						?>
				}
			</style>
		</div>
<?php 
		Hat_Utilities::get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer') );

	}
?>