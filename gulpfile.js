'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var size = require('gulp-size');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var webserver = require('gulp-webserver');
var twig = require('gulp-twig');
var uglify = require('gulp-uglify');
//var uglify = require('gulp-uglifyjs');
var prettify = require('gulp-html-prettify');

gulp.task('sass', function () {
  var s = size();
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss({ processImport: true }))
    .pipe(s)
    .pipe(gulp.dest('./dist/css'))
    .pipe(notify({
      onLast: true,
      message: function () {
        return 'SASS Compiled. Total size minified ' + s.prettySize;
      }
    }));
});

gulp.task('watcher', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.twig', ['twig']);
  gulp.watch('./src/js/{**}/*.js', ['javascript']);
  gulp.watch('./src/images/**/*.*', ['images']);
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true,
      host: '0.0.0.0',
      port: 8000
    }));
});

gulp.task('javascript', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'))
});
//var config = require('./config').javascript;

/*gulp.task('javascript', function () {
    'use strict';

    console.log('js generating');
    gulp.src(config.src)
        //.pipe(sourcemaps.init())
        .pipe(uglify('app.min.js', {
            outSourceMap: true,
            output: {
                beautify: true,
                comments: false
            }
        }).on('error', function (e) {
            gutil.beep();
            console.log(e);

            this.emit('end');
        }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest));
});*/

gulp.task('images', function () {
  gulp.src([
    './src/images/**/*.*'
    ])
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('dependecies', function () {
  gulp.src([
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/jquery/dist/jquery.min.map',
      'src/js/libs/00_webfont.min.js',
      'src/js/libs/01_load_webfont.min.js',
      'src/js/libs/01_loader.min.js',
      'src/js/libs/lazysizes.min.js',
      'src/js/libs/ls.bgset.min.js',
    ])
    .pipe(gulp.dest('./dist/js'))
  gulp.src([
      './src/fonts/*.*'
    ])
    .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('twig', function () {
  gulp.src('./src/*.twig')
    .pipe(twig({
      filters: [

        // Random color generator for placehold.it images
        {
          name: "color",
          func: function (args) {
            var letters = '012345'.split('');
            var darkColor = '';
            for (var i = 0; i < 6; i++) {
                darkColor += letters[Math.round(Math.random() * 5)];
            }
            var letters = '9ABCDE'.split('');
            var lightColor = '';
            for (var i = 0; i < 6; i++ ) {
                lightColor += letters[Math.round(Math.random() * 5)];
            }
            if (args == 'both') {
              return lightColor + '/' + darkColor;
            } else {
              return {'light': lightColor, 'darkColor': darkColor};
            }
          }
        }

      ]
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./dist'))
    .pipe(notify({
      onLast: true,
      message: function () {
        return 'HTML gerated';
      }
    }));
});

gulp.task('build', ['sass', 'twig', 'javascript', 'images', 'dependecies']);
gulp.task('watch', ['build', 'watcher']);
