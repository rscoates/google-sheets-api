import {GoogleSheetsAPI} from "./index";
import {join} from "path";

async function go(){
  const sheets = new GoogleSheetsAPI(
    join(__dirname, '../credentials.json'),
    '1tm3VUB2EoSO6pk1H0Qmjga3p-ZT3M7RPwW9b8g8Z40U'
  )
  await sheets.initialize()
  sheets.addToCell('Sheet1', 'B', 1, 'TEST MESSAGE')
}

go()