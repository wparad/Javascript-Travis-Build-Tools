# Travis Build Tools
Node NPM Travis build tools library.

[![npm version](https://badge.fury.io/js/travis-build-tools.svg)](https://badge.fury.io/js/travis-build-tools) [![Build Status](https://travis-ci.org/wparad/Javascript-Travis-Build-Tools.svg?branch=master)](https://travis-ci.org/wparad/Javascript-Travis-Build-Tools)

### Usage

```javascript
var travis = require('travis-build-tools')(process.env.GIT_TAG_PUSHER);

//Get the current version based on the branch name:
var version = travis.GetVersion();

//Automatically publish a tag with the current version to the git repository.
travis.PublishGitTag();

//Or
travis.PublishGitTag('tag-name.1.0.0-sha1');

//Automatically merge downstream branches (`release/*` or `master`) if the current branch is `release`.
travis.MergeDownstream('release/', 'master');
```

### Development
* Get Node:
	* `curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -`
	* `apt-get install nodejs`
	* `npm install travis-build-tools`


Update .travis.yml keys

* `apt-get install ruby-dev`
* `gem install travis`
* Setup [Travis-CI](https://travis-ci.org/profile/) build on the repository.
* `travis encrypt GIT_TAG_PUSHER=git_api_key --add env.global`
* `travis encrypt deployment_key --add deploy.api_key`
