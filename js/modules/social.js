/*
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
*/


var SocialModule = (function(){
	var eventId;
	var $socialContainer = "";
	var $popupContainer = "";
	var $postlist = "";
	var $activePost = "";
	var lastUpdate = new Date(0);

	function _initialize(_targetContainer, _eventId, _headline){
		$socialContainer = $(_targetContainer).addClass('navigable');
		eventId = _eventId;

		var contentHeader = document.createElement("div");
		contentHeader.className = "contentHeader";
		contentHeader.dataset.eventId = eventId;
		contentHeader.innerHTML = _headline;

		var socialContent = document.createElement("div");
		socialContent.className = "socialContent";

		var socialPopup = document.createElement("div");
		socialPopup.className = "socialPopup";
		socialPopup.style.width = 1152 - $socialContainer.width() + "px";
		if(($socialContainer.hasClass("content_oneColumn") && $socialContainer.css("float") == "left") || $socialContainer.hasClass("left")){
			socialPopup.style.left = 64 + $socialContainer.width() + "px";
		}else if(($socialContainer.hasClass("content_oneColumn") && $socialContainer.css("float") == "none") || $socialContainer.hasClass("middle")){
			socialPopup.style.left = 64 + $socialContainer.width() + "px";
		}else if(($socialContainer.hasClass("content_oneColumn") && $socialContainer.css("float") == "right") || $socialContainer.hasClass("right")){
			socialPopup.style.left = "64px";
			$socialContainer[0].style.margin = 0;
		}

		document.getElementById("hbbtv_app").appendChild(socialPopup);

		$socialContainer.append(contentHeader).append(socialContent);
		$postlist = $(_targetContainer + " .socialContent");
		$popupContainer = $(".socialPopup");

		_scribbleGetData(eventId);
		_update();

		$socialContainer.navUp(function(){
			if(!$activePost.length){
				$activePost = $(".post:first").addClass('activePost');
			}else if(!$activePost.is(".post:first")){
				$activePost = $activePost.removeClass("activePost").prev().addClass("activePost");
				$postlist.scrollTop($postlist.scrollTop() + $activePost.position().top - 75);
				if($popupContainer.is(":visible")){
					$popupContainer.empty();
					_loadContentToPopup();
				}
			}
		}).navDown(function(){
			if(!$activePost.length){
				$activePost = $(".post:first").addClass('activePost');
			}else if(!$activePost.is(".post:last")){
				$activePost = $activePost.removeClass("activePost").next().addClass("activePost");
				$postlist.scrollTop($postlist.scrollTop() + $activePost.position().top - 75);
				if($popupContainer.is(":visible")){
					$popupContainer.empty();
					_loadContentToPopup();
				}
			}
		}).navEnter(function(){
			if($popupContainer.is(":visible")){
				$popupContainer.hide().empty();
				$('.video-dummy').triggerHandler('create-video-object');
				if($socialContainer.hasClass("content_oneColumn") && $socialContainer.css("float") == "none"){
					$socialContainer[0].style.margin = "0 auto";
				}else if($socialContainer.hasClass("middle")){
					$socialContainer[0].style.position = "relative";
				}
			}else{
				$('.video-dummy').triggerHandler('conserve-video-object');
				$popupContainer.show();
				_loadContentToPopup();
				if($socialContainer.hasClass("content_oneColumn") && $socialContainer.css("float") == "none"){
					$socialContainer[0].style.margin = 0;
				}else if($socialContainer.hasClass("middle")){
					$socialContainer[0].style.position = "absolute";
				}	
			}
		}).activate(function(){
			if(!$activePost.length){
				$activePost = $(".post:first").addClass('activePost');
			}
		}).destroy(function(){
			$popupContainer.hide().empty();

		});

		$('.video-dummy').on('conserve-video-object',function(){
			var obj = $(this).next('object');
			$(this).data('playPos',obj[0].playPosition);
			$(this).data('vidURL',obj.attr('data'));
			obj.remove();
		}).on('create-video-object',function(){
			var obj = $('<object id="videoplayer"style="width:100%; height:100%;" type="video/mp4" data='+$(this).attr('vid')+'></object>');
			$(this).after(obj);
			obj[0].play(1);
			setTimeout(function(){
				obj[0].seek($(this).data('playPos'));
			},200);
		});
	}

	function _loadContentToPopup(){
		if($activePost.children(".postContent").data("postType") == "VIDEO"){
			$("#videoplayer").remove();
			$popupContainer.append("<object id='videoplayer' width='100%' height='100%' controls type='video/mp4' data='"+$activePost.children(".postContent").data("url")+"'></object><script type='text/javascript'>window.setTimeout( function() { if($('#videoplayer')){vid_obj = $('#videoplayer')[0]; if (vid_obj && vid_obj.play) vid_obj.play(1);$('#videoplayer')[0].play(1); } }, 10); </script>");
		}else if($activePost.children(".postContent").data("postType") == "AUDIO"){
			$("#videoplayer").remove();
			$popupContainer.append($activePost.children(".postContent").clone());
			$popupContainer.append("<object id='videoplayer' style='display:none;width:0;height:0;position:absolute;' type='video/mp4' data='"+$activePost.children(".postContent").data("url")+"'></object><script type='text/javascript'>window.setTimeout( function() { if($('#videoplayer')){vid_obj = $('#videoplayer')[0]; if (vid_obj && vid_obj.play) vid_obj.play(1);$('#videoplayer')[0].play(1); } }, 10); </script>");
		}else{
			$popupContainer.append($activePost.children(".postContent").clone());
		}
	}

	function _update(){
		var timer = window.setInterval(_scribbleUpdateData, 30000);
	}

	function _showPosts(posts){
		$postlist.empty();
		$(posts).each(function(){
			// if(this.Type != "EMBED"){
				$postlist.append(_createPost(this));
			// }
		});
		$activePost = $(".post:first").addClass('activePost');
	}
	function _addPosts(posts){
		$(posts.reverse()).each(function(){
			$postlist.prepend(_createPost(this));
		});
	}
	function _updatePosts(posts){
		$(posts).each(function(){
			$postlist.find("[data-post-id="+this.Id+"]").replaceWith(_createPost(this));
		});
	}
	function _deletePosts(posts){
		$(posts).each(function(){
			$postlist.find("[data-post-id="+this.Id+"]").remove();
		});
	}
	function _createPost(postData){

		var post = document.createElement("div");
		post.className = "post";
		post.dataset.postId = postData.Id;

		var postHead = document.createElement("div");
		postHead.className = "postHead";
		post.appendChild(postHead);

		var postAvatar = document.createElement("div");
		postAvatar.className = "postAvatar";
		postAvatar.style.backgroundImage = "url("+postData.Avatar+")";
		postHead.appendChild(postAvatar);

		var postAuthor = document.createElement("div");
		postAuthor.className = "postAuthor";
		postAuthor.innerHTML = postData.Name;
		postHead.appendChild(postAuthor);

		var postDate = document.createElement("div");
		postDate.className = "postDate";
		postDate.innerHTML = $.timeago(postData.LastModified);
		postHead.appendChild(postDate);

		var postSourceIcon = document.createElement("div");
		postSourceIcon.className = "postSourceIcon "+postData.Source;
		postHead.appendChild(postSourceIcon);

		var postContent = document.createElement("div");
		postContent.className = "postContent";
		postContent.dataset.source = postData.Source;
		postContent.dataset.postType = postData.Type;

		if(postData.Type == "IMAGE" || postData.Type == "VIDEO" || postData.Type == "AUDIO"){
			var postImage = document.createElement("div");
			postImage.className = "postImage";
			if(postData.Type == "IMAGE"){
				postImage.style.backgroundImage = "url("+postData.Media[0].Url+")";
			}else if(postData.Type == "VIDEO"){
				postImage.style.backgroundImage = "url("+postData.Media[1].Url+")";
				postContent.dataset.url = postData.Media[0].Url;
			}else if(postData.Type == "AUDIO"){
				postImage.style.backgroundImage = "url('wp-content/themes/HAT/assets/default-audio.png')";
				postContent.dataset.url = postData.Media[0].Url;
			}
			postContent.appendChild(postImage);
		}

		if(postData.Content != ""){
			var postText = document.createElement("div");
			postText.className = "postText";
			postText.innerHTML = postData.Content;
			postContent.appendChild(postText);
		}

		// if(postData.Type == "IMAGE"){
		// 	$('<div class="postContent" data-post-type="'+postData.Type+'"><div class="image" style="background-image: url('+postData.Media[0].Url+')"></div><div class="postText">'+postData.Content+'</div></div>').appendTo(post);
		// }else {
		// 	$('<div class="postContent" data-post-type="'+postData.Type+'"><div class="postText">'+postData.Content+'</div></div>').appendTo(post);
		// }


		post.appendChild(postContent);

		return post;
	}

	function _scribbleGetData(){
		$.ajax({
			url: 'https://apiv1.scribblelive.com/event/'+eventId+'/page/last/?Token=DxuR3RCC&Format=json&PageSize=50',
			jsonp: "callback",
			dataType: "jsonp",
			success: function(response){
				log("getdata");
				lastUpdate = _scribbleFormatToDate(response.LastModified);
				_showPosts(_scribbleFormatData(response.Posts));
			},
			error: function(e){
				log("Scribble GetData Error:", e);
				setTimeout(function(){_scribbleGetData()},1000);
			}
		});
		// _showPosts(_scribbleFormatData(fakeDataCallback().Posts));
	}
	function _scribbleUpdateData(){
		$.ajax({
			url: 'https://apiv1.scribblelive.com/event/'+eventId+'/all/?Token=DxuR3RCC&Format=json&Since='+_scribbleFormatToSince(lastUpdate),
			jsonp: "callback",
			dataType: "jsonp",
			success: function(response){
				log("updatedata: "+  _scribbleFormatToSince(lastUpdate));
				lastUpdate = _scribbleFormatToDate(response.LastModified);
				_addPosts(_scribbleFormatData(response.Posts));
				_updatePosts(_scribbleFormatData(response.Edits));
				_deletePosts(_scribbleFormatData(response.Deletes));
			},
			error: function(e){
				log("Scribble UpdateData Error:" + e);
			}
		});
	}
	function _scribbleFormatData(data){
		var posts = [];
		$(data).each(function(){
			var newPost = {"Id":this.Id,"Name":this.Creator.Name,"Avatar":this.Creator.Avatar,"LastModified":_scribbleFormatToDate(this.LastModified),"Content":this.Content,"Type":this.Type,"Media":this.Media,"Source":_scribbleSource(this.Source)};
			if(newPost.Type == "HTML" && newPost.Source == "twitter"){
				var contentArray = newPost.Content.split(" ");
				if(contentArray.indexOf("Video'")){
					$(contentArray).each(function(index, el) {
						if(el.indexOf("flashvars") > -1){
							var urls = el.split(";");
							newPost.Media = [{"Type": "VIDEO", "Url": urls[0].slice(16, -4), "Duration": -1 }, {"Type": "IMAGE", "Url": urls[1].slice(6, -4)}];
							newPost.Type = "VIDEO";
						}
					});
				}
			}
			posts.push(newPost);
		});
		return posts;
	}
	function _scribbleTwitterVideoDecode(contentstring){

	}
	function _scribbleFormatToDate(datestring){
		return eval("new " + (datestring.replace(/\//g, "")));
	}
	function _scribbleFormatToSince(date){
		date.setSeconds(date.getSeconds()+1);
		return date.getUTCFullYear() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
	}
	function _scribbleSource(sourcestring){
		if(sourcestring.indexOf("twitter") > -1){
			return "twitter";
		}else if(sourcestring.indexOf("Facebook") > -1){
			return "facebook";
		}else if(sourcestring.indexOf("Instagram") > -1){
			return "instagram";
		}else if(sourcestring.indexOf("") > -1){
			return "scribble";
		}
	}


	function fakeDataCallback(){
		json = {"Id": 548085, "Title": "Innovationsprojekte Testevent 2", "Key": "Innovationsprojekte_Testevent_2", "Description": "Event nach Twitter-ProblemEvent für den Test auf HbbTV. Bitte möglichst dieses Event mit entsprechenden Templates (Inno_***) nutzen.", "Type": "", "CustomCategories": {}, "IsLive": 1, "IsHidden": 0, "IsDeleted": 0, "IsCommenting": 1, "IsModerated": 0, "Discussion": {"Enabled": 1, "Moderated": 0 }, "Posts": [{"Id": 176694661, "Content": "In unserer Sommer-Serie zur Ringbahn machen wir heute Halt am Bahnhof Jungfernheide und besuchen die Schleuse Charlottenburg!<br><a href=\"http://www.facebook.com/141018599260302/posts/1075839935778159/\">Click to view Facebook Video</a><img class=\"ScribbleLiveCountImage\" width=\"1\" height=\"1\" style=\"display: none;\" src=\"http://cdn.scribblelive.com/Style/Images/transparent.png\" onload=\"(function (t) { if( document.getElementById('SLCountAddonScript') == null ) { var SLCount = document.createElement('script'); SLCount.id = 'SLCountAddonScript'; SLCount.type = 'text/javascript'; SLCount.async = true;            SLCount.src = 'http://cdn.scribblelive.com/modules/lib/addons.js?id=548085'; document.body.appendChild(SLCount); } t.parentNode.removeChild( t );        })(this)\" />", "Creator": {"Id": 23374627, "Name": "Abendschau", "Avatar": "http://avatars.scribblelive.com/2013/2/25/63dbf529-1bc1-48df-b378-ec125916f680.jpg"}, "Type": "TEXT", "Created": "/Date(1437730757833+0000)/", "LastModified": "/Date(1437730757833+0000)/", "IsComment": 1, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Source": "<a href='http://www.facebook.com/141018599260302/posts/1075839935778159/'>Facebook</a>", "EventId": 548085 }, {"Id": 176378088, "Content": "Das Video von unten noch mal einzeln neu gepostet", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "VIDEO", "Created": "/Date(1437573015627+0000)/", "LastModified": "/Date(1437573041273+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "VIDEO", "Url": "http://media.scribblelive.com/2015/7/22/93ce83bd-187f-4fe1-bfc9-e744c3282fa4.mp4", "Duration": 3 }, {"Type": "IMAGE", "Url": "http://images.scribblelive.com/2015/7/22/93ce83bd-187f-4fe1-bfc9-e744c3282fa4-00001.png"} ], "Source": "", "EventId": 548085 }, {"Id": 176377092, "Content": "Office view 2 <br /><br /><div class='Media Video' contenteditable='false'><object><embed id='TwitterVideo' height='200' width='542' flashvars='file=https://video.twimg.com/ext_tw_video/623850119935471617/pu/vid/1280x720/z1GRnh4GlK0FvbHx.mp4&amp;image=http://pbs.twimg.com/ext_tw_video_thumb/623850119935471617/pu/img/h8S04pEbTvUu6Pyx.jpg&amp;fullscreen=true&amp;autostart=false' allowfullscreen='true' wmode='opaque' allowscriptaccess='always' quality='high' src='//embed.scribblelive.com/js/jwflvplayer/player-licensed.swf' type='application/x-shockwave-flash'></object></div>", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "HTML", "Created": "/Date(1437572638873+0000)/", "LastModified": "/Date(1437572638873+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Source": "<a href='http://twitter.com/Olli_Inno/status/623850149475942400'>twitter</a>", "EventId": 548085 }, {"Id": 176377089, "Content": "Office view. <br /><br /><div class='Media Video' contenteditable='false'><object><embed id='TwitterVideo' height='200' width='542' flashvars='file=https://video.twimg.com/ext_tw_video/623848989843193856/pu/vid/720x720/c-kI_Cj6L7ySklfs.mp4&amp;image=http://pbs.twimg.com/ext_tw_video_thumb/623848989843193856/pu/img/sRlY2RmzVkUHNsCP.jpg&amp;fullscreen=true&amp;autostart=false' allowfullscreen='true' wmode='opaque' allowscriptaccess='always' quality='high' src='//embed.scribblelive.com/js/jwflvplayer/player-licensed.swf' type='application/x-shockwave-flash'></object></div>", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "HTML", "Created": "/Date(1437572637200+0000)/", "LastModified": "/Date(1437572637200+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Source": "<a href='http://twitter.com/Olli_Inno/status/623849031853305856'>twitter</a>", "EventId": 548085 }, {"Id": 176375384, "Content": "<iframe class=\"vine-embed\" src=\"//vine.co/v/e7l6WrEOZ1E/embed/simple\" width=\"300\" height=\"300\" ></iframe><p class=\"Caption\">Traveling w/ <a href=\"https://twitter.com/#!/search?q=%23kids\" title=\"#kids\" class=\"tweet-url hashtag\">#kids</a>? Check out <a href=\"https://twitter.com/#!/search?q=%23Berlin\" title=\"#Berlin\" class=\"tweet-url hashtag\">#Berlin</a> 's playgrounds. <a href=\"https://twitter.com/#!/search?q=%236secondsofcalm\" title=\"#6secondsofcalm\" class=\"tweet-url hashtag\">#6secondsofcalm</a> <a href=\"https://twitter.com/#!/search?q=%23travel\" title=\"#travel\" class=\"tweet-url hashtag\">#travel</a> <a href=\"https://twitter.com/#!/search?q=%23vinepostcard\" title=\"#vinepostcard\" class=\"tweet-url hashtag\">#vinepostcard</a> <br><br></p>", "Creator": {"Id": 1434733, "Name": "visitberlin", "Avatar": "http://avatars.scribblelive.com/2010/7/27/39b08799-d1ca-4a21-ab20-34b003d76276.gif"}, "Type": "EMBED", "Created": "/Date(1437571997550+0000)/", "LastModified": "/Date(1437571997550+0000)/", "IsComment": 1, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Source": "<a href='http://twitter.com/visitberlin/status/594852534642200576'>twitter</a>", "EventId": 548085 }, {"Id": 176371836, "Content": "#colorful #fruit #boat #hat #floatingmarket #traditional #market #culture #martapura #banjarmasin #borneo #mudik #dailylife", "Creator": {"Id": 44099629, "Name": "intan_sera", "Avatar": "http://avatars.scribblelive.com/2015/7/22/7ef29dd1-8192-468e-904e-aaf75ffc2845.jpg"}, "Type": "IMAGE", "Created": "/Date(1437570622230+0000)/", "LastModified": "/Date(1437570622230+0000)/", "IsComment": 1, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "IMAGE", "Url": "http://images.scribblelive.com/2015/7/22/3179449c-7a7e-4c5e-b170-65f21d6b7a9a.jpg"} ], "Source": "<a href='https://instagram.com/p/5cIjsEGYCM/' class='sl_instagram_post'>Instagram</a>", "EventId": 548085 }, {"Id": 174985878, "Content": "Abendschau 14.07.2015 19:30: +++ Hässliche Straßen sollen schöner werden +++ Debatte um die Versorgung von Flü... <a href=\"http://t.co/7nXHaplXzj\" title=\"http://bit.ly/1Hxe1bM\">bit.ly/1Hxe1bM</a><br><br>", "Creator": {"Id": 22605238, "Name": "rbb Fernsehen", "Avatar": "http://avatars.scribblelive.com/2013/2/11/7edd6d94-9a54-477a-a5d4-de746fbb705f.jpg"}, "Type": "TEXT", "Created": "/Date(1436970173487+0000)/", "LastModified": "/Date(1436970173487+0000)/", "IsComment": 1, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Source": "<a href='http://twitter.com/rbbFernsehen/status/621307634067488768'>twitter</a>", "EventId": 548085 }, {"Id": 174983193, "Content": " Mit dem Regierenden Bürgermeister Michael Müller starten wir heute unsere Sommerinterviews. Wie liefen die ersten sieben Monate seit seinem Amtsantritt? Wie ist die Stimmung in der rot-schwarzen Koalition? Was werden die inhaltlichen Schwerpunkte bis zum Wahlkampf 2016? Antworten dazu um 19:30 Uhr live in der Abendschau!<br>", "Creator": {"Id": 23374627, "Name": "Abendschau", "Avatar": "http://avatars.scribblelive.com/2013/2/25/63dbf529-1bc1-48df-b378-ec125916f680.jpg"}, "Type": "IMAGE", "Created": "/Date(1436969317023+0000)/", "LastModified": "/Date(1436969317023+0000)/", "IsComment": 1, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "IMAGE", "Url": "http://images.scribblelive.com/2015/7/15/984dbbdd-b996-4070-b1bf-49de6f8f5452.jpg"} ], "Source": "<a href='http://www.facebook.com/1071900542838765/'>Facebook</a>", "EventId": 548085 }, {"Id": 174706528, "Content": "Video", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "VIDEO", "Created": "/Date(1436888218420+0000)/", "LastModified": "/Date(1436888360937+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "VIDEO", "Url": "http://media.scribblelive.com/2015/7/14/88259851-2350-46b5-982a-5b12ca398c1c.mp4", "Duration": 176 }, {"Type": "IMAGE", "Url": "http://images.scribblelive.com/2015/7/14/88259851-2350-46b5-982a-5b12ca398c1c-00001.png"} ], "Source": "", "EventId": 548085 }, {"Id": 174684527, "Content": "", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "IMAGE", "Created": "/Date(1436883939573+0000)/", "LastModified": "/Date(1436883939573+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "IMAGE", "Url": "http://images.scribblelive.com/2015/7/14/7e0fc981-2a86-4d7b-a164-84a74f27056f.jpg"} ], "Location": {"Lat": 52.5167, "Long": 13.4 }, "Source": "", "EventId": 548085 }, {"Id": 174683115, "Content": "Baden in der Spree", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "AUDIO", "Created": "/Date(1436883541740+0000)/", "LastModified": "/Date(1436883656490+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "AUDIO", "Url": "http://media.scribblelive.com/2015/7/14/2ccb85c9-5ba2-46d6-86ff-5e3b0aa6f5da.mp3", "Duration": -1 } ], "Source": "", "EventId": 548085 }, {"Id": 174683103, "Content": "So war: das Splash-Festival", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "AUDIO", "Created": "/Date(1436883536910+0000)/", "LastModified": "/Date(1436883617743+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "AUDIO", "Url": "http://media.scribblelive.com/2015/7/14/fb763a1f-7bd1-4d15-893e-5c56ccef747e.mp3", "Duration": -1 } ], "Source": "", "EventId": 548085 }, {"Id": 174682707, "Content": "LeFloids Interviewtermin bei Mutti Merkel", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "AUDIO", "Created": "/Date(1436883413773+0000)/", "LastModified": "/Date(1436883459843+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "AUDIO", "Url": "http://media.scribblelive.com/2015/7/14/1968c8f9-77cb-4b37-8045-f9d332b0e36f.mp3", "Duration": -1 } ], "Source": "", "EventId": 548085 }, {"Id": 174681374, "Content": "Ein Post", "Creator": {"Id": 43815414, "Name": "Oliver", "Avatar": ""}, "Type": "TEXT", "Created": "/Date(1436883042673+0000)/", "LastModified": "/Date(1436883042673+0000)/", "IsComment": 1, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Location": {"Lat": 52.517, "Long": 13.4 }, "Source": "", "EventId": 548085 }, {"Id": 115320009, "Content": "Looking forward, to the social event tonight! ", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "IMAGE", "Created": "/Date(1399558721800+0000)/", "LastModified": "/Date(1399558721800+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "IMAGE", "Url": "http://images.scribblelive.com/2014/5/8/9f27bd19-0d6a-4b22-892a-2c42cd6391d3.jpg"} ], "Source": "", "EventId": 548085 }, {"Id": 115319546, "Content": "Today @ Fokus Media Web Symposium", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "TEXT", "Created": "/Date(1399558505320+0000)/", "LastModified": "/Date(1399558505320+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Source": "", "EventId": 548085 }, {"Id": 113545587, "Content": "Guten Morgen. Sorry bin noch ein bisschen verschlafen... <a href=\"http://t.co/tFYp6kBWnM\" title=\"http://twitter.com/7Rain/status/456687622576812032/photo/1\">http://pbs.twimg.com/media/BlZ6-QmCYAAQSkq.jpg</a>", "Creator": {"Id": 1619388, "Name": "7Rain", "Avatar": "http://avatars.scribblelive.com/2014/4/10/32b10ddc-948e-4f84-9498-946382373529.jpg"}, "Type": "IMAGE", "Created": "/Date(1397742720883+0000)/", "LastModified": "/Date(1397742720883+0000)/", "IsComment": 1, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Media": [{"Type": "IMAGE", "Url": "http://images.scribblelive.com/2014/4/17/31a530b8-1f96-4ab8-8637-399c874d6e29.jpg"} ], "Source": "<a href='http://twitter.com/7Rain/status/456687622576812032'>twitter</a>", "EventId": 548085 }, {"Id": 113371153, "Content": "First try", "Creator": {"Id": 34917236, "Name": "rbb Innovationsprojekte", "Avatar": "http://avatars.scribblelive.com/2014/11/9/98ee4e65-1a05-4b7a-b2fe-0f8e65990d27.png"}, "Type": "TEXT", "Created": "/Date(1397572883930+0000)/", "LastModified": "/Date(1397572883930+0000)/", "IsComment": 0, "IsStuck": 0, "IsDeleted": 0, "IsApproved": 1, "Location": {"Lat": 52.5167, "Long": 13.4 }, "Source": "", "EventId": 548085 } ], "PromotionalStart": "", "Start": "/Date(1436265000000+0000)/", "End": "/Date(1443706200000+0000)/", "Pages": 1, "NumPosts": 11, "NumComments": 7, "Language": "de", "Location": {"Lat": 52.390617802772326, "Long": 13.119505370750804 }, "Created": "/Date(1397572184000+0000)/", "LastModified": "/Date(1437730757830+0000)/", "Meta": {"LastImage": "http://images.scribblelive.com/2015/7/22/3179449c-7a7e-4c5e-b170-65f21d6b7a9a.jpg", "LastImagePostId": "176371836", "PrivatePolling": "0", "MarketNotified": "1", "SyndicatedTopHtml": ""}, "IsSyndicated": 0, "IsSyndicatable": 0, "SyndicatedComments": 0, "CreatorName": "rbb Innovationsprojekte", "Thumbnail": "http://images.scribblelive.com/2015/7/22/3179449c-7a7e-4c5e-b170-65f21d6b7a9a.jpg"};
		return json;
	}


	return {
		//publicname: function,
		init: _initialize,
		getdata: _scribbleGetData,
		a: _scribbleFormatToDate,
		b: _scribbleFormatToSince
	};


})();

