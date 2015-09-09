

$(document).ready(function(){
	var cur_item;
	var info_view = false;
	//GALLERY---------------------------------------------------------------------------------------
	$('.gallery-item').activate(function(){
		$('#description').html('');
		$('#item-title').html('');
		$('#description-wrapper').hide();
		info_view = false;
		api.getGalleryItemInfo($(this).attr('item-id'),function(item){
			cur_item = item;
			if (!info_view){
				var trailer = document.getElementById('trailer-player');
				if (trailer) {
					trailer.pause();
					delete trailer;
					$(trailer).remove();
				}
				$('#item-info-trailer').empty().html("<object id='trailer-player' type='video/mp4' data='"+item.trailer_url+"'></object>").show();
				window.setTimeout( function() { if($('#trailer-player')){vid_obj = $('#trailer-player')[0]; if (vid_obj) vid_obj.play(1); } }, 10);
			}
		},function(){
			$('#description').html("Could not find the ressource");
		});
		var list = $('#gallery-item-list');
		list[0].scrollTop = $(this).position().top-list.height()/2+$(this).height()/2+parseInt($(this).css('margin-top'));
	}).destroy(function(){
		var trailer = document.getElementById('trailer-player');
		if (trailer) trailer.stop();
		if (trailer) $(trailer).remove();
	}).navEnter(function(){
		info_view = true;
		$('#description').html(cur_item.info).parent().show();
		$('#item-title').html(cur_item.title);
		var trailer = document.getElementById('trailer-player').stop();
		$(trailer).remove();
		$('#item-info-trailer').hide();
	}).navUp(function(){
		var prev = $(this).prev('.gallery-item');
		if (prev.length){
			$(this).destroy();
			prev.activate();
		}
	}).navDown(function(){
		var next = $(this).next('.gallery-item');
		if (next.length){
			$(this).destroy();
			next.activate();
		}
	});
	$(this).trigger('nav_init');
});