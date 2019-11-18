export interface IGoogleSheetsAPI {
  credentials: any
  spreadsheetId: string
  batch: {
    spreadsheetId?: string,
    data: any[],
    majorDimension?: 'ROWS' | 'COLUMNS',
    range: string
  }
}