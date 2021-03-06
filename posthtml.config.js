const stripIndent = require("strip-indent");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

module.exports = () => ({
  plugins: {
    "posthtml-doctype": { doctype: "HTML 5" },
    "posthtml-include": { root: "src" },
    "posthtml-expressions": {
      locals: require("./site.config.js"),
    },
    "posthtml-content": {
      markdown: (content) => md.render(stripIndent(content).trim()),
    },
  },
});
