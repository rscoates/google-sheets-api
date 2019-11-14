"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const path_1 = require("path");
describe('Test the Google Sheets class', () => {
    it('should append data to a sheet', async () => {
        const sheets = new index_1.GoogleSheetsAPI(path_1.join(__dirname, '../../credentials.json'), '1tm3VUB2EoSO6pk1H0Qmjga3p-ZT3M7RPwW9b8g8Z40U');
        await sheets.initialize().catch((error) => {
            console.error('Error initializing client: ', error);
        });
        await sheets.addToCell('Global', 'B', 1, 'TEST MESSAGE');
    });
});
//# sourceMappingURL=index.test.js.map