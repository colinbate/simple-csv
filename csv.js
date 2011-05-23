// 
//  csv.js
//  
//  Created by Colin Bate on 2011-05-22.
//  Copyright 2011 Colin Bate. All rights reserved.
//  
//  Functions for parsing CSV files.
//  

var fs = require('fs');
var tools = require('tools');


var csvPattern = /(,|^)(?:"([^"]*(?:""[^"]*)*)"|([^\",]*))/g;

var buildRecord = function (str, asArray, headers) {
	var record = (asArray && []) || {};
	var index = 0;
	var matches;
	if (str.charAt(0) === ',') {
		matches = ['', ',', undefined, ''];
	} else {
		matches = csvPattern.exec(str);
	}
	while (matches) {
		var delim = matches[1];
		var field;
		if (matches[2]) {
			field = matches[2].replace(/""/g, '"');
		} else {
			field = matches[3] || '';
		}
		if (asArray) {
			record[index] = field;
		} else {
			if (headers && headers[index]) {
				record[headers[index].toLowerCase()] = field;
			} else {
				record['col' + index] = field;
			}
		}
		index += 1;
		matches = csvPattern.exec(str);
	}
	return record;
};

exports.parse = function (filename, options, callback) {
	var defaults = {
		asArray : false,
		headers : [],
		hasHeaders : true,
		normalizeHeaders : false // Not implemented yet.
		};
	if (options.headers && options.headers.length) {
		defaults.hasHeaders = false; // Don't parse headers by default if provided.
	}
	if (options.hasHeaders === false && defaults.hasHeaders === true) {
		// If told there are no headers and none are provided, default to array.
		defaults.asArray = true;
	}
	if (options.asArray === true) {
		defaults.hasHeaders = false; // Assume no header if using array.
	}
	var opts = tools.merge(defaults, options);
	var stream = fs.createReadStream(filename);
	var first = true, buffer = '';
	
	stream.addListener('data', function(data) {
		buffer += data.toString();
		var parts = buffer.split(/\r?\n/);
		parts.forEach(function(d, i) {
			if (i == parts.length-1) {
				return;
			}
			if (opts.hasHeaders && first && i == 0) {
				if (opts.headers.length === 0) {
					opts.headers = buildRecord(d, true);
					first = false;
				} else {
					callback(buildRecord(d, opts.asArray, opts.headers));
				}
			} else {
				callback(buildRecord(d, opts.asArray, opts.headers));
			}
		});
		buffer = parts[parts.length-1];
	});
	
};