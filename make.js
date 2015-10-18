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
var package_metadata = require('./package.json');
var Travis = package_metadata.name == 'travis-build-tools' ? require('./') : require('travis-build-tools');

commander.version(package_metadata.version);
console.log(new Travis().GetBuildNumber());

/**
 * Build
 */
commander
	.command('build')
	.description('Setup require build files for npm package.');

/**
 * After Build
 */
commander
	.command('after_build')
	.description('Publishes git tags and reports failures.');

console.log("Building package %s (%s)", package_metadata.name, package_metadata.version);
console.log('');

commander.parse(process.argv);