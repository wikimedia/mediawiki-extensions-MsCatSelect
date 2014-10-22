var selected_cat = '';
var latest_dd = '';
var chosen_dd = true;

$(document).ready(function () {
	chosen_dd = true ? mscs_vars.UseNiceDropdown : false;
	if ($.browser.msie && parseInt($.browser.version) < 10) { chosen_dd = false; }
	mscs_create_area();
});

function mscs_create_area(){
	
	var mscs_div = $(document.createElement("div")).attr('id','MsCatSelect').insertBefore('.editButtons'); 
	
	var row1 = $(document.createElement("div")).attr('class','row row1').appendTo(mscs_div);
	var row2 = $(document.createElement("div")).attr('class','row row2').appendTo(mscs_div);
	var row3 = $(document.createElement("div")).attr('class','row row3').appendTo(mscs_div);
	
	$(document.createElement("span")).attr('class','label maincat').text(mw.msg('mscs-title')).appendTo(row1);
	
	dd = mscs_create_dd("",0).appendTo(row1);
	
	if(mscs_vars.MainCategories != null && chosen_dd){
		$('#mscs_dd_0').chosen();
		//$(".chzn-container").css("width", "+=10");	
        //$(".chzn-drop").css("width", "+=10");
	}
	
	$(document.createElement("div")).attr('id','mscs_subcat_0').attr('class','subcat').appendTo(row1);

	$(document.createElement("div")).attr('id','mscs_add').attr('class','addcat').click(function(e){
		mscs_add_cat(selected_cat,'');
	}).text(mw.msg('mscs-add')).appendTo(row1);
	
	$(document.createElement("span")).attr('class','label').text(mw.msg('mscs-untercat')).appendTo(row2);
	var new_cat_input = $(document.createElement("input")).attr('class','input').attr('type','text').attr('id','new_cat_input').attr('size','30').appendTo(row2);
	$(document.createElement("div")).attr('id','mscs_add_untercat').attr('class','addcat').click(function(e){

		mscs_create_new_cat(new_cat_input.val(),selected_cat);
		
	}).text(mw.msg('mscs-go')).appendTo(row2);
	
	$(document.createElement("span")).attr('class','untercat_hinw').text('('+mw.msg('mscs-untercat-hinw')+')').appendTo(row2);
	
	
	$(document.createElement("span")).attr('class','label').text(mw.msg('mscs-cats')).appendTo(row3); 
	$(document.createElement("div")).attr('id','mscs_added').appendTo(row3);
	
	mscs_get_pagecats(mw.config.get('wgArticleId'));
}

function mscs_create_dd(maincat,ebene){

	var dd = $(document.createElement("select")).attr('id','mscs_dd_'+ebene).change(function () {
		
		latest_dd = ebene;
		container = $('#mscs_subcat_'+ebene).empty();
		
		if($(this).val() != 0) { //not ---
			selected_cat = $("option:selected",this).text();
			mscs_get_subcats(selected_cat,ebene,container);
		} else if (ebene==0) { //--- and nothing
			selected_cat = ''; //zuruecksetzen
		} else { //---
			selected_cat = $("#MsCatSelect option:selected:eq("+(ebene-1)+")").text();
			//console.log(selected_cat);
		}
	});

	$("<option />", {value: '0', text: '---'}).appendTo(dd);
	
	if(ebene == 0 && maincat == ""){ //first dd
		if(mscs_vars.MainCategories == null){
			mscs_get_uncategorizedcats(dd);		
		} else {
			$.each(mscs_vars.MainCategories, function(dd_index, dd_value) {
			$("<option />", {value: dd_index+1, text: dd_value}).appendTo(dd);
			});
		}
	}	
	return dd;
}

function mscs_add_cat(new_cat,new_sortkey){
	
	if(new_cat != '' && $("#mscs_added .mscs_entry[category='"+new_cat+"']").length == 0){ //new cat
		
		if(new_sortkey == ''){new_sortkey = wgTitle} //standard sortkey is the pagetitle
			
        var entry = $(document.createElement("div")).attr({
          'class':'mscs_entry',
          category:new_cat,
          sortkey:new_sortkey,
        }).text(new_cat).appendTo($("#mscs_added")); 	
        
        $(document.createElement("input")).attr({
          'class':'mscs_checkbox',
          type:'checkbox',
          name:'SelectCategoryList[]',
          value:new_cat+'|'+new_sortkey,
          'checked': true
        }).prependTo(entry);
	
		$(document.createElement("span")).attr("class","img_sortkey").attr("title",new_sortkey).click(function(e) { //click
	        			
	        	userInput = prompt(unescape(mw.msg('mscs-sortkey')),$(this).attr("title"));
	            if (userInput != '' && userInput != null && userInput!= new_sortkey) {
		             sortkey = userInput;
		             console.log(sortkey);
		             entry.attr("sortkey",sortkey);
		             entry.children('.mscs_checkbox').attr("value",new_cat+'|'+sortkey); 
		             $(this).attr("title",sortkey);
	            }			
	    }).appendTo(entry);
        
        
	}
}

