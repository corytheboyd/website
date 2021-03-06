const postcss = require("gulp-postcss");
const gulp = require("gulp");
const posthtml = require("gulp-posthtml");
const connect = require("gulp-connect");

function css() {
  return gulp
    .src("./src/*.css")
    .pipe(postcss())
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
}

function html() {
  return gulp
    .src("./src/*.html")
    .pipe(posthtml())
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
}

function assets() {
  return gulp
    .src("./assets/**/*")
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
}

function devServer() {
  connect.server({
    root: "./dist",
    livereload: true,
  });

  gulp.watch(["./src/**/*.css"], {}, css);
  gulp.watch(
    ["./src/**/*.html", "./src/**/*.md", "./posthtml.config.js"],
    {},
    html
  );
  gulp.watch(["./assets/*"], {}, assets);
}

exports.serve = gulp.series(gulp.parallel(css, html, assets), devServer);
