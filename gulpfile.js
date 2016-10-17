/* Requires */
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    // Utilities
    gutil       = require('gulp-util'),
    plumber     = require('gulp-plumber'),
    slang       = require('gulp-slang'),
    rename      = require('gulp-rename'),
    // Styles
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    // Scripts
    jshint      = require('gulp-jshint');

/* Paths */
var root        = 'namespace-ui/src/main/content/jcr_root/',
    components  = root + 'apps/namespace/components/',
    designs     = root + 'etc/designs/namespace/',
    
    // Styles
    cssPath     = designs + 'css/',
    sassPath    = designs + 'sass/',
    mainCss     = designs + 'styles/main.scss',
    cssBuild    = cssPath + 'main.css',
    cssSrcMaps  = cssPath + 'main.css.map',
    
    // Scripts
    jsPath      = designs + 'js/',
    vendorPath  = designs + 'vendor/',
    
    // Images
    imgPath     = designs + 'img/';

/**
 * Helper: changeNotification
 * Logs an event to the console.
 *
 * @param {String} fType - The file type that was changed.
 * @param {String} eType - The event that occured.
 * @param {String} msg - Short description of the actions that are being taken.
 */

function changeNotification(fType, eType, msg) {
  gutil.log(gutil.colors.cyan.bold(fType), 'was', gutil.colors.yellow.bold(eType) + '.', msg);
}

/**
 * Task: `sass:build`
 * Compiles the sass and writes sourcemaps.
 */
gulp.task('sass:build', function (cb) {
    gulp.src(mainCss)
        .pipe(plumber()) // Prevents pipe breaking due to error (for watch task)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            omitSourceMapUrl: true, // This is hardcoded in the main.scss due to resource path issues
            includePaths: [sassPath, components]
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('./', {
            addComment: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(cssPath))
        // Fire the callback Gulp passes in to tell it we're done
        .on('end', cb);
});

/**
 * Task: `sass:sling`
 * Slings the compiled stylesheet and sourcemaps to AEM.
 */
gulp.task('sass:sling', ['sass:build'], function () {
  return gulp.src([cssBuild, cssSrcMaps])
    .pipe(slang());
});

/**
 * Task: `sass`
 * Runs the sass build and slings the results to AEM.
 */
gulp.task('sass', ['sass:build', 'sass:sling']);

/**
 * Task: `js:lint`
 * Lints project JS, excluding vendor libs.
 */
gulp.task('js:lint', function () {
  return gulp.src([components + '**/*.js', jsPath + '**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * Task: `watch`
 * Watches the HTML, Sass, and JS for changes. On a file change,
 * will run builds file-type dependently and sling the new files
 * up to AEM.
 */
gulp.task('watch', function () {
  gutil.log('Waiting for changes.');

  // Set up our streams
  var jsWatch = gulp.watch([components + '**/*.js', jsPath + '**/*.js'], ['js:lint']),
      sassWatch = gulp.watch([components + '**/*.scss', mainCss, sassPath + '**/*.scss'], ['sass']),
      markupWatch = gulp.watch([components + '**/**/*.html', components + '**/**/*.jsp']),
      imgWatch = gulp.watch([imgPath + '**/*']);
  
  // js needs to be linted
  jsWatch.on('change', function (ev) {
    changeNotification('JS file', ev.type, 'Linting code & slinging to AEM.');
    
    return gulp.src(ev.path)
      .pipe(slang(ev.path));
  });
  
  // Sass needs to get built and slung up
  sassWatch.on('change', function (ev) {
    changeNotification('Sass file', ev.type, 'Running compilation & slinging to AEM.');
  });

  
  // Markup just needs to be slung to AEM
  markupWatch.on('change', function (ev) {
    changeNotification('Sightly file', ev.type, 'Slinging file to AEM.');
    
    return gulp.src(ev.path)
      .pipe(slang(ev.path));
  });
  
  // Images just need to be slung to AEM
  imgWatch.on('change', function (ev) {
    changeNotification('Image file', ev.type, 'Slinging file to AEM.');
    
    return gulp.src(ev.path)
      .pipe(slang(ev.path));
  });
});