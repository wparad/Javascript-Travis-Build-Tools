#!/usr/bin/env node
 
'use strict';

var Travis = require('./travis.js');
var Builder = require('./builder.js')

module.exports = function(service_user){
  var builder = process.env.TRAVIS ? new Builder(service_user || process.env.USER) : null;
  return new Travis(
    process.env.TRAVIS_PULL_REQUEST,
    process.env.TRAVIS_BRANCH,
    process.env.TRAVIS_BUILD_NUMBER,
    builder)
};