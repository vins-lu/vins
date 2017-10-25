var prod = require('./build/gulpfile.prod.js');//生产环境
var dev = require('./build/gulpfile.dev.js');//开发环境

prod();
dev();