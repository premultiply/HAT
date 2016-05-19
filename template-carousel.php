<?php 
/**
 * Template Name: Carousel
 * A custom page template for the HAT Carousel.
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

Hat_Utilities::get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); ?>

	<?php
		$hpc = get_post_meta($post->ID,'_hat_pageContent',TRUE); 
		if(!$hpc) { $hpc = array();}
		$hpc = array(
			"box1" => array(
				"videourl" => "http://ondemand.mdr.de/mp4dyn/d/FCMS-dcf1d201-0f2c-4b87-a7c0-857d1c166cbf-c7cca1d51b4b_dc.mp4",
				"thumbnail" => "http://www.mdr.de/export/sandmann/folgen/sandmann5676_v-big169_zc-aeb2b3af.jpg",
				"title" => "Sandmann vom 12. Mai 2015"
			),
			"box2" => array(
				"videourl" => "http://ondemand.mdr.de/mp4dyn/7/FCMS-71062a82-213a-4a04-92dc-74004f5c6ecf-c7cca1d51b4b_71.mp4",
				"thumbnail" => "http://www.mdr.de/export/sandmann/folgen/sandmann5760_v-big169_zc-aeb2b3af.jpg",
				"title" => "Sandmann-Freunde: Kalli-Fußball"
			),
			"box3" => array(
				"videourl" => "http://ondemand.mdr.de/mp4dyn/f/FCMS-faa706d6-2c75-40f6-8848-09cf3feed75a-c7cca1d51b4b_fa.mp4",
				"thumbnail" => "http://www.mdr.de/export/sandmann/folgen/sandmann4660_v-big169_zc-aeb2b3af.jpg",
				"title" => "Sandmann-Freunde: Paula und Paula auf wilder Flussfahrt"
			),
			"box4" => array(
				"videourl" => "http://ondemand.mdr.de/mp4dyn/1/FCMS-14f699ea-d019-437b-9f77-9693b7e32a37-c7cca1d51b4b_14.mp4",
				"thumbnail" => "http://www.mdr.de/export/sandmann/extras/sandmann5780_v-big169_zc-aeb2b3af.jpg",
				"title" => "Sandmann-Freunde: Die drei kleinen Schweinchen"
			)
		);
	?>

	<div id="content">
		<div class="sandmann">
		</div>
	</div>

	<script type="text/javascript">
		$("#hbbtv_app").css("background-image", "url(<?php echo get_template_directory_uri(); ?>/assets/bgr_sandmann.png)");

		$(document).keydown(function(e){
			console.log('key pressed carousel:'+e.keyCode);
			var currentPos = $('#content .sandmann').find('.sandmann_middle');
			switch (e.keyCode){
				case VK_RIGHT:
					currentPos.prev().removeClass().addClass('hidden');
					currentPos.removeClass().addClass('sandmann_left');
					if(($('#content .sandmann > div').length-2) == currentPos.index()){
						$('#content .sandmann > div').first().removeClass().addClass('sandmann_right');
					}else{
						currentPos.next().next().removeClass().addClass('sandmann_right');
					}
					if(($('#content .sandmann > div').length-1) == currentPos.index()){
						$('#content .sandmann > div').first().removeClass().addClass('sandmann_middle');
						$('#content .sandmann :nth-child(2)').removeClass().addClass('sandmann_right');
					}else{
						currentPos.next().removeClass().addClass('sandmann_middle');
					
					}
					if (currentPos.index() == 0){
						$('#content .sandmann > div').last().removeClass().addClass('hidden');
					}
					break;
				case VK_LEFT:
					currentPos.removeClass().addClass('sandmann_right');
					currentPos.next().removeClass().addClass('hidden');
					if(currentPos.index() == 1){
					 	$('#content .sandmann > div').last().removeClass().addClass('sandmann_left');
					}else{
					 	currentPos.prev().prev().removeClass().addClass('sandmann_left');
					}
					if(currentPos.index() == 0){
						$('#content .sandmann > div').last().removeClass().addClass('sandmann_middle');
						$('#content .sandmann > div').last().prev().removeClass().addClass('sandmann_left');
					}else{
						currentPos.prev().removeClass().addClass('sandmann_middle');
					}
					if (currentPos.index() == ($('#content .sandmann > div').length-1)){
						$('#content .sandmann > div').first().removeClass().addClass('hidden');
					}
					break;
				case VK_ENTER:
					log("enter")
					if(!$('#videoplayer').length){
						log("if");
						$(".sandmann").append("<object class='fullscreen' id='videoplayer' width='100%' height='100%' type='video/mp4' data='"+ currentPos.data("url") +"'></object>");
						window.setTimeout( function() {
							if($("#videoplayer")){
								vid_obj = $('#videoplayer')[0];
								if (vid_obj) vid_obj.play(1);
							}
						}, 10);
					}else{
						log("else");
						$("#videoplayer")[0].play(0);
						$("#videoplayer").remove();
					}
					


			}
		});

		loadSandmannContent = function() {
			var result;
			$.ajax({
				type: "GET",
				url: '/wordpress/wp-content/themes/HAT/getContent.php?url=www.sandmann.de/static/san/app_tv/filme.xml',
				dataType: "xml"
			})
			.done(function(data){
				var sandmann_currentContent ='';
				var sandmann_furtherContent = '';
				result = data;
				$source1 = $(data).find('clips[id="1"]').text();
				$source2 = $(data).find('clips[id="3"]').text();
				loadSandmannSource($source1,function(res){
					sandmann_currentContent = res;
					loadSandmannSource($source2, function(res2){
						sandmann_furtherContent = res2;
						generateSandmannContent(sandmann_currentContent,sandmann_furtherContent);
					});
				});
			})
			.fail(function(result){
				console.log("get xml error1");
			});
		};

		loadSandmannSource = function(url, callback) {
			var result;
			$.ajax({
				type: "GET",
				url: "/wordpress/wp-content/themes/HAT/getContent.php?url="+url,
				dataType: 'xml'
			})
			.done(function(data){
				result = data;
			    callback(result);	
			})
			.fail(function(result){
				log("get json error2");
			});
			
		};


		generateSandmannContent = function (source1,source2){
		  	
		  	// load content from further sandmann series
		  	var thumbnails = [];
		  	var videos = [];
			$(source2).find('media\\:content[medium="image"]').each(function(i,e){
				thumbnails.push($(e).attr('url'));
			});
			$(source2).find('media\\:content[width="960"]').each(function(i,e){
				videos.push($(e).attr('url'));
			});
			
			// load content from the daily sandmann series
		  	$thumbnail_source1 = $(source1).find('media\\:content[medium="image"]').attr('url');
		  	thumbnails.splice(1, 0, $thumbnail_source1);

			
			$video_source1 = $(source1).find('media\\:content[width="960"]').attr('url');
		  	videos.splice(1, 0, $video_source1);

			// var content_str =  '<div class="sandmann navigable">';

			var content_str = '';
			for(i=0;i<videos.length;i++){
				log(videos[i]);
				log(thumbnails[i]);
				var counter = i+1;
				var navi_class;
				switch (counter){
					case 1:
						navi_class = 'sandmann_left';
						break;
					case 2:
						navi_class = 'sandmann_middle';
						break;
					case 3:
						navi_class = 'sandmann_right';
						break;
					default:
						navi_class = 'hidden';
				}
				content_str += '<div id="sandmann_vid_'+counter+'" data-url="'+videos[i]+'" class="'+navi_class+'" style="background-image: url(http://'+thumbnails[i]+');"></div>';
			}
			$('#content .sandmann').html(content_str);

		};

		loadSandmannContent();
	</script>


<?php Hat_Utilities::get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer') ); ?>
