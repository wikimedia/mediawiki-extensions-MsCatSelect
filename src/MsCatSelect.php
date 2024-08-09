<?php

use MediaWiki\MediaWikiServices;

class MsCatSelect {

	public static function onResourceLoaderGetConfigVars( array &$vars, string $skin, Config $config ) {
		$mainCategories = $config->get( 'MSCS_MainCategories' );
		$useNiceDropdown = $config->get( 'MSCS_UseNiceDropdown' );
		$warnNoCategories = $config->get( 'MSCS_WarnNoCategories' );
		$warnNoCategoriesException = $config->get( 'MSCS_WarnNoCategoriesException' );
		$vars['wgMSCS_MainCategories'] = $mainCategories;
		$vars['wgMSCS_UseNiceDropdown'] = $useNiceDropdown;
		$vars['wgMSCS_WarnNoCategories'] = str_replace( ' ', '_', $warnNoCategories );
		$vars['wgMSCS_WarnNoCategoriesException'] = str_replace( ' ', '_', $warnNoCategoriesException );
	}

	/**
	 * Entry point for the hook and main worker function for editing the page.
	 *
	 * @param EditPage $editPage
	 * @param OutputPage $output
	 */
	public static function onShowEditFormInitial( EditPage $editPage, OutputPage $output ) {
		$output->addModules( 'ext.MsCatSelect' );
		self::cleanTextbox( $editPage );
	}

	/**
	 * Entry point for the hook and main worker function for saving the page.
	 *
	 * @param EditPage $editPage
	 */
	public static function onAttemptSave( EditPage $editPage ) {
		// Get localised namespace string
		$language = MediaWikiServices::getInstance()->getContentLanguage();
		$categoryNamespace = $language->getNsText( NS_CATEGORY );

		// Iterate through all selected category entries:
		$text = "\n";
		if ( array_key_exists( 'SelectCategoryList', $_POST ) ) {
			foreach ( $_POST['SelectCategoryList'] as $category ) {
				// If the sort key is empty, remove it
				$category = rtrim( $category, '|' );
				$text .= "\n[[" . $categoryNamespace . ":" . $category . "]]";
			}
		}
		$editPage->textbox1 .= $text;
	}

	/**
	 * Remove the old category tag from the text the user views in the editbox.
	 *
	 * @param EditPage $editPage
	 */
	private static function cleanTextbox( $editPage ) {
		// Get localised namespace string
		$language = MediaWikiServices::getInstance()->getContentLanguage();
		$categoryNamespace = $language->getNsText( NS_CATEGORY );

		// The regular expression to find the category links:
		$pattern = "\[\[({$categoryNamespace}):([^\|\]]*)(\|[^\|\]]*)?\]\]";

		// The container to store the processed text:
		$cleanText = '';

		$editText = $editPage->textbox1;

		// Check linewise for category links:
		foreach ( explode( "\n", $editText ) as $textLine ) {
			// Filter line through pattern and store the result:
			$cleanText .= preg_replace( "/{$pattern}/i", "", $textLine ) . "\n";
		}
		// Place the cleaned text into the text box:
		$editPage->textbox1 = trim( $cleanText );
	}
}
