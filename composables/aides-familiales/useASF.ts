import { computed } from 'vue';
import { BMAF } from '../../constantes';
import { CRDS, readdableRound } from '../../utils';
import { useCore } from './useCore';
import { FamilyPayload, FamilyReturn } from '../../types';

export const ASF_PARTIAL = 28.13; //1er avril 2022 au 31 mars 2023

export function useASF(options: FamilyPayload): FamilyReturn {
    const { childrens } = useCore(options);

    const singleSalary = computed((): boolean => options.salaries.length < 2);

    const CRDSCount = computed((): number =>
        readdableRound(ASF.value - CRDS(ASF.value))
    );

    /**
     * ASF (Allocation de soutien familial)
     * Complément pour parent isolé
     * Taux plein: 37.5% BMAF si l'enfant est orphelin de père et de mère
     * Taux partiel : 28.13% BMAF si l'enfant est orphelin de père ou de mère
     * @TODO => Add ASF full
     */
    const ASF = computed((): number => {
        const sum = CRDS(total.value);
        return readdableRound(sum);
    });

    const total = computed(() => {
        if (!singleSalary.value || childrens.value!.length === 0) {
            return 0;
        }
        const sum = BMAF * (ASF_PARTIAL / 100) * childrens.value!.length;
        return readdableRound(sum);
    });

    const sumBMAF = computed((): number =>
        readdableRound(BMAF * (ASF_PARTIAL / 100))
    );

    const resume = computed(() => {
        const messages: string[] = [];
        if (!singleSalary.value || !childrens.value!.length) {
            messages.push(
                "Vous ne pouvez pas bénéficier de l'allocation parent isolé"
            );
            return messages;
        }
        if (ASF.value) {
            messages.push(`${ASF_PARTIAL}% de ${BMAF}€ (BMAF)`);
            messages.push(
                `${sumBMAF.value}€ * ${childrens.value!.length} enfants éligibles`
            );
            messages.push(
                `Soumis à la CRDS (0.5%) ${total.value}€ - ${CRDSCount.value}€`
            );
        }
        return messages;
    });

    return {
        sum: ASF,
        resume,
    };
}
