#!/usr/bin/env node

'use strict';

/*
var fs = require('fs');
var path = require('path');
var package_json = path.join(process.cwd(), 'package.json');
var version = require(package_json).version;
console.log(version);
*/

/**
 * Module dependencies
 */
var commander = require('commander');
var fs = require('fs');
var package_metadata = require('./package.json');
var TravisBuildTools = (package_metadata.name == 'travis-build-tools' ? require('./') : require('travis-build-tools'));

var travis = new TravisBuildTools(undefined);
var version = travis.GetVersion();
commander.version(version);

/**
 * Build
 */
commander
	.command('build')
	.description('Setup require build files for npm package.')
	.action(function() {
		package_metadata.version = version;
		fs.writeFile('./package.json', JSON.stringify(package_metadata, null, 2), function(err) {
			if(err) { throw err; }
		});

		console.log("Building package %s (%s)", package_metadata.name, version);
		console.log('');
	});

/**
 * After Build
 */
commander
	.command('after_build')
	.description('Publishes git tags and reports failures.')
	.action(function() {
		console.log("After build package %s (%s)", package_metadata.name, version);
		console.log('');
		travis.PublishGitTag();

	});

commander.parse(process.argv);