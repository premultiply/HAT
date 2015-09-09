<!--
Theme Name: 	hat
Theme URI: 		http://hat.fokus.fraunhofer.de/wordpress/
Description: 	HbbTV Application Toolkit
Version: 		0.1
Author: 		Fraunhofer Fokus
Author URI: 	http://www.fokus.fraunhofer.de/go/fame
Tags: 			hbbtv
-->

<?php

/* Required external files */

require_once( 'external/hat-utilities.php' );
include_once 'hat-button-control.php';

/* Theme specific settings */
add_theme_support('post-thumbnails');

// register_nav_menus(array('primary' => 'Primary Navigation'));

/* Scripts */
function hat_admin_scripts_init() {
	wp_register_script('jquery-1.11', get_template_directory_uri().'/js/general/jquery-1.11.3.js',false);
	wp_enqueue_script('jquery-1.11');

	wp_enqueue_script('media-upload');
	wp_enqueue_script('thickbox');
	wp_register_script('hat-media-uploader', get_template_directory_uri().'/js/media-uploader.js', array('jquery-1.11','media-upload','thickbox'));
	wp_enqueue_script('hat-media-uploader');

	wp_enqueue_style('thickbox');
}

function hat_enqueue_customizer_admin_scripts() {
	wp_register_script( 'customizer-admin', get_template_directory_uri() . '/js/customizer-admin.js', array( 'jquery-1.11' ), NULL, true );
	wp_enqueue_script( 'customizer-admin' );
}

function hat_enqueue_customizer_controls_styles() {

  wp_register_style( 'hat-customizer-controls', get_template_directory_uri() . '/css/customizer-controls.css', NULL, NULL, 'all' );
  wp_enqueue_style( 'hat-customizer-controls' );

}
add_action ("init" , "create_hat_post_types");


function create_hat_post_types() {
	register_post_type(
		'hat_gallery_item',
		array(
			'labels' => array(
				'name' => __( 'Gallery Items' ),
				'singular_name' => __( 'Gallery Item' ),
				'add_new_item' => __('Create a new Gallery Item')
			),
			'public' => true,
			'has_archive' => false,
			'menu_icon' => 'dashicons-format-gallery',
			'taxonomies' => array('post_tag')
		)
	);
	register_post_type(
		'hat_popup',
		array(
			'labels' => array(
				'name' => __( 'Popups' ),
				'singular_name' => __( 'Popup' ),
				'add_new_item' => __('Create a new Popup')
			),
			'public' => true,
			'has_archive' => false,
			'menu_icon' => 'dashicons-category',
		)
	);
	register_post_type(
		'hat_function',
		array(
			'labels' => array(
				'name' => __( 'Functions' ),
				'singular_name' => __( 'Function' ),
				'add_new_item' => __('Create a new Function')
			),
			'public' => true,
			'has_archive' => false,
			'menu_icon' => 'dashicons-media-code',
		)
	);
	remove_post_type_support('hat_function', 'editor');
	remove_post_type_support('hat_gallery_item', 'editor');
	remove_post_type_support('page', 'editor');
	register_taxonomy_for_object_type('post_tag', 'page');
}

/* Actions and Filters */
add_action('admin_enqueue_scripts', 'hat_admin_scripts_init');

add_action( 'admin_enqueue_scripts', 'hat_enqueue_customizer_admin_scripts' );

add_action( 'customize_register', 'hat_add_customizer_custom_controls' );

add_action( 'customize_controls_print_styles', 'hat_enqueue_customizer_controls_styles' );

add_action( 'customize_register', 'hat_customizer_register');

add_action( 'init', 'register_HAT_menu');

add_action('wp_head', 'hat_customizer_css');

add_action( 'after_setup_theme', 'remove_feeds' );

add_filter( 'body_class', array( 'Hat_Utilities', 'add_slug_to_body_class'));

remove_action('wp_head', 'feed_links_extra', 3 );
remove_action('wp_head', 'feed_links', 2 );

remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
remove_action('wp_head', 'wp_msapplication_TileImage');



function disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );	
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );	
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
}
add_action( 'init', 'disable_emojis' );


add_filter( 'mime_type_edit_pre', 'filter_function_name', 10, 2 );


// Remove Canonical Link Added By Yoast WordPress SEO Plugin
function at_remove_dup_canonical_link() {
	return false;
}
add_filter( 'wpseo_canonical', 'at_remove_dup_canonical_link' );



