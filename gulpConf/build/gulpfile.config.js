var SRC_DIR = './src/';     // 源文件目录  
var DIST_DIR = './dist/';   // 文件处理后存放的目录  
var DIST_FILES = DIST_DIR + '**'; // 目标路径下的所有文件  

var Config = {
    src: SRC_DIR,
    dist: DIST_DIR,
    dist_files: DIST_FILES,
    html: {  
        src: SRC_DIR + 'pages/**/*.html',  
        dist: DIST_DIR + 'pages'
    },  
    assets: {  
        src: SRC_DIR + 'assets/**/*',            // assets（插件资源）目录：./src/assets  
        dist: DIST_DIR + 'assets'                // assets文件build后存放的目录：./dist/assets  
    },  
    css: {  
        src: SRC_DIR + 'css/**/*.css',           // CSS（样式）目录：./src/css/  
        dist: DIST_DIR + 'css'                   // CSS文件build后存放的目录：./dist/css  
    },  
    sass: {  
        src: SRC_DIR + 'sass/**/*.scss',         // SASS目录：./src/sass/  
        dist: DIST_DIR + 'css'                   // SASS文件生成CSS后存放的目录：./dist/css  
    },  
    js: {  
        src: SRC_DIR + 'js/**/*.js',             // JS目录：./src/js/  
        dist: DIST_DIR + 'js',                   // JS文件build后存放的目录：./dist/js  
        build_name: 'build.js'                   // 合并后的js的文件名  
    },  
    img: {  
        src: SRC_DIR + 'images/**/*.*(jpg|jpeg|png)',            // images（jpg|png图片）目录：./src/images/  
        dist: DIST_DIR + 'images'                               // images文件build后存放的目录：./dist/images  
    },
    imgNotJP: {  
        src: SRC_DIR + 'images/**/*.*!(jpg|jpeg|png)',            // images目录：./src/images/  
        dist: DIST_DIR + 'images'                                // images文件build后存放的目录：./dist/images  
    },
    conf: {  
        src: SRC_DIR + 'conf/**/*.*(js|json)',            // conf（配置文件）目录：./src/conf/  
        dist: DIST_DIR + 'conf'                          // conf文件build后存放的目录：./dist/conf  
    }
};

module.exports = Config;