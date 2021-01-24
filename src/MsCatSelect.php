<?php

use MediaWiki\MediaWikiServices;

class MsCatSelect {

	/**
	 * @param EditPage $editPage
	 * @param OutputPage $output
	 */
	public static function init( EditPage $editPage, OutputPage $output ) {
		global $wgMSCS_MainCategories,
			$wgMSCS_UseNiceDropdown,
			$wgMSCS_WarnNoCategories,
			$wgMSCS_WarnNoCategoriesException;

		// Load module
		$output->addModules( 'ext.MsCatSelect' );

		// Make the configuration variables available to JavaScript
		$mscsVars = [
			'MainCategories' => $wgMSCS_MainCategories,
			'UseNiceDropdown' => $wgMSCS_UseNiceDropdown,
			'WarnNoCategories' => $wgMSCS_WarnNoCategories,
			'WarnNoCategoriesException' => str_replace( ' ', '_', $wgMSCS_WarnNoCategoriesException ),
		];
		$mscsVars = json_encode( $mscsVars, true );
		$output->addScript( "<script>var mscsVars = $mscsVars;</script>" );
	}

	/**
	 * Entry point for the hook and main worker function for editing the page.
	 *
	 * @param EditPage $editPage
	 * @param OutputPage $output
	 */
	public static function showHook( EditPage $editPage, OutputPage $output ) {
		self::cleanTextbox( $editPage );
	}

	/**
	 * Entry point for the hook and main worker function for saving the page.
	 *
	 * @param EditPage $editPage
	 */
	public static function saveHook( EditPage $editPage ) {
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

	public static function onRegistration() {
		global $wgWikimediaJenkinsCI, $wgMSCS_WarnNoCategories;

		if ( isset( $wgWikimediaJenkinsCI ) && $wgWikimediaJenkinsCI === true ) {
			// disable javascript alerts for webdriver.io tests
			$wgMSCS_WarnNoCategories = false;
		}
	}
}
