
function BroadcastOverlay(content, creator) {
	var /** {JSON} */ _content = null;
	var /** {string} */ _creator = null;
	var /** {HTMLObject */ _parent = null;
	var /** {HTMLELement} */ _activeElem = null;
	var /** {string} */ id = null;
	
	function _construct() {
		try {
			_content = content;
			_creator = creator;
			_parent = getBroadcastElement().parentNode;
			id = "broadcastOverlay";

			_createHTML();
			
			_activeElem = document.getElementById("CLOSE");
//			_setFocus(_activeElem);
		} catch (exc) {
			log(exc);
		}
	};
	
	/**
	 * interprets the scroll functionality for the focused element or opened "container"
	 * @param {integer} direction - the direction in which to scroll within the element (typical range[-1,1])
	 */
	this.scroll = function(direction) {	
		
	};
	
	this.onRight = function() {		
		this.close();
		return EnumType.CLOSE;
	};
	
	this.onLeft = function() {
		this.close();
		return EnumType.CLOSE;
	};

	/**
	 * interprets the onOk functionality for the focused element or opened "container"
	 */
	this.onOk = function() {
		this.close();
		return EnumType.CLOSE;
	};

	/**
	 * Closes/deletes the element.
	 * Deletes all the HTML elements except the parent
	 */
	this.close = function() {
		_parent.removeChild(document.getElementById(id));
	};
	
	getBroadcastElement = function() {
		var objects = document.getElementsByTagName("object");
		for(var i = 0; i < objects.length; i++) {
			if(objects[i].getAttribute("type") !== undefined && objects[i].getAttribute("type") !== null && objects[i].getAttribute("type").indexOf("video/") === 0) {
				return objects[i];
			}
		}


		return null;
	};
	
	_createHTML = function() {
		
		if(_content.Type == EnumType.IMAGE) {
			_createImageHTML();
		} else if(_content.Type == EnumType.TEXT) {
			_createTextHTML();
		}
	};
	
	
	/**
	 * <div class="" id="popupSmall" style="left: 0px; background-image: url(&quot;http://images.scribblelive.com/2014/10/10/518bfb7c-9e2a-475f-b78e-894bde580570.jpg&quot;);">
		 * <div id="popupSmallOverlay">
			 * <div class="popupSmallOverlayButton">Fullscreen</div>
			 * <div class="popupSmallOverlayButton active">Schlieﬂen</div>
			 * <div class="popupSmallOverlayBg"></div>
		 * </div>
	 * </div>
	 */
	_createImageHTML = function() {
		var overlay = document.createElement("div");
		overlay.id = id;
		overlay.className = "broadcastContainer";
		overlay.style.display = "none";
		overlay.style.backgroundImage="url('" + _content.Media.URL + "')";
		
		var main = document.createElement("div");
		main.id = id + "_container";
		main.className += " broadcastOverlay image";
		
		var html = 	"<div class='button focus'>Schlie&szlig;en</div>" +
					"<div class='background'>" + 
						"<div>"+ _content.Content.ClearedContent + "</div>" +
					"</div>";
		
		
		main.innerHTML = html;
		overlay.appendChild(main);
		_parent.appendChild(overlay);
		document.getElementById(id).style.display = "inherit";
	};
	
	_createTextHTML = function() {
		var main = document.createElement("div");
		main.id = id;
		main.className += " broadcastOverlay image";
		
		var html = 	"<div class='button focus'>Schlie&szlig;en</div>" +
					"<div class='background'>" +
						"<div>"+ _content.Content.ClearedContent + "</div>" +
					"</div>";
		
		
		main.innerHTML = html;
		_parent.appendChild(main);
		document.getElementById(id).style.display = "inherit";
		
		
//		var overlay = document.createElement("div");
//		overlay.id = id;
//		overlay.className = "broadcastContainer";
//		overlay.style.display = "none";
//		
//		var tranparent = document.createElement("div");
//		tranparent.className += " transparency";
//		tranparent.id = id + "_background";
//		overlay.appendChild(tranparent);		
//		
//		var main = document.createElement("div");
//		
//		main.id = id + "_container";
//		main.className += " broadcastOverlay text";
//		
//		var html = 
//			'<li id="image-creator" class="creator"> ' + _content.Creator.Name + ' </li>' + 
//			'<li id="image-content" class="content"> ' + _content.Content.ClearedContent + ' </li>' +  
//			'<li>' + 
//				'<div class="button focus">Schlie&szlig;en</div>' + 
//			'</li>';
//		main.innerHTML = html;
//		
//		overlay.appendChild(main);
//		
//		_parent.appendChild(overlay);
//		zoom = true;				
//		
//		document.getElementById(id).style.display = "inherit";
	};
	
	_construct();
}var EnumType = {TEXT:"TEXT", IMAGE:"IMAGE", POLL:"POLL", CLOSE:"CLOSE"};function flexMenu(parent, json) {
	
	/**
	 * Number of elements within the menu (visible and hidden)
	 */
	/** {int} */ this.lenght = 0;	
	var /** {HTMLELement} */ _parent = parent;	
	var /** {JSON} */ _json = json;
	var /** {MenuElementFactory} */ _elementFactory = MenuElementFactory.instanceOf();
	var /** {HTMLELement} */ _activeElem = null;
	var /** {int} */ _activeIndex = null;	
	var /** {Array<HTMLELement>} */ _menuItems = null;
	var /** {IScrollable} */ _subMenu = null;
	var /** {string} */ id = _parent.id + "-main-menu";
	
	
	/** 
	 * IMAGES
	 */
	var _verlaufFocus = "";
	var _verlaufLight = "";
	var _verlaufDark = "";
	
	
	/**
	 * TRACKING
	 */
	var upValue = 0;
	var downValue = 0;
	
	/**
	 * constructor
	 */
	function _construct() {
//		log(_json);
		_activeIndex = 0;
		
		//create blog
		_createHTML();
		//set all variables
		_menuItems = parent.getElementsByTagName("li");
				
		this.lenght = _menuItems.lenght;
		//set visible focus
		_activeElem = _menuItems[_activeIndex];
		_setFocus(_activeElem);
	};
	
	this.refresh = function(json) {
		try {
//			log("refresh within Blog started");
			if(_subMenu !== null) {
				_subMenu.refresh();
			}


			var numberOfNewElements = _getNumberOfNewPosts(_json, json);
//			log("loading " + numberOfNewElements + " new posts and updating timeago information");
			_json = json;

			document.getElementById(id).innerHTML = _getBodyContent();
			_menuItems = parent.getElementsByTagName("li");			
			this.lenght = _menuItems.lenght;
//			_activeElem = _menuItems[_activeIndex];
//			log("refreshing blog complete, setting new focus");

			if((_activeIndex == 0 && _subMenu == null) || (_activeIndex >= _menuItems.length - 1 && _subMenu == null)) {
				//if "old" first Element was focused, jump to new first Element
				//OR if last element was focused and there are new elements to display
//				log("reset focus from old first element, to new first element");
				_activeIndex = 0;			
				_activeElem = _menuItems[_activeIndex];

				for(var i = 0; i < _menuItems.length ; i++) {
					_menuItems[i].style.display = "inherit";
				}

				_setFocus(_activeElem);	
			} else {
//				log("reset focus: " + numberOfNewElements + " new elements");
				this._setFocusTo(_activeIndex + numberOfNewElements, this);	
			}
		} catch (exc) {
			log("exception while refreshing blog: " + exc);
		}
	};
	
	_getNumberOfNewPosts = function(oldJson, newJson) {	
		var counter;
		for(counter = 0; newJson.Posts[counter].Created.UTC > oldJson.Posts[0].Created.UTC; counter++) {
			
		}		
		return counter;
	};
	
	this.setActive = function(flag) {
		if(_subMenu === null) {
			if(flag) {
				_activeElem = _menuItems[_activeIndex];
				_setFocus(_activeElem);
				_addClass(document.getElementById(_parent.id + "-menu-headline").firstChild, "active");
			} else {
				_removeClass(_activeElem, "focus");
				_removeClass(document.getElementById(_parent.id + "-menu-headline").firstChild, "active");
				_removeVerlauf(_activeElem);
			}
		} else {
			_subMenu.setActive(flag);
		}
	};

	/**
	 * interprets the scroll functionality for the focused element or opened "container"
	 * @param {integer} direction - the direction in which to scroll within the element (typical range[-1,1])
	 */
	this.scroll = function(direction) {

		
		
		
		if(_subMenu === null) {
			if(direction > 0) {
				downValue++;
			} else {
				upValue++;
			}			
			
			_focusNext(direction);
		} else {	
			_subMenu.scroll(direction);
		}
	};
	
	this.onRight = function(that) {
		if(_subMenu === null) {
			that.jump('right');
		} else {
			return _subMenu.onRight(that);
		}
	};
	
	this.onLeft = function(that) {
		if(_subMenu === null) {
			that.jump('left');
		} else {
			return _subMenu.onLeft(that);
		}
	};
	
	this._setFocusTo = function(index, that) {
		if(_subMenu === null || that == this) {
			
			_removeClass(_activeElem, "focus");
			
			if(_activeElem.scrollHeight > _activeElem.offsetHeight) {
				_activeElem.lastChild.style.display = "inherit";
				_activeElem.lastChild.src = _verlaufFocus;
			} else {
				_activeElem.lastChild.style.display = "none";
			}
			
			_activeIndex = index;
			_activeElem = _menuItems[_activeIndex];
			_setFocus(_activeElem);	
			
			if(index > 1) {
				_scroll();
			} 
			
		} else {
			_subMenu._setFocusTo(0);
		}
		
	};

	/**
	 * interprets the onOk functionality for the focused element or opened "container"
	 */
	this.onOk = function() {
		if(_activeElem.getAttribute("type") === EnumType.CLOSE) {
			this.close();
		} else if(_subMenu === null) {
			_subMenu = _elementFactory.create(_activeElem.getAttribute("type"), getActiveJson(), _activeElem.getAttribute("creator"), id);
			document.getElementById("arrows").style.display = "none";
			
			//TODO check whether correct
			// if(Hbb.tracking){
			// 	_paq.push(['trackEvent', 'ScribbleActions', 'scribbleBlog', 'UP', upValue ]);
			// 	_paq.push(['trackEvent', 'ScribbleActions', 'scribbleBlog', 'DOWN', downValue ]);
			// 	_paq.push(['trackPageView', 'scribbleDetails']);
			// }
			// Hbb.activePageTitle = 'scribbleDetails';
			upValue = 0;
			downValue = 0;
		} else {
			//navigation within submenu
			var flag = _subMenu.onOk();
			if(flag === EnumType.CLOSE) {
				_elementFactory.deleteAssociatedElement(id);
				_subMenu = null;
				log("sub was closed");
				document.getElementById("arrows").style.display = "inherit";
				
				//submenu was closed, send tracking counter and reset
				// if(Hbb.tracking){
				// 	_paq.push(['trackEvent', 'ScribbleActions', 'scribbleDetails', 'UP', upValue ]);
				// 	_paq.push(['trackEvent', 'ScribbleActions', 'scribbleDetails', 'DOWN', downValue ]);
				// 	_paq.push(['trackPageView', 'scribbleBlog']);
				// }
				// Hbb.activePageTitle = 'scribbleBlog';	
				upValue = 0;
				downValue = 0;
			} else if(flag === "PREV") {
				_elementFactory.deleteAssociatedElement(id);
				
				_focusNext(-1);
				
				_subMenu = _elementFactory.create(_activeElem.getAttribute("type"), getActiveJson(), _activeElem.getAttribute("creator"), id);
				_subMenu._setFocusTo(2);
				
				//track up in submenu
				upValue++;
			} else if(flag === "NEXT") {
				_elementFactory.deleteAssociatedElement(id);
				
				_focusNext(1);
				
				_subMenu = _elementFactory.create(_activeElem.getAttribute("type"), getActiveJson(), _activeElem.getAttribute("creator"), id);
				_subMenu._setFocusTo(3);
				
				//track up in submenu
				downValue++;				
			} else if(Hbb.activePageTitle == 'scribbleOverlay'){
				// if(Hbb.tracking){
				// 	_paq.push(['trackEvent', 'ScribbleActions', 'scribbleDetails', 'UP', upValue ]);
				// 	_paq.push(['trackEvent', 'ScribbleActions', 'scribbleDetails', 'DOWN', downValue ]);
				// }
				// upValue = 0;
				// downValue = 0;
			}
		}
	};
	
	this.setHeadline = function(headline) {
		document.getElementById(_parent.id + "-menu-headline").firstChild.insertBefore(document.createTextNode(headline), document.getElementById(_parent.id + "-menu-headline").firstChild.firstChild);
		
	};
	
	var getActiveJson = function() {
		var posts = _json.Posts;
		for(var i = 0; i < posts.length; i++) {
			//find active JSON element
			if(_activeElem.id.indexOf(_json.Posts[i].Id) > 0) {
				return _json.Posts[i];
			}
		}	
	};


	/**
	 * Closes/deletes the element.
	 * Deletes all the HTML elements except the parent
	 */
	this.close = function() {
		if(_subMenu === null) {

		} else {
			_subMenu.close();
			_subMenu = null;
		}		
	};
	

	this.getParent = function() {
		return _parent;
	};
	
	/**
	 * sets the focus within the HTML and in the JS logic and will scroll if necessary 
	 */
	var _focusNext = function(direction) {
		for(var i = 0; i < _menuItems.length; i++) {
			if(_menuItems[i] == _activeElem && (_menuItems.length-direction) > i && i + direction >= 0 && (i + direction) < _menuItems.length) {
				//if i equals the active element
				//and there is another element in the given direction 

				//remove last focus
				_removeClass(_activeElem, "focus");
				_removeVerlauf(_activeElem);

				_activeIndex = _activeIndex + direction;

				_activeElem = _menuItems[_activeIndex];
				//set new focus
				_setFocus(_activeElem);

				if(_activeIndex < (_menuItems.length)) {
//					if any element but the last three is focused
					_scroll(direction);

				} else {

				}
				
				if(_activeIndex > 0 && _activeIndex < _menuItems.length - 1) {
//						log("show both arrows");
					document.getElementById("arrowUp").style.display = "inherit";
					document.getElementById("arrowDown").style.display = "inherit";
//						_addClass(document.getElementsByTagName("ul")[0], "arrow_up arrow_down");
				} else if (_activeIndex == _menuItems.length - 1){
//						log("show top arrow");
					document.getElementById("arrowUp").style.display = "inherit";
					document.getElementById("arrowDown").style.display = "none";
//						_addClass(document.getElementsByTagName("ul")[0], "arrow_up");
				} else if (_activeIndex == 0){
//						log("show bottom arrow");
					document.getElementById("arrowUp").style.display = "none";
					document.getElementById("arrowDown").style.display = "inherit";
//						_addClass(document.getElementsByTagName("ul")[0], "arrow_down");
				} else {
//						log("an unknown error has occured");
				}


				return;
			}
		}
	};
	
	/**
	 * Will scroll within the menu in the given direction [-1;+1]
	 * @param {Integer} direction
	 */
	var _scroll = function() {
		for(var i = 0; i < _menuItems.length ; i++) {
			if(i < _activeIndex - 1) {
				_menuItems[i].style.display = "none";
			} else {
				_menuItems[i].style.display = "inherit";
			}
		}
	};
	
	
	/**
	 * Creates the full HTML structure within the _parent Element
	 */
	/*
	 	<div class="main-menu">
			
			<ul class="menu_ul">
						
				<li id="li_1" class="menu_li li_light focus">
					<div style="background: url('http://avatars.scribblelive.com/2013/2/25/67b4f4dd-bbb1-4bf2-a902-ef9e5143aa85.jpg') no-repeat scroll 16px 5px" id="post_127023564">
						<ul>
							<div>rbb Fernsehen</div>
							<div class="menu_li_datetime">15.9.2014 12:57:24</div>
							<div class="menu_li_subtext">1. Lorem Ipsum </div>
					</div>
					
				</li>
				
				<li id="li_2" class="menu_li li_dark">
					<div class="avatar">
						<ul class="type">
							<div>rbb Fernsehen</div>
							<div class="menu_li_datetime">15.9.2014 12:57:24</div>
							<img alt="" src="http://images.scribblelive.com/2014/2/24/94abeab4-b46f-44ab-8b20-c0563997bb81.jpg" class="image-inline"><img>
							<div class="menu_li_subtext">2. Lorem ipsum dolor sit amet, consetetur sadipscing elitr!</div>
						</ul>
					</div>
					<img alt="" src="img/verlauf_dark_full.png" class="verlauf"></img>
				</li>
				
			</ul>
			
		</div>
	 */
	var _createHTML = function() {
		//delete existing content
		_parent.innerHTML = "";
		
		_createHeadline();
		
		_createBody();		
	};
	
	_createHeadline = function() {
		var /** {HTMLElement} */ headline = document.createElement("p");
		headline.className = "menu-headline";
		headline.id = _parent.id + "-menu-headline";
		headline.innerHTML = 
			'<div class="contentHeader">' + 
				'<div id="arrows">' + 
					'<div id="arrowUp" class="arrowUp_blog" style="display: none;"></div>' + 
					'<div id="arrowDown" class="arrowDown_blog"></div>' + 
				'</div>' +
			'</div>';
		
		_parent.appendChild(headline);
	};
	
	_createBody = function() {
		var /** {HTMLElement} */ main = document.createElement("div");
		main.id = id;
		main.style.display = "inherit";
		main.className = "main-menu";		

		main.innerHTML = _getBodyContent();

		_parent.appendChild(main);
	};
	
	_getBodyContent = function() {
		var /** {HTMLElement} */ html = '<ul id="menu-container" class="menu_ul">';

		var posts = _json.Posts;

		for(var i = 0; i < posts.length; i++) {
			
			var style = _getStyleDisplay(i);
			var color = _getLineColor(i);
			var colorGradient = _getColorGradient(i);
			var avatar = (_json.Posts[i].Creator.Avatar === "")?null:_json.Posts[i].Creator.Avatar;
			avatar = (avatar != null)?' style="background: url(\'' + avatar + '\') no-repeat scroll 6px 5px"':' class="avatar"';

			if(_json.Posts[i].Type === "TEXT") {
				html += _getTextLI(_json.Posts[i], color, colorGradient, style, avatar);
			} else if(_json.Posts[i].Type === "IMAGE") {
				html += _getImageLI(_json.Posts[i], color, colorGradient, style, avatar);
			} /*TODO*//*else if(_json.Posts[i].Type === "POLL") {
				html += _getPollLI(_json.Posts[i], color, style, avatar);
			}*/
			
		}

		html += '</ul>';
		
		return html;
	};
	
	/**
	 * 
	 * @param index
	 * @returns {String} a string containing the HTML information of whether the element is visible or hidden
	 */
	_getStyleDisplay = function(index) {
		//display only the first 6 items and focus first
		if(index >= _activeIndex - 1 && index!==0) {	
			return 'style="display: inherit;"';				
		} else if(index === 0) {
			return 'class=" focus" style="display: inherit;"';				
		} else {
			return 'style="display: none;"';				
		}
	};
	
	_getLineColor = function(i) {
		if(i%2 == 0) {
			return "li_light";
		} else {
			return "li_dark";
		}
	};
	
	_getColorGradient = function(i) {
		if(i%2 == 0) {
			return _verlaufLight;
		} else {
			return _verlaufDark;
		}
	};
	
	/**
	 * 
	 * @param post - the JSON element which contains the information for the element to display
	 * @param color
	 * @param colorGradient
	 * @param style - whether the element is visible or hidden
	 * @param avatar - the avatar picture to display
	 * @returns {HTMLElement as String} a LI element as String representing a list item within the menu - only text
	 */
	/*
	 	<li id="li_1" class="menu_li li_light focus">
			<div style="background: url('http://avatars.scribblelive.com/2013/2/25/67b4f4dd-bbb1-4bf2-a902-ef9e5143aa85.jpg') no-repeat scroll 16px 5px" id="post_127023564">
				<ul>
					<div>rbb Fernsehen</div>
					<div class="menu_li_datetime">15.9.2014 12:57:24</div>
					<div class="menu_li_subtext">1. Lorem Ipsum </div>
			</div>
			
		</li>
	 */
	_getTextLI = function(post, color, colorGradient, style, avatar) {
		var li = 
			'<li class="menu_li ' + color + '" id="li_' + post.Id + '" ' + style + ' creator="' + post.Creator.Name + '" content="' + post.Content.ClearedContent + '" type="' + EnumType.TEXT + '" created="' + post.Created.UTC + '">' +
				'<div id="post_' + post.Id + '" ' + avatar + '>' + 
					'<ul>' + 
						'<div>' + post.Creator.Name + '</div>' + 					
						'<div class="menu_li_datetime">' + post.Created.TimeAgo + '</div>'  + 
						'<div class="menu_li_subtext">' + post.Content.ClearedContent + '</div>'  + 
					'</ul>' + 
				'</div>' +
				'<img alt="" src="' + colorGradient + '" class="verlauf"></img>' + 
			'</li>';
		return li;
	};
	
	/**
	 * 
	 * @param post - the JSON element which contains the information for the element to display
	 * @param color
	 * @param colorGradient
	 * @param style - whether the element is visible or hidden
	 * @param avatar - the avatar picture to display
	 * @returns {HTMLElement as String} a LI element as String representing a list item within the menu - only text
	 */
	/*
	 	<li id="li_2" class="menu_li li_dark">
			<div class="avatar">
				<ul class="type_image">
					<div>rbb Fernsehen</div>
					<div class="menu_li_datetime">15.9.2014 12:57:24</div>
					<img alt="" src="http://images.scribblelive.com/2014/2/24/94abeab4-b46f-44ab-8b20-c0563997bb81.jpg" class="image-inline"><img>
					<div class="menu_li_subtext">2. Lorem ipsum dolor sit amet, consetetur sadipscing elitr!</div>
				</ul>
			</div>
			<img alt="" src="img/verlauf_dark_full.png" class="verlauf"></img>
		</li>
	 */
	_getImageLI = function(post, color, colorGradient, style, avatar) {
		var li = 
			'<li class="menu_li ' + color + '" id="li_' + post.Id + '" ' + style + ' creator="' + post.Creator.Name + '" content="' + encodeURIComponent(post.Content.ClearedContent + '<img src="' + post.Media.URL + '"\/>') + post.Content.ClearedContent + '" type="' + EnumType.IMAGE + '" created="' + post.Created.UTC + '">' +
				'<div id="post_' + post.Id + '"' + avatar + '>' + 
					'<ul class="type_image">' + 
						'<div>' + post.Creator.Name + '</div>' + 					
						'<div class="menu_li_datetime">' + post.Created.TimeAgo + '</div>'  + 
						'<img class="image-inline" alt="" src="' + post.Media.URL + '"> </img>' +
						'<div class="menu_li_subtext">' + post.Content.ClearedContent + '</div>'  + 
					'</ul>' + 
				'</div>' +
				'<img alt="" src="' + colorGradient + '" class="verlauf"></img>' + 
			'</li>';
		return li;
		
	};
	
	/**
	 * Sets focus to the element
	 * @param {HTMLElement} element
	 */
	var _setFocus = function(element) {
		_addClass(element, "focus");
		element.focus();
		
		if(element.scrollHeight > element.offsetHeight) {
			element.lastChild.style.display = "inherit";
			element.lastChild.src = _verlaufFocus;
		} else {
			element.lastChild.style.display = "none";
//			element.lastChild.src = "";
		}

	};
	
	/**
	 * Adds the className to the element 
	 * @param {HTMLElement} element
	 * @param {String} className
	 */
	var _addClass = function(element, className) {
		if(element.className.indexOf(className) < 0) {
			element.className = element.className + " " + className;
		}		
	};
	
	/**
	 * Removes the className from the element 
	 * @param {HTMLElement} element
	 * @param {String} className
	 */
	var _removeClass = function(element, className) {
		element.className = element.className.replace(" " + className, "");
	};
	
	var _removeVerlauf = function(element) {
		if(element.scrollHeight > element.offsetHeight) {
			element.lastChild.style.display = "inherit";
			if(element.className.indexOf("light") >= 0) {
				element.lastChild.src = _verlaufLight;
			} else {
				element.lastChild.src = _verlaufDark;
			}
			
		} else {
//			element.lastChild.src = "";
			element.lastChild.style.display = "none";
		}
		
		
	};
	
	_construct();
};/**

 * Singleton/Factory
 * Handles all created menuElements listed in EnumType and stores them associated to their creating object
 * There will always be only one instance of this class which can be called by MenuElementFactory.instanceOf
 */
