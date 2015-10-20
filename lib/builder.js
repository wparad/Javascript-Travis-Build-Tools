#!/usr/bin/env node
 
'use strict';

var exec = function(func) { return require('child_process').execSync(func, { encoding: 'utf8' }); };

function Builder(service_user, git_repository) {
  this.service_user = service_user;

  var origin_url = exec("git config --get remote.origin.url");
  this.git_repository = git_repository || origin_url.split('://')[1] || origin_url.split('@')[1]

  if (this.git_repository == null) { throw 'git_repository is not specified'; }
  if (service_user == null) { throw 'service_user is not specified'; }
  
  //Set the service remote
  console.log(exec("git remote add service https://" + service_user + '@' + this.git_repository));
  console.log(exec("git fetch service"));

  this.PublishGitTag = PublishGitTag;
  this.MergeDownstream = MergeDownstream; 
}

function PublishGitTag(pull_request, tag) {
  if(pull_request == null || !pull_request.match(/false/i)) { return; }
  if(tag == null) { throw 'tag not specified'; }

  //Setup up deploy
  console.log(exec('git config --global user.email "builds@travis-ci.com"'));
  console.log(exec('git config --global user.name "Travis CI"'));
  console.log(exec('git tag ' + tag + ' -a -m "Generated tag from TravisCI."'));
  console.log('Pushing Git tag ' + tag);

  exec('git push --tags --quiet service ' + tag + ' > /dev/null 2>&1');
}

function MergeDownstream(pull_request, branch, release_branch_name, master_branch_name) {

}
/*
module TravisBuildTools
    def merge_downstream(release_branch_name, master_branch_name)
      if ENV['TRAVIS'] && ENV['TRAVIS_PULL_REQUEST'].match(/false/i)
        #get all branches
        branches = %x[git ls-remote --heads origin].scan(/^.*refs\/heads\/(.*)$/).flatten
        matching_branches = branches.select{|b| b.match(/#{Regexp.quote(release_branch_name)}/)}

        #If this branch doesn't match the downstream then ignore creating the merge
        return if !matching_branches.include?(ENV['TRAVIS_BRANCH'])

        #Sort the branches by the match that comes after the release branch name
        sorted_branches = matching_branches.map{|b| Gem::Version.new(b.match(/#{Regexp.quote(release_branch_name)}(.*)$/)[1].strip)}

        #Find the next branch in the array that isn't the current branch
        current_release_version = Gem::Version.new(ENV['TRAVIS_BRANCH'].match(/#{Regexp.quote(release_branch_name)}(.*)$/)[1].strip)
        next_branch_to_merge = (sorted_branches.drop_while{|b| b <= current_release_version}.map{|v| release_branch_name + v.to_s} + ['master']).first

        #create a merge commit for that branch
        puts %x[git merge --no-ff service/#{next_branch_to_merge} -m"Merge remote-tracking branch '#{ENV['TRAVIS_BRANCH']}'"]
        puts "Merging to downstream branch: #{next_branch_to_merge}"
        #push origin for that branch using the service user
        %x[git push --quiet service HEAD:#{next_branch_to_merge} > /dev/null 2>&1]
      end
    end
  end
end

*/

module.exports = Builder;