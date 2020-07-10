const assert = require('assert');
const rewire = require('rewire');
const borders = require('../borders.json');
const { isArray } = require('util');

const table = rewire('../table.js');

describe('Table tests', () => {
    describe('createTableHeader', () => {
        const createTableHeader = table.__get__('createTableHeader');
        const headers = ['one', 'two', 'three'];
        const colWidths = [5, 6, 7];
        const padding = 2;
        const border = borders['default'];

        it('should create the header string', () => {
            const expected = '┌───────┬────────┬─────────┐\n' +
                '│  one  │  two   │  three  │\n' +
                '├───────┼────────┼─────────┤'
            const actual = createTableHeader(headers, colWidths, padding, border);
            assert.equal(actual, expected);
        });

        it('should correctly add the padding', () => {
            const increase = 2;
            const first = createTableHeader(headers, colWidths, padding, border);
            const second = createTableHeader(headers, colWidths, padding + increase, border);

            // magic three here is from the three rows that make up the header
            const addedSpaces = headers.length * 3 * increase;
            assert.equal(first.length + addedSpaces, second.length);
        });
    });
    describe('createGroupHeaderTop', () => {
        const createGroupHeaderTop = table.__get__('createGroupHeaderTop');
        const colWidths = [4, 2, 6];
        const padding = 2;
        const border = borders['default'];

        it('should return a top line', () => {
            const actual = createGroupHeaderTop(colWidths, padding, border, true);
            const len = colWidths.map(el => el + padding).reduce((a, b) => a + b, 0) + colWidths.length + 1;
            assert.equal(actual.length, len);
        });

        it('renders the correct pieces top header', () => {
            const actual = createGroupHeaderTop(colWidths, padding, border, true);
            assert.equal(actual[0], border['topLeft']);
            assert.equal(actual[actual.length - 1], border['topRight']);
            assert.match(actual, new RegExp(border['topMiddle']));
        });

        it('renders the correct pieces group header', () => {
            const actual = createGroupHeaderTop(colWidths, padding, border, false);
            assert.equal(actual[0], border['midLeft']);
            assert.equal(actual[actual.length - 1], border['midRight']);
            assert.match(actual, new RegExp(border['middleFourWay']));
        });
    });

    describe('createGroupBottom', () => {
        const createGroupBottom = table.__get__('createGroupBottom');
        const colWidths = [4, 2, 6];
        const padding = 2;
        const border = borders['default'];

        it('should return a top line', () => {
            const actual = createGroupBottom(colWidths, padding, border, true);
            const len = colWidths.map(el => el + padding).reduce((a, b) => a + b, 0) + colWidths.length + 1;
            assert.equal(actual.length, len);
        });

        it('renders the correct pieces top header', () => {
            const actual = createGroupBottom(colWidths, padding, border, true);
            assert.equal(actual[0], border['bottomLeft']);
            assert.equal(actual[actual.length - 1], border['bottomRight']);
            assert.match(actual, new RegExp(border['bottomMiddle']));
        });

        it('renders the correct pieces group header', () => {
            const actual = createGroupBottom(colWidths, padding, border, false);
            assert.equal(actual[0], border['midLeft']);
            assert.equal(actual[actual.length - 1], border['midRight']);
            assert.match(actual, new RegExp(border['middleFourWay']));
        });
    });

    describe('CreateDataRow', () => {
        const createDataRows = table.__get__('createDataRows');
        const array = [['one', 'two', 333]];
        const colWidths = [5, 6, 4];
        const padding = 5;
        const border = borders['default'];
        const align = 'center';
        const len = colWidths.map(el => el + padding).reduce((a, b) => a + b, 0) + colWidths.length + 1;

        it('should return a row of data', () => {
            const actual = createDataRows(array, colWidths, padding, border, align);
           
            assert.equal(isArray(actual), true);
            assert.equal(actual.length, array.length);
            assert.equal(actual[0].length, len);
        });

        it('should return multiple rows of data all of the same length', () => {
            const array = [[5,2,5,6],['apple', 'test'],['one', 'two', 'three'],['here']];
            const actual = createDataRows(array, colWidths, padding, border, align);

            assert.equal(isArray(actual), true);
            assert.equal(actual.length, array.length);
            for (let row of actual) {
                assert.equal(row.length, len);
            }
        });

        it('should set the center alignment', () => {
            const actual = createDataRows(array, colWidths, padding, border, align);
            const items = actual[0].split(border['vertical']).slice(1, -1);
            
            // centered alignment 
            for (let item of items) {
                assert.match(item, /^ {2,}\S+ {2,}$/);
            }
        });

        it('should set the left alignment', () => {
            const actual = createDataRows(array, colWidths, padding, border, 'left');
            const items = actual[0].split(border['vertical']).slice(1, -1);
            
            // centered alignment 
            for (let item of items) {
                assert.match(item, /^ {1}\S+ {2,}$/);
            }
        });

        it('should set the right alignment', () => {
            const actual = createDataRows(array, colWidths, padding, border, 'right');
            const items = actual[0].split(border['vertical']).slice(1, -1);
            
            // centered alignment 
            for (let item of items) {
                assert.match(item, /^ {2,}\S+ {1}$/);
            }
        });
    });

    describe('prepareTable', () => {
        const prepareTable = table.__get__('prepareTable');
        const array = [['header1', 'header2', 'header3'],['one', 'two', 333]];
        const headers = [];
        const colWidths = [5, 6, 4];
        const padding = 5;
        const borderType = 'default';
        const align = 'center';

        it('should throw an error if not formatted right', () => {
            assert.throws(() => prepareTable('I am not an array am I?', colWidths, {padding, borderType, align, headers }, []));
        });

        it('should set the default borders if the type is unknown', () => {
            const borderType = 'fish';
            const actual = prepareTable(array, colWidths, {padding, borderType, align, headers }, []);
            
            assert.match(actual, new RegExp(borders['default']['middleFourWay']));
        });
        
        it('should set the selected borders if the type is known', () => {
            const borderType = 'double';
            const actual = prepareTable(array, colWidths, {padding, borderType, align, headers }, []);
            
            assert.match(actual, new RegExp(borders['double']['middleFourWay']));
        });

        it('should render the first row in the array as headers', () => {
            const actual = prepareTable(array, colWidths, {padding, borderType, align, headers }, []);

            assert.match(actual, /│ header1  │  header2  │ header3 │\n/)
        });

        it('should render override headers', () => {
            const headers = ['new1', 'new2'];
            const actual = prepareTable(array, colWidths, {padding, borderType, align, headers }, []);

            assert.match(actual, /│   new1   │   new2    │ header3 │\n/)
        });
    });
});