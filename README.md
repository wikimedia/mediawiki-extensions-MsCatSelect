MsCatSelect
===========
MsCatSelect is a MediaWiki extension that provides a visual interface to the edit form for adding or removing categories to a page.

Installation
------------
To install MsCatSelect, add the following to your LocalSettings.php:

require_once "$IP/extensions/MsCatSelect/MsCatSelect.php";

Usage
-----
Once the extension is installed, edit a page and scroll to the bottom to see the visual interface for adding or removing categories. Select the categories you want from the dropdown menus and save the changes to add the page to those categories.

Configuration
-------------
$wgMSCS_WarnNoCategories = false; // Defaults to 'true'

$wgMSCS_WarnNoCategoriesException = array( NS_TALK, NS_FILE, NS_FILE_TALK ); // Defaults to an empty array

$wgMSCS_MainCategories = array( 'Category1', 'Category2' ); // Defaults to 'null'

$wgGroupPermissions['*']['apihighlimits'] = true; // By default, regular users will be shown a maximum of 500 subcategories. With this set to true, all subcategories will be shown.

Credits
-------
* Developed and coded by Martin Schwindl (wiki@ratin.de)
* Idea, project management and bug fixing by Martin Keyler (wiki@keyler-consult.de)
* Updated, debugged and enhanced by Luis Felipe Schenone (schenonef@gmail.com)
* Some icons by Yusuke Kamiyamane (http://p.yusukekamiyamane.com). All rights reserved. Licensed under a Creative Commons Attribution 3.0 License.

Chosen, a Select Box Enhancer for jQuery and Protoype
by Patrick Filler for Harvest
Available for use under the MIT License
Copyright (c) 2011-2013 by Harvest
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
http://harvesthq.github.com/chosen/