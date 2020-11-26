// Import Required Packages //
// ------------------------------
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-dart-sass');
const pug = require('gulp-pug');
const del = require('del');
const concat = require('gulp-concat');
var header = require('gulp-header');
const merge = require('merge-stream');
const cleanCSS = require('gulp-clean-css');
const { series } = require('gulp');
const vinyl = require('vinyl');
const config = require("./config.json")



// Constants //
// ------------------------------

/* Directories */
const dirs = {
    app: 'src/',
    assets: 'assets/',
    dist: 'dist/'
};

/* Paths */
const paths = {
    app: {
        assets: dirs.app + dirs.assets,
        scss: dirs.app + dirs.assets + 'scss/',
        css: dirs.app + dirs.assets + 'css/',
        js: dirs.app + dirs.assets + 'js/',
        vendors: dirs.app + dirs.assets + 'vendors/',
        fonts: dirs.app + dirs.assets + 'fonts/',
        images: dirs.app + dirs.assets + 'images/'
    },
    dist: {
        assets: dirs.dist + dirs.assets,
        css: dirs.dist + dirs.assets + 'css/',
        js: dirs.dist + dirs.assets + 'js/',
        fonts: dirs.dist + dirs.assets + 'fonts/',
        images: dirs.dist + dirs.assets + 'images/'
    }
}

/* Stamp Branding */
const app = require('./package.json');
const banner = [
    '/*!',
    ` * ${app.name} - ${app.version}`,
    ` * @author ${app.author} - ${app.repository.url} `,
    ` * Copyright (c) ${new Date().getFullYear()}`,
    ' */',
    ''].join('\n');


// Intial Setup & Vendor Tasks //
// ------------------------------

gulp.task('cleanBuild', () => {
    return del([paths.app.css, paths.app.vendors, paths.dist.assets]);
});
gulp.task('cloneVendorSCSS', () => {
    var style1 = gulp.src('./node_modules/bootstrap/scss/**').pipe(gulp.dest('./src/assets/vendors/bootstrap/scss'));
    var style2 = gulp.src('./node_modules/prismjs/themes/**').pipe(gulp.dest('./src/assets/vendors/prismjs/css'));
    return merge(style1,style2);
});
gulp.task('cloneVendorJS', () => {
    var script1 = gulp.src('./node_modules/bootstrap/js/src/*.js').pipe(gulp.dest('./src/assets/vendors/bootstrap/js'));
    var script2 = gulp.src('./node_modules/bootstrap/dist/js/*.js').pipe(gulp.dest('./src/assets/vendors/bootstrap/js'));
    var script3 = gulp.src('./node_modules/jquery/dist/jquery.min.js').pipe(gulp.dest('./src/assets/vendors/jquery'));
    var script4 = gulp.src('./node_modules/feather-icons/**').pipe(gulp.dest('./src/assets/fonts/feather-icons'));
    var script5 = gulp.src('./node_modules/bootstrap-datepicker/js/*.js').pipe(gulp.dest('./src/assets/vendors/bootstrap/js'));
    var script6 = gulp.src('./node_modules/clipboard/dist/*.js').pipe(gulp.dest('./src/assets/vendors/clipboard/js'));
    var script7 = gulp.src('./node_modules/prismjs/*.js').pipe(gulp.dest('./src/assets/vendors/prismjs/js'));
    var script8 = gulp.src('./node_modules/prismjs/plugins/**/*.js').pipe(gulp.dest('./src/assets/vendors/prismjs/plugins'));
    return merge(script1,script2,script3,script4,script5,script6,script7,script8);
});

gulp.task('initialSetup', series('cleanBuild','cloneVendorSCSS','cloneVendorJS'));



// Build Files //
// ------------------------------

gulp.task('buildCoreCSS', () => {
    return gulp.src(['./src/assets/vendors/bootstrap/scss/bootstrap.scss','./src/assets/vendors/prismjs/css/prism.css'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('core.min.css'))
    .pipe(header(banner, { app: app }))
    .pipe(gulp.dest('./dist/assets/css'));
});
gulp.task('buildCoreJS', () => {
    return gulp.src([
        './src/assets/vendors/jquery/jquery.min.js',
        './src/assets/vendors/bootstrap/js/bootstrap.bundle.min.js',
        './src/assets/vendors/bootstrap/js/bootstrap-datepicker.js',
        './src/assets/vendors/clipboard/js/clipboard.min.js',
        './src/assets/js/main.js',
        './src/assets/vendors/prismjs/js/prism.js',
        './src/assets/vendors/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js',
        './src/assets/vendors/prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js'])
    .pipe(concat('core.min.js'))
    .pipe(gulp.dest('./dist/assets/js'));
});
gulp.task('buildThemeCSS', () => {
    return gulp.src(['./src/assets/scss/main.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/assets/css'));
});
gulp.task('buildThemeFonts', () => {
    return gulp.src(['./src/assets/fonts/**'])
    .pipe(gulp.dest('./dist/assets/fonts'));
});
gulp.task('buildThemeImages', () => {
    return gulp.src(['./src/assets/images/**','./src/assets/images/*.png'])
    .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('buildCoreFiles', series('buildCoreCSS','buildCoreJS','buildThemeCSS','buildThemeFonts','buildThemeImages'));


// Compile Views //
// ------------------------------

gulp.task('buildCoreView', function buildHTML() {
    return gulp.src('./src/views/index.pug')
    .pipe(pug({
      pretty: true,
      data: config
    }))
    .pipe(gulp.dest('./dist/pages'));
  });

gulp.task('buildComponentViews', function buildHTML() {
    return gulp.src([
        './src/views/components/alerts.pug',
        './src/views/components/badges.pug',
        './src/views/components/breadcrumbs.pug',
        './src/views/components/buttons.pug',
        './src/views/components/button-groups.pug',
        './src/views/components/cards.pug',
        ])
    .pipe(pug({
      pretty: true,
      data: config
    }))
    .pipe(gulp.dest('./dist/pages'));
  });

gulp.task('buildThemeViews', function buildHTML() {
    return gulp.src([
        './src/views/themes/themes.pug'
        ])
    .pipe(pug({
      pretty: true,
      data: config
    }))
    .pipe(gulp.dest('./dist/pages'));
  });

gulp.task('buildFormViews', function buildHTML() {
    return gulp.src([
        './src/views/forms/switches.pug'
        ])
    .pipe(pug({
      pretty: true,
      data: config
    }))
    .pipe(gulp.dest('./dist/pages'));
  });



gulp.task('compileViews', series('buildCoreView','buildComponentViews','buildThemeViews','buildFormViews'));




// Full Build //
// ------------------------------

gulp.task('mainBuild', series('initialSetup','buildCoreFiles','compileViews'));