const { readFileSync } = require("fs");

module.exports = {
  projects: {
    midishare: {
      title: "Midishare",
      content: readFileSync("./src/projects/midishare.md").toString(),
      links: {
        www: {
          url: "https://www.midishare.app",
          label: "www.midishare.app",
        },
        github: {
          url: "https://github.com/corytheboyd/midishare",
          label: "github.com/corytheboyd/midishare",
        },
      },
    },
    website: {
      title: "Website",
      content: readFileSync("./src/projects/website.md").toString(),
      links: {
        www: {
          url: "https://corytheboyd.com",
          label: "corytheboyd.com",
        },
        github: {
          url: "https://github.com/corytheboyd/website",
          label: "github.com/corytheboyd/website",
        },
      },
    },
  },
};
