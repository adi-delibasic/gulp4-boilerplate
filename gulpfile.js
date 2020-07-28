const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();
const { src, series, parallel, dest, watch } = require("gulp");

//Source

jsPath = "src/assets/js/**/*.js";
scssPath = "src/assets/scss/**/*.scss";
htmlPath = "./*.html";

//Scss
function style() {
  return gulp
    .src(scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(concat("style.min.css"))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/assets/css"))
    .pipe(browsersync.stream());
}

// JS
function jsTask() {
  return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat("app.js"))
    .pipe(terser())
    .pipe(dest("dist/assets/js"))
    .pipe(sourcemaps.write("."));
}
// HTML
function copyHtml() {
  return src("*.html").pipe(gulp.dest("dist"));
}

function reload(done) {
  browsersync.reload();
  done();
}

function watchTask() {
  browsersync.init({
    server: "./",
  });
  watch([scssPath, jsPath, htmlPath], series(style, jsTask, copyHtml));
  watch("./*.html", reload);
}

exports.style = style;
exports.jsTask = jsTask;
exports.copyHtml = copyHtml;
exports.watch = watch;
exports.default = series(parallel(copyHtml, style, jsTask), watchTask);
