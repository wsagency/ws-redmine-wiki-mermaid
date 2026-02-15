(function() {
  'use strict';

  // ---------------------------------------------------------------------------
  // Diagram Templates
  // ---------------------------------------------------------------------------

  var TEMPLATES = {
    flowchart: {
      label: 'Flowchart',
      code: [
        'flowchart TD',
        '    A[Start] --> B{Decision}',
        '    B -->|Yes| C[Action 1]',
        '    B -->|No| D[Action 2]',
        '    C --> E[End]',
        '    D --> E'
      ].join('\n')
    },
    sequence: {
      label: 'Sequence Diagram',
      code: [
        'sequenceDiagram',
        '    participant Client',
        '    participant Server',
        '    participant Database',
        '    Client->>Server: HTTP Request',
        '    Server->>Database: Query',
        '    Database-->>Server: Results',
        '    Server-->>Client: HTTP Response'
      ].join('\n')
    },
    class: {
      label: 'Class Diagram',
      code: [
        'classDiagram',
        '    class Animal {',
        '        +String name',
        '        +int age',
        '        +makeSound()',
        '    }',
        '    class Dog {',
        '        +fetch()',
        '    }',
        '    class Cat {',
        '        +purr()',
        '    }',
        '    Animal <|-- Dog',
        '    Animal <|-- Cat'
      ].join('\n')
    },
    er: {
      label: 'ER Diagram',
      code: [
        'erDiagram',
        '    CUSTOMER ||--o{ ORDER : places',
        '    ORDER ||--|{ LINE_ITEM : contains',
        '    PRODUCT ||--o{ LINE_ITEM : "is in"',
        '    CUSTOMER {',
        '        int id PK',
        '        string name',
        '        string email',
        '    }',
        '    ORDER {',
        '        int id PK',
        '        date created_at',
        '        string status',
        '    }'
      ].join('\n')
    },
    gantt: {
      label: 'Gantt Chart',
      code: [
        'gantt',
        '    title Project Timeline',
        '    dateFormat YYYY-MM-DD',
        '    section Planning',
        '        Requirements     :a1, 2025-01-01, 7d',
        '        Design           :a2, after a1, 5d',
        '    section Development',
        '        Implementation   :a3, after a2, 14d',
        '        Testing          :a4, after a3, 7d',
        '    section Release',
        '        Deployment       :a5, after a4, 3d'
      ].join('\n')
    },
    mindmap: {
      label: 'Mindmap',
      code: [
        'mindmap',
        '  root((Project))',
        '    Frontend',
        '      HTML',
        '      CSS',
        '      JavaScript',
        '    Backend',
        '      Ruby',
        '      Rails',
        '      Database',
        '    DevOps',
        '      CI/CD',
        '      Docker',
        '      Monitoring'
      ].join('\n')
    },
    state: {
      label: 'State Diagram',
      code: [
        'stateDiagram-v2',
        '    [*] --> Draft',
        '    Draft --> Review : Submit',
        '    Review --> Approved : Approve',
        '    Review --> Draft : Request Changes',
        '    Approved --> Published : Publish',
        '    Published --> Archived : Archive',
        '    Archived --> [*]'
      ].join('\n')
    },
    pie: {
      label: 'Pie Chart',
      code: [
        'pie title Browser Market Share',
        '    "Chrome" : 65',
        '    "Safari" : 19',
        '    "Firefox" : 4',
        '    "Edge" : 4',
        '    "Other" : 8'
      ].join('\n')
    }
  };

  // ---------------------------------------------------------------------------
  // Theme Detection
  // ---------------------------------------------------------------------------

  function isDarkTheme() {
    var body = document.body;
    if (body.classList.contains('theme-dark')) return true;
    if (document.documentElement.getAttribute('data-theme') === 'dark') return true;
    var bg = window.getComputedStyle(body).backgroundColor;
    if (bg) {
      var match = bg.match(/\d+/g);
      if (match && match.length >= 3) {
        var brightness = (parseInt(match[0]) * 299 + parseInt(match[1]) * 587 + parseInt(match[2]) * 114) / 1000;
        return brightness < 128;
      }
    }
    return false;
  }

  function getMermaidTheme() {
    return isDarkTheme() ? 'dark' : 'default';
  }

  // ---------------------------------------------------------------------------
  // Mermaid Initialization
  // ---------------------------------------------------------------------------

  var renderCounter = 0;

  function initMermaid() {
    if (typeof mermaid === 'undefined') return;
    mermaid.initialize({
      startOnLoad: false,
      theme: getMermaidTheme(),
      securityLevel: 'loose'
    });
  }

  // ---------------------------------------------------------------------------
  // Display Mode: Render Mermaid blocks on wiki pages
  // ---------------------------------------------------------------------------

  function renderMermaidBlocks() {
    var codeBlocks = document.querySelectorAll('pre > code.language-mermaid');
    if (codeBlocks.length === 0) return;

    codeBlocks.forEach(function(codeEl) {
      var preEl = codeEl.parentElement;
      var source = codeEl.textContent.trim();
      var container = document.createElement('div');
      container.className = 'mermaid-container';

      var diagramDiv = document.createElement('div');
      container.appendChild(diagramDiv);

      // Action buttons (copy + fullscreen)
      var actions = document.createElement('div');
      actions.className = 'mermaid-actions';

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.textContent = '\uD83D\uDCCB Copy';
      copyBtn.title = 'Copy Mermaid source';
      copyBtn.addEventListener('click', function() {
        copyToClipboard(source);
      });

      var fsBtn = document.createElement('button');
      fsBtn.type = 'button';
      fsBtn.textContent = '\uD83D\uDD0D Fullscreen';
      fsBtn.title = 'View fullscreen';
      fsBtn.addEventListener('click', function() {
        openFullscreen(diagramDiv.innerHTML);
      });

      actions.appendChild(copyBtn);
      actions.appendChild(fsBtn);
      container.appendChild(actions);

      var id = 'mermaid-diagram-' + (renderCounter++);

      try {
        mermaid.render(id, source).then(function(result) {
          diagramDiv.innerHTML = result.svg;
          preEl.parentNode.replaceChild(container, preEl);
        }).catch(function(err) {
          var errorDiv = document.createElement('div');
          errorDiv.className = 'mermaid-error';
          errorDiv.textContent = 'Mermaid syntax error: ' + (err.message || err);
          preEl.parentNode.replaceChild(errorDiv, preEl);
        });
      } catch (err) {
        var errorDiv = document.createElement('div');
        errorDiv.className = 'mermaid-error';
        errorDiv.textContent = 'Mermaid syntax error: ' + (err.message || err);
        preEl.parentNode.replaceChild(errorDiv, preEl);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Clipboard Helper
  // ---------------------------------------------------------------------------

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('Copied!');
  }

  function showToast(message) {
    var existing = document.querySelector('.mermaid-copy-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'mermaid-copy-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function() {
      toast.classList.add('visible');
    });
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, 1500);
  }

  // ---------------------------------------------------------------------------
  // Fullscreen Viewer
  // ---------------------------------------------------------------------------

  function openFullscreen(svgHtml) {
    var overlay = document.createElement('div');
    overlay.className = 'mermaid-fullscreen-overlay';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'mermaid-fullscreen-close';
    closeBtn.textContent = '\u2715';
    closeBtn.title = 'Close';
    closeBtn.addEventListener('click', function() { overlay.remove(); });

    var content = document.createElement('div');
    content.innerHTML = svgHtml;

    overlay.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });

    function escHandler(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    }
    document.addEventListener('keydown', escHandler);
  }

  // ---------------------------------------------------------------------------
  // Editor Modal
  // ---------------------------------------------------------------------------

  var debounceTimer = null;

  function openEditorModal(initialCode, callback) {
    // Backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'mermaid-modal-backdrop';

    // Modal
    var modal = document.createElement('div');
    modal.className = 'mermaid-modal';

    // Header
    var header = document.createElement('div');
    header.className = 'mermaid-modal-header';

    var title = document.createElement('h3');
    title.textContent = 'Mermaid Diagram Editor';

    var headerActions = document.createElement('div');
    headerActions.className = 'mermaid-modal-header-actions';

    var templateSelect = document.createElement('select');
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a template...';
    templateSelect.appendChild(defaultOption);

    Object.keys(TEMPLATES).forEach(function(key) {
      var opt = document.createElement('option');
      opt.value = key;
      opt.textContent = TEMPLATES[key].label;
      templateSelect.appendChild(opt);
    });

    templateSelect.addEventListener('change', function() {
      if (templateSelect.value && TEMPLATES[templateSelect.value]) {
        textarea.value = TEMPLATES[templateSelect.value].code;
        updatePreview();
        templateSelect.value = '';
      }
    });

    headerActions.appendChild(templateSelect);
    header.appendChild(title);
    header.appendChild(headerActions);

    // Body: split pane
    var body = document.createElement('div');
    body.className = 'mermaid-modal-body';

    // Left: editor
    var editorPane = document.createElement('div');
    editorPane.className = 'mermaid-modal-editor';

    var editorLabel = document.createElement('div');
    editorLabel.className = 'mermaid-modal-editor-label';
    editorLabel.textContent = 'Code';

    var textarea = document.createElement('textarea');
    textarea.value = initialCode || TEMPLATES.flowchart.code;
    textarea.spellcheck = false;
    textarea.setAttribute('autocomplete', 'off');
    textarea.setAttribute('autocorrect', 'off');
    textarea.setAttribute('autocapitalize', 'off');

    // Tab key inserts spaces instead of changing focus
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updatePreview();
      }
    });

    editorPane.appendChild(editorLabel);
    editorPane.appendChild(textarea);

    // Right: preview
    var previewPane = document.createElement('div');
    previewPane.className = 'mermaid-modal-preview';

    var previewLabel = document.createElement('div');
    previewLabel.className = 'mermaid-modal-preview-label';
    previewLabel.textContent = 'Preview';

    var previewContent = document.createElement('div');
    previewContent.className = 'mermaid-modal-preview-content';

    var previewError = document.createElement('div');
    previewError.className = 'mermaid-modal-preview-error';
    previewError.style.display = 'none';

    previewPane.appendChild(previewLabel);
    previewPane.appendChild(previewContent);
    previewPane.appendChild(previewError);

    body.appendChild(editorPane);
    body.appendChild(previewPane);

    // Footer
    var footer = document.createElement('div');
    footer.className = 'mermaid-modal-footer';

    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'mermaid-modal-btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', function() {
      backdrop.remove();
    });

    var insertBtn = document.createElement('button');
    insertBtn.type = 'button';
    insertBtn.className = 'mermaid-modal-btn-insert';
    insertBtn.textContent = 'Insert';
    insertBtn.addEventListener('click', function() {
      callback(textarea.value);
      backdrop.remove();
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(insertBtn);

    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    backdrop.appendChild(modal);

    // Close on backdrop click
    backdrop.addEventListener('click', function(e) {
      if (e.target === backdrop) backdrop.remove();
    });

    // Close on Escape
    function escHandler(e) {
      if (e.key === 'Escape') {
        backdrop.remove();
        document.removeEventListener('keydown', escHandler);
      }
    }
    document.addEventListener('keydown', escHandler);

    document.body.appendChild(backdrop);

    // Live preview with debounce
    function updatePreview() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        var code = textarea.value.trim();
        if (!code) {
          previewContent.innerHTML = '';
          previewError.style.display = 'none';
          return;
        }

        var id = 'mermaid-preview-' + (renderCounter++);
        try {
          mermaid.render(id, code).then(function(result) {
            previewContent.innerHTML = result.svg;
            previewError.style.display = 'none';
          }).catch(function(err) {
            previewError.textContent = err.message || String(err);
            previewError.style.display = 'block';
          });
        } catch (err) {
          previewError.textContent = err.message || String(err);
          previewError.style.display = 'block';
        }
      }, 300);
    }

    textarea.addEventListener('input', updatePreview);

    // Initial render
    textarea.focus();
    updatePreview();
  }

  // ---------------------------------------------------------------------------
  // Wiki Toolbar Integration
  // ---------------------------------------------------------------------------

  function addToolbarButton() {
    // Find the wiki text area
    var wikiTextarea = document.getElementById('content_text') ||
                       document.getElementById('issue_description') ||
                       document.querySelector('textarea.wiki-edit');
    if (!wikiTextarea) return;

    // Find the jstoolbar container
    var toolbar = document.querySelector('.jstBlock .jstElements');
    if (!toolbar) return;

    // Create the toolbar button
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'jstb_mermaid';
    btn.title = 'Insert Diagram';
    btn.tabIndex = -1;
    btn.style.display = 'inline-block';
    btn.style.width = '24px';
    btn.style.height = '24px';
    btn.style.verticalAlign = 'middle';
    btn.style.cursor = 'pointer';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '2px';
    btn.style.background = '#f5f5f5';
    btn.style.marginLeft = '4px';

    btn.addEventListener('click', function(e) {
      e.preventDefault();

      // Check if cursor is inside an existing mermaid block
      var existingCode = extractMermaidBlockAtCursor(wikiTextarea);

      openEditorModal(existingCode, function(code) {
        if (existingCode) {
          // Replace the existing mermaid block
          replaceMermaidBlockAtCursor(wikiTextarea, code);
        } else {
          // Insert new mermaid block at cursor
          insertAtCursor(wikiTextarea, '```mermaid\n' + code + '\n```\n');
        }
      });
    });

    toolbar.appendChild(btn);
  }

  // ---------------------------------------------------------------------------
  // Textarea Helpers
  // ---------------------------------------------------------------------------

  function insertAtCursor(textarea, text) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var value = textarea.value;

    // Add newline before if not at start of line
    var prefix = '';
    if (start > 0 && value[start - 1] !== '\n') {
      prefix = '\n';
    }

    textarea.value = value.substring(0, start) + prefix + text + value.substring(end);
    var newPos = start + prefix.length + text.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
    textarea.focus();

    // Trigger input event for any listeners
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function extractMermaidBlockAtCursor(textarea) {
    var pos = textarea.selectionStart;
    var value = textarea.value;

    // Find if cursor is inside a ```mermaid ... ``` block
    var regex = /```mermaid\n([\s\S]*?)```/g;
    var match;
    while ((match = regex.exec(value)) !== null) {
      var blockStart = match.index;
      var blockEnd = match.index + match[0].length;
      if (pos >= blockStart && pos <= blockEnd) {
        // Store the block position for later replacement
        textarea._mermaidBlockStart = blockStart;
        textarea._mermaidBlockEnd = blockEnd;
        return match[1].trim();
      }
    }
    return null;
  }

  function replaceMermaidBlockAtCursor(textarea, newCode) {
    var start = textarea._mermaidBlockStart;
    var end = textarea._mermaidBlockEnd;
    if (start === undefined || end === undefined) return;

    var value = textarea.value;
    var replacement = '```mermaid\n' + newCode + '\n```';
    textarea.value = value.substring(0, start) + replacement + value.substring(end);

    var newPos = start + replacement.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
    textarea.focus();

    delete textarea._mermaidBlockStart;
    delete textarea._mermaidBlockEnd;

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function() {
    initMermaid();
    renderMermaidBlocks();
    addToolbarButton();
  });
})();
