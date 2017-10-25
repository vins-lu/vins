var gulp = require('gulp');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer'); // 处理css中浏览器兼容的前缀  
var minifyCss = require('gulp-minify-css'); // css的层级压缩
var rev = require('gulp-rev');// 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');// 路径替换
var sass = require('gulp-sass'); //sass
var jshint = require('gulp-jshint'); //js检查 
var uglify = require('gulp-uglify'); //js压缩  
var imagemin = require('gulp-imagemin'); //图片压缩 
var smushit = require('gulp-smushit');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var Config = require('./gulpfile.config.js');

function prod() {
    
    //assets文件夹下的所有文件处理 
    gulp.task('assets', function () {
        return gulp.src(Config.assets.src)
        .pipe(gulp.dest(Config.assets.dist))
        .pipe(reload({
            stream: true
        }));
    });

    //conf文件夹下的所有文件处理 
    gulp.task('conf', function () {
        return gulp.src(Config.conf.src)
        .pipe(gulp.dest(Config.conf.dist))
        .pipe(reload({
            stream: true
        }));
    });

    //CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
    gulp.task('revCss', function(){
        return gulp.src(Config.css.src)
            .pipe(autoprefixer())
            .pipe(minifyCss())
            .pipe(rev())
            .pipe(gulp.dest(Config.css.dist))
            .pipe(rev.manifest())
            .pipe(gulp.dest('rev/css'));
    });

    //js生成文件hash编码并生成 rev-manifest.json文件名对照映射
    gulp.task('revJs', function(){
        return gulp.src(Config.js.src)
            .pipe(jshint())
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest(Config.js.dist))
            .pipe(rev.manifest())
            .pipe(gulp.dest('rev/js'));
    });

    //Html替换css、js文件版本
    gulp.task('revHtml', function () {
        return gulp.src(['rev/**/*.json', Config.html.src])
            .pipe(revCollector())
            .pipe(gulp.dest(Config.html.dist));
    });


    //md5版本控制
    gulp.task('md5', function (done) {
        condition = false;
        runSequence(
            ['revCss'],
            ['revJs'],
            ['revHtml'],
            done
        );
    });

    //SASS样式处理 
    gulp.task('sass', function () {
        return gulp.src(Config.sass.src)
        .pipe(sass())
        .pipe(gulp.dest(Config.sass.dist))
        .pipe(reload({
            stream: true
        }));
    });

    //图片压缩处理 
    gulp.task('img', function () {
        return gulp.src(Config.imgNotJP.src)
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })).pipe(gulp.dest(Config.imgNotJP.dist)).pipe(reload({
            stream: true
        }));
    });

    //针对jpg和png图片格式的压缩
    gulp.task('smushitImg', function () {
        return gulp.src(Config.img.src)
            .pipe(smushit({
                verbose: true
            }))
            .pipe(gulp.dest(Config.img.dist));
    });

    gulp.task('build', ['assets', 'revCss', 'revJs', 'revHtml', 'md5', 'sass', 'conf', 'img', 'smushitImg'], function () {
        //静态服务器
        browserSync.init({
            files: "**", //监听整个项目
            server: {
                baseDir: Config.dist,
                index: 'pages/test.html'
            },
            notify: false
        });
    });
}
//生产环境
module.exports = prod;