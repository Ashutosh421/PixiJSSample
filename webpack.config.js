const path = require('path');


module.exports = {
	entry: path.join(__dirname , 'index.js'),
	output: {
		filename: 'pixisample.bundle.js',
		path: path.resolve(__dirname , 'dist')
	},
	// externals: {   //Incase if you don't want to include PIXI bundle into the main bundle. In that case you need to add PIXI bundle in index file
	// 	pixi : {
	// 		commonjs: 'pixi.js',
	// 		amd: 'pixi.js',
	// 		root: 'PIXI' // indicates global variable
	// 	}
	// },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
};