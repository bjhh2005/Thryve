##Grep.js

_Best used when saved as a snippet. To do so in Chrome Dev Tools, [read here](https://developers.google.com/chrome-developer-tools/docs/authoring-development-workflow#snippets)_

This is a basic function which allows you to search through an object's properties and find a property based on a match. This is particularly useful when searching for a given DOM API and if you are unsure if it is vendor prefixed.

###Overview
Basic function that searches / filters any object or function and returns matched properties.

This receives either a string or regex as the initial parameter( strSearch ), the sencond parameter ( _isRecursive == Bool_ ) is used to determine whether to search the property's properties should the current property be of type object / function. 

Main area of use would be for DevTools purposes, when needing to find a specific property but only part of the property name is known. 
Is now an inherited method on any Object / Function due to Object.prototype.

This method returns an object of all matches and their relative properties. Should not match be found, each property of the given object that is an object itself will be checked for any matches.

###Usage 

```Object.Grep( 'SearchTerm' ).``` _* in browser console_

eg:

```js
 navigator.Grep( 'geo' ); 
 // returns an object of matched results and their relative properties
```

Should you wish to use this with an interface as opposed to having to use the console, [http://object.hasownproperty.com](http://object.hasownproperty.com) can be used.

Based on original [grep.js gist](https://gist.github.com/nicdaCosta/4072412)

### License
Copyright (c) 2014 Nic da Costa  
Licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)
