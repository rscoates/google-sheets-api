import * as fs from 'fs'
import { IGoogleSheetsAPI } from './types/GoogleSheetsAPI'
import { authorize, listMajors } from './quickstart'
import { columnToNumber } from './utils'
import { google } from 'googleapis'
const sheets = google.sheets('v4')

export class GoogleSheetsAPI implements IGoogleSheetsAPI {
  credentials: any
  spreadsheetId: string
  sheets: any
  initialized: boolean

  constructor(credentialsPath: string, spreadsheetId: string) {
    this.credentials = JSON.parse(this.getCredentials(credentialsPath))
    this.spreadsheetId = spreadsheetId
    this.initialized = false
  }

  async initialize() {
    if (!this.initialized) {
      await new Promise((resolve, reject) => {
        authorize(this.credentials, (auth: any) => {
          this.sheets = google.sheets({ version: 'v4', auth })
          this.initialized = true
          resolve(true)
        })
      })
    }
  }

  getCredentials(credentialsPath: string) {
    try {
      return fs.readFileSync(credentialsPath).toString()
    } catch (err) {
      console.error('Error loading client secret file:', err)
      return ''
    }
  }

  async addToCell(sheet: string | number, columnString: string, row: number, contentToInsert: string) {
    const column = columnToNumber(columnString)

    const request = {
      // The ID of the spreadsheet to update.
      spreadsheetId: this.spreadsheetId, // TODO: Update placeholder value.
      // The A1 notation of the values to update.
      range: `${sheet}!${columnString}${row}`, // TODO: Update placeholder value.
      // How the input data should be interpreted.
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[contentToInsert]]
      }
    }
    return new Promise((resolve, reject) => {
      this.sheets.spreadsheets.values.update(request, (err: Error | null, response: any) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2))
        return resolve(response)
      })
    })
  }
}
