"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function columnToNumber(column) {
    const stringLength = column.length;
    let output = 0;
    for (let i = stringLength - 1; i >= 0; i--) {
        const j = stringLength - 1 - i;
        output += 26 ** j + letterToNumber(column[i]);
    }
    return output;
}
exports.columnToNumber = columnToNumber;
function letterToNumber(s) {
    if (s.length > 1) {
        console.error(`Can't convert multiple letters at once`);
    }
    return s.toUpperCase().charCodeAt(0) - 65;
}
//# sourceMappingURL=utils.js.map