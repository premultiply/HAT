var Hbb;

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

function initialize() {
	hbbtvlib_initialize();
	hbbtvlib_show();
	Hbb = new Hbb();
	Hbb.registerKeyEventListener();
	Hbb.prepareContent(Hbb.loadPreset(Hbb.templateURL));
};

function Hbb() {
	/* space for the defintion of variables */
	log("id: " + $.urlParam("id"));
	if ($.urlParam("id") == null) {
		this.templateURL = "/api/apps/last";
	}else{
		this.templateURL = "/api/apps/" + $.urlParam("id");
	}
	log(this.templateURL);
	this.data = "";
	this.activeTemplate ="";
	this.activeElement = "";
	this.activeMenu = "";
	this.activePageTitle = "startScreen";
	this.tracking = true;
};

Hbb.prototype.loadPreset = function(presetURL) {
	var result;
	$.ajax({
		type: "GET",
		url: presetURL,
		async: false,
		dataType: "json"
	})
	.done(function(data){
		result = data;
		result.data = JSON.parse(data.data);
		return result;
	})
	.fail(function(result){
		log("get json error");
	});
	
	// var result = JSON.parse('{"_id":"544da75a2bcca1742c34d073","data":{"app":{"title":"","logoUrl":"","backgroundImage":"/assets/bgr_mauer3.png","colorPattern":"mauer","secondScreen":"false"},"pages":{"landingPage":{"layout":"template_1","title":"","shorttitle":"","content":{"t1_container1":{"type":"broadcast","navigable":"false"},"t1_container2":{"type":"scribble","title":"Live-Blog","id":"804655","navigable":"true"}}}}},"title":"","__v":0,"alterationDate":"2014-10-29T06:48:28.814Z","creationDate":"2014-10-27T02:00:58.543Z"}');
	
	return result;
};

/* inital call for HbbTV App landingpage */
Hbb.prototype.prepareContent = function(json) {
 	var that = this;
 	log(json);
 	if (typeof json != 'undefined') {
	 	this.data = json.data;
	 	log(this.data);
		var currentPage = this.data.pages.landingPage;
	 	var app = this.data.app;
	 	this.setGeneralSettings(app.title, app.logoUrl, app.backgroundImage, app.colorPattern);
	 	this.setPageSettings(currentPage.title, currentPage.layout, currentPage.content);

	/*   	for (var key in currentPage.content){
	   		this.bindModul(key, currentPage.content[key]);
	   	}*/
	   	this.setActiveElement();
	   	/* ckecks if a menu is needed */
	   	var count = 0;
	   	for(key in currentPage.mainpages) {
  			if(currentPage.mainpages.hasOwnProperty(key)) {
    			count++;
  			}
		}
		if (count >= 1) this.createMenu(count);
		// check if secondScreen feature is enabled
		if (this.data.app.secondScreen == "true") $('#button6').show();
	}
};

// get active div of current template to extract the data-type and set activeElement
Hbb.prototype.setActiveElement = function (){
	
	this.activeElement = $('#content .'+this.activeTemplate).find('.active').data('type');
	log('active element: '+this.activeElement);
	log('active Template: '+this.activeTemplate);
	// remove focus in scribbleLive module
	menu.setActive(this.activeElement == "scribbleLive");
//	if (this.activeElement != "scribbleLive"){
//		$('.focus').removeClass('focus');
//		menu.setActive(false);
//	}
//	if (this.activeElement == "scribbleLive"){
//		menu.setActive(true);
//		$('.focus').removeClass('focus');
//		$('.menu-headline .contentHeader').addClass('active');
		//$('#main-menu > div .menu_ul').addClass('active');
//		menu._setFocusTo(0); 
//	}
	if (this.activeElement == "text" || "image" || "galleryPreview") {
		var container = $('#content .'+this.activeTemplate).find('.active');
		$(container).children().addClass('active');
	}
};