function hat_content_type( $mime_type, $post_id ) {
  header('Content-type: application/vnd.hbbtv.xhtml+xml; charset=utf-8');
  // Process content here
  return $mime_type;
}


//Remove Feed from Header
function remove_feeds() {
	remove_action( 'wp_head', 'feed_links_extra', 3 );
	remove_action( 'wp_head', 'feed_links', 2 );
}

/* Comments */
function hat_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment; 
	if ( $comment->comment_approved == '1' ):
?>	
	<li>
		<article id="comment-<?php comment_ID() ?>">
			<?php echo get_avatar( $comment ); ?>
			<h4><?php comment_author_link() ?></h4>
			<time><a href="#comment-<?php comment_ID() ?>" pubdate><?php comment_date() ?> at <?php comment_time() ?></a></time>
			<?php comment_text() ?>
		</article>
	</li>
<?php endif;
}


/* Customizer */

function hat_add_customizer_custom_controls( $wp_customize ) {

	class HAT_Customize_Alpha_Color_Control extends WP_Customize_Control {
	
		public $type = 'alphacolor';
		public $palette = true;
		public $default = 'rgba(255,255,255,0.9)';
	
		protected function render() {
			$id = 'customize-control-' . str_replace( '[', '-', str_replace( ']', '', $this->id ) );
			$class = 'customize-control customize-control-' . $this->type; ?>
			<li id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $class ); ?>">
				<?php $this->render_content(); ?>
			</li>
		<?php }
	
		public function render_content() { ?>
			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<input type="text" data-palette="<?php echo $this->palette; ?>" data-default-color="<?php echo $this->default; ?>" value="<?php echo intval( $this->value() ); ?>" class="hat-color-control" <?php $this->link(); ?>  />
			</label>
		<?php }
	}

}


