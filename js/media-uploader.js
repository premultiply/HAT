 /**
 * Backend Media Uploader
 *
*/

//Media Upload
//TODO - need some layout for the metabox upload
jQuery(document).ready(function(){
   var currentMediaUploader;
	jQuery(document).on('click', '.media_upload', function() {
      currentMediaUploader = jQuery(this);
      tb_show('','media-upload.php?TB_iframe=true');
      return false;
   });
   if((window.original_tb_remove == undefined) && (window.tb_remove != undefined)) {
      window.original_tb_remove = window.tb_remove;
      window.tb_remove = function() {
         window.original_tb_remove();
      };
   }
   window.original_send_to_editor = window.send_to_editor;
   window.send_to_editor = function(html) {
      if(currentMediaUploader){
         var url = jQuery(html).attr('href');
         currentMediaUploader.parent().children("input:first").attr("value", url);
      }else{
         window.original_send_to_editor(html);
      }
      tb_remove();
   }
});