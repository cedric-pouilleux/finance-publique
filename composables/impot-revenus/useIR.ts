import { computed, ComputedRef } from 'vue'
import { readdableRound } from '~/utils'

interface ITranch {
    max: number;
    percent: number;
}

export const TRANCHS: ITranch[] = [
  { max: 10225, percent: 0 },
  { max: 26070, percent: 0.11 },
  { max: 74545, percent: 0.3 },
  { max: 160336, percent: 0.41 },
  { max: 10000000, percent: 0.45 }
]

export const TRANCHS_2023: ITranch[] = [
  { max: 10777, percent: 0 },
  { max: 27478, percent: 0.11 },
  { max: 78570, percent: 0.3 },
  { max: 168994, percent: 0.41 },
  { max: 10000000, percent: 0.45 }
]

interface useIncomeTaxOptions {
    salaries: Array<number>;
    childrens: number;
}

interface useIncomeTaxTypeReturn {
    readonly calculate: ComputedRef<number>;
    readonly salaryPercent: ComputedRef<number>;
    readonly salaries: ComputedRef<number>;
    readonly parts: ComputedRef<number>;
}

export function useIR (options: useIncomeTaxOptions): useIncomeTaxTypeReturn {
  const salaries = computed((): number =>
    options.salaries.reduce((acc, value) => acc + value)
  )

  /**
     * Parts du foyé
     * 1 adulte vaut 1 part
     * 1 enfant vaut 0.5 part
     */
  const parts = computed(() => options.salaries.length + options.childrens / 2)

  const calculate = computed((): number => {
    let impot = 0
    let onTranch
    let baseSalary = salaries.value / parts.value
    TRANCHS.forEach((item) => {
      if (baseSalary >= item.max) {
        onTranch = item.max
        impot += onTranch * item.percent
        baseSalary = baseSalary - item.max
      } else if (baseSalary < item.max) {
        impot += baseSalary * item.percent
        baseSalary = 0
      }
    })
    if (baseSalary > 0) {
      // pourquoi ?
      impot += baseSalary * 0.45
    }
    return readdableRound(impot * parts.value)
  })

  /**
   * IR en pourcentage du salaire
   */
  const salaryPercent = computed((): number =>
    readdableRound((calculate.value / salaries.value) * 100)
  )

  return {
    calculate,
    salaryPercent,
    salaries,
    parts
  }
}
