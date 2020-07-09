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
		for (let i = 0; i< longestColumn; i++){
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






// console.log(getColumnWidths(mockArray));