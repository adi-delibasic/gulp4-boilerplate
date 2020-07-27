const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const { src, series, parallel, dest, watch } = require("gulp");

//Source

jsPath = "src/assets/js/**/*.js";
scssPath = "src/assets/scss/**/*.scss";

//Scss
function style() {
  return gulp
    .src(scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(rename("style.min.css"))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/assets/css"));
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

function watchTask() {
  watch([scssPath, jsPath], { interval: 1000 }, parallel(style, jsTask));
}
// HTML
function copyHtml() {
  return src("./src/*.html").pipe(gulp.dest("dist"));
}

exports.style = style;
exports.jsTask = jsTask;
exports.copyHtml = copyHtml;
exports.watch = watch;
exports.default = series(parallel(copyHtml, style, jsTask), watchTask);
