export interface course { name: string; credit: number, semester: '2A' | '3S' }
export const courses2A: course[] = [
  {
    name: 'Quantum Chemisty I',
    credit: 2,
  },
  {
    name: 'Analytical Chemisty I',
    credit: 2,
  },
  {
    name: 'Organic Chemisty I',
    credit: 4,
  },
  {
    name: 'Inorganic Chemisty I',
    credit: 2,
  },
  {
    name: 'Chemical Thermodynamics I',
    credit: 2,
  }
].map(c => ({name: c.name, credit: c.credit, semester: '2A'}))

export const courses3S: course[] = [
  {
    name: 'Organic Chemistry II',
    credit: 4,
  },
  {
    name: 'Chemical Thermodynamics II',
    credit: 2,
  },
  {
    name: 'Solid State Chemistry',
    credit: 2,
  },
  {
    name: 'Radiochemistry',
    credit: 1,
  },
  {
    name: 'Structural Chemisty',
    credit: 2,
  },
  {
    name: 'Inorganic Chemisty II',
    credit: 2,
  },
  {
    name: 'Organic Chemisty III',
    credit: 2,
  },
].map(c => ({name: c.name, credit: c.credit, semester: '3S'}))