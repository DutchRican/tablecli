const assert = require('assert');
const rewire = require('rewire');

const main = rewire('../index.js');

objectToArray = main.__get__('objectToArray');
getColumnWidths = main.__get__('getColumnWidths');

describe('Index file tests', () => {
    describe('objectToArray', () => {
        const mockObject = {
            items: [3, 13],
            prices: ['$2343.00', '$12.50'],
            animal: ['giraffe', 'Rhinoceros'],
            cars: ['Audi', 'Lamborghini'],
            flabbergasters: ['Justin Flabber', 'John']
        }
        it('should return null or empty object as an empty array', () => {
            const res = objectToArray({});
            assert.deepEqual(res, []);
        });

        it('should convert a valid object to an array', () => {
            const res = objectToArray(mockObject);

            // should be of type Array
            assert.equal(Array.isArray(res), true);

            // has headers in the 0 index
            assert.deepEqual(res[0], Object.keys(mockObject));
        });

        it('should have the right length for the array', () => {
            const res = objectToArray(mockObject);
            // array length equals headers plus longest array of object
            // headers + 2 for the array length on the object keys = 3
            assert.equal(res.length, 3);
        });

        it('should fill an array with empty string if the array is jagged', () => {
            const res = objectToArray({ ...mockObject, items: [...mockObject.items, 33] });
            assert.equal(res.length, 4);
            assert.deepEqual(res[3], [33, '', '', '', '']);
        });
    });

    describe('getColumnWidths', () => {
       const mockArray = [
            ['items', 'prices', 'animal', 'cars', 'flabbergasters'],
            [3, '$2343.00', 'giraffe', 'Audi', 'Justin Flabber'],
            [13, '$12.50', 'Rhinoceros', 'Lamborghini', 'John']
        ];

        it('should handle an empty array or undefined', () => {
            const res = getColumnWidths();
            assert.deepEqual([], res);
        });
        it('should return a width for all columns', () => {
            const res = getColumnWidths(mockArray);

            assert.deepEqual(res, [5,8,10,11,14]);
        });
    });
});