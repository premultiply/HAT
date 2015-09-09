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



add_action('admin_menu', 'hat_button_control_menu');
add_action('admin_enqueue_scripts', 'hat_enqueue_button_control_scripts');
add_action( 'admin_enqueue_scripts', 'hat_button_control_styles' );


function hat_button_control_menu() {

	add_menu_page( 'HAT Button Control', 'Button Control', 'manage_options', 'hat_button_control', 'hat_button_control_page', 'dashicons-list-view' );
}

function hat_button_control_page() {
	$menu_name = 'footer-menu';
	if ( ( $locations = get_nav_menu_locations() ) && isset( $locations[ $menu_name ] ) ) {
		$menu = wp_get_nav_menu_object( $locations[ $menu_name ] );
		$menu_items = wp_get_nav_menu_items($menu->term_id);
	} else {
		$menu_items = array();
	}

	function action_editor($menu_items){
		$availButtons = array('0',1,2,3,4,5,6,7,8,9,'Blue','Green','Yellow');
		$hide_button_id = false;
		foreach ( (array) $menu_items as $key => $menu_item ) {
			if (get_post_meta($menu_item->ID,'_menu_item_is_hide',true)!==''){
				$hide_button_id = $menu_item->ID;
			} else {
				$button = get_post_meta($menu_item->ID,'_menu_item_hat_button',true);
				if ($button!='' && ($key = array_search($button, $availButtons)) !== false){
					array_splice($availButtons, $key, 1);
				}
			}
		}
		$main_button = get_post_meta(1,'_main_menu_button',true);
		if ($main_button!='' && ($key = array_search($main_button, $availButtons)) !== false){
			array_splice($availButtons, $key, 1);
		}
				
		?>

		<h1>Footer Menu Actions</h1>
		<div class= "btn_control_pages_buttons" style="margin: 20px 0px;">
			<div class=class="btn_control_pages_buttons_pages" style="padding: 15px; height: 25px; text-align: center;">
				<div class="hat-menu-button" style="width:10%;">
					<div id="main-menu-button" class="drag-button">
						<?php
						if ($main_button==''){
							$main_button = $availButtons[0];
							array_splice($availButtons, 0, 1);
						}
						hat_button($main_button);
						?>
					</div>
				</div>
				The Button on which the main menu shall open
			</div>
		</div>
		<div class= "btn_control_pages_buttons">
			<div class=class="btn_control_pages_buttons_pages">
				<ul id="menu-item-list" class="droped-list">
					<?php
					if ($hide_button_id===false){
						?>
						<li id="hide-button" class="drag-menu-item">
							<div class="hat-menu-button">
								<div  ondragstart='event.preventDefault()'><?php hat_button('Red');?></div>
							</div>
							<div class="hat-menu-post" draggable="true">
								<?php echo get_theme_mod( 'hide_text'); ?>
							</div>
						</li>
						<?php
					}
					foreach ( (array) $menu_items as $key => $menu_item ) {
						if (get_post_meta($menu_item->ID,'_menu_item_show_footer',true)=='false'){
							continue;
						}
						if ($menu_item->ID === $hide_button_id){
							?> 
							<li id="hide-button" class="drag-menu-item">
								<div class="hat-menu-button">
									<div  ondragstart='event.preventDefault()'><?php hat_button('Red');?></div>
								</div>
								<div class="hat-menu-post" draggable="true">
									<?php echo get_theme_mod( 'hide_text'); ?>
								</div>
							</li>
							<?php
							continue;
						}
						$usedButton = get_post_meta($menu_item->ID,'_menu_item_hat_button',true);
						if ($usedButton==''){
							$usedButton = $availButtons[0];
							array_splice($availButtons, 0, 1);
						}
						$post_type = get_post($menu_item->object_id)->post_type;
						?> 
						<li class="drag-menu-item" >
							<div class="hat-menu-button">
								<div class="drag-button"><?php hat_button($usedButton);?></div>
							</div>
							<div class="hat-menu-post" post-type="<?php echo $post_type?>" post-id="<?php echo  $menu_item->object_id; ?>" draggable="true">
								<?php echo $menu_item->title;?>
							</div>
							<div alt="f153" class="dashicons dashicons-dismiss remove-menu-item"></div>
						</li>
						<?php
					}
					?>
					<li class="drag-menu-item placeholder" style="">
						<div class="hat-menu-post placeholder" draggable="true">
							Drag your Posts here
						</div>
					</li>
				</ul>

			</div>
			
		</div>
		Note that having more than 3-5 Items in your Footer will probably cause some of them to overflow and thus be invisible
		<h1>Invisible Actions</h1>
		<div class= "btn_control_pages_buttons">
			<div class=class="btn_control_pages_buttons_pages">
				<ul id="invis-item-list" class="droped-list">
					<?php
					foreach ( (array) $menu_items as $key => $menu_item ) {
						if (get_post_meta($menu_item->ID,'_menu_item_show_footer',true)!='false'){
							continue;
						}
						if ($menu_item->ID === $hide_button_id){
							?> 
							<li id="hide-button" class="drag-menu-item">
								<div class="hat-menu-button">
									<div  ondragstart='event.preventDefault()'><?php hat_button('Red');?></div>
								</div>
								<div class="hat-menu-post" draggable="true">
									<?php echo get_theme_mod( 'hide_text'); ?>
								</div>
							</li>
							<?php
							continue;
						}
						$usedButton = get_post_meta($menu_item->ID,'_menu_item_hat_button',true);
						if ($usedButton==''){
							$usedButton = $availButtons[0];
							array_splice($availButtons, 0, 1);
						}
						$post_type = get_post($menu_item->object_id)->post_type;
						?> 
						<li class="drag-menu-item" >
							<div class="hat-menu-button">
								<div class="drag-button"><?php hat_button($usedButton);?></div>
							</div>
							<div class="hat-menu-post" post-type="<?php echo $post_type?>" post-id="<?php echo  $menu_item->object_id; ?>" draggable="true">
								<?php echo $menu_item->title;?>
							</div>
							<div alt="f153" class="dashicons dashicons-dismiss remove-menu-item"></div>
						</li>
						<?php
					}
					?>
					<li class="drag-menu-item placeholder" style="">
						<div class="hat-menu-post placeholder" draggable="true">
							Drag your Posts here
						</div>
					</li>
				</ul>
			</div>
		</div>

		<h4>Available Buttons</h4>
		<ul id = "button-bar">
		<?php 
		foreach($availButtons as $key=>$value){
		?>
			<li>
				<div class="drag-button unused-button" draggable="true">
					<?php
					hat_button($value);
					?>
				</div>
			</li>
		<?php
		}
		?>
		</ul>
		<?php
	}

	function hat_button($name){
		?>
		<div class="hat-button" button-name="<?php echo $name?>">
			<img  src="<?php echo get_template_directory_uri().'/assets/button'.$name.'.png'; ?>"></img>
		</div>
		<?php
	}

	function post_list($post_type,$menu_items){
		$obj = get_post_type_object( $post_type);
		?>

		<div class="btn_control_pages_list_wrapper">
			<h1><?php echo $obj->labels->name; ?></h1>
			<ul data-empty-message="You have no unused Items" class="btn_control_pages_list draggable-list" post-type="<?php echo $post_type?>">
				<?php $args = array(
					'posts_per_page'   => 5,
					'offset'           => 0,
					'orderby'          => 'date',
					'order'            => 'DESC',
					'post_type'        => $post_type,
					'post_status'      => 'publish',
					'suppress_filters' => true 
					);
				$posts = get_posts( $args ); 
				foreach ( $posts as $post ) {
					$existInMenu = false;
					foreach((array)$menu_items as $item){
						if ($item->object_id==$post->ID){
							$existInMenu = true;
							break;
						}
					}
					if ($existInMenu) continue;
					?>

					<li class="drag-menu-item unused">
						<div class="hat-menu-post" post-type="<?php echo $post->post_type;?>" post-id="<?php echo  $post->ID; ?>"  draggable="true">
							<?php echo $post->post_title?>
						</div>
					</li >
					<?php
				}
				?>
			</ul>
		</div>
		<?php
	}

	?>


	<meta charset="utf-8">
	<h2>Button Control</h2>
	<div class="btn_control_decription">With the Button Control feature you are able to handle the actions of your remote control buttons (numbers and color buttons). You will find more information about this feature in our documentation at the <a href="http://fraunhoferfokus.github.io/HAT/index.html#hat_documentation_button_control" target="blank">GitHub repository</a>.</div>
	<div class="btn_control_post_lists" style="overflow:auto; ">
		<?php
		post_list('page',$menu_items);
		post_list('hat_popup',$menu_items);
		post_list('hat_function',$menu_items);
		?>
	</div>
	<div class="btn_control_pages_buttons_wrapper">
		<?php action_editor($menu_items); ?>
	</div>

	<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes"  onclick="saveButtonControlData('<?php echo get_template_directory_uri(); ?>/hat_button_control_save.php')"/>
	<div id="save-notification"><h3>Button Control settings saved!</h3></div>
	<?php
}


function hat_enqueue_button_control_scripts() {

	wp_register_script('hat-button-control-script', get_template_directory_uri().'/js/hat-button-control.js', array('jquery-1.11'));
	wp_enqueue_script('hat-button-control-script');
}

function hat_button_control_styles() {
	wp_register_style( 'hat-button-control-style', get_template_directory_uri() . '/css/hat-button-control-style.css', NULL, NULL, 'all' );
	wp_enqueue_style( 'hat-button-control-style' );
}

