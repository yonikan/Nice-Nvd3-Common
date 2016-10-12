
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var concat = require('gulp-concat-util');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');

var babel = require("gulp-babel");
// var browserify = require('browserify');
// var babelify = require('babelify');
// var buffer = require('vinyl-buffer');
// var source = require('vinyl-source-stream');


// =========== production version ===========
var production = false;
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');

// ===========  variables ===========
var sassOptions = {outputStyle: 'expanded'};
var autoprefixerOptions = {cascade: false};



// ===========  tasks ===========
gulp.task('serve', ['sass', 'js'], function() {
    browserSync.init({server: "./"});
    gulp.watch('./scss/**/*.scss', ['sass']);
    gulp.watch("./js/*.js", ['js']);
});

gulp.task('sass', function() {
    return gulp.src("./scss/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(gulpif(production, autoprefixer(autoprefixerOptions), cssnano()))
      .pipe(sourcemaps.write('./sourcemaps'))
      .pipe(gulp.dest("./dist"))
      .pipe(browserSync.stream());
});



// gulp.task('browserify', function () {
//     return browserify({entries: './app.js', debug: true})
//         .transform('babelify', {presets: ['es2015']})
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest('dist'));
// });


// gulp.task('js', function() {
//     return browserify({
//         extensions: ['.js'],
//         entries: './js/script.js',
//     })
//     .transform(babelify.configure({
//         ignore: /(bower_components)|(node_modules)/
//     }))
//     .bundle()
//     .on("error", function (err) { console.log("Error : " + err.message); })
//     .pipe(source('bundle.js'))
//     .pipe(gulp.dest('./dist'));
//     // .pipe(browserSync.stream());
// });


// gulp.task('js', function () {
//     var bundler = browserify({
//         entries: 'script.js',
//         debug: true
//     });
//     bundler.transform(babelify);
//
//     bundler.bundle()
//         .on('error', function (err) { console.error(err); })
//         .pipe(source('script.js'))
//         .pipe(buffer())
//         .pipe(sourcemaps.init({ loadMaps: true }))
//         // .pipe(uglify()) // Use any gulp plugins you want now
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest('dist'));
// });


gulp.task('js', function() {
    return gulp.src('./js/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('bundle.js'))
      .pipe(sourcemaps.write("./sourcemaps"))
      .pipe(gulpif(production, uglify()))
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);