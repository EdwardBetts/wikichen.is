repo_url      = "git@github.com:wikichen/wikichen.as.git"
deploy_dir    = "_site"
deploy_branch = "gh-pages"

desc 'Preview site on localhost'
task :preview do
  system 'jekyll serve --watch --drafts --config=_config.yml,_local_config.yml'
end

desc 'Deploy the site to GitHub Pages'
task :deploy_deprecated do
  #system 'compass compile'
  system 'jekyll build'

  cd "#{deploy_dir}" do
    system "git pull"
  end

  #(Dir["#{deploy_dir}/*"]).each { |f| rm_rf(f) }

  cd "#{deploy_dir}" do
    system "git add -A"
    puts "\n## Commiting: Site updated at #{Time.now.utc}"
    message = "Site updated at #{Time.now.utc}"
    system "git commit -m \"#{message}\""
    puts "\n## Pushing generated #{deploy_dir} website"
    system "git push origin #{deploy_branch}"
    puts "\n## Github Pages deploy complete"
  end

end

desc "Setup directory for deploying to GitHub Pages"
task :gh_deploy_setup do
  rm_rf deploy_dir
  mkdir deploy_dir
  cd "#{deploy_dir}" do
    system "git init"
    system "echo 'Setting up GitHub Pages deployment &hellip;' > index.html"
    system "git add ."
    system "git commit -m 'Deploy init'"
    system "git branch -m gh-pages"
    system "git remote add origin #{repo_url}"
  end
  puts "\n---\n## Now you can deploy to #{repo_url} with `rake deploy` ##"
end

desc "Build _site/"
task :build do
  system "jekyll build"
end

desc "Commit _site/"
task :commit => [:build] do
  puts "\n## Staging modified files"
  status = system("git add -A")
  puts status ? "Success" : "Failed"
  puts "\n## Committing a site build at #{Time.now.utc}"
  message = "Build site at #{Time.now.utc}"
  status = system("git commit -m \"#{message}\"")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing commits to remote"
  status = system("git push origin source")
  puts status ? "Success" : "Failed"
end

desc "Deploy _site/ to gh-pages branch"
task :deploy => [:build] do
  puts "\n## Deleting gh-pages branch"
  status = system("git branch -D gh-pages")
  puts status ? "Success" : "Failed"
  puts "\n## Creating new gh-pages branch and switching to it"
  status = system("git checkout -b gh-pages")
  puts status ? "Success" : "Failed"
  puts "\n## Forcing the _site subdirectory to be project root"
  status = system("git filter-branch --subdirectory-filter _site/ -f")
  puts status ? "Success" : "Failed"
  puts "\n## Switching back to source branch"
  status = system("git checkout source")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing all branches to origin"
  status = system("git push --all origin")
  puts status ? "Success" : "Failed"
end