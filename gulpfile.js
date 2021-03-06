const gulp          = require('gulp')
const sass          = require('gulp-sass')
const cleanCSS      = require('gulp-clean-css')
const concat        = require('gulp-concat')
const minify_js     = require('gulp-minify')
const del           = require('del')
const browserSync   = require('browser-sync')
const nodemon       = require('gulp-nodemon')
const rev           = require('gulp-rev')
const revCollector  = require('gulp-rev-collector')
const gutil         = require('gulp-util')
const rimraf        = require('rimraf')
const revOutdated   = require('gulp-rev-outdated')
const path          = require('path')
const through       = require('through2')
const runSequence   = require('run-sequence')

function cleaner() {
    return through.obj(function(file, enc, cb){
        rimraf( path.resolve( (file.cwd || process.cwd()), file.path), function (err) {
            if (err) {
                this.emit('error', new gutil.PluginError('Cleanup old files', err));
            }
            this.push(file);
            cb();
        }.bind(this));
    });
}

gulp.task('js_min', () => {
    return gulp
        .src([
			'node_modules/axios/dist/axios.min.js',
            'node_modules/vue/dist/vue.min.js',
            'node_modules/vue-router/dist/vue-router.min.js',
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'public/src/js/app.js'
        ], { allowEmpty: true })
        .pipe(concat('app.js'))
        .pipe(minify_js({
            ext:{
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('public/build/'))
        .on('end', () => {
            del.sync([
                'public/build/app.js',
            ]);
        })
})

gulp.task('css_min', () => {
    return gulp
        .src([
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'public/src/css/app.css'
        ], { allowEmpty: true })
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/build/'))
})

gulp.task('rev', () => {
    return gulp.src(['public/build/app.min.css', 'public/build/app.min.js'])
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/manifest/'))
})

gulp.task('rev_collector', () => {
    return gulp.src(['public/manifest/**/*.json', 'views/app.pug'])
        .pipe( revCollector({
            replaceReved: true
        }))
        .pipe( gulp.dest('views/') )
})

gulp.task('rev_clean', function() {
    return gulp.src( ['public/build/*.*'], {read: false})
        .pipe( revOutdated(1) )
        .pipe( cleaner() )
});







gulp.task('sass', function () {
    return gulp
        .src([
            'public/src/sass/**/*.scss'
        ])
        .pipe(sass())
        .pipe(gulp.dest('public/src/css'))
});

gulp.task('watch', () => {
    gulp.watch('public/src/sass/**/*.scss', gulp.series('sass'))
})

gulp.task('bs', function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: [
            'views/**/*.*',
            'public/src/css/**/*.*',
            'public/src/js/**/*.*'
        ],
        port: 7000
	});
});

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true; 
		} 
	})
})
