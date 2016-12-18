#!/usr/bin/env ruby

DATA_BASE = 'tdd_template'
USER = ARGV[1] || 'postgres'
DB_ENV = ENV['DB'] || 'development'

case ARGV[0]
when 'create'
  puts `sudo -u #{USER} createdb #{DATA_BASE}_#{DB_ENV}`
when 'drop'
  puts `sudo -u #{USER} dropdb #{DATA_BASE}_#{DB_ENV}`
when 'migrate'
  puts `node_modules/.bin/sequelize db:migrate`
when 'reset'
  puts `sudo -u #{USER} dropdb #{DATA_BASE}_#{DB_ENV}`
  puts `sudo -u #{USER} createdb #{DATA_BASE}_#{DB_ENV}`
  puts `node_modules/.bin/sequelize db:migrate`
else
  puts "Error: #{ARGV[0]} is not a valid argunemt. use `create`, `drop`, `migrate` or `reset`"
end
