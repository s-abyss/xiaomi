const { series, parallel, src, dest, watch }  = require('gulp');
const sass = require('gulp-sass')(require('sass'));//sass转css
const autoprefixer = require('gulp-autoprefixer');//给css3添加浏览器前缀
const cssmin = require('gulp-cssmin');            //压缩css3
const clean = require('gulp-clean');              //清理任务
const babel = require('gulp-babel');              //ES6转ES5
const uglify = require('gulp-uglify');            //压缩js
const htmlmin = require('gulp-htmlmin');           //压缩html
const fileInclude = require('gulp-file-include');  //把HTML做成代码片段的任务
const concat = require('gulp-concat');             //合并文件的任务
const rename = require('gulp-rename');             //重命名的任务
const webserver = require('gulp-webserver');       // 开启一个web服务器的任务
const gulpIf = require('gulp-if');                 //条件判断          

//清理任务
function cleanTask(){
    return src('./dist',{allowEmpty:true})
            .pipe(clean())
}

//sass转换
function sassTask(){
    return src('./src/css/*.scss')
            .pipe(sass())
            .pipe(dest('./dist/css'))
}
//html片段任务
function htmlTask(){
    return src('./src/views/*.html')
            .pipe(fileInclude({
                prefix:'@',
                basepath:'./src/views/templates'
            }))
            .pipe(dest('./dist/views'))
}
//同步js代码
function jsTask(){
    return src('./src/js/**')
            .pipe(dest('./dist/js'))
}

//同步api代码
function apiTask(){
    return src('./src/api/**')
            .pipe(dest('./dist/api'))
}

//同步static代码
function staticTask(){
    return src('./src/static/**')
            .pipe(dest('./dist/static'))
}

//同步lib代码
function libTask(){
    return src('./src/lib/**')
            .pipe(dest('./dist/lib'))
}

//启动web服务器
function webTask(){
    return src('./dist')
            .pipe(webserver({
                host : 'localhost',
                port : 4000,
                open : './views/index.html',
                livereload : true 
            })) 
}

//监听src下文件的变化，并实时同步到dist文件夹下
function watchTask(){
    watch('./src/css/**', sassTask);
    watch('./src/views/**', htmlTask);
    watch('./src/js/**', jsTask);
    watch('./src/lib/**', libTask);
    watch('./src/static/**', staticTask);
    watch('./src/api/**', apiTask);
}


module.exports = {
    //开发任务
    dev: series(cleanTask, parallel(sassTask, htmlTask, jsTask, libTask, staticTask, apiTask), parallel(webTask, watchTask) )
};