function hat_customizer_register ($wp_customize){

	class HAT_Customize_Textarea_Control extends WP_Customize_Control {
		public $type = 'textarea';
	 
		public function render_content() {
			?>
			<label>
			<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
			<textarea rows="5" style="width:100%;" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
			</label>
			<?php
		}
	}

	/* Logo */
	$wp_customize->add_section('hat_images', array(
		'title' => __('Logo' , 'hat'),
		'description' => 'Modify the theme logo'
	));
	$wp_customize->add_setting('logo_image', array(
		'default' => get_template_directory_uri().'/assets/logo_hat.png'
	));
	$wp_customize->add_control(new WP_Customize_Image_Control($wp_customize,'logo_image', array(
		'label' => __('max. height: 85px, max. width: 250px', 'hat'),
		'section' => 'hat_images',
		'settings' => 'logo_image'
	)));

	/* Background Image */
	$wp_customize->add_section('hat_background_images', array(
		'title' => __('Background Image' , 'hat'),
		'description' => 'Modify the theme Background Image'
	));
	$wp_customize->add_setting('bg_image', array(
		'default' => get_template_directory_uri().'/assets/bgr_hat.png'
	));
	$wp_customize->add_control(new WP_Customize_Image_Control($wp_customize,'bg_image', array(
		'label' => __('height: 1280px, width: 720px', 'hat'),
		'section' => 'hat_background_images',
		'settings' => 'bg_image'
	)));
	
	/* General Colors */
	$wp_customize->add_section('hat_colors', array(
		'title' => __('General Colors' , 'hat'),
		'description' => 'Modify the theme colors'
	));
	$wp_customize->add_setting('background_color', array(
		'default' => '#fff'
	));
	$wp_customize->add_setting('title_color', array(
		'default' => '#666'
	));
	$wp_customize->add_setting('title_background_color');
	$wp_customize->add_setting('font_color', array(
		'default' => '#666'
	));
	$wp_customize->add_setting('link_color', array(
		'default' => '#00688B'
	));
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'background_color', array(
		'label' => __('Edit Background Color', 'hat'),
		'section' => 'hat_colors',
		'settings' => 'background_color'
	)));
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'title_color', array(
		'label' => __('Edit Title Color', 'hat'),
		'section' => 'hat_colors',
		'settings' => 'title_color'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'title_background_color', array(
		'label' => __('Edit Title Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_colors'
	)));
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'font_color', array(
		'label' => __('Edit Font Color', 'hat'),
		'section' => 'hat_colors',
		'settings' => 'font_color'
	)));
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'link_color', array(
		'label' => __('Edit Links Color', 'hat'),
		'section' => 'hat_colors',
		'settings' => 'link_color'
	)));

	/* Module Colors */
	$wp_customize->add_section('hat_module_colors', array(
		'title' => __('Module Colors' , 'hat'),
		'description' => 'Modify the module colors'
	));
	$wp_customize->add_setting('module_title_color', array(
		'default' => '#666'
	));
	$wp_customize->add_setting('module_header_bg_color');
	$wp_customize->add_setting('module_color');
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'module_title_color', array(
		'label' => __('Edit Module Header Title Color', 'hat'),
		'section' => 'hat_module_colors',
		'settings' => 'module_title_color'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'module_header_bg_color', array(
		'label' => __('Edit Module Header Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_module_colors'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'module_color', array(
		'label' => __('Edit Module Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_module_colors'
	)));


	/* Module Active Colors */
	$wp_customize->add_setting('module_title_color_active', array(
		'default' => '#666'
	));
	$wp_customize->add_setting('module_header_bg_color_active');
	$wp_customize->add_setting('module_color_active');
			$wp_customize->add_setting('module_text_color_active', array(
		'default' => '#666'
	));
	$wp_customize->add_setting('module_font_color_active_highlight');
	$wp_customize->add_setting('module_color_active_highlight');
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'module_title_color_active', array(
		'label' => __('Edit Selected Module Header Title Color', 'hat'),
		'section' => 'hat_module_colors',
		'settings' => 'module_title_color_active'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'module_header_bg_color_active', array(
		'label' => __('Edit Selected Module Header Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_module_colors'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'module_color_active', array(
		'label' => __('Edit Selected Module Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_module_colors'
	)));
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'module_text_color_active', array(
		'label' => __('Edit Selected Module Text Color', 'hat'),
		'section' => 'hat_module_colors',
		'settings' => 'module_text_color_active'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'module_font_color_active_highlight', array(
		'label' => __('Edit Selected Module Highlight Font Color', 'hat'),
		'palette' => true,
		'section' => 'hat_module_colors'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'module_color_active_highlight', array(
		'label' => __('Edit Selected Module Highlight Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_module_colors'
	)));

	/* Menu Colors */
	$wp_customize->add_section('hat_menu_colors', array(
		'title' => __('Menu Settings' , 'hat'),
		'description' => 'Modify the menu settings',
		'priority'  => 202
	));
	$wp_customize->add_setting('menu_text',array(
	    'default' => 'Menu',
	));
	$wp_customize->add_setting('hide_text',array(
	    'default' => 'Hide',
	));
	$wp_customize->add_setting('menu_background_color');
	$wp_customize->add_setting('menu_font_color', array(
		'default' => '#666'
	));
	$wp_customize->add_setting('footer_background_color');
	$wp_customize->add_control('menu_text',array(
        'label' => 'Change text for the Primary Menu',
        'section' => 'hat_menu_colors',
        'type' => 'text',
    ));
    $wp_customize->add_control('hide_text',array(
        'label' => 'Change text to hide the app',
        'section' => 'hat_menu_colors',
        'type' => 'text',
    ));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'menu_background_color', array(
		'label' => __('Edit Primary Menu Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_menu_colors'
	)));
	$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize,'menu_font_color', array(
		'label' => __('Edit Font Color', 'hat'),
		'section' => 'hat_menu_colors',
		'settings' => 'menu_font_color'
	)));
	$wp_customize->add_control(new HAT_Customize_Alpha_Color_Control($wp_customize,'footer_background_color', array(
		'label' => __('Edit Menu Background Color', 'hat'),
		'palette' => true,
		'section' => 'hat_menu_colors'
	)));


	/* Frontpage */

	$wp_customize->remove_section('static_front_page');
	update_option('show_on_front','page');
	
	$wp_customize->add_section( 'hat_front_page', array(
		'title'          => __( 'Frontpage' ),
		'priority'       => 120,
		'description'    => __( 'Select the page to be displayed on the front' ),
	) );

	$wp_customize->add_setting( 'page_on_front', array(
		'type'       => 'option',
		'capability' => 'manage_options',
	) );

	$wp_customize->add_control( 'page_on_front', array(
		'label'      => __( 'Frontpage' ),
		'section'    => 'hat_front_page',
		'type'       => 'dropdown-pages',
	) );
}

function hat_customizer_css(){
?>
	<style type="text/css">
		body { 
			color: <?php echo get_theme_mod('font_color'); ?>;
		}
		a { 
			color: <?php echo get_theme_mod('link_color'); ?>;
		}
		#hbbtv_app { 
			background-color: #<?php echo get_theme_mod('background_color'); ?>;
			background-image: url("<?php echo get_theme_mod('bg_image'); ?> ");
		}
		#title { 
			color: <?php echo get_theme_mod('title_color'); ?>;
			background-color: <?php echo get_theme_mod('title_background_color'); ?>;
		}
		.menuText{
			color: <?php echo get_theme_mod('menu_font_color'); ?>;
		}
		footer{
			 background-color: <?php echo get_theme_mod('footer_background_color'); ?>;
		}
		footer, footer a, #primary-menu-wrap a{
			color: <?php echo get_theme_mod('menu_font_color'); ?>;
		}
		#primary-menu-wrap{
			background-color: <?php echo get_theme_mod('menu_background_color'); ?>;
		}
		.contentHeader{
			color: <?php echo get_theme_mod('module_title_color'); ?>;
			background-color: <?php echo get_theme_mod('module_header_bg_color'); ?>;
		}
		.active .contentHeader{
			color: <?php echo get_theme_mod('module_title_color_active'); ?>;
			background-color: <?php echo get_theme_mod('module_header_bg_color_active'); ?> !important;
		}
		.textContent, .imageContent, .galleryContent, .socialContent, .socialPopup, #item-info{
			background-color: <?php echo get_theme_mod('module_color'); ?>;
		}			
		.active .textContent, .active .imageContent, .active .galleryContent, .active .socialContent{
			color: <?php echo get_theme_mod('module_text_color_active'); ?>;
			background-color: <?php echo get_theme_mod('module_color_active'); ?>;
		}
		.active .socialContent .activePost{
			color: <?php echo get_theme_mod('module_font_color_active_highlight'); ?>;
			background-color: <?php echo get_theme_mod('module_color_active_highlight'); ?>;
		}
	</style>