/* sets general settings like AppTitle, logo and colorScheme (at the moment only Bgcolor) */
Hbb.prototype.setGeneralSettings = function (title, logo, bgimgURL, pattern){
	$('#title').html(title);
	if (logo != "")
		$('#logo').css("background-image", "url("+logo+")");
	$('#hbbtv_app').css('background-image', 'url(' + bgimgURL + ')');
	log('pattern is: '+pattern);
	$('#safe_area').removeClass().addClass(pattern);
	$('#popupFullImage').addClass(pattern);
};

/* sets settings refered to the current page, e.g. pageTitel, layout */
Hbb.prototype.setPageSettings = function (pagetitle, layout, content){
	$('#pagetitle').html(pagetitle);
	this.setLayout(layout, content);
};

/* binds the corresponding modul to the target div */
Hbb.prototype.bindModul = function (target, data) {
	//log('ACTIVE: '+this.activeTemplate);
	try{
		switch (data.type){
			case "textbox":
				// CALLS MODUL TEXT
				log('Bind Modul: Text');
				this.bindTextBox(target, data.headline, data.text);
				break;
			case "broadcast":
				// CALLS MODUL BROADCAST
				log('Bind Modul: Broadcast');
				this.bindBroadcast(target);
				break;
			case "scribble":
				// CALLS MODUL SCRIBBLELIVE
				log('Bind Modul: ScribbleLive');
				this.bindScribbleLive(target, data.id, data.title);
				break;
			case "image":
				// CALLS MODUL IMAGE
				log('Bind Modul: Image');
				this.bindImageBox(target, data.headline, data.imageUrl, data.description);
				break;
			case "video":
				// CALLS MODUL VIDEO
				log('Bind Modul: Video');
				this.bindVideo(target, data.url);
				break;
			case "gallery":
				// CALLS MODUL Gallery
				log('Bind Modul: Gallery');
				//this.bindVideo(target, data.url);
				this.bindGalleryBox(target, data.headline, data.thumbnailurl, data.items);
				break;
			default:
				return false;
		}
	}catch(error){
		log("bindModul ERROR: "+error.message);
	}
};

Hbb.prototype.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// jumps between navigable elements of the current template
Hbb.prototype.jump = function (direction) {
	log("Function jump into direction: "+direction);
	var currentPos = $('#content .'+this.activeTemplate).find('.active');
	log(currentPos);
	if (direction == "left") var newPosition = currentPos.prevAll('.navigable:first').addClass('active');
	
	if (direction == "right") var newPosition = currentPos.nextAll('.navigable:first').addClass('active');
	
	if (newPosition.length) $(currentPos).removeClass('active');
	this.setActiveElement();
};

// handles the switch between moduleKeyhandlers and the globalKeyhandler - if the module specific handler does not define the current keyevent the global keyhandler is called
Hbb.prototype.registerKeyEventListener = function () {
	var that = this;
	document.addEventListener("keydown", function(e) {	

		if(e.keyCode == VK_RED || e.keyCode == VK_YELLOW || e.keyCode == VK_BLUE || e.keyCode == VK_GREEN || e.keyCode == VK_0){
			log('RED, GREEN, BLUE, YELLOW or 0  ->  global keyhandler');
			if (that.handleKeyCode(e.keyCode, e)) e.preventDefault();
		}
		else if (that.activeElement == "text" && that.textKeyCode(e.keyCode, e)) {
			return;
		}
		else if (that.activeElement == "image" && that.imageKeyCode(e.keyCode, e)) {
			return;
		}
		else if (that.activeElement == "menu" && that.menuKeyCode(e.keyCode, e)) {
			return;
		}
		else if (that.activeElement == "video" && that.videoKeyCode(e.keyCode, e)) {
			return;
		}
		else if (that.activeElement == "scribbleLive" && that.scribbleLiveKeyCode(e.keyCode, e)) {
			return;
		}
		else if (that.activeElement == "galleryPreview" && that.galleryPKeyCode(e.keyCode, e)) {
			return;
		}
		else if (that.activeElement == "gallery" && that.galleryKeyCode(e.keyCode, e)) {
			return;
		}
		else if (that.activeElement == "popup" && that.popupKeyCode(e.keyCode, e)) {
			return;
		}
		else {
			log('search in global keyhandler');
			if (that.handleKeyCode(e.keyCode, e)) e.preventDefault();
		}
	}, false);
};

