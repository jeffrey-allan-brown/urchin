var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var rename = require("gulp-rename");
let cleanCSS = require('gulp-clean-css');
const { series } = require('gulp');

// Intial Setup Tasks //

gulp.task('cleanVendors', () => {
    return del([
        './src/assets/vendors/**/*'
    ]);
});

gulp.task('cloneVendorSCSS', () => {
    var style1 = gulp.src('./node_modules/bootstrap/scss/*.scss').pipe(gulp.dest('./src/assets/vendors/bootstrap/scss'));
    var style2 = gulp.src('./node_modules/bootstrap/scss/mixins/*.scss').pipe(gulp.dest('./src/assets/vendors/bootstrap/scss/mixins'));
    var style3 = gulp.src('./node_modules/bootstrap/scss/utilities/*.scss').pipe(gulp.dest('./src/assets/vendors/bootstrap/scss/utilities'));
    var style4 = gulp.src('./node_modules/bootstrap/scss/vendor/*.scss').pipe(gulp.dest('./src/assets/vendors/bootstrap/scss/vendor'));
    return merge(style1,style2,style3,style4);
});

gulp.task('cloneVendorJS', () => {
    var script1 = gulp.src('./node_modules/bootstrap/js/src/*.js').pipe(gulp.dest('./src/assets/vendors/bootstrap/js'));
    return merge(script1);
});

gulp.task('initialSetup', series('cleanVendors','cloneVendorSCSS','cloneVendorJS'));

//


// Build Core Files //

gulp.task('buildCoreCSS', () => {
    return gulp.src([
        './src/assets/vendors/bootstrap/scss/bootstrap.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('core.css'))
    .pipe(gulp.dest('./src/assets/vendors/core'));
});

gulp.task('buildCoreJS', () => {
    return gulp.src([
        './src/assets/vendors/bootstrap/js/*.js'
    ])
    .pipe(concat('core.js'))
    .pipe(gulp.dest('./src/assets/vendors/core'));
});

gulp.task('buildCoreFiles', series('buildCoreCSS','buildCoreJS'));

//


gulp.task('mainBuild', series('initialSetup','buildCoreFiles'));