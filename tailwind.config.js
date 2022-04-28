module.exports = {
  content: ["./src/**/*.html", "./src/**/*.tsx"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.200"),
            h1: {
              color: theme("colors.pink.600"),
            },
            h2: {
              color: theme("colors.pink.600"),
            },
            h3: {
              color: theme("colors.pink.600"),
            },
            h4: {
              color: theme("colors.pink.600"),
            },
            code: {
              color: theme("colors.purple.500"),
            },
            strong: {
              color: theme("colors.gray.400"),
            },
          },
        },
      }),
    },
  },
};