function mscs_get_pagecats(pageId){
	
	//api.php?action=query&titles=Albert%20Einstein&prop=categories
	$.ajax({
        url: mw.util.wikiScript( 'api' ),
        data: {
			format: 'json',
            action: 'query',
            titles: mw.config.get('wgPageName'),
            prop: 'categories',
            clprop: 'sortkey',
            cllimit: 500
        },
        dataType: 'json',
        type: 'GET',
        success: function( data ) {
            if ( data && data.query && data.query.pages && data.query.pages[pageId]) {
                // ... success ...
                if(data.query.pages[pageId].categories){
                //console.log(data.query.pages[pageId].categories[0].title);
                $.each(data.query.pages[pageId].categories, function(index,value){
                	
                	titles = value.title.split(":",2);
                	mscs_add_cat(titles[1],value.sortkeyprefix);
                	
                });
                } else {console.log( 'No Subcats' );}
                
            } else if ( data && data.error ) {
                console.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
            } else {
                console.log( 'Error: Unknown result from API.' );
            }
        },
        error: function( xhr ) {
            console.log('Error');
        }
    });
	
	return true;
}

function mscs_get_uncategorizedcats(dd){
	
	$.ajax({
        url: mw.util.wikiScript( 'api' ),
        data: {
			format: 'json',
            action: 'query',
            list: 'querypage',
            qppage: 'Uncategorizedcategories',
            qplimit: '500',
        },
        dataType: 'json',
        type: 'GET',
        success: function( data ) {
            if ( data && data.query && data.query.querypage ) {
                // ... success ...
                $.each(data.query.querypage.results, function(index,val){
                	$("<option />", {value: index+1, text: val.value.replace(/_/g," ")}).appendTo(dd);
                });
				if (chosen_dd){
					dd.chosen({disable_search_threshold: 6});
               		$("#mscs_dd_0_chzn").width(dd.width()+20);	
				}  
            } else if ( data && data.error ) {
                console.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
            } else {
                console.log( 'Error: Unknown result from API.' );
            }
        },
        error: function( xhr ) {
            console.log('Error');
        }
    });
	
	return true;

}

function mscs_get_subcats(maincat,ebene,container){
	
	$.ajax({
        url: mw.util.wikiScript( 'api' ),
        data: {
			format: 'json',
            action: 'query',
            list: 'categorymembers',
            cmtitle: 'Category:' + maincat,
            cmtype: 'subcat',
            cmlimit: mscs_vars.MaxSubcategories
        },
        dataType: 'json',
        type: 'GET',
        success: function( data ) {
            if ( data && data.query && data.query.categorymembers ) {
                // ... success ...
                if(data.query.categorymembers.length > 0){
	                //console.log(data.query.categorymembers.length);
	                $(document.createElement("div")).attr('class','node').prependTo(container);
					dd = mscs_create_dd(selected_cat,ebene+1).appendTo(container);
					$(document.createElement("div")).attr('id','mscs_subcat_'+(ebene+1)).attr('class','subcat').appendTo(container);
		
	                $.each(data.query.categorymembers, function(index,val){
	                	list_element = val.title.split(":",2);
	                	$("<option />", {value: index+1, text: list_element[1]}).appendTo(dd);
	                });
	                if(chosen_dd){
	               		dd.chosen({disable_search_threshold: 6});
	               		$("#mscs_dd_"+(ebene+1)+"_chzn").width(dd.width()+20);	
	               	}
               } else { //no subcats
               		$(document.createElement("div")).attr('class','no-node').prependTo($('#mscs_subcat_'+ebene));
               }
                
            } else if ( data && data.error ) {
                console.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
            } else {
                console.log( 'Error: Unknown result from API.' );
            }
        },
        error: function( xhr ) {
            console.log('Error');
        }
    });
	
	return true;
}


function mscs_create_new_cat(new_cat,old_cat){
	
	if(old_cat == ""){
		cat_content = "";
	} else {
		cat_content = "[["+mw.config.get('wgFormattedNamespaces')[14]+":"+old_cat+"]]";
	}
	
	cat_title = mw.config.get('wgFormattedNamespaces')[14]+":"+new_cat;
	
	$.ajax({
        url: mw.util.wikiScript( 'api' ),
        data: {
            format: 'json',
            action: 'edit',
            title: cat_title,
            section: 'new',
            //summary: 'MsCatSelect',
            text: cat_content,
            token: mw.user.tokens.get( 'editToken' ),
            createonly: true
        },
        dataType: 'json',
        type: 'POST',
        success: function( data ) {
            if ( data && data.edit && data.edit.result == 'Success' ) {
                //console.log(data.edit.result);
                alert(mw.msg('mscs-created'));
                $('#MsCatSelect #new_cat_input').val('');
                
                created_cat = data.edit.title.split(":",2); //mw macht ersten Buchstaben groß
                //console.log(latest_dd);
                var dd_next = $('#mscs_dd_'+(latest_dd+1));
                
                $("<option />", {value: 99, text: created_cat[1]}).appendTo(dd_next);
                $('#mscs_subcat_'+latest_dd+' .node').removeClass('no-node');
                if(chosen_dd){
                	dd_next.chosen(); //wenn dropdown noch nicht existiert
                	dd_next.trigger("liszt:updated");
                }
                mscs_add_cat(created_cat[1],"");
            } else if ( data && data.error ) {
                console.log( 'Error: API returned error code "' + data.error.code + '": ' + data.error.info );
                if(data.error.code == "articleexists"){
                	alert(data.error.info);
                	$('#MsCatSelect #new_cat_input').val('');
                }
            } else {
                console.log( 'Error: Unknown result from API.' );
            }
        },
        error: function( xhr ) {
            console.log( 'Error: Request failed.' );
        }
    });
	
	
}