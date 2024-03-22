# Obsidian Regex Paste Plugin

Checks pasted content against user-defined regular expressions, and replaces it with the first matched replacement pattern.

Some helpful documentation:
- [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [Replacement Patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement)

[RegExr.com](https://regexr.com/) is a useful tool for testing your replacements!

## Examples

### Shorten links

`https://obsidian.md/` → `[Link 🔗](https://obsidian.md/)`

- Pattern: `http.*`
- Replacement: `[Link 🔗]($&)`

### Format Jira links

`https://org.atlassian.net/browse/ISSUE-123` → `[ISSUE-123](https://org.atlassian.net/browse/ISSUE-123)`

- Pattern: `^.*atlassian.net.*(ISSUE-\d*)`
- Replacement: `[$1]($&)`
