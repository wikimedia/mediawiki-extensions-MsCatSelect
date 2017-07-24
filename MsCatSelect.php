<?php

$wgExtensionCredits['parserhook'][] = [
	'name' => 'MsCatSelect',
	'url' => 'https://www.mediawiki.org/wiki/Extension:MsCatSelect',
	'version' => '6.2',
	'descriptionmsg' => 'mscs-desc',
	'license-name' => 'GPL-2.0+',
	'author' => [
		'[mailto:wiki@ratin.de Martin Schwindl]',
		'[mailto:wiki@keyler-consult.de Martin Keyler]',
		'[https://www.mediawiki.org/wiki/User:Sophivorus Felipe Schenone]'
	],
];

$wgResourceModules['ext.MsCatSelect'] = [
	'scripts' => 'MsCatSelect.js',
	'styles' => 'MsCatSelect.css',
	'messages' => [
		'mscs-title',
		'mscs-untercat',
		'mscs-untercat-hinw',
		'mscs-warnnocat',
		'mscs-cats',
		'mscs-add',
		'mscs-go',
		'mscs-created',
		'mscs-sortkey'
	],
	'dependencies' => 'jquery.chosen',
	'localBasePath' => __DIR__,
	'remoteExtPath' => 'MsCatSelect'
];

$wgMessagesDirs['MsCatSelect'] = __DIR__ . '/i18n';

$wgAutoloadClasses['MsCatSelect'] = __DIR__ . '/MsCatSelect.body.php';

$wgHooks['EditPage::showEditForm:initial'][] = 'MsCatSelect::start';
$wgHooks['EditPage::showEditForm:initial'][] = 'MsCatSelect::showHook';
$wgHooks['EditPage::attemptSave'][] = 'MsCatSelect::saveHook';

// Default configuration
$wgMSCS_MainCategories = null;
$wgMSCS_UseNiceDropdown = true;
$wgMSCS_WarnNoCategories = true;
$wgMSCS_WarnNoCategoriesException = [];