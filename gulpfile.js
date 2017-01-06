var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require("browser-sync"),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('rimraf'),
    prefixer = require('gulp-autoprefixer'),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "rdev"
};


gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Выберем файлы по нужному пути
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('css:build', function () {
    gulp.src(path.src.style) //Выберем файлы по нужному пути
        .pipe(sourcemaps.init())
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('build',[
    'html:build',
    'js:build',
    'css:build' 
]);

gulp.task('watch',function(){
    watch([path.watch.js],function(ev,callback){
        gulp.start('js:build');
    });
    watch([path.watch.html],function(ev,callback){
        gulp.start('html:build');
    });
    watch([path.watch.style],function(ev,callback){
        gulp.start('css:build');
    });
});

gulp.task('default',['build','webserver','watch']);