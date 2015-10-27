 var api = new Object();

(function(){

	api.getGalleryItemInfo = function(id,sucess,failure){
		apiRequest('get_gallery_item_info',id,sucess,failure);
	}

	function apiRequest(action,args,success,failure){
		$.ajax({
  			url: theme_url+'/api.php',
  			dataType: 'json',
  			data: {action: action, args: args}
		}).done(function( data ) {
    		success(data);
    	}).fail(function(jqXHR, textStatus, errorThrown){
			failure(jqXHR, textStatus, errorThrown);
		});
	}
}());