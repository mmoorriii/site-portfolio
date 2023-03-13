"use strict"

const { src, dest } = require("gulp");
const gulp = require("gulp");
const fileInclude = require('gulp-file-include');
const webpHtmlNosvg = require('gulp-webp-html-nosvg');
const versionNumber = require('gulp-version-number');
const removeHtmlComments = require('gulp-remove-html-comments');
const autoprefixer = require("gulp-autoprefixer");
const gulpGroupCssMedia = require("gulp-group-css-media-queries");
const webpCss = require('gulp-webpcss');
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass")(require('sass'));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const babel = require('gulp-babel');
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const notify = require("gulp-notify");
const replace = require("gulp-replace");
const imagewebp = require("gulp-webp");
const newer = require('gulp-newer');
const zipPlugin = require("gulp-zip");
const ifPlugin = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

/* Modes */
const isBuild = process.argv.includes('--build')
//const isDev = !process.argv.includes('--build')

/* Paths */
const srcPath = "src/"
const distPath = "dist/"

const path = {
   build: {
      html: distPath,
      css: distPath + "/css/",
      js: distPath + "js/",
      images: distPath + "img/",
      //fonts: distPath + "fonts/"
   },
   src: {
      html: srcPath + "*.html",
      css: srcPath + "scss/style.scss",
      js: srcPath + "js/app.js",
      images: srcPath + "img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
      //fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}"
   },
   watch: {
      html: srcPath + "**/*.html",
      js: srcPath + "js/**/*.js",
      css: srcPath + "scss/**/*.scss",
      images: srcPath + "img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
      //fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}"
   },
   clean: "./" + distPath
}

//-------ЛОКАЛЬНЫЙ СЕРВЕР---------------------------------------------------------------------//
function serve() {
   browserSync.init({
      server: {
         baseDir: "./" + distPath
      }
   });
}


function html() {
   return src(path.src.html, { base: srcPath })
      .pipe(plumber(
         notify.onError({
            title: "HTML Error",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(fileInclude())
      .pipe(replace(/@img\//g, './img/'))
      .pipe(ifPlugin(isBuild, webpHtmlNosvg()))
      .pipe(ifPlugin(isBuild,
         versionNumber({
            'value': '%DT%',
            'append': {
               'key': '_v',
               'cover': 0,
               'to': [
                  'css',
                  'js',
               ]
            },
            'output': {
               'file': 'gulp/version.json'
            }
         })
      ))
      .pipe(removeHtmlComments())
      .pipe(dest(path.build.html))
      .pipe(browserSync.reload({ stream: true }));
}

function css() {
   return src(path.src.css, { base: srcPath + "scss/" })
      .pipe(sourcemaps.init())
      .pipe(plumber(
         notify.onError({
            title: "SCSS Error",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(replace(/@img\//g, '../img/'))
      .pipe(sass())
      .pipe(gulpGroupCssMedia())
      .pipe(ifPlugin(isBuild, webpCss({
         webpClass: ".webp",
         noWebpClass: ".no-webp"
      })))
      .pipe(autoprefixer({
         grid: true,
         ovverideBrowserlist: ['last 20 versions'],
         cascade: false
      }))
      .pipe(dest(path.build.css))
      .pipe(cssnano({
         zindex: false,
         discardComments: {
            removeAll: true
         }
      }))
      .pipe(removeComments())
      .pipe(rename({
         suffix: ".min",
         extname: ".css"
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(dest(path.build.css))
      .pipe(browserSync.reload({ stream: true }));
}

function js() {
   return src(path.src.js, { base: srcPath + "js/" })
      .pipe(sourcemaps.init())
      .pipe(plumber(
         notify.onError({
            title: "JS Error",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(rigger())                                //---СОБИРАЕТ ВСЕ JS ФАЙЛЫ В 1 //= components/script.js
      .pipe(dest(path.build.js))
      .pipe(babel({
         presets: ['@babel/env']
      }))
      .pipe(uglify())
      .pipe(rename({
         suffix: ".min",
         extname: ".js"
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({ stream: true }));
}

function images() {
   return src(path.src.images, { base: srcPath + "img/" })
      .pipe(plumber(
         notify.onError({
            title: "IMAGE Error",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(newer(path.build.images))
      .pipe(ifPlugin(isBuild, imagemin([
         imagemin.gifsicle({ interlaced: true }),
         imagemin.mozjpeg({ quality: 80, progressive: true }),
         imagemin.optipng({ optimizationLevel: 5 }),
         imagemin.svgo({
            plugins: [
               { removeViewBox: true },
               { cleanupIDs: false }
            ]
         })
      ])))
      .pipe(dest(path.build.images))
      .pipe(browserSync.reload({ stream: true }));
}

function webpImages() {
   return src(path.src.images, { base: srcPath + "img/" })
      .pipe(imagewebp())
      .pipe(dest(path.build.images))
}

//function fonts() {
//   return src(path.src.fonts, { base: srcPath + "fonts/" })
//      .pipe(dest(path.build.fonts))
//      .pipe(browserSync.reload({ stream: true }));
//}

function clean() {
   return del(path.clean)
}

function zip() {
   return src(`${distPath}/**/*.*`, {})
      .pipe(plumber(
         notify.onError({
            title: "ZIP Error",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(zipPlugin(`project.zip`))
      .pipe(dest('./'))
}

function watchFiles() {
   gulp.watch([path.watch.html], html)
   gulp.watch([path.watch.css], css)
   gulp.watch([path.watch.js], js)
   gulp.watch([path.watch.images], images)
   //gulp.watch([path.watch.fonts], fonts)
}

const mainTasks = gulp.parallel(html, css, js, images)

const dev = gulp.series(clean, mainTasks, gulp.parallel(watchFiles, serve))
const build = gulp.series(clean, mainTasks, webpImages)
const deployZip = gulp.series(mainTasks, zip)


exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.webpImages = webpImages
//exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.default = dev
exports.zip = deployZip