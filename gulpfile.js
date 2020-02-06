var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var http = require('http');
var st = require('st');

var config = {
  js: {
    inputDir: './src/',
    entryPoint: './src/snake.ts',
    outputDir: './dest/',
    outputFile: 'snake.js',
  },
};
 
gulp.task('copy-static', function() {
  return gulp
  .src("src/**/!(*.ts)")
  .pipe(gulp.dest(config.js.outputDir))
});

gulp.task('server', function(done) {
  http.createServer(
    st({ path: __dirname + '/dest', index: 'index.html', cache: false })
  ).listen(8080, done);
});
 
gulp.task("transform-js", function () {
    return browserify(config.js.entryPoint, {
        basedir: '.',
        debug: true,
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform("babelify")
    .bundle()
    .pipe(source(config.js.outputFile))
    .pipe(gulp.dest("dest"));
});

gulp.task('default', gulp.parallel([ 'transform-js', 'copy-static', 'server']))