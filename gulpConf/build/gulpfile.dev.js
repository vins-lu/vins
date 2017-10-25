var gulp = require('gulp');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer'); // 处理css中浏览器兼容的前缀  
var rename = require('gulp-rename'); //重命名  
var minifyCss = require('gulp-minify-css'); // css的层级压缩
var rev = require('gulp-rev');// 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');// 路径替换
var sass = require('gulp-sass'); //sass
var jshint = require('gulp-jshint'); //js检查 
var uglify = require('gulp-uglify'); //js压缩  
var concat = require('gulp-concat'); //合并文件  
var imagemin = require('gulp-imagemin'); //图片压缩 
var smushit = require('gulp-smushit');
var browserSync = require('browser-sync').create();
// var watch = require('gulp-watch');
var changed = require('gulp-changed');
const debug = require('gulp-debug');
var reload = browserSync.reload;
var Config = require('./gulpfile.config.js');

function dev() {
    
    //assets文件夹下的所有文件处理 
    gulp.task('assets:dev', function () {
        return gulp.src(Config.assets.src)
        .pipe(gulp.dest(Config.assets.dist))
        .pipe(reload({
            stream: true
        }));
    });

    //conf文件夹下的所有文件处理 
    gulp.task('conf:dev', function () {
        return gulp.src(Config.conf.src)
        .pipe(gulp.dest(Config.conf.dist))
        .pipe(reload({
            stream: true
        }));
    });

    //CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
    gulp.task('revCss', function(){
        return gulp.src(Config.css.src)
            .pipe(changed(Config.css.dist))
            .pipe(debug({title:"css"}))
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
            .pipe(changed(Config.js.dist))
            .pipe(debug({title:"js"}))
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
            .pipe(changed(Config.html.dist))
            .pipe(debug({title:"html"}))
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
    gulp.task('sass:dev', function () {
        return gulp.src(Config.sass.src)
        .pipe(sass())
        .pipe(gulp.dest(Config.sass.dist))
        .pipe(reload({
            stream: true
        }));
    });

    //图片压缩处理 
    gulp.task('images:dev', function () {
        return gulp.src(Config.imgNotJP.src)
        .pipe(changed(Config.imgNotJP.src))
        .pipe(debug({title:"image"}))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })).pipe(gulp.dest(Config.imgNotJP.dist)).pipe(reload({
            stream: true
        }));
    });

    //针对jpg和png图片格式的压缩
    gulp.task('smushit', function () {
        return gulp.src(Config.img.src)
            .pipe(changed(Config.img.src))
            .pipe(debug({title:"image"}))
            .pipe(smushit({
                verbose: true
            }))
            .pipe(gulp.dest(Config.img.dist));
    });

    gulp.task('dev', ['smushit', 'assets:dev', 'conf:dev', 'md5', 'watch'], function () {
        //静态服务器
        browserSync.init({
            // proxy: 'localhost',
            // port: 8888,
            files: "**", //监听整个项目
            server: {
                baseDir: Config.dist,
                index: 'pages/test.html'
            },
            notify: false
        });
    });

    //监听文件变化
    gulp.task('watch', function () {
        // 监听 html 文件 
        gulp.watch(Config.html.src, ['revHtml']);
        // 监听 css 文件  
        gulp.watch(Config.css.src, ['revCss']);
        // 监听 scss 文件  
        gulp.watch(Config.sass.src, ['sass:dev']);
        // 监听 assets 文件  
        gulp.watch(Config.assets.src, ['assets:dev']);
        // 监听 js 文件  
        gulp.watch(Config.js.src, ['revJs']);
        // 监听 image 文件  
        gulp.watch(Config.img.src, ['smushit','images:dev']);
        // 监听 conf 文件  
        gulp.watch(Config.conf.src, ['conf:dev']);
    });

    //服务器打开
    gulp.task('server', ['watch'], function () {
        //静态服务器
        browserSync.init({
            // proxy: 'localhost',
            // port: 8888,
            files: "**", //监听整个项目
            server: {
                baseDir: Config.dist,
                index: 'test.html'
            },
            notify: false
        });
    });
}
//======= gulp dev 开发环境下 ===============
module.exports = dev;