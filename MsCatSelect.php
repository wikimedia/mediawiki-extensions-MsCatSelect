<?php

$wgExtensionCredits['parserhook'][] = array(
	'name' => 'MsCatSelect',
	'url' => 'http://www.mediawiki.org/wiki/Extension:MsCatSelect',
	'version' => '6.1',
	'descriptionmsg' => 'mscs-desc',
	'license-name' => 'GPLv2+',
	'author' => array( '[mailto:wiki@ratin.de Martin Schwindl]', '[mailto:wiki@keyler-consult.de Martin Keyler]', '[https://www.mediawiki.org/wiki/User:Luis_Felipe_Schenone Luis Felipe Schenone]' ),
);

$wgResourceModules['ext.MsCatSelect'] = array(
	'scripts' => 'MsCatSelect.js',
	'styles' => 'MsCatSelect.css',
	'messages' => array(
		'mscs-title',
		'mscs-untercat',
		'mscs-untercat-hinw',
		'mscs-warnnocat',
		'mscs-cats',
		'mscs-add',
		'mscs-go',
		'mscs-created',
		'mscs-sortkey'
	),
	'dependencies' => 'jquery.chosen',
	'localBasePath' => __DIR__,
	'remoteExtPath' => 'MsCatSelect'
);

$wgExtensionMessagesFiles['MsCatSelect'] = __DIR__ . '/MsCatSelect.i18n.php';
$wgMessagesDirs['MsCatSelect'] = __DIR__ . '/i18n';

$wgAutoloadClasses['MsCatSelect'] = __DIR__ . '/MsCatSelect.body.php';

$wgHooks['EditPage::showEditForm:initial'][] = 'MsCatSelect::start';
$wgHooks['EditPage::showEditForm:initial'][] = 'MsCatSelect::showHook';
$wgHooks['EditPage::attemptSave'][] = 'MsCatSelect::saveHook';

// Default configuration
$wgMSCS_MainCategories = null;
$wgMSCS_UseNiceDropdown = true;
$wgMSCS_WarnNoCategories = true;
$wgMSCS_WarnNoCategoriesException = array();