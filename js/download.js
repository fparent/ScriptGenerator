/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */

/*globals $ */

(function (window, undefined) {
	
	// Caching selectors used more than once
	var $elemsParent = $('#downloadScript-components'),
		$elems = $('#downloadScript-components').find('input[type=checkbox]'),
		$options = $('#downloadScript-options').find('input[type=checkbox]'),
		$download = $('#download_zip'),
		$codeDef = $('#codeIntegration'),
		$filesize = $('#fileSize'),
		$compInfo = $('#componentsInfo'),
	
		// Caching the total filesize of the checked inputs
		_filesize = 0;
		
	// Disable the download and manage new style
	function disableDownload() {
		$download
			.addClass('disabled')
			.attr('disabled', true);
	}
	
	// Enable the download and manage new style
	function enableDownload() {
		$download
			.removeClass('disabled')
			.attr('disabled', false);
	}
	
	// Uncheck all checkboxes
	function uncheckAll() {
		$elems.attr('checked', false);
	}
	
	// Check all checkboxes
	function checkAll() {
		$elems.attr('checked', true);
	}
	
	// Returns the total number of plugins (based on the checkboxes)
	function getTotalCount() {
		return $elems.length;
	}
	
	// Returns the total number of checked plugins
	function getTotalChecked() {
		return $elemsParent.find('input:checked').length;
	}
	
	// Return the total filesize of all checked plugins
	function getfilesize() {
		return _filesize;
	}
		
	// Updates the labels for the number of plugins selected, and the total filesize for the package
	// Params are the numbers of checkboxes selected and their total size
	function updateFileInfo(nbItems, newSize) {
		$compInfo.html('Components <em>(' + nbItems + ' of ' + getTotalCount() + ' selected)</em>');
		$filesize.html('File size: ' + newSize + ' KB (non-compressed)');
	}
	
	// On the bottom of the document, there's a list (using Syntax Highlighter) that contains the definition for each checked 
	function updateCodeList() {
		var codeDefList = $codeDef.find('div.dp-highlighter ol'),
			newList = "",
			totalSize = 0;
	
		// Detach the list while doing the DOM manipulations and then re-append it to the document
		codeDefList.detach();
		
		// For each checked plugins, we create a new list item, add it to the detached list and modify the total filesize.
		$elemsParent.find('input:checked').each( function () {
			newList = '<li><span>&lt;script src=<span class="string">"/static/js/Plugins/' + $(this).attr('id') + 
								'.js"</span><span>&gt;&lt;/script&gt;</span></span></li>';
			
			// Append all the list items back in the list
			codeDefList.append(newList);
			
			totalSize += parseInt($(this).next('label').children('span.component-size').text(), 10);
		});
		
		// Store the current object's file size
		_filesize = totalSize;
		
		// Append back the final codelist to the document once the manipulations are done
		$codeDef.find('div.dp-highlighter').append(codeDefList);
	}
	
	// Main function called when something changes in the form.
	function formChanged() {
		var elems = getTotalChecked(),
			size = 0;
		
		// Clear the definition list except for the first item (which is the call to jQuery)
		$codeDef.find("li:gt(0)").remove();
		
		if (elems > 0) {
			// Enable the download button and Update the code list with the selected plugins
			enableDownload();
			updateCodeList();
			
			// Set the new filesize if different then 0
			size = _filesize;
		}
		else {
			// No checkbox selected; disable the download button
			disableDownload();
		}

		// Update the number of components selected and the filesize labels
		updateFileInfo(elems, size);
	}
	
	(function init() {
		// Bind the event for the Select All link and switch label when the user clicks
		$('#selectLinks').find('a.selectAll').bind('click', function () {
			if (this.innerHTML.indexOf('Deselect') !== -1) {
				uncheckAll();
				this.innerHTML = "Select all components";
			} else {
				checkAll();
				this.innerHTML = "Deselect all components";
			}
			
			// Call the main function that will handle all the stuff when something has changed
			formChanged();
			return false;
		});
		
		// Delegate the click event on the checkboxes. I used delegate because in the future I plan on making the plugins list dynamic.
		$('#downloadScript-components').delegate('input[type=checkbox]', 'click', function () {
			formChanged();
		});
		
		// When clicked, the download button returns it's current state: disabled or not
		$download.bind('click', function () {
			return $(this).attr('disabled') !== 'false';
		});	

		// Uncheck all the checkboxes and make sure they have a 'checked' attribute
		uncheckAll();
		
		// Delegate the mouseOver event on the Syntax Highlighter  list to show the toolbar. Delegate is used instead of live for performance issue.
		$codeDef.delegate('.dp-highlighter', 'hover', function () {
			$(this).find('.bar').toggle();
		});
		
		// Disable the download button
		disableDownload();
	}) ();

})(window);