<?php

/**
 * Functions file for extension MsCatSelect.
 *  
 * @author Martin Schwindl  <martin.schwindl@ratin.de> 
 * @copyright © 2014 by Martin Schwindl
 *
 * @licence GNU General Public Licence 2.0 or later
 */

if( !defined( 'MEDIAWIKI' ) ) {
  echo( "This file is an extension to the MediaWiki software and cannot be used standalone.\n" );
  die();
}
 
 
## Entry point for the hook and main worker function for editing the page:
function fnSelectCategoryShowHook( $m_isUpload = false, $m_pageObj ) {
	  
  fnCleanTextbox($m_pageObj); #clean the textbox
  return true;
}

## Entry point for the hook and main worker function for saving the page:
function fnSelectCategorySaveHook( $m_isUpload, $m_pageObj ) {
  global $wgContLang;
  global $wgTitle;

    # Get localised namespace string:
    $m_catString = $wgContLang->getNsText( NS_CATEGORY );

    # default sort key is page name with stripped namespace name,
    # otherwise sorting is ugly.
    if ($wgTitle->getNamespace() == NS_MAIN) {
      $default_sortkey = "";
    } else {
      #$default_sortkey = "|{{PAGENAME}}"; macht bei dateien probleme (anderer NS)
    }
    $m_text = "\n";

    # Iterate through all selected category entries:
    if (array_key_exists('SelectCategoryList', $_POST)) {
      foreach( $_POST['SelectCategoryList'] as $m_cat ) {
        $m_text .= "\n[[".$m_catString.":".$m_cat."]]";
      }
    }
    # If it is an upload we have to call a different method:
    if ( $m_isUpload ) {
      $m_pageObj->mUploadDescription .= $m_text;
    } else{
      $m_pageObj->textbox1 .= $m_text;
    }

  # Return to the let MediaWiki do the rest of the work:
  return true;
}


##removes the old category tag from the text the user views in the editbox.
function fnCleanTextbox( $m_pageObj ) {

  global $wgContLang;
  # Get page contents:
  $m_pageText = $m_pageObj->textbox1;
  # Get localised namespace string:
  $m_catString = strtolower( $wgContLang->getNsText( NS_CATEGORY ) );
  # The regular expression to find the category links:
  $m_pattern = "\[\[({$m_catString}|category|Category):([^\|\]]*)(\|[^\|\]]*)?\]\]";
  $m_replace = "$2";
  # The container to store the processed text:
  $m_cleanText = '';

  # Check linewise for category links:
  foreach( explode( "\n", $m_pageText ) as $m_textLine ) {
    # Filter line through pattern and store the result:
    $m_cleanText .= preg_replace( "/{$m_pattern}/i", "", $m_textLine ) . "\n";
  }
  # Place the cleaned text into the text box:
  $m_pageObj->textbox1 = trim( $m_cleanText );

  return true;
}
