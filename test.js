'use strict';

var mocha = require('mocha');
var assert = require('chai').assert;

var Travis = require('./lib/travis.js');

describe('Travis', function() {
	describe('#Version()', function () {
		var travis = new Travis(true);
		it('Should be 0.0.0 when run on the local system', function(){
			var version = travis.GetVersion();
			assert.equal('0.0.0', version);
		});

		it('Should be 0.0.0 when run on the local system', function(){
			var version = travis.GetVersion(undefined, undefined, undefined);
			assert.equal('0.0.0', version);
		});

		it('Should be 0.0.1 when non release build has a build number.', function(){
			var version = travis.GetVersion('false', 'master', '1');
			assert.equal('0.0.1', version);
		});

		it('Should be 0.0.1 when non release build has a build number.', function(){
			var version = travis.GetVersion(undefined, 'master', '1');
			assert.equal('0.0.1', version);
		});

		it('Should match release branch with 1 values.', function(){
			var version = travis.GetVersion('false', 'release/0', '1');
			assert.equal('0.1.0', version);
		});

		it('Should match release branch with 2 values.', function(){
			var version = travis.GetVersion('false', 'release/1.0', '1');
			assert.equal('1.0.1', version);
		});

		//versions with 4 digits are not supported.
		it.skip('Should match release branch with 3 values.', function(){
			var version = travis.GetVersion('false', 'release/2.0.3', '1');
			assert.equal('2.0.3.1', version);
		});
		
		it('Should be pull request based build number.', function(){
			var version = travis.GetVersion('10', 'master', '1');
			assert.equal('0.10.1', version);
		});
		
		it('Should be pull request based build number.', function(){
			var version = travis.GetVersion('10', 'release/1.0', '1');
			assert.equal('0.10.1', version);
		});
	});
});
