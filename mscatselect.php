<?php
############################################################
#Author:
#Martin Schwindl, mscatselect@ratin.de
#
#Icons: 
#Some icons by Yusuke Kamiyamane. All rights reserved. Licensed under a Creative Commons Attribution 3.0 License.
#http://p.yusukekamiyamane.com
#
#
#Usage:
#LocalSettings.php:
#
#//Start------------------------MsCatSelect
#$wgMSCS_WarnNoCat = false;
#$wgMSCS_MaxSubcategories = 500;
#$wgMSCS_MainCategories = array("Category1","Category2");
#require_once("$IP/extensions/MsCatSelect/mscatselect.php");
#//End--------------------------MsCatSelect
#
#
############################################################

# Setup and Hooks for the MsCatSelect extension
if( !defined( 'MEDIAWIKI' ) ) {
        echo( "This file is an extension to the MediaWiki software and cannot be used standalone.\n" );
        die();
}

## Register extension setup hook and credits:
$wgExtensionCredits['parserhook'][] = array(
        'name'           => 'MsCatSelect',
        'url'  => 'http://www.mediawiki.org/wiki/Extension:MsCatSelect',
        'version'        => '5.3',
        'author' => '[mailto:mscatselect@ratin.de mscatselect@ratin.de] | [http://www.ratin.de/mscatselect.html Ratin]',
        'descriptionmsg' => 'mscs-desc',
);

$dir = dirname(__FILE__) . '/';
$wgExtensionMessagesFiles['mscatselect'] = $dir . 'mscatselect.i18n.php';

# Hook when starting editing:
$wgHooks['EditPage::showEditForm:initial'][] = array( 'fnSelectCategoryShowHook', false );
# Hook when saving page:
$wgHooks['EditPage::attemptSave'][] = array( 'fnSelectCategorySaveHook', false );
# Hook when Editor gets initialized:
$wgHooks['EditPage::showEditForm:initial'][] = 'MsCatSelectSetup';

require_once($dir.'mscatselect.body.php');


$wgResourceModules['ext.MsCatSelect'] = array(
        // JavaScript and CSS styles.
        'scripts' => array( 'js/mscatselect.js' ),
        'styles' => array( 'css/mscatselect.css' ),
        // When your module is loaded, these messages will be available through mw.msg()
        'messages' => array( 'mscs-title', 'mscs-untercat', 'mscs-untercat-hinw', 'mscs-warnnocat', 'mscs-cats', 'mscs-add', 'mscs-go', 'mscs-created', 'mscs-sortkey' ),
        'dependencies' => array( 'jquery.chosen'),
        // subdir relative to "/extensions"
        'localBasePath' => dirname( __FILE__ ),
        'remoteExtPath' => 'MsCatSelect'
);



function MsCatSelectSetup() {
  global $wgOut, $wgJsMimeType, $wgMSCS_MainCategories, $wgMSCS_WarnNoCat, $wgMSCS_MaxSubcategories;
  
  //load module
  $wgOut->addModules( 'ext.MsCatSelect' );
  $wgMSCS_WarnNoCat = $wgMSCS_WarnNoCat ? "true" : "false";
  if (is_null($wgMSCS_MaxSubcategories)){ $wgMSCS_MaxSubcategories = 10;} //default max subcats

  $mscs_vars = array(
		'WarnNoCat' => $wgMSCS_WarnNoCat,
    	'MainCategories' => $wgMSCS_MainCategories,
    	'MaxSubcategories' => $wgMSCS_MaxSubcategories,
    	'UseNiceDropdown' => true //$wgMSCS_UseNiceDropdown
	);
	
  $mscs_vars = json_encode($mscs_vars,true);
  $wgOut->addScript( "<script type=\"{$wgJsMimeType}\">var mscs_vars = $mscs_vars;</script>\n" );

  return true;
}


