import { describe, it, expect } from 'vitest'
import { useCF } from '../../../composables/aides-familiales/useCF'

/**
 * Family suplement
 */
describe('Test : Familly Supplement', () => {
  it('Familly Supplement : with 1 salary tranch 1 and 3 childrens', () => {
    const { sum } = useCF({
      salaries: [15000, 0],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(262.52)
  })

  it('Familly Supplement : with 1 salary tranch 2 and 3 childrens', () => {
    const { sum } = useCF({
      salaries: [25000, 0],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(175)
  })

  it('Familly Supplement : with 1 salary tranch 2 and 2 childrens with more 14', () => {
    const { sum } = useCF({
      salaries: [25000, 0],
      childrens: [{ age: 16 }, { age: 15 }, { age: 10 }]
    })
    expect(sum.value).toBe(175)
  })

  it('Familly Supplement : with 2 salary tranch 1 and 3 childrens', () => {
    const { sum } = useCF({
      salaries: [10000, 12000],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(262.52)
  })

  it('Familly Supplement : with 2 salary tranch 2 and 3 childrens', () => {
    const { sum } = useCF({
      salaries: [20000, 12000],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(175)
  })

  it('Familly Supplement : with 2 salary tranch 2 and 4 childrens', () => {
    const { sum } = useCF({
      salaries: [22000, 12000],
      childrens: [{ age: 5 }, { age: 8 }, { age: 10 }]
    })
    expect(sum.value).toBe(175)
  })
})
