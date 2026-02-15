# frozen_string_literal: true

module RedmineWikiMermaid
  class Hooks < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(context = {})
      stylesheet_link_tag('wiki_mermaid', plugin: 'redmine_wiki_mermaid') +
        javascript_include_tag('mermaid.min', plugin: 'redmine_wiki_mermaid')
    end

    def view_layouts_base_body_bottom(context = {})
      javascript_include_tag('wiki_mermaid', plugin: 'redmine_wiki_mermaid')
    end
  end
end
