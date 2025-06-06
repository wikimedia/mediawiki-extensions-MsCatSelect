<?php

use MediaWiki\Config\Config;
use MediaWiki\EditPage\EditPage;
use MediaWiki\MediaWikiServices;
use MediaWiki\Output\OutputPage;

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
		$categories = $editPage->getContext()->getRequest()->getArray( 'SelectCategoryList', [] );
		$text = implode( "\n", array_map( static function ( string $category ) use ( $categoryNamespace ) {
			// If the sort key is empty, remove it
			$category = rtrim( $category, '|' );
			return "[[{$categoryNamespace}:{$category}]]";
		}, $categories ) );

		if ( $text !== '' ) {
			$editPage->textbox1 .= "\n\n{$text}";
		}
	}

	/**
	 * Remove the old category tag from the text the user views in the editbox.
	 *
	 * @param EditPage $editPage
	 */
	private static function cleanTextbox( EditPage $editPage ) {
		// Get localised namespace string
		$language = MediaWikiServices::getInstance()->getContentLanguage();
		$categoryNamespace = $language->getNsText( NS_CATEGORY );

		// The regular expression to find the category links
		$pattern = "\[\[({$categoryNamespace}):([^\|\]]*)(\|[^\|\]]*)?\]\]";

		// Don't remove categories in Semantic MediaWiki #ask queries
		// https://www.mediawiki.org/wiki/Topic:Uxnm9nzhdhhypum9
		$pattern = "(?<!#ask:)" . $pattern;

		// The container to store the processed text
		$cleanText = '';

		$editText = $editPage->textbox1;

		// Remove category links line by line
		$textLines = explode( "\n", $editText );
		foreach ( $textLines as $textLine ) {
			$cleanText .= preg_replace( "/{$pattern}/i", "", $textLine ) . "\n";
		}

		// Place the cleaned text into the text box
		$editPage->textbox1 = trim( $cleanText );
	}
}
