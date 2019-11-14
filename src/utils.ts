export function columnToNumber(column: string){
  const stringLength = column.length
  let output: number = 0
  for(let i = stringLength - 1 ; i >= 0; i--){
    const j = stringLength - 1 - i;
    output += 26**j + letterToNumber(column[i])
  }
  return output
}

function letterToNumber(s: string){
  if(s.length > 1){
    console.error(`Can't convert multiple letters at once`)
  }
  return s.toUpperCase().charCodeAt(0) - 65
}
