#!/usr/bin/env node
 
'use strict';

var shell = function(func) { return require('child_process').execSync(func, { encoding: 'utf8' }); };

function Builder(service_user, git_repository) {
  this.service_user = service_user;

  var origin_url = shell("git config --get remote.origin.url");
  this.git_repository = git_repository || origin_url.split('://')[1] || origin_url.split('@')[1]

  if (this.git_repository == null) { throw 'git_repository is not specified'; }
  if (service_user == null) { throw 'service_user is not specified'; }
  
  //Set the service remote
  if(shell('git remote show service > /dev/null 2>&1 || echo 1'))
    shell("git remote add service https://" + service_user + '@' + this.git_repository  + '  > /dev/null 2>&1 || exit 0');
  shell("git fetch service > /dev/null 2>&1 || exit 0");

  this.PublishGitTag = PublishGitTag;
  this.MergeDownstream = MergeDownstream; 
}

function PublishGitTag(pull_request, tag) {
  if(pull_request == null || !pull_request.match(/false/i)) { return; }
  if(tag == null) { throw 'tag not specified'; }

  //Setup up deploy
  console.log(shell('git config --global user.email "builds@travis-ci.com"'));
  console.log(shell('git config --global user.name "Travis CI"'));
  console.log(shell('git tag ' + tag + ' -a -m "Generated tag from TravisCI."'));
  console.log('Pushing Git tag ' + tag);

  shell('git push --tags --quiet service ' + tag + ' > /dev/null 2>&1');
}

function MergeDownstream(pull_request, branch, release_branch_name, master_branch_name) {
  if(pull_request == null || !pull_request.match(/false/i)) { return; }
  if(branch == null) { throw 'current branch not specified.'; }
  if(release_branch_name == null) { throw 'release branch matcher not specified.'; }
  if(master_branch_name == null) { throw 'master branch master not specified.'; }

  //get all branches
  var git_branches = shell('git ls-remote --heads origin');
  var regex = new RegExp(/(.*refs\/heads\/([^\s]+))/g)
 
  var branch_matching_regex = new RegExp(release_branch_name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + '(.*)$');
  var current_release_version = branch_matching_regex.exec(branch)[1];
  var matching_branches = [];
  var match = null;
  var found = false;
  while(match = regex.exec(git_branches)) {
    var version_match = branch_matching_regex.exec(match[2]); 
    if(version_match) {
      matching_branches.push(version_match[1]);
      if(version_match[1] == current_release_version) found = true;
    }
  }

  //If this branch doesn't match the downstream then ignore creating the merge
  if(!found) {return;}

  var Version = function(a){ return (a + '.0.0').split('.').slice(0, 3).join('.'); }
  var semver = require('semver');
  //Sort the branches by the match that comes after the release branch name
  var sorted_branches = matching_branches.sort(function(a,b) {return semver.compare(Version(a),Version(b)); });
  //Find the next branch in the array that isn't the current branch
  var next_branch_to_merge = sorted_branches.filter(function(a) { return semver.gt(Version(a), Version(current_release_version)); })[0];
  
  //merge to master last
  next_branch_to_merge = next_branch_to_merge == null ? master_branch_name : release_branch_name + next_branch_to_merge;
  //create a merge commit for that branch
  console.log(shell('git merge --no-ff service/' + next_branch_to_merge + ' -m"Merge remote-tracking branch \'' + branch + '\'"'));
  console.log('Merging to downstream branch: ' + next_branch_to_merge);
  //push origin for that branch using the service user
  shell('git push --quiet service HEAD:' + next_branch_to_merge + ' > /dev/null 2>&1');
}

module.exports = Builder;