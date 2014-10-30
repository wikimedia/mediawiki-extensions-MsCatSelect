<?php

class MsCatSelect {

	static function start() {
		global $wgOut, $wgJsMimeType, $wgMSCS_MainCategories, $wgMSCS_UseNiceDropdown, $wgMSCS_WarnNoCategories;

		// Load module
		$wgOut->addModules( 'ext.MsCatSelect' );

		// Make the configuration available to JavaScript
		$mscsVars = array(
			'MainCategories' => $wgMSCS_MainCategories,
			'UseNiceDropdown' => $wgMSCS_UseNiceDropdown,
			'WarnNoCategories' => $wgMSCS_WarnNoCategories,
		);
		$mscsVars = json_encode( $mscsVars, true );
		$wgOut->addScript( "<script type=\"{$wgJsMimeType}\">var mscsVars = $mscsVars;</script>\n" );

		return true;
	}

	// Entry point for the hook and main worker function for editing the page:
	static function showHook( EditPage $editPage, OutputPage $output ) {
		self::cleanTextbox( $editPage );
		return true;
	}

	// Entry point for the hook and main worker function for saving the page:
	static function saveHook( $editPage ) {
		global $wgContLang, $wgTitle;

		// Get localised namespace string
		$categoryNamespace = $wgContLang->getNsText( NS_CATEGORY );

		// Default sort key is page name with stripped namespace name, otherwise sorting is ugly
		if ( $wgTitle->getNamespace() == NS_MAIN ) {
			$default_sortkey = "";
		} else {
			$default_sortkey = "|{{PAGENAME}}";
		}

		// Iterate through all selected category entries:
		$text = "\n";
		if ( array_key_exists( 'SelectCategoryList', $_POST ) ) {
			foreach ( $_POST['SelectCategoryList'] as $category ) {
				$text .= "\n[[" . $categoryNamespace . ":" . $category . "]]";
			}
		}
		$editPage->textbox1 .= $text;

		return true;
	}

	// Removes the old category tag from the text the user views in the editbox.
	static function cleanTextbox( $editPage ) {
		global $wgContLang;

		$editText = $editPage->textbox1;

		$categoryNamespace = $wgContLang->getNsText( NS_CATEGORY );

		// The regular expression to find the category links:
		$pattern = "\[\[({$categoryNamespace}):([^\|\]]*)(\|[^\|\]]*)?\]\]";

		// The container to store the processed text:
		$cleanText = '';

		// Check linewise for category links:
		foreach ( explode( "\n", $editText ) as $textLine ) {
			// Filter line through pattern and store the result:
			$cleanText .= preg_replace( "/{$pattern}/i", "", $textLine ) . "\n";
		}
		// Place the cleaned text into the text box:
		$editPage->textbox1 = trim( $cleanText );

		return true;
	}
}