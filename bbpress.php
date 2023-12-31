<?php
/**
 * The template for displaying bbPress
 *
 * @package Betheme
 * @author Muffin group
 * @link https://muffingroup.com
 */

get_header();
?>

<div id="Content">
	<div class="content_wrapper clearfix">

		<main class="sections_group">
			<section class="section the_content">
				<div class="section_wrapper">
					<div class="the_content_wrapper">
						<?php
							while (have_posts()) {
								the_post();
								the_content();
							}
						?>
					</div>
				</div>
			</section>
		</main>

		<?php get_sidebar(); ?>

	</div>
</div>

<?php get_footer();