var appActive = true;
Hbb.prototype.onRed = function(){
	if (appActive){
		$('#broadcast').remove();
		hbbtvlib_hide();
		appActive = false;
		if(Hbb.tracking){
			_paq.push(['trackPageView', 'leaveAusblenden']);
		}
	} else{
		this.bindBroadcast('t1_container1');
		hbbtvlib_show()
		appActive = true;
		if(Hbb.tracking){
			_paq.push(['trackPageView', Hbb.activePageTitle]);
		}
	}
};


Hbb.prototype.handleKeyCode = function (keyCode) {
	log("Hbb.handleKeyDown(" + keyCode + ")");

	var that = this;
	switch (keyCode) {
	case VK_LEFT:
		//this.kEvent = 'left';
		log('Global Keyhandler  - Key Left')
		this.jump('left');
		break;
	case VK_RIGHT:
		//this.kEvent = 'right';
		this.jump('right');
		break;
	case VK_UP:
		//this.kEvent = 'up';
		//break;
	case VK_DOWN:
		//this.kEvent = 'down';
		//break;
	case VK_ENTER:
		//this.kEvent = 'enter';
		//break;
	case VK_BACK:
		log("KeyCode: ", keyCode);
		//this.kEvent = 'return';
		break;
	case VK_PLAY:
		log("KeyCode: ", keyCode);
		vid_obj = $('#videoplayer')[0];
		if (vid_obj) vid_obj.play(1);
		break;
	case VK_PAUSE:
		log("KeyCode: ", keyCode);
		vid_obj = $('#videoplayer')[0];
		if (vid_obj) vid_obj.play(0);
		break;
	case VK_STOP:
		log("KeyCode: ", keyCode);
		vid_obj = $('#videoplayer')[0];
		if (vid_obj){
			vid_obj.seek(0);
			vid_obj.play(0);
		}
		break;
	case VK_0:
		if(Hbb.tracking){
			_paq.push(['trackPageView', 'leaveStartleiste']);
		}
		startRbbAitApplication("13.1");
		break;
	case VK_1:
		if(Hbb.tracking){
			_paq.push(['trackPageView', 'privacy']);
		}
		this.showPopup("privacy");
		break;
	case VK_2:
		if(Hbb.tracking){
			_paq.push(['trackPageView', 'imprint']);
		}
		this.showPopup("imprint");
		break;
	case VK_5:
		//that.toggleMenu();
		break;
	case VK_9:
		if($('#debug').css("visibility") == "hidden"){
			$('#debug').css("visibility", "visible");
		}else{
			$('#debug').css("visibility", "hidden");
		}
		break;
	case VK_BLUE:
		if(Hbb.tracking){
			_paq.push(['trackPageView', 'leaveText']);
		}
		startRbbAitApplication("13.17");
		break;
	case VK_YELLOW:
		if(Hbb.tracking){
			_paq.push(['trackPageView', 'leaveMediathek']);
		}
		startRbbAitApplication("13.18");
		break;
	case VK_GREEN:
		if(Hbb.tracking){
			_paq.push(['trackPageView', 'leaveEPG']);
		}
		startRbbAitApplication("13.2");
		break;
	case VK_RED:
		this.onRed();
		break;
	default:
		//this.kEvent = '';
		log("handle default key event, key code(" + keyCode + ")");
		return false;

	}
	return true;
};

startRbbAitApplication = function(appID){
	log("startAITapp");
	try { 
		// var mgr = document.getElementById("appmgr");
		var mgr = int_objs[int_objTypes.appMan];
		var app = mgr.getOwnerApplication(document);
		log("dvb://current.ait/"+ appID +"?autoshow=1");
		if (app.createApplication("dvb://current.ait/"+ appID +"?autoshow=1", false)) {
			app.destroyApplication();
			return; 
		} 
	} catch (e) {}
};

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null){
	   return null;
	}
	else{
	   return results[1] || 0;
	}
};

