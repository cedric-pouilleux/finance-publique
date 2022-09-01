import { computed } from 'vue'
import { SMIC, CHILD_SALARY } from '../../constantes'
import { FamilyAllowanceCoreReturn, FamilyOptionalPayload, Childrens } from '../../types'

export const TRANCHS = [70074, 93399]
export const TRANCHS_PER_CHILD = 5839

export function useCore (
  options: FamilyOptionalPayload
): FamilyAllowanceCoreReturn {
  /**
     * Nombre d'enfants
     * à charge si l'enfant à moins de 20 ans
     * Si le salaire de l'enfant n'excede pas 78% du SMIC net
     */
  const childrens = computed((): Childrens[] | undefined =>
    options.childrens?.filter(
      child =>
        !(!child.age ||
            child.age >= 20 ||
            (child.salary &&
                child.salary > SMIC.NET_YEAR * (CHILD_SALARY / 100)))
    )
  )

  const salaries = computed((): number | undefined =>
    options.salaries?.reduce((a, salary) => a + salary)
  )

  // Adjust cap tranch for family allowance
  const customTranch = computed((): { start: number; end: number } => {
    const childAjust = (childrens.value!.length - 2) * TRANCHS_PER_CHILD
    return {
      start: TRANCHS[0] + childAjust,
      end: TRANCHS[1] + childAjust
    }
  })

  /**
     * Dépend de la tranche de revenu du foyé
     * De 70 074 € à 93 399 € = divisé par 2
     * Supérieur à 93 399 € = divisé par 4
     */
  const resourcesTranch = computed((): number => {
    const { start, end } = customTranch.value
    const tranchA = salaries.value! - start
    const tranchB = salaries.value! - end
    if (tranchB > 0) {
      return 4
    } else if (tranchA > 0) {
      return 2
    }
    return 0
  })

  const teenage = computed((): Childrens[] | undefined =>
    childrens.value?.filter(child => child.age >= 14 && child.age <= 20)
  )

  return { childrens, salaries, customTranch, resourcesTranch, teenage }
}
