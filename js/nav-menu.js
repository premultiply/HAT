var userFunctions = new Object();
$(document).ready(function(){
			//Primary Menu
	var $menuActive;
	$('div#menu-toggle').activate(function () {
		$(this).addClass('primary-menu');
		$('#primary-menu-wrap').show();
		//$('.menuText').html('Close Menu');
		$('#primary-menu-wrap li').activate();
	}).destroy(function(){
		$(this).removeClass('primary-menu');
		$('#primary-menu-wrap').hide();
		//$('.menuText').html('Menu');
		$startEl.activate();
	}).autoDestroy(false);

	$('#primary-menu-wrap li').navUp(function(){
		var prev = $(this).prev();
		if(prev.length) prev.activate();
	}).navDown(function(){
		var next = $(this).next();
		if(next.length) next.activate();
	});
	// Popup
	$('#popup').activate(function(){
		$(this).show();
		$('#overlay').show();
		setTimeout(function(){
			var text = $("#popup .textContent");
			if (text.length && text[0].scrollHeight > 510){
				$('#popup .arrowdown').show();
			}
		}, 500);
	}).destroy(function(){
		$(this).html('');
		$(this).hide();
		$('#overlay').hide();
		$startEl.activate();
	}).navEnter(function(){
		$(this).destroy();
	}).navDown(function(){
		var text = $(this).find(".textContent");
		if (text.length) text[0].scrollTop += 20;
		toggleArrows("down");
	}).navUp(function(){
		var text = $(this).find(".textContent");
		if (text.length) text[0].scrollTop -= 20;
		toggleArrows("up");
	}).autoDestroy(false).allowParentNav(false);

	$('.menu-item-object-page').navEnter(function(){
		window.location = $(this).find('p').eq(0).attr('href');
		$('div#menu-toggle').destroy();
	});

	$('.menu-item-object-hat_popup').navEnter(function(){
		var link = $(this).find('p').eq(0).attr('href');
		$('div#menu-toggle').destroy();
		$('#popup').load(link,function(){
			$(this).activate();
		});
	});

	$('.menu-item-object-hat_function').navEnter(function(){
		var id = $(this).attr('object-id');
		if (id && userFunctions['func'+id]){
			userFunctions['func'+id]();
		}
		//$('div#menu-toggle').destroy();
	});
	var appActive = true;
	$generalNav.nav("Red", function(){
		if (appActive){
			if($("[data-type=video]")){
				if($('#videoplayer')){
					vid_obj = $('#videoplayer')[0]; 
					if (vid_obj && vid_obj.stop) 
						vid_obj.stop();
				}
			}
			$('#broadcast').remove();
			hbbtvlib_hide();
			appActive = false;
		} else{
			if($("[data-type=video]")){
				if($('#videoplayer')){
					vid_obj = $('#videoplayer')[0]; 
					if (vid_obj && vid_obj.play) 
						vid_obj.play(1);
				}
			}
			if($("[data-type=broadcast]").length){
				$("[data-type=broadcast]").empty().html("<object id='broadcast' type='video/broadcast' height='100%' width='100%'></object><script type='text/javascript'>window.setTimeout( function() { $('#broadcast')[0].bindToCurrentChannel(); }, 10); </script>");
			}
			hbbtvlib_show();
			appActive = true;
		}
	});
})