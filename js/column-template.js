$(document).ready(function(){
	//Content Boxes ------------------------------------------------------------------------------
	$generalNav = $('body');
	$startEl = $('.navigable').eq(0);
	$('.navigable').navLeft(function(){
		var prev = $(this).prev('.navigable');
		if (!prev.length){
			prev = $(this).prevUntil('.navigable').prev();
			prev.length && prev.activate();
		} else {
			prev.activate();
		}
	}).navRight(function(){
		var next = $(this).next('.navigable');
		if (!next.length){
			next = $(this).nextUntil('.navigable').next();
			next.length && next.activate();
		} else {
			next.activate();
		}
	});

	//Text Box 
	$('.navigable[data-type="text"]').navUp(function(){
		$(this).children()[1].scrollTop-=20;			
	}).navDown(function(){
		$(this).children()[1].scrollTop+=20;
	});

	//Scribble Box
	$('.navigable[data-type="scribble"]').navUp(function(){
		scribble.scroll(-1);			
	}).navDown(function(){
		scribble.scroll(1);
	}).navEnter(function(){
		scribble.onOk();
	});

	//Image Box
	var fullscreen = false;
	$('.navigable[data-type="image"]').activate(function(){
		$(this).append($('<div style="z-index: 1" class="fullscreen-banner">Press OK for Fullscreen</div>'));
		$(this).autoDestroy(false);
		$(this).find('.img-row').find('.img-wrap').activate();
		$(this).autoDestroy(true);
		var imgs = $(this).find('.img-wrap');
		imgs.first().addClass('first-img');
		imgs.last().addClass('last-img');
	}).destroy(function(){
		$(this).find('.fullscreen-banner, .img-select').remove();
	}).find('.img-wrap').activate(function(){
		if (fullscreen){
			$(this).addClass('fullscreen');
			if ($(this).hasClass('first-img')) {
				$('#arrows-h .arrowleft').hide();
			} else {
				$('#arrows-h .arrowleft').show();
			}
			if ($(this).hasClass('last-img')) {
				$('#arrows-h .arrowright').hide();
			} else {
				$('#arrows-h .arrowright').show();
			}
		} else {
			$(this).prepend('<div class="img-select"></div>');
			$(this).parent().parent()[0].scrollTop += $(this).parent().position().top;
		}
	}).destroy(function(){
		$(this).removeClass('fullscreen').find('.img-select').remove();
	}).navRight(function(){
		if (fullscreen) {
			var next = $(this).next();
			if (next.length) {
				next.activate();
			} else {
				next = $(this).parent().next();
				if (next.length){
					next.children().first().activate();
				}
			}
		} else {
			var next = $(this).next();
			if (next.length){
				next.activate();
			} else {
				$(this).parent().parent().parent().destroy();
				$(this).destroy().delegateNavToParent();
			}
		}
	}).navLeft(function(){
		if (fullscreen) {
			var prev = $(this).prev();
			if (prev.length) {
				prev.activate();
			} else {
				prev = $(this).parent().prev();
				if (prev.length){
					prev.children().last().activate();
				}
			}
		} else {
			var prev = $(this).prev();
			if (prev.length){
				prev.activate();
			} else {
				$(this).parent().parent().parent().destroy();
				$(this).destroy().delegateNavToParent();
			}
		}
	}).navUp(function(){
		if (!fullscreen){
			var prev = $(this).parent().prev().find('.img-wrap').eq($(this).attr('column'));
			if (prev.length){
				prev.activate();
			}
		}
	}).navDown(function(){
		if (!fullscreen){
			var next = $(this).parent().next().find('.img-wrap').eq($(this).attr('column'));
			if (next.length){
				next.activate();
			}
		}
	}).navEnter(function(){
		if ($(this).hasClass('fullscreen')){
			$('#arrows-h').remove();
			$(this).children('.arrows').remove();
			$(this).removeClass('fullscreen');
			$(this).prepend('<div class="img-select"></div>');
			$(this).parent().parent()[0].scrollTop +=  $(this).parent().position().top;
			fullscreen=false;
		} else {
			$('body').append('<div id="arrows-h" class="arrows-h"><div class="arrow arrowleft"></div><div class="arrow arrowright"></div></div>');
			if ($(this).hasClass('first-img')) {
				$('#arrows-h .arrowleft').hide();
			}
			if ($(this).hasClass('last-img')) {
				$('#arrows-h .arrowright').hide();
			}
			$(this).addClass('fullscreen');
			$(this).find('.img-select').remove();
			fullscreen=true;
		}
	});

	//Video Box
	$('.navigable[data-type="video"]').navEnter(function(){
		var content = $('#videoplayer');
		if(!content.hasClass('fullscreen')){
			content.addClass('fullscreen');
		} else {
			content.removeClass('fullscreen');
		}
	}).activate(function(){
		$(this).append($('<div class="fullscreen-banner" style="top:-51px!important;">Press OK for Fullscreen</div>'));
	}).destroy(function(){
		$(this).find('.fullscreen-banner').remove();
	});
	$(this).trigger('nav_init');
});


