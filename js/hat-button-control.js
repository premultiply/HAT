const maxMenuItems = 3;

$(document).ready(function(){
	var dragSrcEl = null;

	var buttons = {
		handleDragStart: function(e) {
			dragSrcEl = $(this);
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);
  			dragSrcEl.css('opacity','0.4');  // this / e.target is the source node.
  		},

  		handleDragOver: function(e) {
  			if (e.preventDefault) {
		    	e.preventDefault(); // Necessary. Allows us to drop.
		    }
		    if (!dragSrcEl.hasClass('drag-button')) return;
		  	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
		  	return false;
		},

		handleDragEnter: function (e) {
			if (e.preventDefault) {
		    	e.preventDefault(); // Necessary. Allows us to drop.
		    }
		  if (!dragSrcEl.hasClass('drag-button')) return;
		  $(this).addClass('over');
		},

		handleDragLeave: function(e) {
			if (e.preventDefault) {
		    	e.preventDefault(); // Necessary. Allows us to drop.
		    }
		    if (!dragSrcEl.hasClass('drag-button')) return;
		  	$(this).removeClass('over');  // this / e.target is previous target element.
		},

		handleDrop: function(e) {
	  		if (e.preventDefault) {
		    	e.preventDefault();
		    }
		    if (e.stopPropagation) {
	    		e.stopPropagation();
	    	}
	    	if (!dragSrcEl.hasClass('drag-button')) return;
	    	dragSrcEl.css('opacity','1.0');
	    	if (this!=dragSrcEl[0]){
	    		dragSrcEl.html(this.innerHTML);
	    		this.innerHTML = e.dataTransfer.getData('text/html');
	    	}
	  		return false;
		},

		handleDragEnd: function(e) {
			if (e.preventDefault) {
			    e.preventDefault(); // Necessary. Allows us to drop.
			}
		    if (!dragSrcEl.hasClass('drag-button')) return;
		  	this.style.opacity = '1.0';
		},


		addDragListeners: function($el){
			var that = this;
			$el.each(function(){
				this.addEventListener('dragstart', that.handleDragStart, false);
				this.addEventListener('dragenter', that.handleDragEnter, false);
				this.addEventListener('dragover', that.handleDragOver, false);
				this.addEventListener('dragleave', that.handleDragLeave, false);
				this.addEventListener('drop', that.handleDrop, false);
				this.addEventListener('dragend', that.handleDragEnd, false);
			});
		}
	}

	var menuItems = {
		handleDragStart: function(e) {
			if ($(this).hasClass('placeholder')) return;
			dragSrcEl = $(this).parent();
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', dragSrcEl.html());
  			dragSrcEl.css('opacity','0.4');  // this / e.target is the source node.
  		},

  		handleDragOver: function(e) {
  			if (e.preventDefault) {
		    	e.preventDefault(); // Necessary. Allows us to drop.
		    }
		    if (!dragSrcEl.hasClass('drag-menu-item')) return;
		  	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
		  	return false;
		},

		handleDragEnter: function (e) {
			if (e.preventDefault) {
		    	e.preventDefault(); // Necessary. Allows us to drop.
		    }
		  if (!dragSrcEl.hasClass('drag-menu-item')) return;
		  $(this).parent().addClass('over');
		},

		handleDragLeave: function(e) {
			if (e.preventDefault) {
		    	e.preventDefault(); // Necessary. Allows us to drop.
		    }
		    if (!dragSrcEl.hasClass('drag-menu-item')) return;
		  	 $(this).parent().removeClass('over');  // this / e.target is previous target element.
		},

		handleDrop: function(e) {
			console.log(dragSrcEl);
	  		if (e.preventDefault) {
		    	e.preventDefault();
		    }
		    if (e.stopPropagation) {
	    		e.stopPropagation();
	    	}
	    	dragSrcEl.css('opacity','1.0');
	    	if (!dragSrcEl.hasClass('drag-menu-item')) return;
	    	var par = $(this).parent()
	    	if (par[0]===dragSrcEl[0] || par.hasClass('unused')) return;
	    	if (dragSrcEl.hasClass('unused')){
	    		var new_button = $('<div class="hat-menu-button"></div>');
	    		var button_bar = $('#button-bar');
	    		new_button.append(button_bar.children().first().remove().children().first());
	    		dragSrcEl.removeClass('unused').append('<div alt="f153" class="dashicons dashicons-dismiss remove-menu-item"></div>').prepend(new_button);
	    		par.before(dragSrcEl);
	    		removeButtons();
	    	} else {
	    		par.before(dragSrcEl);
	    	}
	    	
	  		return false;
		},

		handleDragEnd: function(e) {
			if (e.preventDefault) {
			    e.preventDefault(); // Necessary. Allows us to drop.
			}
		    if (!dragSrcEl.hasClass('drag-menu-item')) return;
		    $('.over').removeClass('over');
		  	$(this).parent().css('opacity','1.0');
		},


		addDragListeners: function($el){
			var that = this;
			$el.each(function(){
				this.addEventListener('dragstart', that.handleDragStart, false);
				this.addEventListener('dragenter', that.handleDragEnter, false);
				this.addEventListener('dragover', that.handleDragOver, false);
				this.addEventListener('dragleave', that.handleDragLeave, false);
				this.addEventListener('drop', that.handleDrop, false);
				this.addEventListener('dragend', that.handleDragEnd, false);
			});
		}

	}

	buttons.addDragListeners($('.drag-button'));
	menuItems.addDragListeners($('.hat-menu-post'));

	function removeButtons(){
		$('.remove-menu-item').click(function(){
			var list_item = $('<li class="drag-menu-item unused"></li>');
			var par = $(this).parent();
			var post = par.children('.hat-menu-post').eq(0);
			var button = $('<li></li').append(par.find('.drag-button').eq(0));
			$('#button-bar').prepend(button);
			list_item.append(post);
			par.remove();
			$('.btn_control_pages_list[post-type="'+post.attr('post-type')+'"]').eq(0).append(list_item);
		});
	}
	removeButtons();

});

function saveButtonControlData(url){
	theData = new Array();
	$('#menu-item-list .drag-menu-item').not('.placeholder').each(function(){
		var $this = $(this);
		var button = $this.find('.hat-button').eq(0).attr('button-name');
		if ($this.attr('id')=='hide-button'){
			theData.push({is_hide: true, button_name: button, show: 'true'});
		} else {
			var post= $this.find('.hat-menu-post').eq(0).attr('post-id');
			theData.push({post_id: post, button_name: button, show: 'true'});
		}
	});
	$('#invis-item-list .drag-menu-item').not('.placeholder').each(function(){
		var $this = $(this);
		var button = $this.find('.hat-button').eq(0).attr('button-name');
		if ($(this).attr('id')=='hide-button'){
			theData.push({is_hide: true, button_name: button, show: 'false'});
		} else {
			var post= $this.find('.hat-menu-post').eq(0).attr('post-id');
			theData.push({post_id: post, button_name: button, show: 'false'});
		}
	});

	console.log(theData);
	console.log($('#main-menu-button .hat-button').attr('button-name'));
	$.ajax({
		url: url,
		type: 'POST',
		data: {items:theData, main_menu_button: $('#main-menu-button .hat-button').attr('button-name')}
	}).done(function(){
		console.log("Data saved");
		$('#save-notification').stop().show().delay(2000).fadeOut(500);
	}).fail(function(xhr, status, error) {
		console.log("Failed to Save");
	});
}

