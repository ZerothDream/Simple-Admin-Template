/**
 * Created by admin on 2016/12/3.
 */

/**
 * 组件安装
 * npm install gulp gulp-notify gulp-livereload gulp-sass gulp-rename gulp-autoprefixer gulp-cssnano jshint gulp-jshint gulp-uglify gulp-concat gulp-imagemin del --save-dev
 *
 * 参考：
 * http://www.dbpoo.com/getting-started-with-gulp/
 * https://markgoodyear.com/2014/01/getting-started-with-gulp/
 * http://blog.csdn.net/qq_15096707/article/details/52270355
 */

// 引入 gulp及组件
var gulp = require('gulp'),                 //基础库
    notify = require('gulp-notify'),           //通知

    //tinylr = require('tiny-lr'),               //livereload
    //server = tinylr(),
    //port = 35729,
    livereload = require('gulp-livereload'),   //livereload

    sass = require('gulp-sass'),          //sass
    rename = require('gulp-rename'),           //重命名
    autoprefixer = require('gulp-autoprefixer'), // 处理css中浏览器兼容的前缀
    cssnano = require('gulp-cssnano'),          // css的层级压缩合并

    jshint = require('gulp-jshint'),           //js检查 ==> npm install --save-dev jshint gulp-jshint（.jshintrc：https://my.oschina.net/wjj328938669/blog/637433?p=1）
    uglify = require('gulp-uglify'),          //js压缩
    concat = require('gulp-concat'),          //合并文件

    imagemin = require('gulp-imagemin'),       //图片压缩

    del = require('del');             //清空文件


var SRC_DIR = './src/';     // 源文件目录
var DIST_DIR = './dist/';   // 文件处理后存放的目录
var DIST_FILE = DIST_DIR + '**'; // 目标路径下的所有文件

var Config = {
    html: {
        src: SRC_DIR + '*.html',
        dist: DIST_DIR
    },
    assets: {
        src: SRC_DIR + 'assets/**/*',            // assets目录：./src/assets
        dist: DIST_DIR + 'assets'                // assets文件build后存放的目录：./dist/assets
    },
    css: {
        src: SRC_DIR + 'css/**/*.css',           // CSS目录：./src/css/
        dist: DIST_DIR + 'css'                   // CSS文件build后存放的目录：./dist/css
    },
    sass: {
        src: SRC_DIR + 'scss/**/*.scss',         // SCSS目录：./src/scss/
        dist: DIST_DIR + 'css'                   // SCSS文件生成CSS后存放的目录：./dist/css
    },
    js: {
        src: SRC_DIR + 'js/**/*.js',             // JS目录：./src/js/
        dist: DIST_DIR + 'js',                   // JS文件build后存放的目录：./dist/js
        build_name: 'build.js'                   // 合并后的js的文件名
    },
    img: {
        src: SRC_DIR + 'images/**/*',            // images目录：./src/images/
        dist: DIST_DIR + 'images'                // images文件build后存放的目录：./dist/images
    }
};

/**
 * copy任务（复制不需要处理的文件到dist目录下）
 */
/*var copyTasks = [
    'html', 'assets'
]; // 定义单纯的复制功能的列表
gulp.task('copy', function () {
    for (var i = 0; i < copyTasks.length; i++) {
        var key = copyTasks[i];
        gulp.src(Config[key].src)
            .pipe(gulp.dest(Config[key].dist));
        //.pipe(notify({ message: key + ' task complete' }));
    }
});*/

/**
 * HTML处理
 */
gulp.task('html', function () {
    gulp.src(Config.html.src)
        .pipe(gulp.dest(Config.html.dist));
});

/**
 * assets文件夹下的所有文件处理
 */
gulp.task('assets', function () {
    gulp.src(Config.assets.src)
        .pipe(gulp.dest(Config.assets.dist));
});

/**
 * CSS样式处理
 */
gulp.task('css', function () {
    gulp.src(Config.css.src)
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(Config.css.dist))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano()) //执行压缩
        .pipe(gulp.dest(Config.css.dist))
        .pipe(notify({message: 'css task complete'}));
});
/**
 * 监听CSS文件的变化，变化后将执行CSS任务
 */
gulp.task('css-watch', function () {
    gulp.watch(Config.css.src, ['css']);
});

/**
 * SCSS样式处理
 */
gulp.task('sass', function () {
    return gulp.src(Config.sass.src)
        .pipe(autoprefixer('last 2 version'))
        .pipe(sass())
        .pipe(gulp.dest(Config.sass.dist))
        .pipe(rename({suffix: '.min'})) //rename压缩后的文件名
        .pipe(cssnano()) //执行压缩
        .pipe(gulp.dest(Config.sass.dist))
        /*.pipe(notify({message: 'sass task complete'}))*/;
});
/**
 * 监听SASS文件的变化，变化后将执行SASS任务
 */
gulp.task('sass-watch', function () {
    gulp.watch(Config.sass.src, ['sass']);
});

/**
 * js处理
 */
gulp.task('js', function () {
    gulp.src(Config.js.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(Config.js.dist))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(Config.js.dist))
        /*.pipe(notify({message: 'js task complete'}))*/;
});
/**
 * 合并所有js文件并做压缩处理
 */
gulp.task('js-concat', function () {
    gulp.src(Config.js.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat(Config.js.build_name))
        .pipe(gulp.dest(Config.js.dist))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(Config.js.dist))
        .pipe(notify({message: 'js-concat task complete'}));
});

/**
 * 图片处理
 */
gulp.task('images', function () {
    return gulp.src(Config.img.src)
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest(Config.img.dist))
        /*.pipe(notify({ message: 'images task complete' }))*/;
});

/**
 * 清空图片、样式、js
 */
gulp.task('clean', function () {
    return del([Config.html.dist, Config.css.dist, Config.js.dist, Config.img.dist]);
});
gulp.task('clean-all', function () {
    return del([Config.html.dist, Config.assets, Config.css.dist, Config.js.dist, Config.img.dist]);
});

/**
 * 默认任务 清空图片、样式、js并重建 运行语句 gulp
 */
gulp.task('default', ['clean'], function () {
    gulp.start('html', 'assets', 'css', 'sass', 'images', 'js');
});


/**
 * 监听任务
 */
gulp.task('watch', function () {
    // Watch .html files
    gulp.watch(Config.html.src, ['html']);

    // Watch .css files
    gulp.watch(Config.css.src, ['css']);

    // Watch .scss files
    gulp.watch(Config.sass.src, ['sass']);

    // Watch assets files
    gulp.watch(Config.assets.src, ['assets']);

    // Watch .js files
    gulp.watch(Config.js.src, ['js']);

    // Watch image files
    gulp.watch(Config.img.src, ['images']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch([DIST_FILE]).on('change', livereload.changed);
});