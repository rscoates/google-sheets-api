"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
const googleapis_1 = require("googleapis");
const path_1 = require("path");
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = '../token.json';
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs.readFile(path_1.join(__dirname, TOKEN_PATH), (err, token) => {
        if (err)
            return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
        callback(oAuth2Client);
    });
}
exports.authorize = authorize;
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(path_1.join(__dirname, TOKEN_PATH), JSON.stringify(token), err => {
                if (err)
                    return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
exports.getNewToken = getNewToken;
function listMajors(auth) {
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E'
    }, (err, res) => {
        var _a, _b;
        if (err)
            return console.log('The API returned an error: ' + err);
        const rows = ((_b = (_a = res) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.values) || [];
        if (rows.length) {
            console.log('Name, Major:');
            rows.map(row => {
                console.log(`${row[0]}, ${row[4]}`);
            });
        }
        else {
            console.log('No data found.');
        }
    });
}
exports.listMajors = listMajors;
//# sourceMappingURL=quickstart.js.map