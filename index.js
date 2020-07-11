const { prepareTable } = require('./table');
const { isArray } = require('util');

/** {{message: string}}
 * @type {{ padding: number, borderType: 'default|double', align: 'left|center
 * right', headers: 'array overriding object keys', columnInformation: 'not used yet'}}
 */
const base_options = {
	padding: 2,
	borderType: 'default',
	align: 'center',
	headers: undefined,
	columnInformation: undefined
}

/**
 * 
 * @param {base_options} [options] 
 */
class TableCli {
	constructor(options = {}) {
		this.opts = Object.assign(base_options, options);
		this._data = null;
		this._dataBuffer = [];

		// making sure it won't look completely weird
		if (this.opts.padding < 2) this.opts.padding = 2;
	}

	setData(data) {
		this._data = data;
	}

	addRow(row) {
		if (!Array.isArray(row)) throw new Error('row needs to be of type array!');
		this._dataBuffer.push(row);
	}

	/**
	 * Prints out the table as returned by this.getTableString
	 */
	showTable() {
		const table = this.getTableString();
		console.log(table);
	}

	/**
	 * Returns the table as a string for further manipulation.
	 */
	getTableString() {
		let dataArray;
		if (!isArray(this._data)) {
			dataArray = objectToArray(this._data);
		} 
		if (isArray(this._data) && this._data.length && typeof this._data[0] === 'object' && !isArray(this._data[0])) {
			dataArray = arrayOfObjectsToArray(this._data);
		}
		const colWidths = getColumnWidths(dataArray || this._data);
		try {
			const table = prepareTable(dataArray || this._data, colWidths, this.opts, this._dataBuffer);
			return table;
		} catch (err) {
			return err.message;
		}
	}
}

function objectToArray(obj) {
	if (!obj || !Object.keys(obj).length) return [];
	const items = Object.entries(obj).reduce((acc, curr) => {
		acc.headers.push(curr[0]);
		acc.columns.push(curr[1]);
		return acc;
	}
		, { headers: [], columns: [] }
	);
	const longestColumn = Math.max(...items.columns.map(el => el.length));
	const sortedColumns = [];
	for (let i = 0; i < longestColumn; i++) {
		const tempCol = [];
		for (const col of items.columns) {
			tempCol.push(col[i] || '');
		}
		sortedColumns.push(tempCol)
	}
	sortedColumns.unshift(items.headers);
	return sortedColumns;
}

function arrayOfObjectsToArray(list) {
	const res = list.reduce((acc, curr) => {
		Object.entries(curr).forEach(([key, val]) => {
			acc[key] ? acc[key].push(val) : acc[key] = [val];
		});
		return acc;
	}, {});
	return objectToArray(res);
}

function getColumnWidths(array = []) {
	const colWidths = array.reduce((acc, curr) => {
		curr.forEach((group, index) => {
			const groupLen = group.toString().length;
			if (!acc[index]) {
				acc.push(groupLen);
			} else {
				acc[index] = acc[index] > groupLen ? acc[index] : groupLen;
			}
		});
		return acc;
	}, []);
	return colWidths;
}

module.exports.TableCli = TableCli;

const mockObject = [{
	items: 3,
	prices: '$2343.00',
	animal: 'giraffe',
	cars: 'Audi',
	flabbergasters: 'Justin Flabber',
},{
	items: 13,
	prices: '$12.50',
	animal: 'Rhinoceros',
	cars: 'Lamborghini',
	flabbergasters: 'John'
}]

const otherObj = {
	items: [3, 13],
	prices: ['$2343.00', '$12.50'],
	animal: ['giraffe', 'Rhinoceros'],
	cars: ['Audi', 'Lamborghini'],
	flabbergasters: ['Justin Flabber', 'John']
}
const mockArray = [
	['items', 'prices', 'animal', 'cars', 'flabbergasters'],
	[3, '$2343.00', 'giraffe', 'Audi', 'Justin Flabber'],
	[13, '$12.50', 'Rhinoceros', 'Lamborghini', 'John']
];
const table = new TableCli();
table.setData(mockObject);
table.showTable();