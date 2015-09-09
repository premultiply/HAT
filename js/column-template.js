$(document).ready(function(){
	//Content Boxes ------------------------------------------------------------------------------
	$generalNav = $('body');
	$startEl = $('.navigable').eq(0);
	$('.navigable').navLeft(function(){
		var prev = $(this).prev('.navigable');
		if (!prev.length){
			prev = $(this).prevUntil('.navigable').prev()
			prev.length && prev.activate();
		} else {
			prev.activate();
		}
	}).navRight(function(){
		var next = $(this).next('.navigable');
		if (!next.length){
			next = $(this).nextUntil('.navigable').next()
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
	$('.navigable[data-type="image"]').navEnter(function(){
		var content = $(this).children().eq(1);
		if(!content.hasClass('fullscreen')){
			content.addClass('fullscreen');
		} else {
			content.removeClass('fullscreen');
		}
	}).activate(function(){
		$(this).append($('<div class="fullscreen-banner">Press OK for Fullscreen</div>'));
	}).destroy(function(){
		$(this).find('.fullscreen-banner').remove();
	});

	//Video Box
	$('.navigable[data-type="video"]').navEnter(function(){
		var content = $('#videoplayer')
		if(!content.hasClass('fullscreen')){
			content.addClass('fullscreen');
			canNavigate=false;
		} else {
			content.removeClass('fullscreen');
			canNavigate=true;
		}
	}).activate(function(){
		$(this).append($('<div class="fullscreen-banner" style="top:-51px!important;">Press OK for Fullscreen</div>'));
	}).destroy(function(){
		$(this).find('.fullscreen-banner').remove();
	});
	$(this).trigger('nav_init');
});


