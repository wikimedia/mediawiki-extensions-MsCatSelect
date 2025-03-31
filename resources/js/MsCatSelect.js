/* eslint-disable no-jquery/no-global-selector */
/* eslint-disable no-jquery/no-sizzle */
const MsCatSelect = {

	selectedCat: '',

	latestDropDown: '',

	mainCategories: mw.config.get( 'wgMSCS_MainCategories' ),
	useNiceDropdown: mw.config.get( 'wgMSCS_UseNiceDropdown' ),
	warnNoCategories: mw.config.get( 'wgMSCS_WarnNoCategories' ),
	warnNoCategoriesException: mw.config.get( 'wgMSCS_WarnNoCategoriesException' ),

	init: function () {
		MsCatSelect.createArea();
		$( '#editform' ).on( 'submit', MsCatSelect.checkCategories );
	},

	createArea: function () {
		const $row1 = $( '<div>' ).attr( 'class', 'row row1' );
		$( '<span>' ).attr( 'class', 'label maincat' ).text( mw.msg( 'mscs-title' ) ).appendTo( $row1 );
		MsCatSelect.createDropDown( '', 0 ).appendTo( $row1 );
		$( '<div>' ).attr( 'id', 'mscs_subcat_0' ).attr( 'class', 'subcat' ).appendTo( $row1 );
		$( '<div>' ).attr( 'id', 'mscs_add' ).attr( 'class', 'addcat' ).on( 'click', () => {
			MsCatSelect.addCat( MsCatSelect.selectedCat, '' );
		} ).text( mw.msg( 'mscs-add' ) ).appendTo( $row1 );

		const $row2 = $( '<div>' ).attr( 'class', 'row row2' );
		$( '<span>' ).attr( 'class', 'label' ).text( mw.msg( 'mscs-untercat' ) ).appendTo( $row2 );
		const $newCatInput = $( '<input>' ).attr( 'class', 'input' ).attr( 'type', 'text' ).attr( 'id', 'newCatInput' ).attr( 'size', '30' ).appendTo( $row2 );
		$( '<div>' ).attr( 'id', 'mscs_add_untercat' ).attr( 'class', 'addcat' ).on( 'click', () => {
			MsCatSelect.createNewCat( $newCatInput.val(), MsCatSelect.selectedCat );
		} ).text( mw.msg( 'mscs-go' ) ).appendTo( $row2 );

		const $row3 = $( '<div>' ).attr( 'class', 'row row3' );
		$( '<span>' ).attr( 'class', 'untercat-hinw' ).text( '(' + mw.msg( 'mscs-untercat-hinw' ) + ')' ).appendTo( $row2 );
		$( '<span>' ).attr( 'class', 'label' ).text( mw.msg( 'mscs-cats' ) ).appendTo( $row3 );
		$( '<div>' ).attr( 'id', 'mscs-added' ).appendTo( $row3 );

		const $div = $( '<div>' ).attr( 'id', 'MsCatSelect' ).append( $row1, $row2, $row3 );
		$div.insertBefore( '.editButtons' );

		if ( MsCatSelect.mainCategories.length && MsCatSelect.useNiceDropdown ) {
			$( '#mscs_dd_0' ).chosen();
		}

		MsCatSelect.getPageCats();
	},

	getUncategorizedCats: function ( $dd ) {
		// api.php?action=query&list=querypage&qppage=Uncategorizedcategories&qplimit=500
		new mw.Api().get( {
			format: 'json',
			formatversion: 2,
			action: 'query',
			list: 'querypage',
			qppage: 'Uncategorizedcategories',
			qplimit: 'max'
		} ).done( ( data ) => {
			if ( data && data.query && data.query.querypage ) {
				// Success!
				data.query.querypage.results.forEach( ( result, index ) => {
					const category = result.title.slice( result.title.indexOf( ':' ) + 1 );
					$( '<option>' ).val( index + 1 ).text( category ).appendTo( $dd );
				} );
				if ( MsCatSelect.useNiceDropdown ) {
					$dd.chosen( { disableSearchThreshold: 6 } );
					$( '#mscs_dd_0_chzn' ).width( $dd.width() + 20 );
				}
			} else if ( data && data.error ) {
				mw.log.error( 'API returned error code "' + data.error.code + '": ' + data.error.info );
			} else {
				mw.log.error( 'Unknown result from API.' );
			}
		} );
	},

	getSubcats: function ( maincat, level, $container ) {
		new mw.Api().get( {
			format: 'json',
			action: 'query',
			list: 'categorymembers',
			cmtitle: 'Category:' + maincat,
			cmtype: 'subcat',
			cmlimit: 'max'
		} ).done( ( data ) => {
			if ( data && data.query && data.query.categorymembers ) {
				// Success!
				if ( data.query.categorymembers.length ) {
					$( '<div>' ).attr( 'class', 'node' ).prependTo( $container );
					const $dd = MsCatSelect.createDropDown( MsCatSelect.selectedCat, level + 1 ).appendTo( $container );
					$( '<div>' ).attr( 'id', 'mscs_subcat_' + ( level + 1 ) ).attr( 'class', 'subcat' ).appendTo( $container );

					data.query.categorymembers.forEach( ( val, index ) => {
						const listElement = val.title.split( ':', 2 );
						$( '<option>' ).val( index + 1 ).text( listElement[ 1 ] ).appendTo( $dd );
					} );
					if ( MsCatSelect.useNiceDropdown ) {
						$dd.chosen( { disableSearchThreshold: 6 } );
						$( '#mscs_dd_' + ( level + 1 ) + '_chzn' ).width( $dd.width() + 20 );
					}
				} else { // No subcats
					$( '<div>' ).attr( 'class', 'no-node' ).prependTo( $( '#mscs_subcat_' + level ) );
				}
			} else if ( data && data.error ) {
				mw.log.error( 'API returned error code "' + data.error.code + '": ' + data.error.info );
			} else {
				mw.log.error( 'Unknown result from API.' );
			}
		} );
	},

	createDropDown: function ( maincat, level ) {
		const $dd = $( '<select>' ).attr( 'id', 'mscs_dd_' + level ).on( 'change', function () {
			const $container = $( '#mscs_subcat_' + level );
			$container.empty();

			if ( $( this ).val() !== 0 ) { // Not ---
				MsCatSelect.selectedCat = $( 'option:selected', this ).text();
				MsCatSelect.getSubcats( MsCatSelect.selectedCat, level, $container );
			} else if ( level === 0 ) { // --- and nothing
				MsCatSelect.selectedCat = ''; // Fall back to the previous category, if any
			} else {
				MsCatSelect.selectedCat = $( '#MsCatSelect option:selected:eq(' + ( level - 1 ) + ')' ).text();
			}
		} );

		$( '<option>' ).val( 0 ).text( '---' ).appendTo( $dd );

		if ( level === 0 && maincat === '' ) { // First dd
			if ( MsCatSelect.mainCategories.length === 0 ) {
				MsCatSelect.getUncategorizedCats( $dd );
			} else {
				MsCatSelect.mainCategories.forEach( ( ddValue, ddIndex ) => {
					$( '<option>' ).val( ddIndex + 1 ).text( ddValue ).appendTo( $dd );
				} );
			}
		}
		return $dd;
	},

	addCat: function ( category, sortkey ) {
		if ( category !== '---' && $( '#mscs-added .mscs_entry[category="' + category + '"]' ).length === 0 ) {

			const $entry = $( '<div>' ).attr( 'class', 'mscs_entry' ).data( 'sortkey', sortkey ).text( category ).appendTo( $( '#mscs-added' ) );

			const $input = $( '<input>' ).attr( 'class', 'mscs_checkbox' ).attr( {
				type: 'checkbox',
				name: 'SelectCategoryList[]',
				value: category + '|' + sortkey,
				checked: true
			} ).prependTo( $entry );

			$( '<span>' ).attr( 'class', 'img-sortkey' ).attr( 'title', sortkey ).on( 'click', () => {
				const $sortkey = $( this );
				const oldSortkey = $entry.data( 'sortkey' );
				OO.ui.prompt( mw.msg( 'mscs-sortkey' ), { textInput: { value: oldSortkey } } ).done( ( newSortkey ) => {
					if ( newSortkey !== null ) {
						$entry.data( 'sortkey', newSortkey );
						$input.val( category + '|' + newSortkey );
						$sortkey.attr( 'title', newSortkey );
					}
				} );
			} ).appendTo( $entry );
		}
	},

	getPageCats: function () {
		// api.php?action=query&titles=Albert%20Einstein&prop=categories
		new mw.Api().get( {
			format: 'json',
			action: 'query',
			titles: mw.config.get( 'wgPageName' ),
			prop: 'categories',
			clprop: 'sortkey',
			cllimit: 'max'
		} ).done( ( data ) => {
			const pageId = mw.config.get( 'wgArticleId' );
			if ( data && data.query && data.query.pages && data.query.pages[ pageId ] ) {
				// Success!
				if ( data.query.pages[ pageId ].categories ) {
					data.query.pages[ pageId ].categories.forEach( ( value ) => {
						const titles = value.title.split( ':', 2 );
						MsCatSelect.addCat( titles[ 1 ], value.sortkeyprefix );
					} );
				} else {
					mw.log( 'No subcategories' );
				}
			} else if ( data && data.error ) {
				mw.log.error( 'API returned error code "' + data.error.code + '": ' + data.error.info );
			} else {
				mw.log.error( 'Unknown result from API.' );
			}
		} );
	},

	createNewCat: function ( newCat, oldCat ) {
		const catNamespace = mw.config.get( 'wgFormattedNamespaces' )[ 14 ];
		const catTitle = catNamespace + ':' + newCat;
		const catContent = oldCat === '' ? '' : '[[' + catNamespace + ':' + oldCat + ']]';
		new mw.Api().post( {
			action: 'edit',
			title: catTitle,
			section: 'new',
			text: catContent,
			token: mw.user.tokens.get( 'csrfToken' ),
			createonly: true,
			format: 'json'
		} ).done( ( data ) => {
			if ( data && data.edit && data.edit.result === 'Success' ) {
				mw.notify( mw.msg( 'mscs-created' ) );
				$( '#MsCatSelect #newCatInput' ).val( '' );

				const createdCat = data.edit.title.split( ':', 2 ); // MediaWiki capitalizes first letter
				const $ddNext = $( '#mscs_dd_' + ( MsCatSelect.latestDropDown + 1 ) );

				$( '<option>' ).val( 99 ).text( createdCat[ 1 ] ).appendTo( $ddNext );
				$( '#mscs_subcat_' + MsCatSelect.latestDropDown + ' .node' ).removeClass( 'no-node' );
				if ( MsCatSelect.useNiceDropdown ) {
					$ddNext.chosen(); // If dropdown does not yet exist
					$ddNext.trigger( 'liszt:updated' );
				}
				MsCatSelect.addCat( createdCat[ 1 ], '' );
			} else if ( data && data.error ) {
				mw.log.error( 'API returned error code "' + data.error.code + '": ' + data.error.info );
				if ( data.error.code === 'articleexists' ) {
					mw.notify( data.error.info );
					$( '#MsCatSelect #newCatInput' ).val( '' );
				}
			} else {
				mw.log.error( 'Unknown result from API.' );
			}
		} );
	},

	checkCategories: function () {
		if ( MsCatSelect.warnNoCategories &&
			$( '#mscs-added input[type="checkbox"]:checked' ).length === 0 &&
			!MsCatSelect.warnNoCategoriesException.includes( mw.config.get( 'wgRelevantPageName' ) ) &&
			!MsCatSelect.warnNoCategoriesException.includes( mw.config.get( 'wgNamespaceNumber' ).toString() )
		) {
			// eslint-disable-next-line no-alert
			return confirm( mw.msg( 'mscs-warnnocat' ) );
		}
	}
};

mw.loader.using( 'oojs-ui-windows', MsCatSelect.init );
