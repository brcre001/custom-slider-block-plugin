<?php
/**
 * Plugin Name: Custom Text-Image Slider Block
 * Description: A Gutenberg block with text and image columns that can slide.
 * Version: 1.0
 * Author: Brandon
 */

function ctsb_register_block() {
    register_block_type( __DIR__ );
}
add_action( 'init', 'ctsb_register_block' );