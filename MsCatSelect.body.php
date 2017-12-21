<?php

class MsCatSelect {

	static function start() {
		global $wgOut, $wgMSCS_MainCategories, $wgMSCS_UseNiceDropdown, $wgMSCS_WarnNoCategories, $wgMSCS_WarnNoCategoriesException;

		// Load module
		$wgOut->addModules( 'ext.MsCatSelect' );

		// Make the configuration variables available to JavaScript
		$mscsVars = [
			'MainCategories' => $wgMSCS_MainCategories,
			'UseNiceDropdown' => $wgMSCS_UseNiceDropdown,
			'WarnNoCategories' => $wgMSCS_WarnNoCategories,
			'WarnNoCategoriesException' => str_replace( ' ', '_', $wgMSCS_WarnNoCategoriesException ),
		];
		$mscsVars = json_encode( $mscsVars, true );
		$wgOut->addScript( "<script>var mscsVars = $mscsVars;</script>" );
		return true;
	}

	// Entry point for the hook and main worker function for editing the page:
	static function showHook( EditPage $editPage, OutputPage $output ) {
		self::cleanTextbox( $editPage );
		return true;
	}

	// Entry point for the hook and main worker function for saving the page:
	static function saveHook( $editPage ) {
		global $wgContLang;

		// Get localised namespace string
		$categoryNamespace = $wgContLang->getNsText( NS_CATEGORY );

		// Iterate through all selected category entries:
		$text = "\n";
		if ( array_key_exists( 'SelectCategoryList', $_POST ) ) {
			foreach ( $_POST['SelectCategoryList'] as $category ) {
				$category = rtrim( $category, '|' ); // If the sort key is empty, remove it
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