<?php
}


/* Menu */

function register_HAT_menu() {
  register_nav_menus( array (
	'primary-menu' =>__( 'Primary Menu', 'hat' ),
	//'footer-menu' =>__( 'Footer Menu', 'hat' ),
  ));
}

/**
 * Add different Metaboxes to the edit screen.
 * 
 */

$post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'] ;
$template_file = get_post_meta($post_id,'_wp_page_template',TRUE);
// check for a template type
// if ($template_file) {
// 	echo 'Template: '.$template_file;
// }
if ($template_file == 'template-fullpage.php') {
	add_action( 'add_meta_boxes', 'fullpage_add_meta_box' );
}
if ($template_file == 'template-two_columns.php') {
	add_action( 'add_meta_boxes', 'two_columns_add_meta_box' );
}
if ($template_file == 'template-three_columns.php') {
	add_action( 'add_meta_boxes', 'three_columns_add_meta_box' );
}
if ($template_file == 'template-media_gallery.php') {
	add_action( 'add_meta_boxes', 'media_gallery_add_meta_box' );
}
add_action('save_post', 'save_meta_box_contentselection');
add_action('add_meta_boxes', 'add_hat_post_type_meta_boxes');

function add_hat_post_type_meta_boxes(){
	add_meta_box('hat_function_meta_box', 'Javascript Code', 'hat_function_meta_box_callback', 'hat_function', 'advanced', 'high');
	add_meta_box('hat_popup_function_meta_box', 'Button Functions', 'popup_meta_box_callback', 'hat_popup', 'advanced', 'high');
	add_meta_box('hat_gallery_item_meta_box', 'Gallery Item Content', 'gallery_item_meta_box_callback', 'hat_gallery_item', 'advanced', 'high');
}

function hat_function_meta_box_callback($post, $param) {
	?>
	<textarea name="_hat_functionContent" id="post_text" rows="10"><?php echo get_post_meta($post->ID,'_hat_functionContent',true) ?></textarea>
	<?php
}

function gallery_item_meta_box_callback($post, $param){
	$postMeta = get_post_meta( $post->ID, '_hat_galleryItemContent', true);
	if(!$postMeta) { $postMeta = array(); };
	?>	
		<style>
			#description-editor {
				position: absolute;
				left: 40%;
				width: 55%;
				margin-right: 5%;
				
			}
			#preview {
				margin: 0px 5%;
				left: 0%;
				width: 30%;
				position: absolute;
				overflow: hidden;
			}
			#content-edit{
				height: 600px;
			}
			#cover-preview{
				width: 100%;
			}
			#cover-preview img {
				width: 100%;
				background-size: cover;
			}
		</style>
		<div id="content-edit">
		<div id="description-editor">
			<?php
			wp_editor($postMeta['info'],'editor',array('textarea_name'=>'_hat_galleryItemContent[info]','drag_drop_upload' => true,'wpautop' => false));
			?>
		</div>
		<div id="preview">
			<label> Cover-URL <input type='text' name='_hat_galleryItemContent[cover_url]' value="<?php echo $postMeta['cover_url']; ?>"> <br/><br/>or Cover-Upload: <input type='button' class='media_upload' value='Select File'></label>
			<div id="cover-preview">
				<img src="<?php echo $postMeta['cover_url']; ?>"></img>
			</div>
			<label> Trailer-URL <input type='text' name='_hat_galleryItemContent[trailer_url]' value="<?php echo $postMeta['trailer_url']; ?>"> <br/><br/> or Trailer-Upload: <input type='button' class='media_upload' value='Select File'></label>
		</div>
		
		</div>

	<?php
}


