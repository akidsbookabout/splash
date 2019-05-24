// Require
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      postcss = require('gulp-postcss'),
      rename = require('gulp-rename'),
      cleanCSS = require('gulp-clean-css'),
      run = require('gulp-run-command').default,
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      plumber = require('gulp-plumber'),
      purgecss = require('gulp-purgecss');

// Resource paths
var paths = {

  sass: {
    source: './src/sass/main.scss',
    dest: 'css/'
  },

  javascript: {
    source:
      [
        './src/js/vendor/aos.js',
        './src/js/utilities/*.js',
        './src/js/local/*.js'
      ],
    dest: 'js/'
  }
}

// Catch errors
var onError = function (err) {
  this.emit('end');
};

// Sass
gulp.task('css:compile', function() {
  return gulp.src(paths.sass.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(rename({
      extname: '.css'
    }))
    .pipe(gulp.dest(paths.sass.dest));
});

// Minify the CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
    './css/main.css',
    '!./css/*.min.css'
  ])
  .pipe(cleanCSS())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./css'));
});

// Run the minify task
gulp.task('css', ['css:minify']);

// JS compile & concat
gulp.task('js:compile', function () {
  return gulp.src(paths.javascript.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({
      presets: ['@babel/env'],
      sourceType: 'script'
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.javascript.dest));
});

// Minify the JS
gulp.task('js:minify', function() {
  return gulp.src(paths.javascript.dest + 'main.js')
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.javascript.dest));
});

// Run all the JS things
gulp.task('js', ['js:minify']);

// Default Gulp
gulp.task('default', ['css', 'js:compile']);

// Dev mode
gulp.task('dev', ['css', 'js:compile'], function () {
  // Configure watch files.
  gulp.watch([
    'site/*.njk',
    'site/includes/**/*.njk',
  ], ['css']);
  gulp.watch('./src/sass/**/*.scss', ['css']);
  gulp.watch('./src/js/**/*.js', ['js:compile']);
});

// CSS preflight
gulp.task('css:compile:preflight', function () {
  return gulp.src(paths.sass.source)
    .pipe(sass())
    .pipe(purgecss({
      content: [
        'site/*.njk',
        'site/includes/**/*.njk',
      ],
      whitelist: [
        'body',
        'html',
        'h1',
        'h2',
        'h3',
        'p',
        'blockquote',
        'intro'
      ],
    }))
    .pipe(rename({
      extname: '.css'
    }))
    .pipe(gulp.dest('css/'))
});

// Minify CSS
gulp.task('css:minify:preflight', ['css:compile:preflight'], function () {
  return gulp.src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'));
});

// Run all the CSS things
gulp.task('css:preflight', ['css:minify:preflight']);

// Build all the things
gulp.task('build', ['css:preflight', 'js:minify']);
