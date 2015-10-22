var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var RevAll = require('gulp-rev-all');
var rename = require('gulp-rename');
var useref = require('gulp-useref');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var rev = require('gulp-rev-hash');

gulp.task('copy-conf', function() {
    gulp.src('js/conf.js')
        .pipe(gulp.dest('build/js/'));
});

gulp.task('copy-pics', ['copy-conf'], function() {
    gulp.src('pics/*')
        .pipe(gulp.dest('build/pics/'));
});

gulp.task('copy-fonts', ['copy-pics'], function() {
    var sources = ['bower_components/bootstrap/dist/fonts/*'];
    gulp.src(sources)
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('html-replace', function() {
    var assets = useref.assets();
    var revAll = new RevAll();
    return gulp.src('index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revAll.revision())
        .pipe(gulp.dest('build/'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('build/'));
});

gulp.task('html-rename', ['html-replace'], function() {
    gulp.src('build/index.*.html')
      .pipe(rename('index.html'))
      .pipe(gulp.dest('build/'));
});

gulp.task('clean', ['html-rename'], function() {
    var sources = [
      'build/index.**.html'
    ];
    return gulp.src(sources, {read: false})
        .pipe(clean());
});

gulp.task('rev', function() {
    gulp.src('build/index.html')
        .pipe(rev())
        .pipe(gulp.dest('build/'))
});

gulp.task('default', ['clean', 'copy-fonts']);