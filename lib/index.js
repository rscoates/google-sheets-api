"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const quickstart_1 = require("./quickstart");
const utils_1 = require("./utils");
const googleapis_1 = require("googleapis");
const sheets = googleapis_1.google.sheets('v4');
class GoogleSheetsAPI {
    constructor(credentialsPath, spreadsheetId) {
        this.credentials = JSON.parse(this.getCredentials(credentialsPath));
        this.spreadsheetId = spreadsheetId;
        this.initialized = false;
        this.batch = {
            data: [],
            range: ''
        };
    }
    async initialize() {
        if (!this.initialized) {
            await new Promise((resolve, reject) => {
                quickstart_1.authorize(this.credentials, (auth) => {
                    this.sheets = googleapis_1.google.sheets({ version: 'v4', auth });
                    this.initialized = true;
                    resolve(true);
                });
            });
        }
    }
    getCredentials(credentialsPath) {
        try {
            return fs.readFileSync(credentialsPath).toString();
        }
        catch (err) {
            console.error('Error loading client secret file:', err);
            return '';
        }
    }
    async addToCell(sheet, columnString, row, contentToInsert) {
        const column = utils_1.columnToNumber(columnString);
        const request = {
            spreadsheetId: this.spreadsheetId,
            range: `${sheet}!${columnString}${row}`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[contentToInsert]]
            }
        };
        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.values.update(request, (err, response) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                console.log(JSON.stringify(response, null, 2));
                return resolve(response);
            });
        });
    }
    async addToBatch(sheet, columnString, row, contentToInsert) {
        if (!this.batch.range) {
            this.batch.range = `${sheet}!${columnString}${row}:${columnString}${row}`;
            this.batch.data = [contentToInsert];
        }
        else {
            const regex = /(.*)!([a-zA-Z]{1,})(\d{1,}):([a-zA-Z]{1,})(\d{1,})/;
            let [_, sheetName, columnStart, rowStart, columnEnd, rowEnd] = regex.exec(this.batch.range) || [];
            if (sheetName !== sheet) {
                throw new Error(`Can't update multiple sheets`);
            }
            if (columnStart !== columnString) {
                if (rowStart !== `${row}`) {
                    throw new Error(`Can't traverse multiple ranges`);
                }
                else {
                    this.batch.majorDimension = 'COLUMNS';
                }
            }
            if (utils_1.columnToNumber(columnStart) > utils_1.columnToNumber(columnString)) {
                columnStart = columnString;
            }
            if (utils_1.columnToNumber(columnEnd) < utils_1.columnToNumber(columnString)) {
                columnEnd = columnString;
            }
            if (parseInt(rowStart) > row) {
                rowStart = `${row}`;
            }
            if (parseInt(rowEnd) < row) {
                rowEnd = `${row}`;
            }
            this.batch.range = `${sheetName}!${columnStart}${rowStart}:${columnEnd}${rowEnd}`;
            this.batch.data.push(contentToInsert);
        }
    }
    async updateFromBatch() {
        const request = {
            spreadsheetId: this.spreadsheetId,
            valueInputOption: 'USER_ENTERED',
            resource: {
                range: this.batch.range,
                values: [this.batch.data],
                majorDimension: this.batch.majorDimension || 'ROWS'
            }
        };
        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.values.batchUpdate(request, (err, response) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                console.log(JSON.stringify(response, null, 2));
                this.batch.data = [];
                this.batch.range = '';
                return resolve(response);
            });
        });
    }
}
exports.GoogleSheetsAPI = GoogleSheetsAPI;
//# sourceMappingURL=index.js.map