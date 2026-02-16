# frozen_string_literal: true

module RedmineWikiMermaid
  class Hooks < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(context = {})
      return '' unless plugin_enabled?

      stylesheet_link_tag('wiki_mermaid', plugin: 'redmine_wiki_mermaid') +
        javascript_include_tag('mermaid.min', plugin: 'redmine_wiki_mermaid')
    end

    def view_layouts_base_body_bottom(context = {})
      return '' unless plugin_enabled?

      javascript_include_tag('wiki_mermaid', plugin: 'redmine_wiki_mermaid')
    end

    private

    def plugin_enabled?
      settings = Setting.plugin_redmine_wiki_mermaid rescue {}
      settings['enabled'] != '0'
    end
  end
end
