import { describe, it, expect } from 'vitest'
import { useARS } from '../../../composables/aides-familiales/useARS'

describe('Test : School allowance', () => {
  it('Familly Allowance : tranch 1 with 1 student', () => {
    const { sum } = useARS({
      salaries: [5000, 20000],
      childrens: [{ age: 2 }, { age: 3 }, { age: 8 }]
    })
    expect(sum.value).toBe(376.98)
  })

  it('Familly Allowance : tranch 2 with 2 student', () => {
    const { sum } = useARS({
      salaries: [21000, 10560],
      childrens: [{ age: 7 }, { age: 14 }]
    })
    expect(sum.value).toBe(441.42)
  })

  it('Familly Allowance : tranch 2 with 1 student', () => {
    const { sum } = useARS({
      salaries: [22000, 20000],
      childrens: [{ age: 2 }, { age: 3 }, { age: 8 }]
    })
    expect(sum.value).toBe(0)
  })

  it('Familly Allowance : tranch 1 with 2 student', () => {
    const { sum } = useARS({
      salaries: [15000, 20000],
      childrens: [{ age: 2 }, { age: 12 }, { age: 8 }]
    })
    expect(sum.value).toBe(774.75)
  })
})
