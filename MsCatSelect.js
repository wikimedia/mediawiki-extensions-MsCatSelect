mediaWiki.api = new mediaWiki.Api();
var selectedCat = '';
var latestDropDown = '';
var chosenDropDown = true;

function mscsGetUncategorizedCats( dd ) {
	mediaWiki.api.get({
		'format': 'json',
		'action': 'query',
		'list': 'querypage',
		'qppage': 'Uncategorizedcategories',
		'qplimit': 500
    }).done( function( data ) {
		mediaWiki.log( data );
		if ( data && data.query && data.query.querypage ) {
			// Success!
			jQuery.each( data.query.querypage.results, function( index, val ) {
				jQuery( '<option>', { value: index + 1, text: val.value.replace( /_/g, ' ' ) } ).appendTo( dd );
			});
			if ( chosenDropDown ) {
				dd.chosen( { disableSearchThreshold: 6 } );
				jQuery( '#mscs_dd_0_chzn' ).width( dd.width() + 20 );
			}
		} else if ( data && data.error ) {
			mediaWiki.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
		} else {
			mediaWiki.log( 'Error: Unknown result from API.' );
		}
	});
}

function mscsGetSubcats( maincat, ebene, container ) {
	mediaWiki.api.get({
		'format': 'json',
        'action': 'query',
        'list': 'categorymembers',
        'cmtitle': 'Category:' + maincat,
        'cmtype': 'subcat',
        'cmlimit': 'max'
	}).done( function( data ) {
		mediaWiki.log( data );
		if ( data && data.query && data.query.categorymembers ) {
			// Success!
			if ( data.query.categorymembers.length > 0 ) {
				jQuery( '<div>' ).attr( 'class', 'node' ).prependTo( container );
				var dd = mscsCreateDropDown( selectedCat, ebene + 1 ).appendTo( container );
				jQuery( '<div>' ).attr( 'id', 'mscs_subcat_' + ( ebene + 1 ) ).attr( 'class', 'subcat' ).appendTo( container );

				jQuery.each( data.query.categorymembers, function( index, val ) {
					var listElement = val.title.split( ':', 2 );
					jQuery( '<option>', { value: index + 1, text: listElement[1] } ).appendTo( dd );
				});
				if ( chosenDropDown ) {
					dd.chosen({ disableSearchThreshold: 6 });
					jQuery( '#mscs_dd_' + ( ebene + 1 ) + '_chzn' ).width( dd.width() + 20 );
				}
			} else { //no subcats
				jQuery( '<div>' ).attr( 'class', 'no-node' ).prependTo( jQuery( '#mscs_subcat_' + ebene ) );
			}
		} else if ( data && data.error ) {
			mediaWiki.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
		} else {
			mediaWiki.log( 'Error: Unknown result from API.' );
		}
	});
}

function mscsCreateDropDown( maincat, ebene ) {
	var dd = jQuery( '<select>' ).attr( 'id', 'mscs_dd_' + ebene ).change( function () {
		var container = jQuery( '#mscs_subcat_' + ebene ).empty();

		if ( jQuery( this ).val() !== '0' ) { //not ---
			selectedCat = jQuery( 'option:selected', this ).text();
			mscsGetSubcats( selectedCat, ebene, container );
		} else if ( ebene === 0 ) { //--- and nothing
			selectedCat = ''; //Fall back to the previous category, if any
		} else {
			selectedCat = jQuery( '#MsCatSelect option:selected:eq(' + ( ebene - 1 ) + ')' ).text();
		}
	});

	jQuery( '<option>', { value: '0', text: '---' } ).appendTo( dd );

	if ( ebene === 0 && maincat === '' ) { //first dd
		if ( mscsVars.MainCategories === null ) {
			mscsGetUncategorizedCats( dd );
		} else {
			jQuery.each( mscsVars.MainCategories, function( ddIndex, ddValue ) {
				jQuery( '<option>', { value: ddIndex + 1, text: ddValue } ).appendTo( dd );
			});
		}
	}	
	return dd;
}

