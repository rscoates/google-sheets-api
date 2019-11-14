import { columnToNumber } from '../utils'

describe('Test the utilities', () => {
  it('should return the correct column', () => {
    expect(columnToNumber('A')).toEqual(1)
    expect(columnToNumber('B')).toEqual(2)
    expect(columnToNumber('C')).toEqual(3)
    expect(columnToNumber('D')).toEqual(4)
    expect(columnToNumber('E')).toEqual(5)
    expect(columnToNumber('AA')).toEqual(27)
    expect(columnToNumber('AD')).toEqual(30)
  })
})