function popup_meta_box_callback($post, $param){
	include_once 'userFunctions/popup_functions.php';
	$postMeta = get_post_meta( $post->ID, '_hat_popupContent', true);
	if(!$postMeta) { $postMeta = array(); };
?>

	<!--<script type='text/javascript' src="<?php bloginfo( 'template_url' ); ?>/js/general/jquery-1.11.0.js"></script>-->
	<table id="buttonFunctions">
	<tr>
		<th>Button</th>
		<th>Function</th>
		<th>Description</th>
		<th>Activate</th>
	</tr> 
	<?php 
		for ($i=0;$i<10;$i++) {
			popup_button_function($i,$postMeta,$userFunctions);
		}
		popup_button_function('Blue',$postMeta,$userFunctions);
		popup_button_function('Green',$postMeta,$userFunctions);
		popup_button_function('Yellow',$postMeta,$userFunctions);
	?>
	</table>
	<script>
		function toogleTableRow(target){
			var opt = jQuery(target).parent().parent().find('select , input:not(.checkbox)');
			if (target.checked){
				opt.removeAttr('disabled');
			} else {
				opt.attr('disabled','');
			}
		}
	</script>
<?php
}

function popup_button_function($buttonName,$meta,$userFunctions) {
	
	$func = $meta['button_functions'][$buttonName]['func'];
	$desc = $meta['button_functions'][$buttonName]['desc'];
	$exist = isset($func);
?>	

	<tr>
		<th><img src="<?php echo (get_bloginfo('template_url').'/assets/button'. $buttonName.'.png') ?>"></img></th>
		<th>
			<select <?php disabled(!$exist);?> class="functionSelection" name="_hat_popupContent[button_functions][<?php echo $buttonName ?>][func]">
				<option selected disabled> Select a function </option>
				<?php 
				foreach ($userFunctions as $key => $value) {
					?>
					<option value="<?php echo $value; ?>" <?php selected( $func, $value ); ?>><?php echo $key; ?></option>
					<?php
				}
				?>
			</select>
		</th>
		<th>
			<input <?php disabled(!$exist);?> type="text" value="<?php echo $desc;?>" placeholder="Enter a description" name="_hat_popupContent[button_functions][<?php echo $buttonName ?>][desc]">
		</th>
		<th>
			<input class="checkbox" type="checkbox" onchange="toogleTableRow(this)" <?php checked($exist);?>>
		</th>
			
	</tr>
<?php
}

function fullpage_add_meta_box() {

	$var1 = get_template_directory_uri().'/assets/template-fullpage_mockup_Thumbnail.png';

	add_meta_box('hat_layout_meta_box', 'Layout', 'meta_box_layout_callback', 'page', 'advanced', 'high',
			array( 'iconurl' => $var1, 'box' => 'box1'));
	add_meta_box('hat_content_meta_box', 'Content Box', 'meta_box_contentselection_callback', 'page', 'advanced', 'high',
			array( 'iconurl' => $var1, 'box' => 'box1'));

}


function two_columns_add_meta_box() {

	$var1 = get_template_directory_uri().'/assets/template-two_columns_mockup_Thumbnail_big.png';
	$var2 = get_template_directory_uri().'/assets/template-two_columns_mockup_Thumbnail_small.png';

	add_meta_box('hat_content_meta_box_left', 'Content Box Left', 'meta_box_contentselection_callback','page', 'advanced', 'high',
		array( 'iconurl' => $var1, 'box' => 'box1')
	);

	add_meta_box('hat_content_meta_box_right', 'Content Box Right', 'meta_box_contentselection_callback','page', 'advanced', 'high',
		array( 'iconurl' => $var2, 'box' => 'box2') 
		);
}

