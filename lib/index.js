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
}
exports.GoogleSheetsAPI = GoogleSheetsAPI;
//# sourceMappingURL=index.js.map