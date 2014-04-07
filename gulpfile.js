// include gulp
var gulp = require('gulp');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');

// SASS/CSS build plugins
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// JS build plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

// global build variables
var buildDst  = './_site';
var assetsSrc = './_assets',
    assetsDst = buildDst + '/assets';
var sassSrc   = assetsSrc + '/stylesheets/*.scss',
    sassDst   = assetsDst + '/css';
var jsSrc     = assetsSrc + '/javascripts',
    jsDst     = assetsDst + '/js';
var imagesDr  = '/images';

// JS hint task
gulp.task('jshint', function() {
  gulp.src('./_assets/javascripts/*.js')
    .pipe(cached('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './uploads/**/*',
      imgDst = imgSrc;

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// minifiy new or changed HTML pages
gulp.task('htmlmin', function() {
  var htmlSrc = './_site/**/*.html',
      htmlDst = htmlSrc;

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// compile SASS files
gulp.task('sass', function() {
  var src = sassSrc, dst = sassDst;

  gulp.src(src)
    .pipe(sass())
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(dst));
});
