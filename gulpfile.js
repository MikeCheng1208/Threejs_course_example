"use strict";
const gulp = require('gulp'),
    path = require('path'),
    fs = require("fs"),
    concat = require('gulp-concat'),
    changed = require('gulp-changed'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    source = require('vinyl-source-stream'),    
    gutil = require('gulp-util'),
    watchify = require('watchify'),
    Proxy = require('gulp-api-proxy');

/* Server無法重新整理時改 port 試試看 */
gulp.task('connect',()=>{
	connect.server({
		root: './',
		port: 3000,
		livereload: true,
        middleware: (connect, opt)=> {
            opt.route = '/server';
            opt.context = '192.168.1.186/server';
            var proxy = new Proxy(opt);
            return [proxy];
        }
	});
});


/* html */
gulp.task('html', () => { 
    return gulp.src('./*.html')
    .pipe(connect.reload())
})

/*Sass*/
gulp.task('sass',()=> {
	return gulp.src('sass/**/*.scss')
	.pipe(sass.sync().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['> 1%', 'last 5 versions', 'Firefox >= 45', 'iOS >=8', 'Safari >=8','ie >= 10'],
		cascade: false
	}))
	.pipe(sass({outputStyle: 'compressed'}))
	.pipe(gulp.dest('css/'))
	.pipe(connect.reload())
});



/*Watch*/
gulp.task('watch',()=> {
    gulp.watch('./*.html', ['html']);
    gulp.watch('sass/**/*.scss', ['sass']);
});


gulp.task('default', ['connect','html', 'sass' , 'watch']);
