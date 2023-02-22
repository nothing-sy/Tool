const path = require('path')
module.exports = {
		entry: "/src/Tool.js",
		output: {
			path:path.resolve(__dirname, 'lib'),
			library: 'MyLibrary'
		}
		
		
}