const Converters = require('./converters/index');

class Converter {
	constructor(fromFormat, toFormat) {
		this.importer = Converters.factory(fromFormat);
		if (!this.importer) {
			throw new Error('from format ' + fromFormat.name + ' not supported');
		}
		this.importer.type = fromFormat;

		this.exporter = Converters.factory(toFormat);
		if (!this.exporter) {
			throw new Error('to format ' + toFormat.name + ' not supported');
		}
		this.exporter.type = toFormat;
		this.format = this.exporter.type.formats[0];
	}

	getModelFromData(data, options) {
		return new Promise((resolve, reject) => {
			this._loadData(data, options).then(() => {
				const model = this.importer.import(this.importer.data);
				resolve(model);
			}).catch(reject);
		});
	}


	getModelFromFile(file, options) {
		return new Promise((resolve, reject) => {
			this._loadFile(file, options).then(() => {
				const model = this.importer.import(this.importer.data);
				resolve(model);
			}).catch(reject);
		});
	}

	convertFromModel(model) {
		return new Promise((resolve, reject) => {
			try {
				this.exporter.export(model)
          .then(resolve)
          .catch(reject);
			} catch (e) {
				reject(e);
			}
		});
	}
	
	convertFile(file, options) {
		return new Promise((resolve, reject) => {
			this.getModelFromFile(file, options).then((model) => {
				this.convertFromModel(model).then(resolve).catch(reject);
			}).catch(reject);
		});
	}

	convertData(data, options) {
		return new Promise((resolve, reject) => {
			this.getModelFromData(data, options).then((model) => {
				this.convertFromModel(model).then(resolve).catch(reject);
			}).catch(reject);
		});
	}

	_loadFile(filePath, options) {
		return this.importer._loadFile(filePath, options);
	}

	_loadData(rawData, options) {
		return this.importer._loadData(rawData, options);
	}
}

exports.Converter = Converter;
