import { ComputedRef } from 'vue';

export type Childrens = {
    age: number;
    salary?: number;
};

export interface FamilyAllowanceCoreReturn {
    childrens: ComputedRef<Childrens[] | undefined>;
    salaries: ComputedRef<number | undefined>;
    resourcesTranch: ComputedRef<number | undefined>;
    customTranch: ComputedRef<{ start: number; end: number }>;
    teenage: ComputedRef<Childrens[] | undefined>;
}

export interface FamilyOptionalPayload {
    salaries?: number[];
    childrens?: Childrens[];
}

export interface FamilyPayload {
    salaries: number[];
    childrens: Childrens[];
}

export interface FamilyReturn {
    sum: ComputedRef<number>;
    informations?: ComputedRef<string[]>;
    resume?: ComputedRef<string[]>;
}
