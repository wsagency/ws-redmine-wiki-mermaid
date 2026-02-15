# frozen_string_literal: true

Redmine::Plugin.register :redmine_wiki_mermaid do
  name 'Redmine Wiki Mermaid'
  author 'Web Solutions Ltd (ws.agency)'
  description 'Renders Mermaid diagrams in wiki pages and provides a live split-pane editor.'
  version '1.0.0'
  url 'https://github.com/wsagency/ws-redmine-wiki-mermaid'
  author_url 'https://ws.agency'

  requires_redmine version_or_higher: '5.0'
end

Rails.configuration.to_prepare do
  require_dependency File.expand_path('../lib/redmine_wiki_mermaid/hooks', __FILE__)
end
