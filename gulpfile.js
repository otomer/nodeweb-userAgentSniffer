var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    debug = require("gulp-debug"),
    nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function() {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/**/*.css', './public/js/**/*.js'], {
        read:false
    });
    var injectOptions = {
        ignorePath: '/public'
    };
    var wiredepOptions = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };

    return gulp.src('./src/views/*.ejs')
        .pipe(wiredep(wiredepOptions))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('serve', [ 'inject'], function() {
    var options = {
        script: 'index.js',
        delayTime: 1,
        env: {
            'PORT': 3000
        },
        watch: jsFiles
    };

    return nodemon(options)
        .on('restart', function(ev) {
            console.log("Restarting...");
        });
});