repo_url      = "git@github.com:wikichen/wikichen.as.git"
deploy_dir    = "_site"
deploy_branch = "gh-pages"

desc 'Preview site on localhost'
task :preview do
  system 'jekyll serve --watch --drafts --config=_config.yml,_local_config.yml'
end

desc 'Deploy the site to GitHub Pages'
task :deploy do
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
  branch = (repo_url.match(/\/[\w-]+\.github\.(?:io|com)/).nil?) ? 'gh-pages' : 'master'
  rm_rf deploy_dir
  mkdir deploy_dir
  cd "#{deploy_dir}" do
    system "git init"
    system "echo 'Setting up GitHub Pages deployment &hellip;' > index.html"
    system "git add ."
    system "git commit -m 'Deploy init'"
    system "git branch -m gh-pages" unless branch == 'master'
    system "git remote add origin #{repo_url}"
  end
  puts "\n---\n## Now you can deploy to #{repo_url} with `rake deploy` ##"
end