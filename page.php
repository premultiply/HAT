<!--
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
-->

<?php Hat_Utilities::get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); ?>

	<div class="content">
		<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
			<div id="content_oneColum"><?php the_content(); ?></div>
		<?php endwhile; ?>
	</div>


<?php Hat_Utilities::get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer' ) ); ?>