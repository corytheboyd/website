const { readFileSync } = require("fs");

module.exports = {
  posts: {
    "2022-04-28": {
      date: "2022-04-28",
      title: "It still works!",
      content: readFileSync("./src/posts/2022-04-28.md").toString(),
    },
    "2020-03-09": {
      date: "2020-03-09",
      title: "New city, new job, new... website?",
      content: readFileSync("./src/posts/2020-03-09.md").toString(),
    },
  },
};
