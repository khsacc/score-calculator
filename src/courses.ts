export interface course { name: string; credit: number, semester: '2A' | '3S', required?: boolean }
export const courses2A: course[] = [
  {
    name: 'Quantum Chemistry I',
    credit: 2,
    required: true,
  },
  {
    name: 'Analytical Chemistry I',
    credit: 2,
    required: true,
  },
  {
    name: 'Organic Chemistry I',
    credit: 4,
    required: true,
  },
  {
    name: 'Inorganic Chemistry I',
    credit: 2,
    required: true,
  },
  {
    name: 'Chemical Thermodynamics I',
    credit: 2,
    required: true,
  },
  {
    name: 'Elementary Academic English for Chemistry',
    credit: 2,
  }
].map(c => ({name: c.name, credit: c.credit, semester: '2A', required: c.required || false}))

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
    credit: 3,
  },
  {
    name: 'Organic Chemistry III',
    credit: 3,
  },
  {
    name: 'Basic Academic English for Chemistry I',
    credit: 2,
  }
].map(c => ({name: c.name, credit: c.credit, semester: '3S', required: false}))