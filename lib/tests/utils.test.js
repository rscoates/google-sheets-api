"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('Test the utilities', () => {
    it('should return the correct column', () => {
        expect(utils_1.columnToNumber('A')).toEqual(1);
        expect(utils_1.columnToNumber('B')).toEqual(2);
        expect(utils_1.columnToNumber('C')).toEqual(3);
        expect(utils_1.columnToNumber('D')).toEqual(4);
        expect(utils_1.columnToNumber('E')).toEqual(5);
        expect(utils_1.columnToNumber('AA')).toEqual(27);
        expect(utils_1.columnToNumber('AD')).toEqual(30);
    });
});
//# sourceMappingURL=utils.test.js.map