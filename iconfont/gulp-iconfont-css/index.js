'use strict';

var path = require('path'),
	gutil = require('gulp-util'),
	consolidate = require('consolidate'),
	_ = require('lodash'),
	Stream = require('stream');

var PLUGIN_NAME  = 'gulp-iconfont-css';

function iconfontCSS(config) {

	var glyphMap = [],
		currentGlyph,
		currentCodePoint,
		inputFilePrefix,
		stream,
		outputFile,
		dataAry,
		engine;

	// Set default values
	config = _.merge({
		path: 'css',
		targetPath: '_icons.css',
		fontPath: './',
		engine: 'lodash',
		firstGlyph: 0xE001,
		dataAry:{}
	}, config);
	// Enable default stylesheet generators
	if(!config.path) {
		config.path = 'scss';
	}
	if(/^(scss|less|css)$/i.test(config.path)) {
		config.path = __dirname + '/templates/_icons.' + config.path;
	}

	// Validate config
	if (!config.fontName) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Missing option "fontName"');
	}
    if(!config.className){
		    throw new gutil.PluginError(PLUGIN_NAME, 'Missing option "className"');
    }
    if(!config.iconName){
		    throw new gutil.PluginError(PLUGIN_NAME, 'Missing option "iconName"');
    }
	if (!consolidate[config.engine]) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Consolidate missing template engine "' + config.engine + '"');
	}
	try {
		engine = require(config.engine);
	} catch(e) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Template engine "' + config.engine + '" not present');
	}

	// Define starting point
	currentGlyph = config.firstGlyph;

	// Happy streaming
	stream = Stream.PassThrough({
		objectMode: true
	});

	stream._transform = function(file, unused, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}
		var data = config.dataAry;
		var dataIndex;
	  
		for(var ii in data)
		{
			if(data[ii] == path.basename(file.path).replace('.svg','')){
				dataIndex = ii;
				break;
			}
		
		}
		var dataValue = config.dataAry[dataIndex];
		delete config.dataAry[dataIndex];
		

		// Create output file
		if (!outputFile) {
			outputFile = new gutil.File({
				base: file.base,
				cwd: file.cwd,
				path: path.join(file.base, config.targetPath),
				contents: file.isBuffer() ? new Buffer.from("0") : new Stream.PassThrough()
			});
		}

		// Add glyph
		glyphMap.push({
			fileName: dataValue,
			codePoint: dataIndex
		});
		
		// Prepend codePoint to input file path for gulp-iconfont
		inputFilePrefix = 'u' + dataIndex + '-';
		file.path = path.dirname(file.path) + '/' + inputFilePrefix + dataValue + ".svg";
			//console.log(file.path)

		this.push(file);
		cb();
	};

	stream._flush = function(cb) {
		var content;
		
		if (glyphMap.length) {
			consolidate[config.engine](config.path, {
					glyphs: glyphMap,
					fontName: config.fontName,
                    className:config.className,
                    iconName:config.iconName,
					fontPath: config.fontPath
				}, function(error, html) {
					if (error) {
						throw error;
					}
					content = Buffer.from(html);
					if (outputFile.isBuffer()) {
						outputFile.contents = content;
					} else {
						outputFile.contents.write(content);
						outputFile.contents.end();
					}

					stream.push(outputFile);

					cb();
			});
		} else {
			cb();
		}
	};

	return stream;
};

module.exports = iconfontCSS;
