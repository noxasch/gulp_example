// gulp 4

/* 
-- TOP LEVEL FUNCTIONS --
gulp.task - define task
gulp.src - point to source folder and files
gulp.dest - point to output folder
gulp.watch - folder and files to watch for changes
*/

// init modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser-js');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

// File path variables
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js'
}

// sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    // .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'));
};

// JS task
function jsTask() {
  return src(files.jsPath)
    .pipe(concat('all.js')) // final output file name
    .pipe(terser())
    .pipe(dest('dist'));
};

// Cachebusting task
const cbstring = new Date().getTime();
function cacheBustingTask() {
  return src(['index'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.'));
}

// Watch task - monitor file for changes
function watchTask() {
  watch([files.scssPath, files.jsPath], 
    parallel(scssTask, jsTask));
}

// Default task
exports.default = series(
  parallel(scssTask, jsTask),
  cacheBustingTask,
  watchTask);

