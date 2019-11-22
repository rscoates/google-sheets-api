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
  batch: {
    data: any[]
    majorDimension?: 'ROWS' | 'COLUMNS'
    range: string
  }

  constructor(credentialsPath: string, spreadsheetId: string) {
    this.credentials = JSON.parse(this.getCredentials(credentialsPath))
    this.spreadsheetId = spreadsheetId
    this.initialized = false
    this.batch = {
      data: [],
      range: ''
    }
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
      spreadsheetId: this.spreadsheetId,
      // The A1 notation of the values to update.
      range: `${sheet}!${columnString}${row}`,
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

  async addToBatch(sheet: string | number, columnString: string, row: number, contentToInsert: string) {
    if (!this.batch.range) {
      this.batch.range = `${sheet}!${columnString}${row}:${columnString}${row}`
      this.batch.data = [contentToInsert]
    } else {
      const regex = /(.*)!([a-zA-Z]{1,})(\d{1,}):([a-zA-Z]{1,})(\d{1,})/
      let [_, sheetName, columnStart, rowStart, columnEnd, rowEnd] = regex.exec(this.batch.range) || []
      if(sheetName !== sheet){
        throw new Error(`Can't update multiple sheets`)
      }
      if (columnStart !== columnString) {
        if (rowStart !== `${row}`) {
          throw new Error(`Can't traverse multiple ranges`)
        }
        else {
          this.batch.majorDimension = 'COLUMNS'
        }
      }
      if(columnToNumber(columnStart) > columnToNumber(columnString)){
        columnStart = columnString
      }
      if(columnToNumber(columnEnd) < columnToNumber(columnString)){
        columnEnd = columnString
      }
      if(parseInt(rowStart) > row){
        rowStart = `${row}`
      }
      if(parseInt(rowEnd) < row){
        rowEnd = `${row}`
      }
      this.batch.range = `${sheetName}!${columnStart}${rowStart}:${columnEnd}${rowEnd}`
      this.batch.data.push(contentToInsert)
    }
  }

  async updateFromBatch() {
    const request = {
      // The ID of the spreadsheet to update.
      spreadsheetId: this.spreadsheetId,
      // The A1 notation of the values to update.
      // How the input data should be interpreted.
      valueInputOption: 'USER_ENTERED',
      resource: {
        data: {
          range: this.batch.range,
          values: this.batch.data.map((elem) => [elem]),
          majorDimension: this.batch.majorDimension || 'ROWS'
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.sheets.spreadsheets.values.batchUpdate(request, (err: Error | null, response: any) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2))
        this.batch.data = []
        this.batch.range = ''
        this.batch.majorDimension = 'ROWS'
        return resolve(response)
      })
    })
  }
}