function mscsAddCat( category, sortkey ) {
	if ( category !== '---' && jQuery( '#mscs-added .mscs_entry[category="' + category + '"]' ).length === 0 ) {

		var entry = jQuery( '<div>' ).attr({
			'class': 'mscs_entry',
			'category': category,
			'sortkey': sortkey
		}).text( category ).appendTo( jQuery( '#mscs-added' ) );

		var input = jQuery( '<input>' ).attr({
			'class': 'mscs_checkbox',
			'type': 'checkbox',
			'name': 'SelectCategoryList[]',
			'value': category + '|' + sortkey,
			'checked': true
		}).prependTo( entry );

		jQuery( '<span>' ).attr( 'class', 'img-sortkey' ).attr( 'title', sortkey ).click( function () {
			var oldSortkey = entry.attr( 'sortkey' );
			var newSortkey = prompt( unescape( mediaWiki.msg( 'mscs-sortkey' ) ), oldSortkey );
			if ( newSortkey !== null ) {
				entry.attr( 'sortkey', newSortkey );
				input.attr( 'value', category + '|' + newSortkey ); 
				jQuery( this ).attr( 'title', newSortkey );
			}
		}).appendTo( entry );
	}
}

function mscsGetPageCats( pageId ) {
	//api.php?action=query&titles=Albert%20Einstein&prop=categories
	mediaWiki.api.get({
		'format': 'json',
		'action': 'query',
		'titles': mediaWiki.config.get( 'wgPageName' ),
		'prop': 'categories',
		'clprop': 'sortkey'
	}).done( function( data ) {
		mediaWiki.log( data );
		if ( data && data.query && data.query.pages && data.query.pages[ pageId ] ) {
			// Success!
			if ( data.query.pages[ pageId ].categories ) {
				mediaWiki.log(data.query.pages[pageId].categories[0].title);
				jQuery.each( data.query.pages[ pageId ].categories, function( index, value ) {
					var titles = value.title.split( ':', 2 );
					mscsAddCat( titles[1], value.sortkeyprefix );
				});
			} else {
				mediaWiki.log( 'No subcategories' );
			}
	    } else if ( data && data.error ) {
	        mediaWiki.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
	    } else {
	        mediaWiki.log( 'Error: Unknown result from API.' );
	    }
	});
}

function mscsCreateNewCat( newCat, oldCat ) {
	var catContent, catTitle;

	if ( oldCat === '' ) {
		catContent = '';
	} else {
		catContent = '[[' + mediaWiki.config.get( 'wgFormattedNamespaces' )[14] + ':' + oldCat + ']]';
	}

	catTitle = mediaWiki.config.get( 'wgFormattedNamespaces' )[14] + ':' + newCat;

	mediaWiki.api.post({
		'action': 'edit',
		'title': catTitle,
		'section': 'new',
		//'summary': 'MsCatSelect',
		'text': catContent,
		'token': mediaWiki.user.tokens.get( 'editToken' ),
		'createonly': true,
		'format': 'json'
	}).done( function( data ) {
		mediaWiki.log( data );
		if ( data && data.edit && data.edit.result === 'Success' ) {
			alert( mediaWiki.msg( 'mscs-created' ) );
			jQuery( '#MsCatSelect #newCatInput' ).val( '' );

			var createdCat = data.edit.title.split( ':', 2 ); //mediaWiki macht ersten Buchstaben groß
			//mediaWiki.log( latestDropDown );
			var ddNext = jQuery( '#mscs_dd_' + ( latestDropDown + 1 ) );

			jQuery( '<option>', { value: 99, text: createdCat[1] } ).appendTo( ddNext );
			jQuery( '#mscs_subcat_' + latestDropDown + ' .node' ).removeClass( 'no-node' );
			if ( chosenDropDown ) {
				ddNext.chosen(); //wenn dropdown noch nicht existiert
				ddNext.trigger( 'liszt:updated' );
			}
			mscsAddCat( createdCat[1], '' );
		} else if ( data && data.error ) {
			mediaWiki.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
			if ( data.error.code === 'articleexists' ) {
				alert( data.error.info );
				jQuery( '#MsCatSelect #newCatInput' ).val( '' );
			}
		} else {
			mediaWiki.log( 'Error: Unknown result from API.' );
		}
	});
}

