<?php
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );
function theme_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );

}
add_filter('show_admin_bar', '__return_false');

function someJako($url, $title){
	$url 		= urlencode($url);
	$title 		= urlencode($title);
	$source		= urlencode("http://markokaartinen.net"); //kotisivusi osoite
	$twnick		= "MarkoK"; //Twitter nimimerkkisi
	$facebook	= '<a class="somenappi" href="https://www.facebook.com/sharer/sharer.php?u='.$url.'" target="_blank"><i class="fa fa-facebook"></i></a>';
	$twitter 	= '<a class="somenappi" href="https://twitter.com/share?text='.$title.'&amp;url='.$url.'&amp;via='.$twnick.'" target="_blank"><i class="fa fa-twitter"></i></a>';
	$gplus		= '<a class="somenappi" href="https://plus.google.com/share?url='.$url.'" target="_blank"><i class="fa fa-google-plus"></i></a>';
	$linkedin	= '<a class="somenappi" href="https://www.linkedin.com/shareArticle?mini=true&url='.$url.'&title='.$title.'&summary=&source='.$source.'" target="_blank"><i class="fa fa-linkedin"></i></a>';
	echo $facebook.$twitter.$linkedin.$gplus; //tulostetaan tuossa järjestyksessä
}
?>