function three_columns_add_meta_box() {

	$var1 = get_template_directory_uri().'/assets/template-three_columns_mockup_Thumbnail_left.png';
	$var2 = get_template_directory_uri().'/assets/template-three_columns_mockup_Thumbnail_middle.png';
	$var3 = get_template_directory_uri().'/assets/template-three_columns_mockup_Thumbnail_right.png';

	add_meta_box('hat_content_meta_box_left', 'Content Box Left', 'meta_box_contentselection_callback','page', 'advanced', 'high',
		array( 'iconurl' => $var1, 'box' => 'box1') 
	);
	
	add_meta_box('hat_content_meta_box_middle', 'Content Box Middle', 'meta_box_contentselection_callback','page', 'advanced', 'high',
		array( 'iconurl' => $var2, 'box' => 'box2') 
	);
	
	add_meta_box('hat_content_meta_box_right', 'Content Box Right', 'meta_box_contentselection_callback','page', 'advanced', 'high',
		array( 'iconurl' => $var3, 'box' => 'box3') 
	);
}


function media_gallery_add_meta_box() {
	$var1 = get_template_directory_uri().'/assets/template-fullpage_mockup_Thumbnail.png';

	add_meta_box('hat_gallery_meta_box', 'Gallery Layout', 'gallery_meta_box_callback', 'page', 'advanced', 'high');
}

function gallery_meta_box_callback($post, $param){
	$postMeta = get_post_meta( $post->ID, '_hat_pageContent', true);
	if(!$postMeta) { $postMeta = array(); }
	?>
		<label style="display: block;"><p style="width:90px;display:inline-block;margin:0;">Cover orientation: </p>
			<select name="_hat_pageContent[cover_orientation]">
				<option selected value="portrait"<?php selected( $postMeta['cover_orientation'], 'portrait' ); ?>>Portrait</option>
				<option value="landscape"<?php selected( $postMeta['cover_orientation'], 'landscape' ); ?>>Landscape</option>
			</select>
		</label>
		<label style="display: block;"><p style="width:90px;display:inline-block;margin:0;">Item-list position</p>
			<select name="_hat_pageContent[list_position]">
				<option selected value="left"<?php selected( $postMeta['list_position'], 'left' ); ?>>Left</option>
				<option value="right"<?php selected( $postMeta['list_position'], 'right' ); ?>>Right</option>
			</select>
		</label>
	<?php
}


function meta_box_layout_callback($post,$param){
	$postMeta = get_post_meta( $post->ID, '_hat_pageContent', true);
	$box = $param['args']['box'];
	if(!$postMeta) { $postMeta = array(); }else{ $postMeta = $postMeta[$box]; }
	
	?>
	<label style="display: block;"><p style="width:90px;display:inline-block;margin:0;">Box Width</p>
		<input style="width: 50px;" name="_hat_pageContent[<?php echo $box;?>][width]" type="number" min="33" max="100" step="1" value="<?php echo $postMeta['width'];?>"/> %
	</label>
	<label style="display: block;"><p style="width:90px;display:inline-block;margin:0;">Box Aligment</p>
			<select class="contenttype <?php echo $param['args']['box'] ?>" name="_hat_pageContent[<?php echo $box;?>][align] ?>]">
				<option disabled selected> -- select an option -- </option>
				<option value="left"<?php selected( $postMeta['align'], 'left' ); ?>>Left</option>
				<option value="center"<?php selected( $postMeta['align'], 'center' ); ?>>Center</option>
				<option value="right"<?php selected( $postMeta['align'], 'right' ); ?>>Right</option>
			</select>
		</label>
	 <?php

}

