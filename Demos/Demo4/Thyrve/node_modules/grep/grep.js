/*
	Grep.js
	Author	: Nic da Costa ( @nic_daCosta )
        Created : 2012/11/14
	Version	: 0.2
	(c) Nic da Costa
	License : MIT, GPL licenses

	Overview:
	Basic function that searches / filters any object or function and returns matched properties.
	This receives either a string or regex as the initial parameter( strSearch ), the sencond parameter ( isRecursive == Bool) is
	used to determine whether to search the property's properties should the current property be of type object / function. 
	Main area of use would be for DevTools purposes, when needing to find a specific property but only part of 
		the property name is known. 
		Is now an inherited method on any Object / Function due to Object.prototype.
		Thus can go ObjectName.Grep( 'SearchTerm' ).
		eg: navigator.Grep( 'geo' );
			var foo = function(){}; foo.Grep( 'proto' );

       *Tested in Chrome Dev Tools*

*/


Object.prototype.Grep = function( strSearch , isRecursive ) {

	// Checks if seach string is not empty/undefined
	if ( !strSearch ) {

		return this;

	}

	// Used to prevent maxing out callstack for sub-lookups due to __proto__ == Object
	isRecursive = isRecursive || false;

	// Declare necessary local variables to hold necessary values
	var objToIterate = this,
		typeOfObject = typeof objToIterate,
		objKeys = [],
		objResult = {};

	
	// if item that needs to be iterated over is an object or function, get all properties ( including non enumerable properties )
	if ( typeOfObject === 'object' || typeOfObject === 'function' ) {
	
		objKeys = Object.getOwnPropertyNames( objToIterate );

	}

	// Loop through all the properties
	objKeys.forEach( function( item ) {

		var itemValue;
	
		/* 
			Initially check if search phrase is a regular expression, if so check if there is a match, else
			check if key matches search string, if so add, if not, check if object and iterate through object's keys
		*/
		if ( ( strSearch instanceof RegExp ) ? item.match( strSearch ) : item.toLowerCase().indexOf( strSearch.toLowerCase() ) >= 0 ) {

			itemValue = objToIterate[ item ];

		}
		else if ( typeof objToIterate[ item ] === 'object' && !isRecursive ){

			itemValue = Grep.call( objToIterate[ item ] , strSearch , true );

		}

		// Check if Item Value has a value, if so, add to results
		if ( itemValue ) {

			objResult[ item ] = itemValue;

		}

	} );

	// checks if objResult is empty, if so, return empty string.
	return ( Object.getOwnPropertyNames( objResult ).length ) ? objResult : '';

};

if ( root ){
	module.exports = Object;
}
