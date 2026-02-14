# CLAUDE.md — ws-redmine-wiki-mermaid

## Project
Redmine plugin that renders Mermaid diagrams in wiki pages and provides a live split-pane editor.
Open source, MIT license. Copyright Web Solutions Ltd (ws.agency). Initial development Kristijan Lukačin.

## Stack
- **Backend:** Ruby on Rails (Redmine 6.1 plugin architecture, Rails 7.2.3)
- **Frontend:** Mermaid.js (latest CDN or vendored), vanilla JS, CSS
- **No jQuery dependency** — use vanilla JS only

## What It Does

### Display Mode (viewing wiki pages)
- Detects ` ```mermaid ` fenced code blocks in rendered wiki HTML
- Replaces them with rendered SVG diagrams using Mermaid.js
- Supports ALL Mermaid diagram types: flowchart, sequence, class, state, ER, Gantt, pie, mindmap, timeline, etc.
- Graceful error handling — if syntax is invalid, show the error message inline (not console)
- Light/dark mode support — detect Redmine theme and adjust Mermaid theme accordingly
- Diagrams should be responsive (fit container width)
- Add a small "📋 Copy" button and "🔍 Fullscreen" button on hover over each diagram

### Edit Mode (editing wiki pages)
- When editing a wiki page, add a "📊 Insert Diagram" button to the wiki toolbar
- Clicking it opens a **modal** with split-pane Mermaid editor:
  - **Left pane:** Code editor with Mermaid syntax (use a simple textarea with monospace font, syntax highlighting NOT required)
  - **Right pane:** Live preview that updates as you type (debounced, ~300ms)
  - **Template dropdown:** Pre-built templates for common diagrams (flowchart, sequence, ER, Gantt, mindmap)
  - **Error display:** If syntax is invalid, show error below the preview pane
  - **Insert button:** Inserts the ` ```mermaid\n...\n``` ` block at cursor position in wiki textarea
  - **Cancel button:** Closes modal without inserting
- When cursor is inside an existing mermaid block and user clicks "📊 Edit Diagram", open the modal pre-populated with the existing code
- Modal should be large (80% viewport) for comfortable editing

### Integration Points
- Hook: `view_layouts_base_html_head` — inject Mermaid.js + CSS on wiki pages
- Hook: `view_layouts_base_body_bottom` — inject JS initialization
- Wiki toolbar: Add button via JS DOM manipulation on wiki edit pages
- Works with CommonMark (Redmine's markdown formatter) — ` ```mermaid ` blocks are rendered as `<pre><code class="language-mermaid">` in HTML

## Architecture

### Files to Create
```
init.rb                              — Plugin registration
assets/javascripts/mermaid.min.js    — Mermaid.js library (vendored, ~1.5MB)
assets/javascripts/wiki_mermaid.js   — Main plugin JS (display + editor)
assets/stylesheets/wiki_mermaid.css  — Styles for diagrams + modal editor
lib/redmine_wiki_mermaid/hooks.rb    — View hooks for asset injection
config/locales/en.yml                — English translations
config/locales/hr.yml                — Croatian translations
README.md                           — Documentation
LICENSE                              — MIT license
```

### Display Logic (wiki_mermaid.js)
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Find all <pre><code class="language-mermaid"> blocks
  // For each: create a container div, call mermaid.render(), replace the code block
  // Add copy + fullscreen buttons on hover
});
```

### Editor Modal Logic
```javascript
// On wiki edit page, add toolbar button
// Modal: split-pane with textarea + preview div
// On textarea input (debounced): mermaid.render() into preview
// Insert: get textarea selection/cursor, insert mermaid code block
```

## Critical Redmine 6.1 + Rails 7.2 Rules
1. Use `prepend` for any patches (NOT `alias_method_chain`)
2. Plugin assets go in `assets/` — Redmine serves them from `/plugin_assets/redmine_wiki_mermaid/`
3. No database needed — this is a pure frontend plugin
4. No controller needed — hooks only
5. Test in both light and dark Redmine themes
6. Wiki content uses CommonMark — fenced code blocks render as `<pre><code class="language-X">`

## Mermaid.js Integration
- Vendor the latest Mermaid.js in `assets/javascripts/mermaid.min.js`
- Download from: https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js
- Initialize with: `mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' })`
- Render individual diagrams with: `mermaid.render(id, code)` — returns SVG
- Use `securityLevel: 'loose'` to allow click events in diagrams

## Templates to Include
Provide these starter templates in the editor dropdown:
1. **Flowchart** — basic process flow
2. **Sequence Diagram** — API call flow
3. **Class Diagram** — OOP structure
4. **ER Diagram** — database schema
5. **Gantt Chart** — project timeline
6. **Mindmap** — brainstorming
7. **State Diagram** — state machine
8. **Pie Chart** — simple data viz

## Quality Checklist
- [ ] Mermaid blocks render correctly on wiki show pages
- [ ] Invalid syntax shows friendly error, not broken page
- [ ] Toolbar button appears on wiki edit pages
- [ ] Modal opens with split-pane editor
- [ ] Live preview updates as you type
- [ ] Templates populate correctly
- [ ] Insert button adds properly formatted code block
- [ ] Edit existing diagram works (pre-populates modal)
- [ ] Copy button copies Mermaid source code
- [ ] Fullscreen button works
- [ ] Responsive — diagrams fit container
- [ ] Works in both light and dark themes
- [ ] No JavaScript errors in console
- [ ] Plugin installs cleanly (no migrations needed)
- [ ] No conflicts with other wiki plugins
