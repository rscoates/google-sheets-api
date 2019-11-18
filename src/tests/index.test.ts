import { GoogleSheetsAPI } from '../index'
import { join } from 'path'

describe('Test the Google Sheets class', () => {
  it('should append data to a sheet', async () => {
    const sheets = new GoogleSheetsAPI(
      join(__dirname, '../../credentials.json'),
      '1tm3VUB2EoSO6pk1H0Qmjga3p-ZT3M7RPwW9b8g8Z40U'
    )
    await sheets.initialize().catch((error) => {
      console.error('Error initializing client: ', error)
    })
    await sheets.addToCell('Global', 'B', 1, 'TEST MESSAGE')
  })
})

describe('Test the batching functionality', () => {
  it('should add new data to a batch', () => {
    const sheets = new GoogleSheetsAPI(
      join(__dirname, '../../credentials.json'),
      '1tm3VUB2EoSO6pk1H0Qmjga3p-ZT3M7RPwW9b8g8Z40U'
    )
    sheets.addToBatch('Global', 'B', 1, 'TEST MESSAGE')
    expect(sheets.batch.range = 'Global!B1:B1')
    sheets.addToBatch('Global', 'C', 1, 'TEST MESSAGE')
    expect(sheets.batch.range = 'Global!B1:C1')
  })

  it('should add a new row of data to a batch', () => {
    const sheets = new GoogleSheetsAPI(
      join(__dirname, '../../credentials.json'),
      '1tm3VUB2EoSO6pk1H0Qmjga3p-ZT3M7RPwW9b8g8Z40U'
    )
    sheets.addToBatch('Global', 'B', 1, 'TEST MESSAGE')
    expect(sheets.batch.range = 'Global!B1:B1')
    sheets.addToBatch('Global', 'B', 2, 'TEST MESSAGE')
    expect(sheets.batch.range = 'Global!B1:B2')
  })
})
