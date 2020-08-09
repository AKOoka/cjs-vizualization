const gulp = require('gulp')

const del = require('del')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()

const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const uglify = require('gulp-uglify-es').default

function clean () {
  return del(['dist/*'])
}

function styles () {
  return gulp.src('./src/sass/**/*.sass')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead'
      ],
      cascade: false
    }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream())
}

function scripts () {
  return gulp.src('./src/js/**/*.js')
    // .pipe(uglify({ toplevel: true }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream())
}

function watch () {
  browserSync.init({ server: { baseDir: './' } })

  gulp.watch('./src/sass/**/*.sass', styles)
  gulp.watch('./src/js/**/*.js', scripts)
  gulp.watch('./*.html').on('change', browserSync.reload)
}

gulp.task('build', gulp.series(clean, styles, scripts))

gulp.task('serve', gulp.series('build', watch))
