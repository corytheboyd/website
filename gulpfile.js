const rimraf = require("rimraf");
const postcss = require("gulp-postcss");
const gulp = require("gulp");
const posthtml = require("gulp-posthtml");
const connect = require("gulp-connect");

function buildCss() {
  return gulp
    .src("./src/**/*.css")
    .pipe(postcss())
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
}

function buildHtml() {
  return gulp
    .src("./src/**/*.html", {
      ignore: "./src/templates/**/*",
    })
    .pipe(posthtml())
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
}

function copyAssets() {
  return gulp
    .src("./assets/**/*")
    .pipe(gulp.dest("./dist/assets"))
    .pipe(connect.reload());
}

function copyJs() {
  return gulp
    .src("./src/**/*.js")
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
}

function cleanAll(cb) {
  rimraf("./dist", cb);
}

function devServer() {
  connect.server({
    root: "./dist",
    livereload: true,
  });
  gulp.watch(
    ["./src/**/*.html", "./src/**/*.css", "./{tailwind,postcss}.config.js"],
    {},
    gulp.series(buildCss)
  );
  gulp.watch(
    ["./src/**/*.html", "./src/**/*.md", "./{posthtml,site}.config.js"],
    {},
    gulp.series(buildHtml)
  );
  gulp.watch(
      ["./src/**/*.js", "./{tailwind,postcss}.config.js"],
      {},
      gulp.series(copyJs)
  );
  gulp.watch(["./assets/*"], {}, copyAssets);
}

exports.serve = gulp.series(
  cleanAll,
  gulp.parallel(buildCss, buildHtml, copyJs, copyAssets),
  devServer
);

exports.build = gulp.series(
  cleanAll,
  gulp.parallel(buildCss, buildHtml, copyJs, copyAssets)
);
