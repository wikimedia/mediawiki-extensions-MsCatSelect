<?php
/**
 * Internationalisation file for extension MsCatSelect.
 *  
 * @author Martin Schwindl  <martin.schwindl@ratin.de> 
 *
 * @licence GNU General Public Licence 2.0 or later
 */

$messages = array();

/** German (Deutsch)
 * @author Martin Schwindl  <martin.schwindl@ratin.de>
 * @author Kghbln
 */
$messages['de'] = array(
        'mscs-desc' => 'Ermöglicht das Zuweisen einer Seite zu einer bestehenden oder neu erstellbaren Kategorie über ein Dropdown-Listenfeld',
        'mscs-title' => 'Oberkategorie auswählen:',
        'mscs-untercat' => 'Neue Unterkategorie:',
        'mscs-untercat-hinw' => 'wird in vorrausgewählter Oberkategorie erstellt',
        'mscs-warnnocat' => 'VORSICHT: Diese Seite enthält noch keine Kategorie. Bitte fügen Sie zuerst eine Kategorie hinzu!',
        'mscs-cats' => 'Bereits vergebene Kategorien:', 
        'mscs-add' => 'hinzufügen',
        'mscs-go' => 'erstellen', 
        'mscs-created' => 'Neue Kategorie erfolgreich erstellt',
        'mscs-sortkey' => 'Hier bitte den Sortierschlüssel eingeben. Der Sortierschlüssel ist für die Sortierung in der Kategorieübersicht relevant.'    
);

/** Czech (Česky) 1.0
 * @author Neřeknu   <narodni.hrdost@Safe-mail.net>
 */
$messages['cs'] = array(
	   'mscs-desc' => 'Mit dieser Extension kann eine Seite einer bestehenden oder neuen Kategorie per DropDown zugewiesen werden oder auch neue Unterkategorien erstellt werden.',
       'mscs-title' => 'Hlavní kategorie',
       'mscs-untercat' => 'Nová podkategorie',
       'mscs-untercat-hinw' => 'bude vytvořena ve výše uvedené kategorii',
       'mscs-warnnocat' => 'UPOZORNĚNÍ: Tato stránka není zařazena do žádné kategorie. Prosím zvolte nějakou kategorii!',
       'mscs-cats' => 'Již přiřazené kategorie',
       'mscs-add' => 'přidat',
       'mscs-go' => 'vytvořit',
       'mscs-created' => 'Neue Kategorie erfolgreich erstellt',
       'mscs-sortkey' => 'Hier bitte den Sortierschlüssel eingeben. Der Sortierschlüssel ist für die Sortierung in der Kategorieübersicht relevant.'
);

/** English
 * @author GabMaster
 * @author Kghbln
 * Note: Warning messages are still defined in German (in "mscatselect.js").
 */
$messages['en'] = array(
       'mscs-desc' => 'Allows  to add a page to an existing or newly creatable category via a drop-down list',
       'mscs-title' => 'Main Category',
       'mscs-untercat' => 'New subcategory',
       'mscs-untercat-hinw' => 'will be created in the category selected above',
       'mscs-warnnocat' => 'WARNING: This page does not belong to any category. Please select a category!',
       'mscs-cats' => 'Assigned categories',
       'mscs-add' => 'Add',
       'mscs-go' => 'Create',
       'mscs-created' => 'New category successfully created',
       'mscs-sortkey' => 'Please add the default sortkey here. It is used for sorting within the category overview pages.'
);

/** Nederlands
 * @author hrh 
 */
$messages['nl'] = array(
        'mscs-desc' => 'Allows  to add a page to an existing or newly creatable category via a drop-down list',
        'mscs-title' => 'Categorie',
        'mscs-untercat' => 'Nieuwe subcategorie',
        'mscs-untercat-hinw' => 'Nieuwe categorie wordt aangemaakt in bovenstaande categorie, tenzij --- is geselecteerd',
        'selectcategory-warnnocat' => 'Deze pagina heeft nog geen categorie. Definieer een nieuwe of bestaande categorie.',
        'mscs-cats' => 'Toegewezen categorieën', 
        'mscs-add' => 'Toevoegen',
        'mscs-go' => 'Aanmaken',   
        'mscs-created' => 'New category successfully created',
        'mscs-sortkey' => 'Please add the default sortkey here. It is used for sorting within the category overview pages.'
);    


/** Spanish (Español)
 * @author Ángel J. Vico 
 */
$messages['es'] = array(
       'mscs-desc' => 'Esta extensión permite asignar categorías y subcategorías a una página escogiéndolas de una lista desplegable. También permite crear nuevas categorías desde la página de edición.',
       'mscs-title' => 'Categoría principal',
       'mscs-untercat' => 'Nueva subcategoría',
       'mscs-untercat-hinw' => 'se creará en la categoría seleccionada arriba',
       'mscs-warnnocat' => 'ADVERTENCIA: Esta página no pertenece a ninguna categoría. Por favor, seleccione una categoría.',
       'mscs-cats' => 'Categorías asignadas',
       'mscs-add' => 'Agregar',
       'mscs-go' => 'Crear',
       'mscs-created' => 'Nueva categoría creada con éxito',
       'mscs-sortkey' => 'Por favor introduce el criterio de ordenación. La clave de ordenación se utiliza para clasificar el contenido de la categoría.'
);