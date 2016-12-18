#!/usr/bin/env ruby
@paths = %w(
  package.json
  scripts/db.rb
  server/config.json
)

def replace_in_files(new_project_name)
  @paths.each do |p|
    text = File.read p
    changed_text = text.gsub(/tdd_template/, new_project_name)
    File.open(p, 'w') { |f| f << changed_text }
  end
end

def run
  replace_in_files ARGV[0]
end

if ARGV[0]
  run
else
  puts 'You need to enter the project name as arg, for example `./scripts/rename_project new_project_name`'
end