function meta_box_contentselection_callback($post, $param) {

	$contenttype = $navigable = $title = $data = "";
	$postMeta = get_post_meta( $post->ID, '_hat_pageContent', true);
	if(!$postMeta) { $postMeta = array(); }else{ $postMeta = $postMeta[$param['args']['box']]; }
	
?>
	
	<img src="<?php echo $param['args']['iconurl'] ?>" style="width:48%; max-width:250px;min-height:80px;"></img>
	<div style="float: right; max-width:48%;">
		<label style="display: block;"><p style="width:90px;display:inline-block;margin:0;">Contenttype:</p>
			<select class="contenttype <?php echo $param['args']['box'] ?>" name="_hat_pageContent[<?php echo $param['args']['box'] ?>][contenttype]">
				<option disabled selected> -- select an option -- </option>
				<option value="broadcast"<?php selected( $postMeta['contenttype'], 'broadcast' ); ?>>Broadcast</option>
				<option value="video"<?php selected( $postMeta['contenttype'], 'video' ); ?>>Video</option>
				<option value="text"<?php selected( $postMeta['contenttype'], 'text' ); ?>>Text</option>
				<option value="image"<?php selected( $postMeta['contenttype'], 'image' ); ?>>Image</option>
				<option value="scribble"<?php selected( $postMeta['contenttype'], 'scribble' ); ?>>Scribble</option>
				<option value="social"<?php selected( $postMeta['contenttype'], 'social' ); ?>>Social</option>
			</select>
		</label>
		<label style="display: block;"><p style="width:90px;display:inline-block;margin:0;">Navigable:</p>
			<input id="nav-checkbox-<?php echo $param['args']['box'] ?>" <?php disabled($postMeta['contenttype'], 'broadcast' );?> type="checkbox" name="_hat_pageContent[<?php echo $param['args']['box'] ?>][navigable]" value="navigable" <?php if($postMeta['navigable']){echo checked;} ?>>
		</label>
		<label style="display: block;"><p style="width:90px;display:inline-block;margin:0;">Title:</p>
			<input type="text" name="_hat_pageContent[<?php echo $param['args']['box'] ?>][title]" size="22" maxlength="40" value="<?php echo $postMeta['title'] ?>">
		</label>
	</div>
	<div class="settings" style="padding: 15px;">
		<div class="editor <?php echo $param['args']['box'] ?>" style="<?php if($postMeta['contenttype'] != 'text') {echo 'display:none'; } ?>">
			<?php
				$content = $postMeta['data'];
				$content = isset($content)?$content:"Enter text here";
				$args = array (
						'textarea_name' => '_hat_pageContent['.$param['args']['box'].'][data]',
						'drag_drop_upload' => true,
						'wpautop' => false
					);
				wp_editor($content,'textedit'.$param["id"],$args);
			?>
		</div>
		<div class="other">
			<?php switch($postMeta['contenttype']):
			case 'broadcast': ?>
				<?php break;
			case 'video': ?>
				Video-URL: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value="<?php echo $postMeta['data'] ?>"><br><br> or <br><br>File-Upload: <input type='button' class='media_upload' value='Select File'>
				<?php break;
			case 'image': ?>
				Image-URL: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value="<?php echo $postMeta['data'] ?>"><br><br> or <br><br>File-Upload: <input type='button' class='media_upload' value='Select File'>
				<?php break;
			case 'scribble': ?>
				Scribble ID: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value="<?php echo $postMeta['data'] ?>">
				<?php break;
			case 'social': ?>
				Social ID: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value="<?php echo $postMeta['data'] ?>">
				<?php break; ?>
		<?php endswitch; ?>
		</div>

	<?php submit_button(); ?>
	</div>


	<script type="text/javascript">

		// var selected = <?php echo json_encode($postMeta.contenttype);?>;
		// var jContenttype = jQuery('.contenttype');
		jQuery('.contenttype.<?php echo $param['args']['box'] ?>').change(function() {
			var html;
			var editor = jQuery('.settings .editor.<?php echo $param['args']['box'] ?>');
			editor.hide();
			switch(this.value){
				case 'broadcast':
					html = "";
					jQuery('#nav-checkbox-<?php echo $param['args']['box'] ?>').attr('disabled','true');
					break;
				case 'video':
					html = "Video-URL: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value='<?php echo $postMeta['data'] ?>'><br><br> or <br><br>File-Upload: <input type='button' class='media_upload' value='Select File'>";
					jQuery('#nav-checkbox-<?php echo $param['args']['box'] ?>').removeAttr('disabled');
					break;
				case 'text':
					html = "";
					editor.show();
					jQuery('#nav-checkbox-<?php echo $param['args']['box'] ?>').removeAttr('disabled');
					break;
				case 'image':
					html = "Image-URL: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value='<?php echo $postMeta['data'] ?>'><br><br> or <br><br>File-Upload: <input type='button' class='media_upload' value='Select File'>";
					jQuery('#nav-checkbox-<?php echo $param['args']['box'] ?>').removeAttr('disabled');
					break;
				case 'scribble':
					html = "Scribble ID: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value='<?php echo $postMeta['data'] ?>'>";
					jQuery('#nav-checkbox-<?php echo $param['args']['box'] ?>').removeAttr('disabled');
					break;
				case 'social':
					html = "Social ID: <input type='text' name='_hat_pageContent[<?php echo $param['args']['box'] ?>][data]' value='<?php echo $postMeta['data'] ?>'>";
					jQuery('#nav-checkbox-<?php echo $param['args']['box'] ?>').removeAttr('disabled');
					break;
				default:
			}
			jQuery(this).eq(0).parent().parent().next().children('.other').html(html);
		});
	</script>

<?php
}

