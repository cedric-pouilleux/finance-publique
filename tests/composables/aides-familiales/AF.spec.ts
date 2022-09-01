import { describe, it, expect } from 'vitest'
import { useAF } from '../../../composables/aides-familiales/useAF'

/**
 * Family Allowance unit testing
 */
describe('Test : Familly Allowance', () => {
  it('Familly Allowance : with one children and tranch 1', () => {
    const { sum } = useAF({
      salaries: [35000, 20000],
      childrens: [{ age: 5 }]
    })
    expect(sum.value).toBe(0)
  })

  it('Familly Allowance : with 2 childrens and tranch 1', () => {
    const { sum } = useAF({
      salaries: [35000, 0],
      childrens: [{ age: 5 }, { age: 8 }]
    })
    expect(sum.value).toBe(134.45)
  })

  it('Familly Allowance : with 2 childrens and tranch 2, with declining supplement', () => {
    const { sum } = useAF({
      salaries: [70150, 0],
      childrens: [{ age: 14 }, { age: 16 }]
    })
    expect(sum.value).toBe(94.53)
  })

  it('Familly Allowance : with 2 childrens and tranch 3, with declining supplement', () => {
    const { sum } = useAF({
      salaries: [93600, 0],
      childrens: [{ age: 14 }, { age: 16 }]
    })
    expect(sum.value).toBe(33.75)
  })

  it('Familly Allowance : with 3childrens and tranch 1, with declining supplement', () => {
    const { sum } = useAF({
      salaries: [15000, 0],
      childrens: [{ age: 5 }, { age: 20 }, { age: 13 }]
    })
    expect(sum.value).toBe(219.04)
  })

  it('Familly Allowance : with 2 childrens and tranch 2', () => {
    const { sum } = useAF({
      salaries: [52000, 20000],
      childrens: [{ age: 5 }, { age: 8 }]
    })
    expect(sum.value).toBe(67.23)
  })

  it('Familly Allowance : with 3 childrens and tranch 1', () => {
    const { sum } = useAF({
      salaries: [35000, 20000],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(306.72)
  })

  it('Familly Allowance : with 6 childrens and tranch 1', () => {
    const { sum } = useAF({
      salaries: [35000, 20000],
      childrens: [
        { age: 5 },
        { age: 8 },
        { age: 10 },
        { age: 12 },
        { age: 15 },
        { age: 16 }
      ]
    })
    expect(sum.value).toBe(957.99)
  })

  it('Familly Allowance : with 3 childrens and tranch 2', () => {
    const { sum } = useAF({
      salaries: [45000, 40000],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(153.36)
  })

  it('Familly Allowance : with 3 childrens and tranch 3', () => {
    const { sum } = useAF({
      salaries: [105000, 20000],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(76.68)
  })

  it('Familly Allowance : with 3 childrens and one teenage (one 14 more) and tranch 3', () => {
    const { sum } = useAF({
      salaries: [105000, 20000],
      childrens: [{ age: 5 }, { age: 8 }, { age: 15 }]
    })
    expect(sum.value).toBe(93.49)
  })

  it('Familly Allowance : with 2 childrens and one with salary more than 78% of SMIC', () => {
    const { sum } = useAF({
      salaries: [12000, 10000],
      childrens: [{ age: 10 }, { age: 16, salary: 18000 }]
    })
    expect(sum.value).toBe(0)
  })

  it('Familly Allowance : with 2 childrens and one with salary lesss than 78% of SMIC', () => {
    const { sum } = useAF({
      salaries: [12000, 12000],
      childrens: [{ age: 10 }, { age: 16, salary: 12050 }]
    })
    expect(sum.value).toBe(134.45)
  })
})
