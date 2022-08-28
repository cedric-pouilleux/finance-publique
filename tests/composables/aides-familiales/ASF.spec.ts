import { describe, it, expect } from 'vitest';
import { useASF } from '../../../composables/aides-familiales/useASF';

/**
 * ASF unit testing
 */
describe('Test : ASF', () => {
    it('Familly Allowance : none with 2 salaries', () => {
        const { sum } = useASF({
            salaries: [35000, 20000],
            childrens: [{ age: 5 }],
        });
        expect(sum.value).toBe(0);
    });

    it('Familly Allowance : with 1 children', () => {
        const { sum } = useASF({
            salaries: [35000],
            childrens: [{ age: 5 }],
        });
        expect(sum.value).toBe(118.2);
    });

    it('Familly Allowance : with 3 children', () => {
        const { sum } = useASF({
            salaries: [35000],
            childrens: [{ age: 5 }, { age: 7 }, { age: 8 }],
        });
        expect(sum.value).toBe(354.58);
    });
});
