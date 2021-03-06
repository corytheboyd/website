module.exports = () => ({
  plugins: {
    "posthtml-doctype": { doctype: "HTML 5" },
    "posthtml-include": { root: "src" },
    "posthtml-extend": { root: "src" },
  },
});
