'use strict';
const gulp = require('gulp');
const newer = require('gulp-newer');
const uglify = require('gulp-uglify');
const imageMin = require('gulp-imagemin');
const cssnano = require("gulp-cssnano");
const zip = require("gulp-zip");
const terser = require("gulp-terser");
const del = require('del');


const nodemon = require('gulp-nodemon');
const exec = require('child_process').exec;
const webserver = require('gulp-webserver');

// const htmlmin = require('gulp-htmlmin');
// const ejs = require("gulp-ejs");
// const gulpEjsMonster = require('gulp-ejs-monster');
// const minifyejs = require('gulp-minify-ejs');

const devBuild = (process.env.NODE_ENV !== 'production');
const { apps } = require('./ecosystem.config.js');


var paths = {
  srcRootFiles: ['app.js',
  				'ecosystem.config.js',
  				'package.json',
  				'package-lock.json'],
  srcPublicJS: 'public/js/*.js',
  srcJS : [	'controllers/**/*.js',
  			'middleware/**/*.js',
  			'models/**/*.js',
  			'routes/**/*.js',
  			'services/**/*.js',
  			'util/**/*.js'],
  srcCSS: 'public/css/*.css',
  srcImages: 'public/images/*',
  srcEjs : 'views/**/*.ejs',
  build: 'build/',
  buildImages: 'build/public/images/',
  buildEjs: 'build/views/**/',
  buildCSS: 'build/public/css/',
  buildPublicJS: 'build/public/js/',
  buildJS : ['build/controllers/**/',
  			'build/middleware/**/',
  			'build/routes/**/',
  			'build/services/**/',
  			'build/util/**/']
};

gulp.task('clean', function() {
	return del(['build/**', '!build'], {force:true});
});

function getFormattedDate() {
	let date = new Date();
	const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();
	return [(dd > 9 ? '' : '0') + dd, (mm > 9 ? '' : '0') + mm,
				date.getFullYear()
			].join('');
}

gulp.task('message', function() {
  return Promise.resolve(console.log('Begin Deploy') );
});

//must be called after images
gulp.task('copyEjs', function() {
	const out = paths.build;
	return gulp.src(paths.srcEjs, {base: '.'})
//	.pipe(htmlmin({ collapseWhitespace: true }))
//		.pipe(minifyejs())
//		.pipe(gulpEjsMonster({/* plugin options */}))
//		.pipe(ejs({}, {ext:'.html'}))
		.pipe(gulp.dest(out));
});

gulp.task('copyRootFiles', function() {
    return gulp.src(paths.srcRootFiles)
    	.pipe(gulp.dest(paths.build));
});

gulp.task('copyImages', function() {
	const out = paths.buildImages;
	return gulp.src(paths.srcImages)
		.pipe(newer(out))
		.pipe(imageMin({interlaced: true,    //I don't know what these mean - find out
    			progressive: true,
    			optimizationLevel: 5}))
		.pipe(gulp.dest(out));
});

gulp.task('copyCss', function() {
	const out = paths.buildCSS;
	return gulp.src(paths.srcCSS)
		.pipe(newer(out))
		.pipe(cssnano())
		.pipe(gulp.dest(out));
});

gulp.task('copyPublicScripts', function() {
	const fileIn = paths.srcPublicJS;
	console.log('Moving files from ' + fileIn +' to ' + paths.buildPublicJS);
	return gulp.src(fileIn)
		.pipe(terser())
		.pipe(gulp.dest(paths.buildPublicJS))
});

gulp.task('copySourceScripts', function() {
	const fileIn = paths.srcJS;
	console.log('Moving files from ' + fileIn +' to ' + paths.build);
	return gulp.src(fileIn, {base: '.'})
	    //    .pipe(jshint()).pipe(jshint())   is this Es6?
		.pipe(terser())
		.pipe(gulp.dest(paths.build))
});

gulp.task('runDevDeploy', function(done) {
	const appSettings = apps[0];
	console.log ('APP SETTINGS: ' + JSON.stringify(appSettings));
	const startupServer = paths.build + appSettings.script;
	console.log ("Starting NODE server from: " + startupServer);
	const options = {
						script: startupServer
						, ext: 'js html'
						, env: { 'NODE_ENV': appSettings.env.NODE_ENV,
								 'PORT' : appSettings.env.PORT,
								 'MYSQL_HOST' : appSettings.env.MYSQL_HOST,
								 'MYSQL_USER' : appSettings.env.MYSQL_USER,
								 'MYSQL_PASSWORD' : appSettings.env.MYSQL_PASSWORD,
								 'MYSQL_SCHEMA' : appSettings.env.MYSQL_SCHEMA,
								 'SESSION_SERCRET' : appSettings.env.SESSION_SERCRET
							   } 
						, done: done() };
    console.log(JSON.stringify(nodemon))
	nodemon(options);
});

gulp.task('deployDev', 
	gulp.series('message', 'clean', 
		gulp.parallel('copyRootFiles', 'copyCss', 'copyImages', 'copyEjs'),
		gulp.parallel('copyPublicScripts','copySourceScripts') ,
		'runDevDeploy'
	)
);


gulp.task('zipProduction', function() {
	const zipFile = 'txc_parts_search-' + getFormattedDate() + '.zip';
    return gulp.src('build/**')
        .pipe(zip(zipFile))
        .pipe(gulp.dest('deploy/'));
});

gulp.task('deployProd', 
	gulp.series('zipProduction')
	// rsync to move files to production: https://mikeeverhart.net/2016/01/deploy-code-to-remote-servers-with-gulp-js/
	//run "npm ci" on production server to recreate node-modules
	//secret not pulling from ecosystem.config.js - add it manually...
	
);
