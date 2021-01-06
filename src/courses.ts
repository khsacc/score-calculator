export interface course { name: string; credit: number, semester: '2A' | '3S' }
export const courses2A: course[] = [
  {
    name: 'Quantum Chemistry I',
    credit: 2,
  },
  {
    name: 'Analytical Chemistry I',
    credit: 2,
  },
  {
    name: 'Organic Chemistry I',
    credit: 4,
  },
  {
    name: 'Inorganic Chemistry I',
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
    name: 'Structural Chemistry',
    credit: 2,
  },
  {
    name: 'Inorganic Chemistry II',
    credit: 2,
  },
  {
    name: 'Quantum Chemistry II', 
    credit: 2,
  },
  {
    name: 'Organic Chemistry III',
    credit: 2,
  },
].map(c => ({name: c.name, credit: c.credit, semester: '3S'}))