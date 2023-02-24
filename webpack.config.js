const path = require('path')
module.exports = {
		entry: "/src/Tool.js",
		experiments: {
			outputModule: true,
		},
		output: {
			path:path.resolve(__dirname, 'lib'),
			library: {
				type: 'module'
			}
		}
}