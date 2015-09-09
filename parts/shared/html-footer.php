<!--
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
-->

			</div>
			<div style="z-index: 3" id="overlay"></div>
			<div style="z-index: 4" id="popup"></div>
			<div id="debug"></div>
		</div>
		<script type="text/javascript" language="javascript">
			try{
				hbbtvlib_initialize();
				hbbtvlib_show();
			}catch(err){
				document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML +"<br/>ERROR: " +err.message;
			}
		</script>
		<?php wp_footer(); ?>
	</body>
</html>