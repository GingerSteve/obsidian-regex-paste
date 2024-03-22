import { App, PluginSettingTab, Setting } from "obsidian";
import RegexPastePlugin from "./main";
import type { Replacement } from "./types";

export class SettingsTab extends PluginSettingTab {
  plugin: RegexPastePlugin;

  constructor(app: App, plugin: RegexPastePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    let { containerEl } = this;
    containerEl.empty();

    this.addSettingsHeader();
    this.addAddReplacementButton();

    this.plugin.settings.replacements.forEach((rep, index) => {
      this.addReplacementListItem(rep, index);
    });
  }

  addSettingsHeader(): void {
    this.containerEl.createEl("p", {
      text: "When pasting into the editor, the plugin checks the pasted text against each regex pattern. The first match will be replaced with its replacement string. ",
    });
    this.containerEl.createEl("p", {
      text: "Some helpful documentation:",
    });
    const ul = this.containerEl.createEl("ul");
    ul.createEl("li").createEl("a", {
      text: "Regular Expressions",
      href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp",
    });
    ul.createEl("li").createEl("a", {
      text: "Replacement Patterns",
      href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement",
    });
  }

  addAddReplacementButton() {
    new Setting(this.containerEl)
      .setName("Add Replacement")
      .addButton((button) => {
        button
          .setTooltip("Add new replacement")
          .setButtonText("+")
          .setCta()
          .onClick(() => {
            this.plugin.settings.replacements.push({
              name: "",
              pattern: "",
              replacement: "",
            });
            this.plugin.saveSettings();
            this.display();
          });
      });
  }

  addReplacementListItem(rep: Replacement, index: number) {
    const itemContainer = this.containerEl.createEl("div");
    itemContainer.addClass("item-container");

    const setting = new Setting(itemContainer)
      .setClass("primary-item")
      .addText((text) =>
        text
          .setPlaceholder("Name")
          .setValue(rep.name)
          .onChange(async (value) => {
            this.plugin.settings.replacements[index].name = value;
            await this.plugin.saveSettings();
          }),
      );
    if (index !== 0) {
      setting.addExtraButton((cb) => {
        cb.setIcon("up-chevron-glyph")
          .setTooltip("Move up")
          .onClick(() => {
            move(this.plugin.settings.replacements, index, index - 1);
            this.plugin.saveSettings();
            this.display();
          });
      });
    }
    if (index !== this.plugin.settings.replacements.length - 1) {
      setting.addExtraButton((cb) => {
        cb.setIcon("down-chevron-glyph")
          .setTooltip("Move down")
          .onClick(() => {
            move(this.plugin.settings.replacements, index, index + 1);
            this.plugin.saveSettings();
            this.display();
          });
      });
    }
    setting.addExtraButton((cb) => {
      cb.setIcon("cross")
        .setTooltip("Delete")
        .onClick(() => {
          this.plugin.settings.replacements.splice(index, 1);
          this.plugin.saveSettings();
          this.display();
        });
    });

    new Setting(itemContainer)
      .setName("Pattern")
      .setClass("sub-item")
      .addText((text) =>
        text.setValue(rep.pattern).onChange(async (value) => {
          this.plugin.settings.replacements[index].pattern = value;
          await this.plugin.saveSettings();
        }),
      );
    new Setting(itemContainer)
      .setName("Replacement")
      .setClass("sub-item")
      .addText((text) =>
        text.setValue(rep.replacement).onChange(async (value) => {
          this.plugin.settings.replacements[index].replacement = value;
          await this.plugin.saveSettings();
        }),
      );
  }
}

/** Switch order of two array items */
function move<T>(arr: T[], from: number, to: number): void {
  if (to < 0 || to === arr.length) return;

  const temp = arr[from];
  arr[from] = arr[to];
  arr[to] = temp;
}
