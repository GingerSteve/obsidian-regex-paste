import { Plugin } from "obsidian";
import { SettingsTab } from "./Settings";

import type { Settings } from "./types";

const DEFAULT_SETTINGS: Settings = {
  replacements: [
    {
      name: "Example: Shorten links",
      pattern: "http.*",
      replacement: "[Link 🔗]($&)",
    },
  ],
};

export default class RegexPastePlugin extends Plugin {
  settings: Settings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingsTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on("editor-paste", (evt, editor) => {
        const text = evt.clipboardData?.getData("text");
        if (!text) return;

        const rep = this.settings.replacements.find((r) =>
          text.match(new RegExp(r.pattern)),
        );
        if (rep) {
          evt.preventDefault();
          const formatted = text.replace(
            new RegExp(rep.pattern, "g"),
            rep.replacement,
          );
          editor.replaceRange(
            formatted,
            editor.getCursor("from"),
            editor.getCursor("to"),
          );

          const cursor = editor.getCursor();
          editor.setCursor({
            line: cursor.line,
            ch: Math.min(
              cursor.ch + formatted.length,
              editor.getLine(cursor.line).length,
            ),
          });
        }
      }),
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
