import { computed } from 'vue';
import { BMAF } from '../../constantes';
import { CRDS, readdableRound, CRDSCount } from '../../utils';
import { useCore } from './useCore';
import { FamilyPayload, FamilyReturn, Childrens } from '../../types';

export const SALARY_SUPP_TRANCHS = [19603, 39196];
export const SALARIES_SUPP_TRANCHS = [23979, 47948];
export const SALARY_SUPP_TRANCHS_PER_CHILD = 3267;
export const FAMILY_SUPLEMENT_MAX = 62.48; //1er avril 2022 au 31 mars 2023
export const FAMILY_SUPLEMENT_MIN = 41.65; //1er avril 2022 au 31 mars 2023

export function useCF(options: FamilyPayload): FamilyReturn {
    const { salaries } = useCore(options);

    const eligibleChilds = computed((): Childrens[] =>
        options.childrens.filter((child) => child.age <= 21 && child.age >= 3)
    );

    const tranch = computed((): number => {
        const tranchA = salaries.value! - customTranchRange.value[0];
        const tranchB = salaries.value! - customTranchRange.value[1];
        if (tranchB > 0) {
            return 3;
        } else if (tranchA > 0) {
            return 2;
        }
        return 1;
    });

    const customTranchMessage = computed(() => {
        const arr = [
            `Vous etes dans la tranche 1 inférieur à ${customTranchRange.value[0]}€ annuel`,
            `Vous etes dans la tranche 2 entre ${customTranchRange.value[0]}€ et ${customTranchRange.value[1]}€ annuel`,
            `Vous etes dans la tranche 3 supérieur à ${customTranchRange.value[1]}€ annuel`,
        ];
        return arr[tranch.value - 1];
    });

    const customTranchRange = computed((): number[] =>
        options.salaries.length < 2 ? SALARY_SUPP_TRANCHS : SALARIES_SUPP_TRANCHS
    );

    const childsBonus = computed(
        (): number =>
            (eligibleChilds.value.length - 3) * SALARY_SUPP_TRANCHS_PER_CHILD
    );

    const tranchMessage = computed(() => {});

    //const minSuplement = computed(() => readdableRound(BMAF * (FAMILY_SUPLEMENT_MAX / 100));
    //const minSuplement = computed(() => readdableRound(BMAF * (FAMILY_SUPLEMENT_MAX / 100));

    const total = computed((): number => {
        if (tranch.value === 1) {
            return readdableRound(BMAF * (FAMILY_SUPLEMENT_MAX / 100));
        } else if (tranch.value === 2) {
            return readdableRound(BMAF * (FAMILY_SUPLEMENT_MIN / 100));
        }
        return 0;
    });

    /**
     * Complément familial
     * Donné aux familles ayant 3 enfants agé de 3 a 21 ans
     * Soumi à lA CRDS (-0.5%)
     */
    const familySupplement = computed((): number => {
        if (eligibleChilds.value.length < 3) {
            return 0;
        }
        return readdableRound(CRDS(total.value));
    });

    const resume = computed((): string[] => {
        const messages: string[] = [];
        messages.push(customTranchMessage.value);
        if (tranch.value === 3) {
            messages.push("La tranche 3 n'est pas éligible");
            return messages;
        }
        if (eligibleChilds.value.length < 3) {
            messages.push(
                'Vous devez avoir au moins 3 enfants agé entre 3 et 21 ans'
            );
        }
        if (eligibleChilds.value.length > 2) {
            messages.push(
                `Vous avez ${eligibleChilds.value.length} enfants scolarisé, vous êtes éligibles`
            );
        }
        if (familySupplement.value) {
            messages.push(
                `${total.value}€ forfaitaire qu'importe le nombre d'enfants`
            );
            messages.push(
                `Soumis à la CRDS (0.5%) : ${total.value}€ - ${CRDSCount(total.value)}€`
            );
        }
        return messages;
    });

    return {
        sum: familySupplement,
        resume,
    };
}
