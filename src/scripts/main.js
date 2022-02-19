import { LitElement, html, css} from "lit";

import { basicSetup, EditorView } from "@codemirror/basic-setup";
import { EditorState, Compartment } from "@codemirror/state";

import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang  } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";

const getLanguage = (lang) => {
  switch (lang) {
    case "javascript": return javascript;
    case "rust": return rust;
    case "html": return htmlLang;
    case "css": return cssLang;
    case "json": return json;
    case "markdown": return markdown;
    default: return javascript;
  }
}

let myTheme = EditorView.theme({
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "#ddd",
    border: "none"
  },
}, {dark: false})


class EditorCode extends LitElement {
  constructor() {
    super();
    this.lang = "javascript";
    this.view = null;
    this.div = null;

    this.language = new Compartment(),
    this.tabSize = new Compartment();
    this.state = EditorState.create({
      extensions: [
        basicSetup,
        this.language.of(javascript()),
        this.tabSize.of(EditorState.tabSize.of(8)),
        myTheme
      ],
    });
  }

  static properties = { lang: { attribute: true }, 'tab-size': { attribute: true } };

  get editorRoot() {
    return this.renderRoot?.querySelector('#code') ?? null;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.view = null;
  }

  firstUpdated() {
    this.view = new EditorView({
      state: this.state,
      parent: this.editorRoot,
    });
  }

  updated(changedProperties) {
    if (!this.view) return;
    if (changedProperties.has("lang")) {
      const lang = getLanguage(this.lang)
      this.view.dispatch({
        effects: this.language.reconfigure(lang()),
      });
    }
  }

  onTabSizeChange(e) {
    
    console.log(e.target.value);
    this.view.dispatch({
      effects: this.tabSize.reconfigure(EditorState.tabSize.of(e.target.value)),
    });
  }

  static styles = css`
    .wrapper {
      display: grid;
      grid-template-rows: 44px 1fr;
      border: 1px solid #b2bec3;
      border-radius: 6px;
    }

    .settings {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background-color: #dfe6e9;
    }

    .ͼ2 .cm-activeLine {
      background-color: transparent;
    }

    .ͼ2 .cm-activeLineGutter {
      background-color: transparent;
    }
  `;
  
  render() {
    return html`
      <div class="wrapper">
        <nav class="settings">
          <div>
            tabsize
            <input type="number" value="${this.tabSize.get(this.state).value}" @change="${this.onTabSizeChange}">
          </div>
          <div>
            spaces/tabs
          </div>
        </nav>
        <div id="code"></div>
      </div>
    `;
  }
}

customElements.define("ysk-editorcode", EditorCode);
