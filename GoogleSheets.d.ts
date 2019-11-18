declare module 'google-sheets' {
  export class GoogleSheetsAPI {
    constructor(credentialsPath: string, spreadsheetId: string)
    initialize(): Promise<void>
    addToCell(sheet: string, columnString: string, row: number, contentToInsert: string): Promise<any>
    addToBatch(sheet: string, columnString: string, row: number, contentToInsert: string): Promise<any>
    updateFromBatch(): Promise<void>
  }
}