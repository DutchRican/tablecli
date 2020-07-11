const { isArray } = require('util');
const chalk = require('chalk');
const borders = require('./borders.json');

function createTableHeader(headers, colWidths, padding, border) {
    const headerTop = createGroupHeaderTop(colWidths, padding, border, true);
    const columnHeads = createDataRows([headers], colWidths, padding, border, 'center');
    const headerBottom = createGroupBottom(colWidths, padding, border, false);

    return headerTop + '\n' + columnHeads + '\n' + headerBottom;
}

function createGroupHeaderTop(colWidths, padding, border, isHeader) {
    const groupingHeader = colWidths.reduce((acc, curr, index) => {
        let endPiece = index < colWidths.length - 1 ? border[isHeader ? 'topMiddle' : 'middleFourWay'] : border[isHeader ? 'topRight' : 'midRight'];
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

function getLeftRightPadding(width, padding, text, alignment) {
    let [left, right] = [];
    let diff = width + padding - text;
    if (alignment === 'center') {
        [left, right] = (diff % 2 == 0) ? [diff / 2, diff / 2] : [Math.floor(diff / 2), Math.ceil(diff / 2)];
    } else if (alignment === 'left') {
        [left, right] = [1, diff - 1];
    } else {
        [left, right] = [diff - 1, 1];
    }
    return [left, right];
}

function paddText(left, right, text) {
    return ' '.repeat(left) + text + ' '.repeat(right)
}

function createDataRows(array, colWidths, padding, border, align, columnInformation) {
    const columnHeads = array.map(row =>
        colWidths.reduce((acc, curr, index) => {
            const colInfo = columnInformation && columnInformation[index];
            let alignment = colInfo && colInfo.align || align;
            row[index] = row[index] || '';
            let connector = border['vertical'];
            let [left, right] = getLeftRightPadding(curr, padding, row[index].toString().length, alignment);
            const color = !!(colInfo && colInfo.color && chalk[colInfo.color]) && colInfo.color;
            const cellData = color && chalk[colInfo.color](row[index]) || row[index];
            acc += paddText(left, right, cellData) + connector;
            // acc += ' '.repeat(left) + cellData + ' '.repeat(right) + connector;
            return acc;
        }, border['vertical']));
    return columnHeads;
}

function prepareTable(array, colWidths, { padding, borderType, align, headers, columnInformation, title }, dataBuffer) {
    if (!array.length || !isArray(array) || !colWidths.length) throw new Error('Data not formatted right');

    const border = borders[borderType] || borders['default'];
    if (headers) {
        headers.forEach((header, index) => {
            array[0][index] = header;
        });
    }
    
    let output = createTableHeader(array[0], colWidths, padding, border) + '\n' +
        createDataRows(array.slice(1).concat(dataBuffer), colWidths, padding, border, align, columnInformation).join('\n') + '\n' +
        createGroupBottom(colWidths, padding, border, true);
        const tableTitle = title && paddText(...getLeftRightPadding(output.split('\n')[0].length, 0, title.length, 'center'), title);
    return tableTitle ?  tableTitle + '\n' + output : output;
}

module.exports.prepareTable = prepareTable;