function save_meta_box_contentselection($post_id){

	if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
	if( !current_user_can( 'edit_post' ) ) return;

	if (get_post_type($post_id)=='hat_popup'){
		$new_meta_value = $_POST['_hat_popupContent'];
		$meta_key = '_hat_popupContent';
		$meta_value = get_post_meta( $post_id, $meta_key, true );
		if ( $new_meta_value && $new_meta_value != $meta_value ){
			update_post_meta( $post_id, $meta_key, $new_meta_value );
		}
	} elseif (get_post_type($post_id)=='hat_function'){
		$new_meta_value = $_POST['_hat_functionContent'];
		$meta_key = '_hat_functionContent';
		$meta_value = get_post_meta( $post_id, $meta_key, true );
		if ( $new_meta_value && $new_meta_value != $meta_value ){
			update_post_meta( $post_id, $meta_key, $new_meta_value );
		}

	} elseif (get_post_type($post_id)=='hat_gallery_item'){
		$new_meta_value = $_POST['_hat_galleryItemContent'];
		$meta_key = '_hat_galleryItemContent';
		$meta_value = get_post_meta( $post_id, $meta_key, true );
		if ( $new_meta_value && $new_meta_value != $meta_value ){
			update_post_meta( $post_id, $meta_key, $new_meta_value );
		}
	
	} else {
		$new_meta_value = $_POST['_hat_pageContent'];
		$meta_key = '_hat_pageContent';
		$meta_value = get_post_meta( $post_id, $meta_key, true );
		if ( $new_meta_value && $new_meta_value != $meta_value ){
			update_post_meta( $post_id, $meta_key, $new_meta_value );
		}
	}

}


function generateContentBox($data){
	$html = "";
	switch($data['contenttype']):
		case 'broadcast':
			$html .= "<object id='broadcast' type='video/broadcast' height='100%' width='100%'></object>";
			$html .= "<script type='text/javascript'>window.setTimeout( function() { $('#broadcast')[0].bindToCurrentChannel(); }, 10); </script>";
			break;
		case 'video':
			$html .= "<object id='videoplayer' width='100%' height='100%' type='video/mp4' data='$data[data]'></object>";
			$html .= "<script type='text/javascript'>window.setTimeout( function() { if($('#videoplayer')){vid_obj = $('#videoplayer')[0]; if (vid_obj && vid_obj.play) vid_obj.play(1); } }, 10); </script>";
			break;
		case 'image':
			$html .= "<div class='contentHeader'>$data[title]</div>";
			$html .= "<div class='imageContent' style='background-image: url($data[data]);'></div>";
			break;
		case 'text':
			$html .= "<div class='contentHeader'>$data[title]</div>";
			$html .= "<div class='textContent'>$data[data]</div>";
			break;
		case 'scribble':
			$html .= "<script type='text/javascript'> $(document).ready(function(){scribble = new scribbleModule($('[data-type=scribble]')[0], $data[data], '$data[title]'); scribble.setActive(true); }); </script>";
			break;
		case 'social':
			$html .= "<script type='text/javascript'> $(document).ready(function(){ SocialModule.init('[data-type=social]', $data[data], '$data[title]')}); </script>";
	endswitch;
	echo $html;
}





/**
 * Adds a box to the main column on the Post and Page edit screens.
 */

$current_template;
function myplugin_add_meta_box() {

	$post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'] ;
	$GLOBALS['current_template'] = substr(get_post_meta($post_id,'_wp_page_template',TRUE),0,-4);


	$screens = array( 'post', 'page');

	foreach ( $screens as $screen ) {

		add_meta_box(
			'myplugin_sectionid',
			__( 'Design of '.$GLOBALS['current_template'], 'myplugin_textdomain' ),
			'myplugin_meta_box_callback',
			$screen
		);
	}
}

add_action( 'add_meta_boxes', 'myplugin_add_meta_box' );

/**
 * Prints the box content.
 * 
 * @param WP_Post $post The object for the current post/page.
 */
function myplugin_meta_box_callback($post) {

	$template_mockup = get_template_directory_uri().'/assets/'.$GLOBALS['current_template'].'_mockup.png';
	echo  '<img src="'.$template_mockup.'" style="width:100%" ></img>';

}



