// 
//  tools.js
//  
//  Created by Colin Bate on 2011-05-22.
//  Copyright 2011 Colin Bate. All rights reserved.
// 

// Works similar to jQuery's $.extend() only it doesn't mutate any of the objects
// Always returns a new object with the properties being writable and enumerable
// Usage: var combinedOptions = tools.merge(defaultObject, myOptions);
exports.merge = function () {
	var newObj = {};
	for (var arg = 0; arg < arguments.length; arg +=1) {
		var keys = Object.keys(arguments[arg]);
		for (var k in keys) {
			Object.defineProperty(newObj, keys[k], {value: arguments[arg][keys[k]], writable: true, enumerable: true});
		}
	}
	return newObj;
};