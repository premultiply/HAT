/*
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
*/

var $active;
var $generalNav;
var userFunctions = new Object();
var $startEl;

$(document).on('nav_init',function(){
	$startEl.activate();
}).ready(function(){
	$generalNav = $('body').eq(0);
	$startEl = $('.navigable').eq(0);
	//Keyboard events ------------------------------------------------------------------------------
	$(this).keydown(function(e){
		console.log('key pressed:'+e.keyCode);
		function navParent(key){
			function _navParent(_el){
				if (!_el || _el.length===0 || _el[0]===$generalNav[0]){
					$generalNav.nav(key);
					return false;
				} else if (_el.nav(key)===true){
					return false;
				} else if (_el.allowParentNav()===true){
					return true;
				} else {
					return false;
				}
			}
			var el = $active;
			while(_navParent(el)){
				el = el.parent();
			}
		}

		switch (e.keyCode){
			case VK_RIGHT:
			e.preventDefault();
			navParent('right');
			break;
			case VK_LEFT:
			e.preventDefault();1
			navParent('left');
			break;
			case VK_DOWN:
			e.preventDefault();
			navParent('down');
			break;
			case VK_UP:
			e.preventDefault();
			navParent('up');
			break;
			case VK_ENTER: 
			e.preventDefault();
			navParent('enter');
			break;
			case VK_PLAY:
			e.preventDefault();
			if($("#videoplayer")){
				vid_obj = $('#videoplayer')[0];
				if (vid_obj) vid_obj.play(1);
			}
			break;
			case VK_PAUSE:
			e.preventDefault();
			if($("#videoplayer")){
				vid_obj = $('#videoplayer')[0];
				if (vid_obj) vid_obj.play(0);
			}
			break;
			case VK_STOP:
			e.preventDefault();
			if($("#videoplayer")){
				vid_obj = $('#videoplayer')[0];
				if (vid_obj){
				}
				vid_obj.seek(0);
				vid_obj.play(0);
			}
			break;
			case VK_0:
			e.preventDefault();
			navParent('0');
			break;
			case VK_1:
			e.preventDefault();
			navParent('1');
			break;
			case VK_2:
			e.preventDefault();
			navParent('2');
			break;
			case VK_3:
			e.preventDefault();
			navParent('3');
			break;
			case VK_4:
			e.preventDefault();
			navParent('4');
			break;
			case VK_5:
			e.preventDefault();
			navParent('5');
			break;
			case VK_6:
			e.preventDefault();
			navParent('6');
			break;
			case VK_7:
			e.preventDefault();
			navParent('7');
			break;
			case VK_8:
			e.preventDefault();
			navParent('8');
			break;
			case VK_9:
			e.preventDefault();
			navParent('9');
			break;
			case VK_GREEN:
			navParent('Green');
			break;
			case VK_BLUE:
			navParent('Blue');
			break;
			case VK_YELLOW:
			navParent('Yellow');
			break;
			case VK_RED:
			navParent('Red');
			break;
		}
	});
})

//Navigation Functions
$.fn.extend({
	activate: function(func) {
		if (func){
			return this.on('activate',func);
		} else {

			if (!this.length && this[0]!==$('.navigable')[0]) {
				$('.navigable').activate();
				return false;
			}
			if ($active && $active.length){
				if (this[0] === $active[0] && this.hasClass('active')) {
					return false;
				}
			}
			if ($active && $active.autoDestroy()) $active.destroy();
			var first = this.eq(0);
			first.addClass('active');
			var $last = $active;
			$active = first;
			first.triggerHandler('activate');
			return this;
		}
	},
	autoDestroy: function(auto){
		if (auto === undefined){
			if (this.data('autoD') === undefined){
				return true;
			} 
			return this.data('autoD');
		} else {
			this.data('autoD',auto);
			return this;
		}
	},
	allowParentNav: function(allowParNav){
		if (allowParNav === undefined){
			if (this.data('allowParNav') === undefined){
				return true;
			} 
			return this.data('allowParNav');
		} else {
			this.data('allowParNav',allowParNav);
			return this;
		}
	},
	delegateNavToParent: function(){
		this.data('delP',true);
	},
	destroy: function(func) {
		if (func) {
			return this.on('destroy',func);
		} else {
			if (this.hasClass('active')){
				this.removeClass('active');
				if($active) $active.removeClass('active');
			}
			var that = this;
			this.triggerHandler('destroy');
			return that;
		}
	},
	navUp: function(func) {
		return this.nav('up',func);
	},
	navDown: function(func) {
		return this.nav('down',func);
	},
	navLeft: function(func) {
		return this.nav('left',func);
	},

	navRight: function(func) {
		return this.nav('right',func);
	},
	navEnter: function(func) {
		return this.nav('enter',func);
	},
	nav: function(num,func) {
		if (func){
			this.data('nav-'+num,true);
			return this.on('nav-'+num,func);
		} else {
			var isDef = this.data('nav-'+num);
			if (isDef) {
				this.eq(0).triggerHandler('nav-'+num);
			}
			var delP = this.data('delP');
			if (delP) this.data('delP',false);
			return isDef && !delP;
		}
	},

}); 

const _VIDEO_STOPPED = 0;
const _VIDEO_PLAYING = 1;
const _VIDEO_PAUSED = 2;
const _VIDEO_CONNECTING = 3;
const _VIDEO_BUFFERING = 4;
const _VIDEO_FINISHED = 5;
const _VIDEO_ERROR = 6;

playControl = function() {
	try {
		var state = $("#videoplayer")[0].playState;
		switch (state) {
			case _VIDEO_PLAYING:
			break;
			case _VIDEO_ERROR:
			break;
			case _VIDEO_FINISHED:
			$('#videoplayer')[0].seek(0);
			$('#videoplayer')[0].play(1);
			break;
			default:
			return;
		}
	} catch(ex) {
			//log('video::playControl caught: '+ex);
		}
	};

	toggleArrows = function (direction){
		if (direction == 'down' && $("#popup .textContent").scrollTop() != 0){
			$('#popup .arrowup').show();
			if ($("#popup .textContent").outerHeight()+$("#popup .textContent").scrollTop() >= $("#popup .textContent")[0].scrollHeight){
				$('#popup .arrowdown').hide();
			}
		}
		if (direction == 'up'){
			if ($("#popup .textContent").scrollTop() == 0) {
				$('#popup .arrowup').hide();
			}
			if ($("#popup .textContent").outerHeight()+$("#popup .textContent").scrollTop() <= $("#popup .textContent").outerHeight()){
				$('#popup .arrowdown').show();
			}
		}
	};


// debug functions
println = function (target, line, unescaped) {
	var html = $(target).html();
	$(target)[unescaped ? 'html' : 'text'](line);	// escape text
	$(target).html($(target).html()+'<br/>'+html);
};

log = function (msg, unescaped) {
	println('#debug', msg, unescaped);
	if(typeof console == 'object'){
		console.log(msg);
	}
};

printlnr = function (target, line, unescaped) {	
	var html = $(target).html();
	$(target)[unescaped ? 'html' : 'text'](line);	// escape text
	$(target).html(html+$(target).html()+'<br/>');
};
// end debug functions

