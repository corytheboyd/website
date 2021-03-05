module.exports = () => ({
  plugins: {
    "posthtml-doctype": { doctype: "HTML 5" },
    "posthtml-md": { root: "src" },
    "posthtml-extend": {
      root: "src",
      plugins: [require("posthtml-expressions")()],
    },
  },
});
