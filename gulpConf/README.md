备注: 在根目录下创建一个文件夹名称为rev

gulp常用配置

版本号管理：

打开node_modules\gulp-rev\index.js

第133行 manifest[originalFile] = revisionedFile;
更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;

打开node_modules\gulp-rev\node_modules\rev-path\index.js

10行 return filename + '-' + hash + ext;
更新为: return filename + ext;

打开node_modules\gulp-rev-collector\index.js

40行 let cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
更新为: let cleanReplacement =  path.basename(json[key]).split('?')[0];
