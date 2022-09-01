import { computed } from 'vue'
import { BMAF, SMIC, CHILD_SALARY } from '../../constantes'
import { readdableRound, CRDS, CRDSCount } from '../../utils'
import { FamilyPayload, FamilyReturn, Childrens } from '../../types'
import { useCore } from './useCore'

// Global rate for family allowance rate
export const RATE_CHILDREN = {
  ageIncrease: 16, // Increase for more 14 year
  increase: 41, // Increase rate per child
  start: 32 // Start rate after 2 childs
}

export const LUMP_SUM_ALLOWANCE = 20.234 // 1er avril 2022 au 31 mars 2023

export function useAF (options: FamilyPayload): FamilyReturn {
  const { childrens, salaries, customTranch, resourcesTranch, teenage } =
        useCore(options)

  /**
     * Complément dégressif
     * Quand les ressources dépassent de peu le plafond
     */
  const decliningSupplement = function (allowance: number) {
    const { start, end } = customTranch.value
    const tranchA = salaries.value! - start
    const tranchB = salaries.value! - end
    if (tranchB > 0) {
      if (allowance * 12 > tranchB) {
        return (end + 12 * allowance - salaries.value!) / 12
      }
    } else if (tranchA > 0) {
      if (allowance * 12 > tranchA) {
        return (start + 12 * allowance - salaries.value!) / 12
      }
    }
    return allowance
  }

  // exception for childrens majorate
  const teenagesExpection = computed((): boolean => {
    if (childrens.value!.length <= 2) {
      return teenage.value?.length === 2
    }
    return false
  })

  const teenagesCanceled = computed(
    (): boolean => childrens.value!.length <= 2 && teenage.value?.length === 1
  )

  /**
     * Versé à partir de deux enfants
     * 2 enfants : 32% de BMAF
     * 3 enfants : 73% de BMAF
     * Pour chaques enfants supplémentaires : 41% BMAF
     * Majoration pour chaques enfants à partir de 14 ans : 16% BMAF
     * La majoration + 14 ans pour 2 enfants ne s'applique pas pour l'ainé
     */
  const familyAllowanceBMAFRate = computed((): number => {
    if (childrens.value!.length < 2) {
      return 0
    }
    if (childrens.value!.length <= 2) {
      return teenage.value?.length === 2
        ? totalRate.value + RATE_CHILDREN.ageIncrease
        : totalRate.value
    }
    return (
      totalRate.value + (teenage.value?.length || 0) * RATE_CHILDREN.ageIncrease
    )
  })

  const sumWithoutTranch = computed(() =>
    readdableRound(BMAF * (familyAllowanceBMAFRate.value / 100))
  )

  const totalRate = computed(() =>
        childrens.value!.reduce(
          (acc, _, index) => (index < 2 ? acc : acc + 41),
          RATE_CHILDREN.start
        )
  )

  const progressRate = computed((): string => {
    const progress = []
    for (let i = 0; i < childrens.value!.length; i++) {
      if (i === 1) {
        progress.push(32)
      } else if (i > 1) {
        progress.push(41)
      }
    }
    return progress.map(item => `${item}%`).join(' + ')
  })

  const sumWithTranch = computed((): number =>
    readdableRound(
      resourcesTranch.value === 0
        ? sumWithoutTranch.value
        : decliningSupplement(sumWithoutTranch.value / resourcesTranch.value!)
    )
  )

  const childsWith20 = computed((): Childrens[] | undefined =>
    options.childrens?.filter(child => child.age === 20)
  )

  const currentTranch = computed((): number => {
    switch (resourcesTranch.value) {
      case 0:
        return 1
      case 2:
        return 2
      case 4:
        return 3
    }
    return 0
  })

  const currentTranchMessage = computed((): string => {
    const arr = [
            `inférieur à ${customTranch.value.start}€ annuel`,
            `entre ${customTranch.value.start}€ et ${customTranch.value.end}€ annuel`,
            `supérieur à ${customTranch.value.end}€ annuel`
    ]
    return arr[currentTranch.value - 1]
  })

  const sumLumpSumAllowances = computed((): number =>
    readdableRound(BMAF * (LUMP_SUM_ALLOWANCE / 100))
  )

  /**
     * Allocation forfaitaire
     * Permet de couvrir une partie de la perte engendré par une enfant qui atteint ses 20 ans.
     * 20.234% BMAF, subit un plafonnement semblable au allocations familliales par tranches
     * Soumis à la CRDS (0.5%)
     * @Todo => Mettre dans allocations familiale ?
     */
  const lumpSumAllowances = computed((): number => {
    const childrens = options.childrens?.filter(
      child =>
        !(!child.age ||
                    child.age >= 21 ||
                    (child.salary &&
                        child.salary > SMIC.NET_YEAR * (CHILD_SALARY / 100)))
    )
    if (!childsWith20.value?.length || (childrens && childrens.length < 3)) {
      return 0
    }
    const adjustedSum =
            resourcesTranch.value === 0
              ? sumLumpSumAllowances.value
              : sumLumpSumAllowances.value / resourcesTranch.value!
    return readdableRound(CRDS(adjustedSum))
  })

  /**
     * Allocation familiale
     * Repose sur BMAF (Base mensuelle de calcul des allocations familiales) (422.28€)
     * Soumi à la CRDS (-0.5%)
     */
  const familyAllowance = computed((): number => {
    const withCRDS = CRDS(sumWithTranch.value + lumpSumAllowances.value)
    return readdableRound(withCRDS)
  })

  // resume informations
  const resume = computed((): string[] => {
    const messages: string[] = []
    messages.push(`Vous etes dans la tranche ${currentTranch.value} ${currentTranchMessage.value}`)
    if (currentTranch.value > 1 && sumWithoutTranch.value > 0) {
      messages.push(
          `Tranche ${currentTranch.value} : Minoré de ${sumWithoutTranch.value}€ / ${resourcesTranch.value}  = ${sumWithTranch.value}€`
      )
    }
    if (childrens.value!.length < 2) {
      messages.push('Il faut au moin 2 enfants à charge pour bénéficier de l\'allocation familiale')
    } else {
      messages.push(`${childrens.value!.length} enfants à charge (${progressRate.value})`)
    }

    if (lumpSumAllowances.value) {
      messages.push(
        'Vous avez un enfant de 20 ans et bénéficiez de l\'allocation forfaitaire',
          `${LUMP_SUM_ALLOWANCE}% de ${BMAF}€ (BMAF) = ${lumpSumAllowances.value}€`
      )
    } else if (teenage.value?.length) {
      if (teenagesExpection.value) {
        messages.push(
          'Si vous avez 2 enfants et qu\'ils ont tous les deux 14 ans, l\'ainé est exclue de la majoration'
        )
      }
      if (!teenagesCanceled.value) {
        messages.push(
            `${teenage.value.length} enfants à charge de plus de 14 ans (${teenagesExpection.value ? 1 : teenage.value.length} * ${RATE_CHILDREN.ageIncrease}%)`
        )
      }
    }

    if (sumWithTranch.value > 0) {
      messages.push(`${familyAllowanceBMAFRate.value}% de ${BMAF}€ (BMAF)`)
      messages.push(`Soumis à la CRDS (0.5%) : ${sumWithTranch.value}€ - ${CRDSCount(sumWithTranch.value)}€`)
    }

    return messages
  })

  return {
    sum: familyAllowance,
    resume
  }
}
