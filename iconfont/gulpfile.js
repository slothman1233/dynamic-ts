var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('./gulp-iconfont-css');
var clean = require("gulp-clean");
var template = require("gulp-template");
var watch = require('gulp-watch');
var del = require("del");
var minifycss = require('gulp-minify-css');
var fs = require("fs");
var fontName = 'iconfont';
var iconName = "iconfont";
var iconfontaddAnddel = require('./gulp-iconfont-css/iconfontaddAnddel')
    // 发布项目
    //, "fx110"
    var filt = ["newfx", "fx", "dls", "hh", "whtt", "bls", "huihunapp", "f"],
    // var filt = ["hh"],
    //var filt = ["layer"],
    //  var filt = ["hcc"],
      //  var filt = ["editor"],
 //var filt = ["layer"],
    //var filt = ["fx","dls","whtt"],
    task = {
        //去掉所有svg 里面的width和height
        writeFile: function() {
            filt.forEach(function(f) {
                let src = "./src/" + f + "/icons/";
                fs.readdir(src, function(err, files) {
                    if (err) return console.log(err);
                    files.forEach(function(file) {
                        let fileSrc = src + file;
                        let fileContent = fs.readFileSync(fileSrc, 'utf-8').replace(/(height|width)="[^\"]*"/ig, "").replace(`width="16"`, "");
                        fs.writeFile(fileSrc, fileContent, function() {
                            // console.log(arguments)
                        })

                        //fs.readFile(fileSrc, function (err, data) {})
                    })

                })
            })



        },

        clean: function(name) {
            var icons = this.icons(name);
            return gulp.src("./build/" + name, {
                read: false
            }).pipe(clean());
        },

        // 发布打包
        iconfont: function(name) {
            return gulp.src('./src/' + name + '/icons/*.svg')
                .pipe(iconfontCss({
                    fontName: fontName,
                    className:"iconfont_"+name,
                    iconName:iconName,
                    path: './src/templates/iconfont.css',
                    targetPath: './iconfont.css',
                    fontPath: '../fonts/',
                    dataAry: this.getData(name)
                }))
                .pipe(iconfont({
                    fontName: iconName,
                    prependUnicode: true,
                    formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
                    // timestamp:Math.round(Date.now()/1000),
                    //fixedWidth: true,
                    normalize: true,
                    //centerHorizontally: true,
                    fontHeight: 1024,
                    //descent: -32,

                }))
                .on('glyphs', function(glyphs, options) {
                    // CSS templating, e.g.
                    // console.log(glyphs, options);
                })
                .pipe(gulp.dest('./build/' + name + '/'));
        },
        example: function(name) {
            return gulp.src('./src/example/index.html')
                .pipe(template({
                    icons: this.output(name, 0),
                    fileName: name
                }))
                .pipe(gulp.dest("./build/" + name));
        },

        exampleJson: function(name) {

            return gulp.src('./src/example/json.json')
                .pipe(template({
                    icons: this.output(name, 1)
                }))
                .pipe(gulp.dest("./json/" + name));
        },



        icons: function(name) {
            var icons = fs.readdirSync("./src/" + name + "/icons/");
            return icons;
        },
        output: function(name, type) {

            var Ary = { name: name, icon: [] };
            d = this.getData(name);

            for (var i in d) {
                if (type == 0) {

                    Ary.icon.push({ fileName: d[i], codePoint: "&#x" + i + ";", codePointext: "&amp;#x" + i + ";" })

                } else {

                    Ary.icon.push({ fileName: d[i], codePoint: i })

                }
            }


            //console.log(Ary);


            return Ary;
        },
        getData(name) {
            var data;
            try {
                data = fs.readFileSync("./json/" + name + "/json.json", 'utf-8') || "{}";
            } catch (e) {
                data = "{}";
            }
            data = JSON.parse(data);
            var Arys = this.icons(name);

            return iconfontaddAnddel({ json: data, imgAry: Arys });
        }


    };


gulp.task("del", function() {
    return del(['./build/*']);
})
gulp.task('default', ["del"], function() {


    for (var key in task) {
        if (key != "icons" || key != "output") {
            for (var key2 in filt) {
                task[key](filt[key2]);
            }
        }
    }
});

gulp.task("watch", function(e) { // 修改或增加时
    console.log(1)
    watch('src/**/*svg').on('add', function(file) {
            console.log('添加了 ' + file);
            gulp.run('default')
        })
        .on('change', function(file) {
            console.log('修改了 ' + file);
            gulp.run('default')
        })
        .on('unlink', function(file) {
            console.log('删除了 ' + file);
            gulp.run('default')
        });
})