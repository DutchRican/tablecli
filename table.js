const borders = require('./borders.json');

function createTableHeader(headers, colWidths, padding, border) {

    const headerTop = createGroupHeaderTop(colWidths, padding, border, true);
    const columnHeads = createDataRow([headers], colWidths, padding, border, 'center');
    const headerBottom = createGroupBottom(colWidths, padding, border, false);

    return headerTop + '\n' + columnHeads + '\n' + headerBottom;
}

function createGroupHeaderTop(colWidths, padding, border, isHeader) {
    const groupingHeader = colWidths.reduce((acc, curr, index) => {
        let endPiece = index < colWidths.length - 1 ? border[isHeader ? 'topMiddle' : 'middleFourWay'] : border[isHeader ? 'topRight' : 'vertical'];
        acc += border['horizontal'].repeat(curr + padding) + endPiece;
        return acc;
    }, isHeader ? border['topLeft'] : border['midLeft']);
    return groupingHeader;
}
function createGroupBottom(colWidths, padding, border, isTableBottom = true) {
    const bottom = colWidths.reduce((acc, curr, index) => {
        let endPiece = index < colWidths.length - 1 ? border[isTableBottom
            ? 'bottomMiddle' : 'middleFourWay'] 
            : border[isTableBottom ? 'bottomRight' : 'midRight'];
        acc += border['horizontal'].repeat(curr + padding) + endPiece;
        return acc;
    }, isTableBottom ? border['bottomLeft'] : border['midLeft']);
    return bottom;
}

function createDataRow(array, colWidths, padding, border, align) {
    const columnHeads = array.map(row =>
        colWidths.reduce((acc, curr, index) => {
            let connector = border['vertical'];
            let [left, right] = [];
            let diff = curr + padding - row[index].toString().length;
            if (align === 'center') {
                [left, right] = (diff % 2 == 0) ? [diff / 2, diff / 2] : [Math.floor(diff / 2), Math.ceil(diff / 2)];
            } else if (align === 'left') {
                [left, right] = [1, diff - 1];
            } else {
                [left, right] = [diff - 1, 1];
            }
            
            acc += ' '.repeat(left) + row[index] + ' '.repeat(right) + connector;
            return acc;
        }, border['vertical']));
    return columnHeads;
}

function prepareTable(array, colWidths, {padding, borderType, align}) {
    if (!array.length || !colWidths.length) throw new Error('Data not formatted right');
    let output = createTableHeader(array[0], colWidths, padding, borders[borderType]) + '\n' +
        createDataRow(array.slice(1), colWidths, padding, borders[borderType], align).join('\n') + '\n' +
        createGroupBottom(colWidths, padding, borders[borderType], true);
    return output;
}

module.exports.prepareTable = prepareTable;
