export const readdableRound = (numb: number): number =>
  Math.round(numb * 100) / 100

export const getRange = (
  value: number,
  refMin: number,
  refMax: number,
  min: number,
  max: number
) => {
  const sum = ((value - refMin) * (max - min)) / (refMax - refMin) + min
  return sum > 0 ? sum : 0
}

export const CRDSCount = (value: number): number =>
  readdableRound(value - CRDS(value))

export const CRDS = (val: number): number => val - val * (0.5 / 100)
