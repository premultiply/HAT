/*
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
*/

/* BROADCAST MODUL */ 
Hbb.prototype.bindBroadcast = function (target_div) {
	try{
		var target_area = '#'+target_div;
		$(target_area).attr("data-type","broadcast");
		if($(target_area).children().length){
			$(target_area).prepend("<object id='broadcast' type='video/broadcast' height='100%' width='100%'></object>");
		}else{
			$(target_area).html("<object id='broadcast' type='video/broadcast' height='100%' width='100%'></object>");
		}
		$(target_area).css('background-color', '#000000');
		// ONLY available in broadcast environments !!!  
		var broadcast = $('#broadcast')[0];
		$('#broadcast')[0].bindToCurrentChannel();
	}catch(error){
		log("bindBroadcast ERROR: "+error.message);
	}

	// this.bindVideo(target_div, "assets/yourVideo.mp4");
};