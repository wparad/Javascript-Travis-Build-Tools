'use strict';

var mocha = require('mocha');
var assert = require('chai').assert;

var Travis = require('./lib/travis.js');

describe('Travis', function() {
	describe('#Version()', function () {
		it('Should be 0.0.0 when run on the local system', function(){
			var version = new Travis().GetVersion();
			assert.equal('0.0.0', version);
		});

		it('Should be 0.0.0 when run on the local system', function(){
			var version = new Travis(undefined, undefined, undefined).GetVersion();
			assert.equal('0.0.0', version);
		});

		it('Should be 0.0.1 when non release build has a build number.', function(){
			var version = new Travis('false', 'master', '1').GetVersion();
			assert.equal('0.0.1', version);
		});

		it('Should be 0.0.1 when non release build has a build number.', function(){
			var version = new Travis(undefined, 'master', '1').GetVersion();
			assert.equal('0.0.1', version);
		});

		it('Should match release branch with 1 values.', function(){
			var version = new Travis('false', 'release/0', '1').GetVersion();
			assert.equal('0.1.0', version);
		});

		it('Should match release branch with 2 values.', function(){
			var version = new Travis('false', 'release/1.0', '1').GetVersion();
			assert.equal('1.0.1', version);
		});

		//versions with 4 digits are not supported.
		it.skip('Should match release branch with 3 values.', function(){
			var version = new Travis('false', 'release/2.0.3', '1').GetVersion();
			assert.equal('2.0.3.1', version);
		});
		
		it('Should be pull request based build number.', function(){
			var version = new Travis('10', 'master', '1').GetVersion();
			assert.equal('0.10.1', version);
		});
		
		it('Should be pull request based build number.', function(){
			var version = new Travis('10', 'release/1.0', '1').GetVersion();
			assert.equal('0.10.1', version);
		});
	});
});
