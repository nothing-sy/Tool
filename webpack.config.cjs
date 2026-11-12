const path = require('path')

module.exports = {
	entry: path.resolve(__dirname, 'src/Tool.js'),
	experiments: {
		outputModule: true,
	},
	externals: {
		jquery: 'jquery',
	},
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'main.mjs',
		library: {
			type: 'module',
		},
		clean: true,
	},
}