function mscsCreateArea() {

	var mscsDiv = jQuery( '<div>' ).attr( 'id', 'MsCatSelect' ).insertBefore( '.editButtons' ); 

	var row1 = jQuery( '<div>' ).attr( 'class', 'row row1' ).appendTo( mscsDiv );
	var row2 = jQuery( '<div>' ).attr( 'class', 'row row2' ).appendTo( mscsDiv );
	var row3 = jQuery( '<div>' ).attr( 'class', 'row row3' ).appendTo( mscsDiv );

	jQuery( '<span>' ).attr( 'class','label maincat' ).text( mediaWiki.msg( 'mscs-title' ) ).appendTo( row1 );

	mscsCreateDropDown( '', 0 ).appendTo( row1 );

	if ( mscsVars.MainCategories !== null && chosenDropDown ) {
		jQuery( '#mscs_dd_0' ).chosen();
		//jQuery( '.chzn-container' ).css( 'width', '+=10' );
        //jQuery( '.chzn-drop' ).css( 'width', '+=10' );
	}

	jQuery( '<div>' ).attr( 'id', 'mscs_subcat_0' ).attr( 'class', 'subcat' ).appendTo( row1 );

	jQuery( '<div>' ).attr( 'id', 'mscs_add' ).attr( 'class', 'addcat' ).click( function() {
		mscsAddCat( selectedCat, '' );
	}).text( mediaWiki.msg( 'mscs-add' ) ).appendTo( row1 );

	jQuery( '<span>' ).attr( 'class', 'label' ).text( mediaWiki.msg( 'mscs-untercat' ) ).appendTo( row2 );
	var newCatInput = jQuery( '<input>' ).attr( 'class', 'input' ).attr( 'type', 'text' ).attr( 'id', 'newCatInput' ).attr( 'size', '30' ).appendTo( row2 );
	jQuery( '<div>' ).attr( 'id', 'mscs_add_untercat' ).attr( 'class', 'addcat' ).click( function() {

		mscsCreateNewCat( newCatInput.val(), selectedCat );

	}).text( mediaWiki.msg( 'mscs-go' ) ).appendTo( row2 );

	jQuery( '<span>' ).attr( 'class', 'untercat-hinw' ).text( '(' + mediaWiki.msg( 'mscs-untercat-hinw' ) + ')' ).appendTo( row2 );
	jQuery( '<span>' ).attr( 'class', 'label' ).text( mediaWiki.msg( 'mscs-cats' ) ).appendTo( row3 ); 
	jQuery( '<div>' ).attr( 'id', 'mscs-added' ).appendTo( row3 );

	mscsGetPageCats( mediaWiki.config.get( 'wgArticleId' ) );
}

function mscsCheckCategories() {
	if ( mscsVars.WarnNoCategories === true &&
		 jQuery( '#mscs-added input[type="checkbox"]:checked' ).length === 0 &&
		 jQuery.inArray( mw.config.get( 'wgNamespaceNumber' ), mscsVars.WarnNoCategoriesException ) === -1 &&
		 jQuery.inArray( mw.config.get( 'wgRelevantPageName' ), mscsVars.WarnNoCategoriesException ) === -1
	) {
		return confirm( mediaWiki.msg( 'mscs-warnnocat' ) );
	}
	return true;
}

jQuery( function () {
	chosenDropDown = true ? mscsVars.UseNiceDropdown : false;

	mscsCreateArea();

	jQuery( '#editform' ).submit( mscsCheckCategories );
});