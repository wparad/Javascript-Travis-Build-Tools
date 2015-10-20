#!/usr/bin/env node
 
'use strict';

/**
 * Travis Build Tools
 *
 * @constructor
 */

function Travis(pull_request, branch, build_number, builder) {
	this.pull_request = pull_request;
	this.branch = branch;
	this.build_number = build_number;

	this.GetVersion = GetVersion;
	this.GetPullRequest = GetPullRequest;
	this.PublishGitTag = PublishGitTag;
	this.MergeDownstream = MergeDownstream;
}

function GetVersion(pull_request, branch, build_number)
{
	var pull_request = this.pull_request;
	var branch = this.branch;
	var build_number = this.build_number;

	var release_version = '0.0';
	//Builds of pull requests
	if(pull_request != null && !pull_request.match(/false/i)) {
		release_version = '0.' + pull_request;
	}
	//Builds of branches that aren't master or release
	else if(branch == null || !branch.match(/^release[\/-]/i)) {
		release_version = '0.0';
	}
	//Builds of release branches (or locally or on server)
	else {
		release_version = branch.match(/^release[\/-](\d+(?:\.\d+){0,3})$/i)[1];
	}

	return (release_version + '.' + (build_number == null ? '0' : build_number) + '.0.0.0.0').split('.').slice(0, 3).join('.');
}

function GetPullRequest(travis_pull_request){
	var travis_pull_request = this.travis_pull_request; 
	return !travis_pull_request || travis_pull_request.match(/false/i) ? null : travis_pull_request;
}

function PublishGitTag(tag) {
	if(builder) builder.PublishGitTag(pull_request, tag || GetVersion());
};

function MergeDownstream(release_branch_name, master_branch_name) {
	if(builder) builder.MergeDownstream(pull_request, branch, release_branch_name, master_branch_name);
};

module.exports = Travis;