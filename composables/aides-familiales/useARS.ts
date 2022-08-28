import { computed } from 'vue';
import { BMAF } from '../../constantes';
import { CRDS, readdableRound, CRDSCount } from '../../utils';
import { useCore } from './useCore';
import { FamilyPayload, FamilyReturn, Childrens } from '../../types';

//1er avril 2022 au 31 mars 2023
type SchoolRate = {
    age: number[];
    rate: number;
};

export const SCHOOL_RATE: SchoolRate[] = [
    { age: [6, 10], rate: 89.72 },
    { age: [11, 14], rate: 94.67 },
    { age: [15, 18], rate: 97.95 },
];
export const CHILD_SALARY = 78;
export const SCHOOL_PRIME_TRANCHS = 25370;
export const SCHOOL_TRANCHS_PER_CHILD = 5855;

export function useARS(options: FamilyPayload): FamilyReturn {
    const { childrens, salaries } = useCore(options);

    const students = computed(() =>
        options.childrens.filter(
            (child) => child.age <= 18 && child.age >= 6 && !child.salary
        )
    );

    function studentRate(student: Childrens): string {
        let childMessage: string = '';
        SCHOOL_RATE.forEach((item) => {
            if (student.age >= item.age[0] && student.age <= item.age[1]) {
                childMessage = `1 enfant entre ${item.age[0]} et ${item.age[1]} ans : + ${item.rate}% majoré`;
            }
        });
        return childMessage;
    }

    const allStudentsRateMessage = computed((): string[] =>
        students.value.map((student) => studentRate(student))
    );

    const rate = computed(() =>
        students.value.reduce((acc, child) => {
            const matched = SCHOOL_RATE.find(
                (item) => child.age >= item.age[0] && child.age <= item.age[1]
            );
            return matched ? readdableRound(acc + matched.rate) : readdableRound(acc);
        }, 0)
    );

    const maxSalary = computed(
        (): number =>
            SCHOOL_PRIME_TRANCHS +
            SCHOOL_TRANCHS_PER_CHILD * (childrens.value!.length - 1)
    );

    const sum = computed((): number => readdableRound(BMAF * (rate.value / 100)));

    const adjustedCap = computed((): number => sum.value + maxSalary.value);

    const differential = computed((): number => {
        if (adjustedCap.value > salaries.value!) {
            return readdableRound(adjustedCap.value - salaries.value!);
        }
        return 0;
    });

    const isAdoveCeiling = computed(
        (): boolean => salaries.value! > maxSalary.value
    );

    /**
     * Allocation Rentré Scolaire
     */
    const schoolAllowance = computed((): number => {
        if (!childrens.value && !salaries.value && students.value.length < 1) {
            return 0;
        }
        const result = isAdoveCeiling.value ? differential.value : sum.value;
        return readdableRound(CRDS(result));
    });

    const resume = computed((): string[] => {
        const messages: string[] = [];

        if (!students.value.length) {
            messages.push(`Vous avez avoir un enfant scolarisé`);
            return messages;
        }

        if (isAdoveCeiling.value) {
            if (differential.value !== 0) {
                messages.push(
                    `Vous dépassez de peu le plafond, vous bénéficier de l'ARS différenciel`,
                    `Nouveau plafond (${adjustedCap.value}€) - ressources (${salaries.value}€)`,
                    `Soumis à la CRDS (0.5%) : ${differential.value}€ - ${CRDSCount(
                        differential.value
                    )}€ `
                );
            } else {
                messages.push(
                    `Vos ressources sont de ${salaries.value}€ et le plafond ${maxSalary.value}€`,
                    `Vous ne pouvez pas prétendre à l'allocation scolaire`
                );
            }
            return messages;
        }

        if (students.value.length) {
            messages.push(`Vous avez ${students.value.length} enfants scolarisés`);
            allStudentsRateMessage.value.forEach((item) => messages.push(item));
            messages.push(`${rate.value}% de ${BMAF}€ (BMAF)`);
            messages.push(
                `Soumis à la CRDS (0.5%) : ${sum.value}€ - ${CRDSCount(
                    sum.value
                )}€ par an`
            );
        } else {
            messages.push(
                'Il faut au moins 1 enfant scolarisé de 6 à 18 ans pour etre éligible'
            );
        }
        return messages;
    });

    return {
        sum: schoolAllowance,
        resume,
    };
}
