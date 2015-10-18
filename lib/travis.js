#!/usr/bin/env node
 
'use strict';

/*
var fs = require('fs');
var path = require('path');
var package_json = path.join(process.cwd(), 'package.json');
var version = require(package_json).version;
console.log(version);
*/

/*
module TravisBuildTools
  module Build
    RELEASE_VERSION = case
      #Builds of pull requests
      when !(ENV['TRAVIS_PULL_REQUEST'] || 'false').match(/false/i) then "0.#{ENV['TRAVIS_PULL_REQUEST']}"
      #Builds of branches that aren't master or release
      when !ENV['TRAVIS_BRANCH'] || !ENV['TRAVIS_BRANCH'].match(/^release[\/-]/i) then '0.0'
      #Builds of release branches (or locally or on server)
      else ENV['TRAVIS_BRANCH'].match(/^release[\/-](\d+\.\d+)$/i)[1]
    end
    now = Time.now.to_a
    VERSION = Gem::Version.new("#{RELEASE_VERSION}.#{ENV['TRAVIS_BUILD_NUMBER'] || '0'}.0")
    PULL_REQUEST = (ENV['TRAVIS_PULL_REQUEST'] || 'false').match(/false/i) ? nil : ENV['TRAVIS_PULL_REQUEST']
  end
end
*/
/*
module TravisBuildTools
  class Builder
    def initialize(service_user, git_repository = nil)
      @service_user = service_user
      origin_url = %x[git config --get remote.origin.url]
      git_repository ||= origin_url.split('://')[1] || origin_url.split('@')[1]
      raise 'git_repository is not specified' if !git_repository
      raise 'service_user is not specified' if !service_user
      
      #Set the service remote
      puts %x[git remote add service https://#{service_user}@#{git_repository}]
      puts %x[git fetch service]
    end

    def publish_git_tag(tag_name)
      if ENV['TRAVIS'] && ENV['TRAVIS_PULL_REQUEST'].match(/false/i)
        raise 'tag_name is not specified' if !tag_name

        #Setup up deploy
        puts %x[git config --global user.email "builds@travis-ci.com"]
        puts %x[git config --global user.name "Travis CI"]
        puts %x[git tag #{tag_name} -a -m "Generated tag from TravisCI."]
        puts "Pushing Git tag #{tag_name}."

        %x[git push --tags --quiet service #{tag_name} > /dev/null 2>&1]
      end
    end
    
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