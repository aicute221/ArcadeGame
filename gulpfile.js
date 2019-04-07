// var gulp = require('gulp');
//
// gulp.task('default', function() {
//     // 将你的默认的任务代码放在这
//     console.log("cnn")
// });
var gulp = require('gulp');
gulp.task('default', defaultTask);
function defaultTask(done) {
    var browserSync = require('browser-sync').create();
    browserSync.init({
        // 这里的意思是含有这个文件的目录地址，可以将目录更改
        server: "./"
    });
    browserSync.stream();
    done();
}