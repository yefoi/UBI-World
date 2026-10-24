import type { Lang } from './translations'

export interface GlossaryEntry {
  id: string
  term: Record<Lang, string>
  plain: Record<Lang, string>
  example: Record<Lang, string>
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'pib',
    term: { es: 'PIB', en: 'GDP' },
    plain: {
      es: 'Todo lo que un país produce en un año: bienes y servicios. Es el tamaño de la tarta.',
      en: 'Everything a country produces in a year: goods and services. It is the size of the pie.',
    },
    example: {
      es: 'Si un país produce 100.000 millones al año, su PIB es 100.000 millones.',
      en: 'If a country produces 100 billion a year, its GDP is 100 billion.',
    },
  },
  {
    id: 'renta-basica',
    term: { es: 'Renta básica (UBI)', en: 'Basic income (UBI)' },
    plain: {
      es: 'Un pago mensual a todo el mundo, sin condiciones ni papeleo.',
      en: 'A monthly payment to everyone, with no conditions or paperwork.',
    },
    example: {
      es: 'Como si el Estado ingresara 500 $ al mes a cada persona, trabaje o no.',
      en: 'As if the state paid 500 $ a month to every person, whether they work or not.',
    },
  },
  {
    id: 'coste-vida',
    term: { es: 'Ajuste al coste de vida (PPA)', en: 'Cost-of-living adjustment (PPP)' },
    plain: {
      es: 'En unos países el dinero compra más que en otros. Ajustarlo permite comparar mejor.',
      en: 'Money buys more in some countries than others. Adjusting for that makes comparisons fairer.',
    },
    example: {
      es: '500 $ dan para más en Bolivia que en Suiza.',
      en: '500 $ go further in Bolivia than in Switzerland.',
    },
  },
  {
    id: 'gasto-publico',
    term: { es: 'Gasto público', en: 'Public spending' },
    plain: {
      es: 'El dinero que el Estado ya gasta en hospitales, escuelas, carreteras, pensiones y ayudas.',
      en: 'Money the state already spends on hospitals, schools, roads, pensions and benefits.',
    },
    example: {
      es: 'Si el Estado gasta 30 de cada 100 $ que se producen, su gasto público es el 30%.',
      en: 'If the state spends 30 out of every 100 $ produced, public spending is 30%.',
    },
  },
  {
    id: 'gasto-reaprovechado',
    term: { es: 'Gasto reaprovechado', en: 'Reused spending' },
    plain: {
      es: 'Parte del gasto que ya existe y que se cambiaría por el UBI en lugar de añadirlo.',
      en: 'Part of the spending that already exists and would be replaced by the UBI instead of added to it.',
    },
    example: {
      es: 'Si ya se pagan ayudas, se sustituyen por el UBI en vez de sumar dos pagos.',
      en: 'If benefits are already paid, the UBI replaces them instead of adding a second payment.',
    },
  },
  {
    id: 'coste-bruto',
    term: { es: 'Coste bruto', en: 'Gross cost' },
    plain: {
      es: 'Lo que costaría pagar el UBI a todos antes de reaprovechar nada.',
      en: 'What it would cost to pay the UBI to everyone before reusing anything.',
    },
    example: {
      es: 'Si pagar a todos cuesta 100 y ya se reaprovechan 20, el bruto es 100.',
      en: 'If paying everyone costs 100 and 20 is reused, the gross cost is 100.',
    },
  },
  {
    id: 'coste-neto',
    term: { es: 'Coste neto', en: 'Net cost' },
    plain: {
      es: 'Lo que queda por pagar después de reaprovechar gasto. Es el dinero realmente nuevo que hace falta.',
      en: 'What is left to pay after reusing spending. It is the genuinely new money needed.',
    },
    example: {
      es: '100 de coste bruto menos 20 reaprovechados dejan 80 de coste neto.',
      en: '100 of gross cost minus 20 reused leaves 80 of net cost.',
    },
  },
  {
    id: 'impuestos-nuevos',
    term: { es: 'Impuestos nuevos', en: 'New taxes' },
    plain: {
      es: 'Dinero adicional que se podría recaudar subiendo impuestos hasta el límite elegido.',
      en: 'Additional money that could be raised by increasing taxes up to the chosen limit.',
    },
    example: {
      es: 'Si hoy se recaudan 20 de cada 100 y el límite es 50, se podrían recaudar 30 más.',
      en: 'If 20 out of every 100 is collected today and the limit is 50, 30 more could be raised.',
    },
  },
  {
    id: 'brecha',
    term: { es: 'Brecha', en: 'Gap' },
    plain: {
      es: 'Lo que falta por conseguir después de sumar gasto reaprovechado, impuestos nuevos y dinero de la IA.',
      en: 'What is still missing after adding reused spending, new taxes and money from AI.',
    },
    example: {
      es: 'Si costaría 80 y hay 60, la brecha es 20.',
      en: 'If it would cost 80 and 60 is available, the gap is 20.',
    },
  },
  {
    id: 'ia-extra',
    term: { es: 'Producción extra de la IA', en: 'Extra AI output' },
    plain: {
      es: 'Producción adicional que la IA podría generar en este escenario. No es una previsión.',
      en: 'Additional output AI could generate in this scenario. It is not a forecast.',
    },
    example: {
      es: 'Si la IA hace que el país produzca 5 de cada 100 $ más, ese es el crecimiento extra.',
      en: 'If AI makes the country produce 5 more out of every 100 $, that is the extra growth.',
    },
  },
  {
    id: 'cobertura',
    term: { es: 'Cobertura', en: 'Coverage' },
    plain: {
      es: 'Quién recibe el UBI: solo personas adultas o también menores.',
      en: 'Who receives the UBI: only adults or children too.',
    },
    example: {
      es: 'Si los menores cobran la mitad, un UBI de 500 serían 250 por menor.',
      en: 'If children get half, a 500 UBI would be 250 per child.',
    },
  },
  {
    id: 'techo-fiscal',
    term: { es: 'Límite de impuestos', en: 'Tax limit' },
    plain: {
      es: 'El máximo de impuestos que la herramienta permite cobrar, como parte de lo que produce el país.',
      en: 'The maximum tax level the tool allows, as a share of what the country produces.',
    },
    example: {
      es: 'Con un límite del 50%, el Estado no recaudaría más de 50 de cada 100 $.',
      en: 'With a 50% limit, the state would not collect more than 50 out of every 100 $.',
    },
  },
]

export function glossaryEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY.find((entry) => entry.id === id)
}
