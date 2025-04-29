<?php
/**
 * Plugin Name: Custom Text-Image Slider Block
 * Description: A Gutenberg block with text and image columns that can slide.
 * Version: 1.0
 * Author: Brandon
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the block
 */
function ctsb_register_block() {
    // Register the block using the metadata loaded from the `block.json` file.
    register_block_type( __DIR__ );
}
add_action( 'init', 'ctsb_register_block' );

/**
 * Enqueue block assets for both editor and frontend
 */
function ctsb_enqueue_block_assets() {
    // Enqueue frontend styles
    wp_enqueue_style(
        'ctsb-slider-style',
        plugins_url( 'build/style-index.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/style-index.css' )
    );
}
add_action( 'enqueue_block_assets', 'ctsb_enqueue_block_assets' );

// Enqueue frontend script
function jra_custom_slider_block_enqueue_scripts() {
    if (has_block('ctsb/text-image-slider')) {
        wp_enqueue_script(
            'jra-custom-slider-block-frontend',
            plugins_url('build/frontend.js', __FILE__),
            array(),
            '1.0.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'jra_custom_slider_block_enqueue_scripts');