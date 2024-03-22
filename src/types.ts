export interface Replacement {
  name: string;
  pattern: string;
  replacement: string;
}

export interface Settings {
  replacements: Replacement[];
}
