var gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		rename = require("gulp-rename"),
		pug = require('gulp-pug'),
		uglify = require('gulp-uglifyjs'),
		del = require('del');

gulp.task('styl', function () {
	gulp.src(['dev/styles/app.styl'])
			.pipe(stylus({compress: true}))
			.pipe(rename('app.min.css'))
			.pipe(gulp.dest('public/css'));
});

gulp.task('js', function () {
	gulp.src(['dev/js/libs/*.js'])
	    .pipe(uglify('libs.js'))
	    .pipe(gulp.dest('public/js'));
	gulp.src(['dev/js/app.js'])
	    .pipe(uglify('app.min.js'))
	    .pipe(gulp.dest('public/js'));
});

gulp.task('pug', function () {
  gulp.src('views/*.pug')
      .pipe(pug({pretty: true}))
      .pipe(gulp.dest(''));
});

gulp.task('watch:pug', function(){
	gulp.watch('views/*.pug', ['pug']);
});

gulp.task('watch:styl', function(){
    gulp.watch('dev/styles/**/*', ['styl']);
});

gulp.task('watch:js', function(){
    gulp.watch('dev/js/**/*', ['js']);
});

gulp.task('watch:all', ['watch:pug','watch:styl','watch:js']);

gulp.task('default',['js','styl','pug']);
