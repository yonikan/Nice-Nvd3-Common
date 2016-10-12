
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var concat = require('gulp-concat-util');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');

var babel = require("gulp-babel");
var browserify = require('browserify');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');


// =========== production version ===========
var production = false;
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');

// ===========  variables ===========
var sassOptions = {outputStyle: 'expanded'};
var autoprefixerOptions = {cascade: false};



// ===========  tasks ===========
gulp.task('serve', ['html', 'sass', 'js'], function() {
    browserSync.init({server: "./"});
    gulp.watch('./*.html', ['html']);
    gulp.watch('./app/**/*.scss', ['sass']);
    gulp.watch("./app/*.js", ['js']);
});


gulp.task('html', function() {
    return gulp.src("./index.html")
      // .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream());
});


gulp.task('sass', function() {
    return gulp.src("./app/**/*.scss")
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


// ===========  JS Task with Brwoserfy ===========
// gulp.task('js', function () {
//     var bundler = browserify({
//         entries: 'app/app.js',
//         debug: true
//     });
//     bundler.transform('babelify', {presets: ['es2015']});
//     bundler.bundle()
//         .on('error', function (err) { console.error(err); })
//         .pipe(source('bundle.js'))
//         .pipe(buffer())
//         .pipe(gulp.dest('dist'));
// });


gulp.task('js', function() {
    return gulp.src('./app/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('bundle.js'))
      .pipe(sourcemaps.write("./sourcemaps"))
      .pipe(gulpif(production, uglify()))
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
