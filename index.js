const { prepareTable } = require('./table');

const base_options = {
	padding: 2,
	borderType: 'default',
	align: 'center',
	columnInformation: undefined
}
/**
 * 
 * @param {object|Array} [data] - Either an object or array to display
 * @param {base_options} [options] 
 */
function TableCli(data = {}, options = {}) {
	this.opts = Object.assign(base_options, options);
	this.data = data;

	// making sure it won't look completely weird
	if (this.opts.padding < 2) this.opts.padding = 2;
}

function objectToArray(obj = {}) {
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

function getColumnWidths(array = []) {
	const colWidths = array.reduce((acc, curr) => {
		curr.forEach((group, index) => {
			if (!acc[index]) {
				acc.push(group.toString().length);
			} else {
				acc[index] = acc[index] > group.toString().length ? acc[index] : group.toString().length;
			}
		});
		return acc;
	}, []);
	return colWidths;
}


const mockArray = [
	['items', 'prices', 'animal', 'cars', 'flabbergasters'],
	[3, '$2343.00', 'giraffe', 'Audi', 'Justin Flabber'],
	[13, '$12.50', 'Rhinoceros', 'Lamborghini', 'John']
];

const mockObject = {
	items: [3, 13,34],
	prices: ['$2343.00', '$12.50', '$234'],
	animal: ['giraffe', 'Rhinoceros', 'ape'],
	cars: ['Audi', 'Lamborghini'],
	flabbergasters: ['Justin Flabber', 'John', 'Henry']
}

/**
 * Prints out the table as returned by this.getTableString
 */
TableCli.prototype.showTable = function () {
	const table = this.getTableString();
	console.log(table);
}

/**
 * Returns the table as a string for further manipulation.
 */
TableCli.prototype.getTableString = function () {
	let dataArray;
	if (!Array.isArray(this.data)) {
		dataArray = objectToArray(this.data);
	}
	const colWidths = getColumnWidths(dataArray || this.data);
	try {
		const table = prepareTable(dataArray || this.data, colWidths, this.opts );
		return table;
	} catch (err) {
		return err.message;
	}
}

const Table = new TableCli(mockObject, {align: 'center', padding: 2, borderType: 'double'});
Table.showTable();