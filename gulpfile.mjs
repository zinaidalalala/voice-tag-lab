import gulp from 'gulp';
const { src, dest, series, watch } = gulp;
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import autoPrefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import browserSync from 'browser-sync';
import svgSprite from 'gulp-svg-sprite';
import replace from 'gulp-replace';
import svgmin from 'gulp-svgmin';
import imagemin from 'gulp-imagemin';
import terser from 'gulp-terser';
import babel from 'gulp-babel';
import notify from 'gulp-notify';
import fontMin from 'gulp-fontmin';
import sourceMaps from 'gulp-sourcemaps';
import { deleteAsync } from 'del';

const clean = () => {
  return deleteAsync(['dist']);
}

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

const styles = () => {
  return src('src/styles/**/*.css')
    .pipe(concat('main.css'))
    .pipe(autoPrefixer({
      cascade: false
    }))
    .pipe(cleanCss({
      level: 2
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

const svgSprites = () => {
  return src('src/images/svg/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream());
}

const images = () => {
  return src([
    'src/images/*.jpg',
    'src/images/*.JPG',
    'src/images/*.jpeg',
    'src/images/*.png',
    'src/images/*.svg',
    'src/images/*.webp'
  ], { encoding: false })
    .pipe(imagemin())
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream());
}

const scripts = () => {
  return src(['src/js/**/*.js', '!src/js/lazyload.min.js'])
    .pipe(sourceMaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(terser().on('error', notify.onError()))
    .pipe(sourceMaps.write()) // Запись sourceMaps
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

const toolScripts = () => {
  return src('src/js/lazyload.min.js')
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

const minifyFonts = () => {
  return src('src/fonts/*', { encoding: false })
    .pipe(fontMin())
    .pipe(dest('dist/fonts'))
    .pipe(browserSync.stream());
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  watch('src/**/*.html', htmlMinify);
  watch('src/styles/**/*css', styles);
  watch('src/images/svg/**/*.svg', svgSprites);
  watch('src/images/*.{jpg,jpeg,png,svg,webp}', images);
  watch('src/js/**/*.js', scripts);
  watch('src/js/lazyload.min.js', toolScripts);
  watch('src/fonts/**/*', minifyFonts);
}

export const dev = series(clean, htmlMinify, styles, svgSprites, images, scripts, toolScripts, minifyFonts, watchFiles);
export const build = series(clean, htmlMinify, styles, svgSprites, images, scripts, toolScripts, minifyFonts);

export default dev;