var MenuElementFactory = (function () {

	// Instance stores a reference to the Singleton
	var instance = null;

	function init() {

		// Singleton/Factory

		// Private methods and variables

		/**
		 * Associate Array containing all created menuElements by their creating object
		 */
		var _menuElements = new Array();


		return {

			// Public methods and variables
			
			getAssociatedElement: function (parent) {
				return _menuElements[parent];			
			},
			
			deleteAssociatedElement: function (parent) {
				_menuElements[parent] = null;
			},
			
			/**
			 * Creates an Object of a type d_menuElementsumType
			 * @param {EnumType} type - the type on menu to create
			 * @param {INavigable} parent - the creating object
			 * @returns {INavigable}
			 */
			create: function (type, content, creator, parent) {
				log( "Create a new Element" );
				
				switch(type) {
				case EnumType.TEXT:
					
				case EnumType.IMAGE:
					if (parent.indexOf("main-menu") >= 0) {
						_menuElements[parent] = new MenuOverlay(content, creator, document.getElementById(parent).parentNode);
					} else {
						_menuElements[parent] = new BroadcastOverlay(content, creator, document.getElementById(parent).parentNode);
					}
					break;
				case EnumType.POLL:
					 _menuElements[parent] = new Poll(content, creator, document.getElementById(parent).parentNode, parent.getNumberOfVisibleElements(), this);
					break;
				default:
					
					break;
				}
			return _menuElements[parent];
			},
		};

	};

	return {

		// Get the Singleton instance if one exists
		// or create one if it doesn't
		instanceOf: function () {

			if ( !instance ) {
				instance = init();
			}

			return instance;
		}

	};

})();function MenuOverlay(content, creator, parent) {
	var /** {JSON} */ _content = null;
	var /** {string} */ _creator = null;
	var /** {HTMLObject */ _parent = null;
	var /** {HTMLELement} */ _activeElem = null;
	var /** {IScrollable} */ _subMenu = null;
	var /** {string} */ id = null;
	var  /** {string} */ _id_content = null;
	var /** {ElementFactory} */_elementFactory = null;
		
	/**
	 * IMAGES
	 */
	var _verlaufFocus = "img/verlauf_rot_500px.png";
	var _verlaufLight = "img/verlauf_light_full.png";
	
	function _construct() {
		try {
//			_content = decodeURIComponent(content.replace(/\+/g, '%20'));
			_content = content;			
			_creator = creator;
			_parent = parent;
			id = _parent.id + "-" + _content.Type;
			_id_content = _parent.id + "-content";
			_elementFactory = MenuElementFactory.instanceOf();

			_createHTML();
			
			_activeElem = getClose(EnumType.CLOSE);
			_setFocus(_activeElem);
		} catch (exc) {
			log(exc);
		}
		
	}
	
	
	this.setActive = function(flag) {
		if(_subMenu === null) {
			if(flag) {
				_setFocus(_activeElem);
				if(_activeElem.id == _id_content) {
					getVerlauf().src = _verlaufFocus;
				}
			} else {
				_removeClass(_activeElem, "focus");
			}
		} else {
			
		}
	};
	
	this.refresh = function() {
//		log("trying to refresh timeago in menuOverlay");
		var timeAgo = "";
		try {
			timeAgo = $.timeago( parseInt(_content.Created.UTC) );
		} catch (exc) {
			timeAgo = date.getDay() + ". " + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
		}
		
		
		_content.Created.TimeAgo = timeAgo;
		document.getElementById("datetime").innerHTML = timeAgo;
//		log("refresh timeago: value in HTML: " + document.getElementById("datetime").innerHTML + "; value in lokal var: " + timeago);
	};
	
	
	/**
	 * interprets the scroll functionality for the focused element or opened "container"
	 * @param {integer} direction - the direction in which to scroll within the element (typical range[-1,1])
	 */
	this.scroll = function(direction) {
		if(_subMenu !== null) {
			_subMenu.scroll(direction);			
		} else {
			if(direction < 0) {
				onUp();
			} else {
				onDown();
			}
		}

	};
	
	onUp = function() {
		switch(_activeElem.id) {
		case EnumType.CLOSE:
		case "PREV": 
		case "NEXT":
			_removeClass(_activeElem, "focus");
			_activeElem = document.getElementById(_id_content);
			_setFocus(_activeElem);
			getVerlauf().src = _verlaufFocus;
			break;
		case _id_content:
			break;
		}
	};
	
	onDown = function() {
		switch(_activeElem.id) {
		case EnumType.CLOSE:
			break;
		case "PREV": 
			break;
		case "NEXT":
			break;
		case _id_content:
			_removeClass(_activeElem, "focus");
			_activeElem = getClose(EnumType.CLOSE);
			_setFocus(_activeElem);
			getVerlauf().src = _verlaufLight;
			break;
		}
	};
	
	this.onRight = function(that) {
		if(_subMenu !== null) {
			var flag = _subMenu.onRight();
			if(flag === EnumType.CLOSE) {
				_elementFactory.deleteAssociatedElement(id);
				_subMenu = null;
				log("sub was closed");
				this._setFocusTo(0);
				getVerlauf().src = _verlaufFocus;
			}
		} else {
			switch(_activeElem.id) {
			case EnumType.CLOSE:
				_removeClass(_activeElem, "focus");
				_activeElem = getDivById("PREV");
				_setFocus(_activeElem);
				getVerlauf().src = _verlaufLight;
				break;
			case "PREV":
				_removeClass(_activeElem, "focus");
				_activeElem = getDivById("NEXT");
				_setFocus(_activeElem);
				getVerlauf().src = _verlaufLight;
				break;
			case "NEXT":
			case _id_content:
				getVerlauf().src = _verlaufLight;
				that.jump('right');
				break;
			}
			
		}
	};
	
	this.onLeft = function(that) {
		if(_subMenu !== null) {
			var flag = _subMenu.onLeft();
			if(flag === EnumType.CLOSE) {
				_elementFactory.deleteAssociatedElement(id);
				_subMenu = null;
				log("sub was closed");
				this._setFocusTo(0);
				getVerlauf().src = _verlaufFocus;
			}
		} else {
			switch(_activeElem.id) {
			case EnumType.CLOSE:
				getVerlauf().src = _verlaufLight;
				that.jump('left');
				break;
			case "PREV": 
				_removeClass(_activeElem, "focus");
				_activeElem = getClose(EnumType.CLOSE);
				_setFocus(_activeElem);
				getVerlauf().src = _verlaufLight;
				break;
			case "NEXT":
				_removeClass(_activeElem, "focus");
				_activeElem = getDivById("PREV");
				_setFocus(_activeElem);
				getVerlauf().src = _verlaufLight;
				break;
			case _id_content:
				getVerlauf().src = _verlaufLight;
				that.jump('left');
				break;
			}
			
		}
	};

	/**
	 * interprets the onOk functionality for the focused element or opened "container"
	 */
	this.onOk = function() {
		if(_subMenu != null) {
			var flag = _subMenu.onOk();
			if(flag === EnumType.CLOSE) {
				_elementFactory.deleteAssociatedElement(id);
				_subMenu = null;
				log("sub was closed");
				this._setFocusTo(0);
				getVerlauf().src = _verlaufFocus;
				
				//Track				
				// if(Hbb.tracking){
				// 	_paq.push(['trackPageView', 'scribbleDetails']);
				// }
				// Hbb.activePageTitle = 'scribbleDetails';
			}
		} else {
			switch(_activeElem.id) {
			case EnumType.CLOSE:
				this.close();								
				return EnumType.CLOSE;
				break;
			case "PREV":
			case "NEXT":				
				this.close();
				getDivById("main-menu").style.visibility = "hidden";
				getDivById("main-menu").style.display = "inherit"; 				
				return _activeElem.id;
				break;
			case _id_content:
				if(getBroadcastElement() !== null) {
					_removeClass(_activeElem, "focus");
					getVerlauf().src = _verlaufLight;
					_subMenu = _elementFactory.create(_content.Type, _content, _content.Creator.Name, id);
					
					//Track					
					// if(Hbb.tracking){
					// 	_paq.push(['trackPageView', 'scribbleOverlay']);
					// }
					// Hbb.activePageTitle = 'scribbleOverlay';
				}				
				break;
			}
		}
	};
	
	getBroadcastElement = function() {
		var objects = document.getElementsByTagName("object");
		for(var i = 0; i < objects.length; i++) {
			if(objects[i].getAttribute("type") !== undefined && objects[i].getAttribute("type") !== null && objects[i].getAttribute("type").indexOf("video/") === 0) {
				return objects[i];
			}
		}


		return null;
	};
	
	this._setFocusTo = function(index) {
		_removeClass(_activeElem, "focus");
		switch(index) {
		case 0:
			_activeElem = document.getElementById(_id_content);
			getVerlauf().src = _verlaufFocus;
			break;
		case 1: 
			_activeElem = getClose(EnumType.CLOSE);
			break;
		case 2:
			_activeElem = getDivById("PREV");
			break;
		case 3:
			_activeElem = getDivById("NEXT");
			break;
		}
		_setFocus(_activeElem);
	};

	/**
	 * Closes/deletes the element.
	 * Deletes all the HTML elements except the parent
	 */
	this.close = function() {
		_parent.removeChild(getDivById(id));
		getDivById("main-menu").style.visibility = "";
		getDivById("main-menu").style.display = "inherit";
	};
	
	getDivById = function(elementId) {
		var divs = _parent.getElementsByTagName("div");
		for(var i = 0; i < divs.length; i++) {
			if(divs[i].id.indexOf(elementId) >= 0) {
				return divs[i];
			} 
		}
		return null;
	};
	
	var getClose = function() {
		var divs = _parent.getElementsByTagName("div");
		for(var i = 0; i < divs.length; i++) {
			if(divs[i].id.indexOf("CLOSE") >= 0) {
				return divs[i];
			} 
		}
		return null;
	};
	
	getVerlauf = function() {
		var divs = _parent.getElementsByTagName("img");
		for(var i = 0; i < divs.length; i++) {
			if(divs[i].id.indexOf("verlauf") >= 0) {
				return divs[i];
			} 
		}
		return null;
	};
	
	var _createHTML = function() {
		getDivById("main-menu").style.visibility = "visible";
		getDivById("main-menu").style.display = "none";

		var /** {HTMLElement} */ main = document.createElement("div");
		main.id = id;
		main.style.display = "inherit";
		main.className = "main-menu";

		var avatar = (_content.Creator.Avatar === "")?null:_content.Creator.Avatar;
		avatar = (avatar != null)?'" style="background: url(\'' + avatar + '\') no-repeat scroll 6px 5px"':' class="avatar"';
		
		var img = "";
		if(_content.Type == EnumType.IMAGE) {
			img = '<img class="image-inline" alt="" src="' + _content.Media.URL + '"> </img>';
		}
		
		var classType = "";
		if(_content.Type == EnumType.IMAGE) {
			classType = 'class="type_image"';
		}

		var /** {HTMLElement} */ temp = 
		'<ul class="menu_ul">' +
			'<li class="menu_li zoom" id=' + _id_content + ' >' +
				'<div id="post_zoom_' + _content.Id + '"' + avatar + '>' + 
					'<ul ' + classType + '>' + 
						'<div>' + _content.Creator.Name + '</div>' + 					
						'<div id="datetime" class="menu_li_datetime">' + _content.Created.TimeAgo + '</div>'  + 
						img +
						'<div class="menu_li_subtext">' + _content.Content.ClearedContent + '</div>'  + 
						'<img id="verlauf" alt="" src="' + _verlaufLight + '" class="verlauf"></img>' +
					'</ul>' + 
				'</div>' +
			'</li>' +
			'<div id="navigation" class="navigation">' + 
				'<div id="' + EnumType.CLOSE + '">' + 'Back' + '</div>' +
			'</div>' +
		'</ul>';
		
		main.innerHTML = temp;

		_parent.appendChild(main);
		
		
		
		//old version: over Broadcast
//		var objects = document.getElementsByTagName("object");
//		for(var i = 0; i < objects.length; i++) {
//			if(objects[i].getAttribute("type") == "video/broadcast") {
//				break;
//			}
//		}		
//		var tranparent = parents.cloneNode(false);
//		tranparent.className += " transparency";
//		tranparent.id = "image-background";
//		document.body.appendChild(tranparent);		
//		
//		var main = objects[i].parentNode.cloneNode(false);
//		
//		
//		main.id = "image";
//		main.style.display = "none";
//		main.className += " image";
//		
//		var html = 
//			'<li id="image-creator" class="creator"> ' + _content.Creator.Name + ' </li>' + 
//			'<li>' + 
//				'<img src="' + _content.Media.URL + '">' + 
//			'</li>' + 
//			'<li id="image-content" class="content"> ' + _content.Content.ClearedContent + ' </li>' +  
//			'<li>' + 
//				'<div class="button focus">Schlie&#x03B2;en</div>' + 
//			'</li>';
//		main.innerHTML = html;
//		
//		document.body.appendChild(main);
//		zoom = true;				
//		
//		document.getElementById("image").style.display = "inherit";
	};
	
	/**
	 * Sets focus to the element
	 * @param {HTMLElement} element
	 */
	var _setFocus = function(element) {
		_addClass(element, "focus");
		element.focus();
	};
	
	/**
	 * Adds the className to the element 
	 * @param {HTMLElement} element
	 * @param {String} className
	 */
	var _addClass = function(element, className) {
		if(element.className.indexOf(className) < 0) {
			element.className = element.className + " " + className;
		}	
	};
	
	/**
	 * Removes the className from the element 
	 * @param {HTMLElement} element
	 * @param {String} className
	 */
	var _removeClass = function(element, className) {
		element.className = element.className.replace(" " + className, "");
	};
	
	_construct();
};function scribbleModule(parent, scribbleId, headline) {
	
	var /** {HTMLELement} */ _parent = parent;
	var /** {integer} */ _scribbleId = scribbleId;
	var _headline = headline;
	var _isActive = false;
//	var /** TODO **/ _layout = layout;

	var /** {JSON} */ _json = "";
	
	var /** {int} */ _refreshIntervall = 35000;

	var /** {int UTC} */ _lastRefresh = 0;
	
	var _menu = null;
	var counter = 0;
	var callbackSuccessfull = false;
	var timer = null;
	
	function _construct() {
		_jsonp("http://apiv1.scribblelive.com/event/" + _scribbleId + "/page/last/?Token=DxuR3RCC&Format=json&PageSize=50&callback=_callbackCreate");
		
		//check whether create was successfull
		timer = window.setInterval("_checkCallback()", 3000);
	};
	
	this.onOk = function() {
		_menu.onOk();
	};
	
	this.scroll = function(dir) {
		_menu.scroll(dir);
	};
	
	this.onRight = function(that) {
		return _menu.onRight(that);
	};
	
	this.onLeft = function(that) {
		return _menu.onLeft(that);
	};
	
	this._setFocusTo = function(index) {
		_menu._setFocusTo(index);
	};
	
	setHeadline = function(headline) {
		_menu.setHeadline(headline);
	};
	
	this.setActive = function(flag) {
		if(_menu == null) {
			_isActive = flag;
		} else {
			_menu.setActive(flag);
		}
		
	};
	
	
	/**
	 * creates a new cut json structure that will be the basis for the blog
	 */
	_createJSON = function(_scribble) {
//		var _scribble = null;
//		if(scribble === undefined) {
//			_scribble = JSON.parse(_getFromURL("http://apiv1.scribblelive.com/event/" + _scribbleId + "/page/last/?Token=DxuR3RCC&Format=json"));
//		} else {
//			_scribble = scribble;
//		}		
		
		var posts = _scribble.Posts;
		
		_json = 
			{
				"Id" : _scribble.Id,
				"Title" : _scribble.Title,
				"Posts" : []
			};
		
		
		for(var i = 0; i < posts.length; i++) {
			var post = _scribble.Posts[i];
			
			var created = post.Created;
			var date = new Date(parseInt(created.replace('/Date(', '')));
			var mediaURL = null;
			var mediaType = null;
			try {
				mediaURL = post.Media[0].Url;
				mediaType = post.Media[0].Type;
			} catch (exc) {
//				log("no media for post: " + post.Id);
			}
			
			var timeAgo = 0;
			try {
				timeAgo = $.timeago( parseInt(created.replace('/Date(', '')) );
			} catch (exc) {
				timeAgo = date.getDay() + ". " + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
			}
			
			
			
			
			_json.Posts[i] = {
				"Id" : post.Id,
				"Content" : {
					"Content" : post.Content,
					"ClearedContent" : _regularExpressionReplace(post.Content)
				},
				"Creator" : {
					"Id" : post.Creator.Id,
					"Name" : post.Creator.Name,
					"Avatar" : post.Creator.Avatar
				},
				"Type" : post.Type,
				"Created" : {
					"Created" : created,
					"UTC" : parseInt(created.replace('/Date(', '')),
					"LocaleString" : date.toLocaleString(),
					"TimeAgo" : timeAgo
				},
				"Media" : {
					"Type" : mediaType,
					"URL" : mediaURL
				}
			};
		}
//		log(_json);
	};
	
	/**
	 * @param url the URL to retrieve the string from
	 * @param local if the url is not based within /proxy.php?url= this shall be true
	 * @returns a string
	 */
//	_getFromURL = function(url) {
//		var xmlhttp;
//		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
//			xmlhttp=new XMLHttpRequest();
//		}
//		//TODO change to async
//		xmlhttp.open("GET", url, false);
//
//		xmlhttp.send();
//		return xmlhttp.responseText;
//	};
	
	
	_jsonp = function(url) {
		// Lˆschen bereits vorhandener JSONP Skripte
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i<scripts.length; i++) {
			var src = scripts[i].getAttribute("src");
			if(!src) continue;
			if(src.indexOf("callback") >= 0) {
				scripts[i].parentNode.removeChild(scripts[i]);
//				log("loeschen des alten skript tags");
			}
		}

		// Anlegen und Einf¸gen des neuen Skripts
		var script = document.createElement("script");
		script.setAttribute("src", url);
		script.setAttribute("type", "text/javascript");
		script.id = "jsonp";
		document.getElementsByTagName("head")[0].appendChild(script);
//		if(document.getElementById("jsonp").innerHTML == "") {
//			_jsonp(url);
//		}
		
	};
	
	_createMenu = function() {
		try {
			_menu = new flexMenu(_parent, _json);
		} catch(exc) {
			log("exception while creating blog: " + exc);
		}
	};

	
	_checkCallback = function() {
		if(!callbackSuccessfull) {
			log("call to scribble was not successfull, trying again.");
			
			counter++;
			// var callbackName = "refresh" + counter;
			var callbackName = "refresh";
			
			window[callbackName] = function(data) {
				try {
//					log("calling callback function");
					_callbackCreate(data);
				} catch(exc) {
					log("Es ist ein Fehler beim erstellen einer CallBackBethode aufgetreten: " + exc);
				}
				try {
					delete window[callbackName];
				} catch (e) {
					log("Es ist ein Fehler beim lˆschen einer CallBackMethode aufgetreten" + e);
				}
				window[callbackName] = null; 
			};
			
			
			
//			log("send jsonp request");
			_jsonp("http://apiv1.scribblelive.com/event/" + _scribbleId + "/page/last/?Token=DxuR3RCC&Format=json&PageSize=50&callback="+callbackName+"&rand="+counter);
		} else {
			window.clearInterval(timer);
		}
	};
	
	// Entgegennahme der Serverantwort
	_callbackCreate = function(data) { 
		try {
			callbackSuccessfull = true;
			window.clearInterval(timer);
			_scribble = data;
			_createJSON(_scribble);
			_createMenu();
			setHeadline(_headline);
			_menu.setActive(_isActive);
			window.setInterval("_refresh()", _refreshIntervall);
			_lastRefresh = new Date().getTime();
			
		} catch(exc) {
			log("exception while loading blog: " + exc);
		}
	};
	
	_callbackRefresh = function(data) {
		try {
			newScribble = "";
//			log("received jsonp answer");
			newScribble = data;
			
			
//			log("first post in answer before clearing: " + _regularExpressionReplace(data.Posts[0].Content));

			var utc = newScribble.Posts[0].Created;
			var now = new Date().getTime();
			if(parseInt(utc.replace('/Date(', '')) > _json.Posts[0].Created.UTC || now > _lastRefresh + 40000) {				
				//only if new post(s) exist
				_createJSON(newScribble);
//				log("first json post in jsonp-answer after clearing: " + _json.Posts[0].Content.ClearedContent);
				_menu.refresh(_json);
				_lastRefresh = now;
			}
		} catch (exc) {
			log("exception while refreshin scribble module: " + exc);
		}
	};
	
	/**
	 * @param string - the string on which the regular expression is used
	 * @returns {String} a string which does not contain any links
	 */
	_regularExpressionReplace = function(string) {
		string = string.replace(/\+/g, ' ');
		string = string.replace(/%/g, '%25');
		string = decodeURIComponent(string);
		string = string.replace(/(?=<).*?(?=>)(>)/g, " ");
		string = string.replace(/"/g, "'");
		return string;
	};
	
	_refresh = function() {
		counter++;
		// var callbackName = "refresh" + counter;
		var callbackName = "refresh";
		
		window[callbackName] = function(data) {
			try {
//				log("calling callback function");
				_callbackRefresh(data);
			} catch(exc) {
				log("neuer versuch gescheitert: " + exc);
			}
			try {
				delete window[callbackName];
			} catch (e) {
			}
			window[callbackName] = null; 
		};
		
		
		
//		log("send jsonp request");
		_jsonp("http://apiv1.scribblelive.com/event/" + _scribbleId + "/page/last/?Token=DxuR3RCC&Format=json&PageSize=50&callback="+callbackName+"&rand="+counter);
//		var /** JSON */ newScribble = JSON.parse(_getFromURL("http://apiv1.scribblelive.com/event/" + _scribbleId + "/page/last/?Token=DxuR3RCC&Format=json&PageSize=5&callback=_callbackRefresh0"));
//
//		var utc = newScribble.Posts[0].Created;
//
//		if(parseInt(utc.replace('/Date(', '')) > _json.Posts[0].Created.UTC) {
//
//			//only if new post(s) exist
//
//			_createJSON(newScribble);
//
//			
//
//			_menu.refresh(_json);
//
//		}
		
	};
	
	_construct();
}
