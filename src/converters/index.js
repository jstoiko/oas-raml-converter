const importers = {
	RAML: require('../raml10/raml10Converter'),
	OAS20: require('../oas20/oas20Converter')
};

function doesSupportFormat(format) {
	return !(!format || !format.name || !importers.hasOwnProperty(format.className));
}

module.exports = {
	hasSupport: doesSupportFormat,
	factory: (format) => {
		if (!doesSupportFormat(format)) {
			return null;
		}
		return new importers[format.className]();
	}
};
