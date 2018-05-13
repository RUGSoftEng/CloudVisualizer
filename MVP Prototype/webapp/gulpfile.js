var gulp         = require('gulp'),
    htmlmin      = require('gulp-htmlmin'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    imagemin     = require('gulp-imagemin'),
    browserSync  = require('browser-sync'),
    ejs          = require('gulp-ejs');

gulp.task('ejs', function(){
    return gulp.src('./work/**/*.ejs')
        .pipe(ejs({}, {ext:'.html'}))
        .pipe(gulp.dest('./dist'))
});

gulp.task('html', function() {
    return gulp.src('./work/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'))
});

gulp.task('sass', function() {
   return gulp.src('./work/scss/**/*.scss')
       .pipe(sass())
       .pipe(gulp.dest('./dist/css'));
});

gulp.task('styles', function() {
    return gulp.src('./work/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename(function (path) {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('scripts', function() {
    return gulp.src('./work/js/**/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('images', function() {
    return gulp.src('./work/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
});

gulp.task('vendor', function() {
    return gulp.src('./work/vendor/**/*')
        .pipe(gulp.dest('./dist/vendor'))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('./work/**/*.html', ['html']);
    gulp.watch('./work/**/*.ejs', ['ejs']);
    gulp.watch('./work/scss/**/*.scss', ['styles']);
    gulp.watch('./work/js/**/*.js', ['scripts']);
    gulp.watch('./work/images/**/*', ['images']);
    gulp.watch('./work/vendor/**/*', ['vendor']);
    gulp.watch('./work/**/*').on('change', browserSync.reload);
});

gulp.task('default', ['ejs','html', 'styles', 'scripts', 'images', 'vendor', 'browser-sync', 'watch','sass']);
