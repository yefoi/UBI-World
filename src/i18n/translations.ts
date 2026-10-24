export const es = {
  title: 'UBI World',
  subtitle: '¿Qué haría falta para pagar una renta básica a todo el mundo?',
  description:
    'Una calculadora para entender, país a país, qué haría falta para pagar una renta básica universal. No es una predicción: es un juego de supuestos con las cartas boca arriba.',

  // Búsqueda y navegación
  searchCountry: 'Busca un país',
  noResults: 'No encontramos ese país',
  metric: 'Qué muestra el mapa',
  category: 'Si se podría pagar',
  gap: 'Lo que faltaría',
  metricGap: 'Lo que faltaría por conseguir',
  metricCost: 'Lo que costaría pagarlo',
  metricNeeded: 'Cuánta IA extra haría falta',
  legend: 'Qué significan los colores',
  legendHint: 'Toca un país del mapa para ver su explicación',
  noData: 'Sin datos suficientes',
  noDataDesc:
    'Al Banco Mundial le faltan datos de este país. No nos los hemos inventado: por eso aparece en gris.',
  methodology: 'Cómo se calcula',
  disclaimer:
    'Esta web no predice el futuro. Solo enseña qué supuestos harían falta para que las cuentas salgan y cómo cambian al moverlos.',

  // Categorías
  viableNow: 'Se podría pagar hoy',
  viableModerate: 'Faltaría poco o lo cubre la IA',
  extremeAI: 'Haría falta mucha IA',
  notViable: 'No cuadra ni con mucha IA',
  legendViableNow: 'Se podría pagar hoy',
  legendViableModerate: 'Faltaría poco (o lo cubre la IA)',
  legendExtremeAI: 'Haría falta mucha IA',
  legendNotViable: 'No cuadra ni con mucha IA',
  legendNoData: 'Sin datos suficientes',

  // Resumen
  noSelectionTitle: 'Elige un país',
  noSelectionHint: 'Búscalo arriba o toca el mapa para ver cuánto costaría y qué faltaría.',
  close: 'Cerrar',
  summaryIncome: 'Al mes, por adulto',
  summaryCost: 'Coste de pagarlo',
  summaryGap: 'Lo que faltaría',
  summaryCovered: 'No falta nada',
  nominalApprox: '≈ {value} $ al mes',
  grossShort: 'Antes de reaprovechar gasto: {value}',
  grossCost: 'Coste bruto',
  netCost: 'Coste neto',
  fiscalMargin: 'Impuestos nuevos',
  aiIncome: 'Dinero de la IA',
  gapTotal: 'Lo que faltaría',
  aiGrowthNeeded: 'Cuánta IA extra haría falta',
  perMonth: 'mes',
  perYear: 'año',
  perMonthPpp: '$ PPA al mes',
  perMonthNominal: '$ al mes',
  perYearNominal: '$ al año',
  perAdultNote: '(≈ {value} {unit} por adulto)',
  ofGdp: 'de lo que produce el país',
  coveredWord: 'cubierta',

  // Frase-resumen dinámica
  plainSummaryCost:
    'De cada 100 $ que produce el país en un año, pagar el UBI costaría unos {cost} $.',
  plainSummaryFunding:
    'Ese dinero podría salir de {replaced} $ de gasto que ya existe, {margin} $ de impuestos nuevos y {ai} $ de la IA.',
  plainSummaryGap: 'Aun así, faltarían {gap} $ de cada 100.',
  plainSummaryCovered: 'Y no faltaría nada: sobrarían {surplus} $ de cada 100.',

  // Motivo de la categoría
  reasonCoveredNow: 'Con estos ajustes, las cuentas salen sin necesidad de más IA.',
  reasonCoveredWithAi: 'Las cuentas salen gracias a la producción extra de la IA.',
  reasonModerate:
    'Faltarían {gap} de cada 100 $ producidos. Con la IA actual, el país tendría que producir {needed} de cada 100 $ más: algo moderado.',
  reasonExtreme:
    'Faltarían {gap} de cada 100 $ producidos. Haría falta que el país produjera {needed} de cada 100 $ más gracias a la IA: mucha IA.',
  reasonBeyond:
    'Faltarían {gap} de cada 100 $ producidos. Haría falta un {needed}% más de producción por IA, por encima de lo que esta herramienta considera razonable.',
  reasonNoCapture:
    'Así no puede salir: el Estado no se queda nada de lo que produce la IA. En modo Completo puedes subir la captación o la producción nacional.',
  impossibleShort: 'No se puede cerrar por esta vía',

  // Financiación y pasos
  fundingTitle: 'De dónde saldría el dinero',
  fundingSubtitle:
    'Lo que costaría pagarlo a todos se reparte entre gasto reaprovechado, impuestos nuevos, IA y lo que faltaría.',
  howCalculated: 'Los números por dentro',
  fundingReplaced: 'Gasto reaprovechado',
  fundingMargin: 'Impuestos nuevos',
  fundingAi: 'IA',
  fundingGap: 'Faltaría',
  surplus: 'Con estos ajustes sobrarían {value} de cada 100 $.',
  stepPeople: 'Quién cobra y cuánto',
  stepGross: 'Lo que costaría pagarlo a todos',
  stepReplace: 'Gasto que ya existe y se reaprovecha',
  stepMargin: 'Impuestos nuevos hasta el límite',
  stepAi: 'Dinero de la producción extra de la IA',
  stepGap: 'Lo que faltaría',
  stepNeeded: 'Cuánta IA extra haría falta',
  stepNeededNone: 'No hace falta IA extra: las cuentas ya salen.',
  stepNeededImpossible:
    'Así no se puede cerrar la diferencia: el Estado no se queda nada de la producción extra de la IA.',
  stepReplaceText:
    'El {substitution}% de {govExp} ({govLabel}) son {potential} {ofGdp}. Del coste de {gross} se reaprovechan {replaced}: quedarían {net} por pagar.',
  stepMarginText:
    'Límite del {ceiling}% − impuestos actuales del {tax} = {margin} {ofGdp} en impuestos nuevos.',
  stepAiText:
    'La producción extra ({growth}%) × la parte que se queda en el país ({domestic}%) × lo que capta el Estado ({capture}%) = {ai} {ofGdp}.',
  stepGapText: 'Coste {net} − impuestos nuevos {margin} − IA {ai} = {gap} {ofGdp}.',
  stepNeededText: '{gap} ÷ ({domestic}% × {capture}%) = +{needed} {ofGdp}.',
  replaceHint:
    'Se aplica al total del gasto público del país. La app no sabe qué programas concretos se recortarían.',
  marginHint:
    'Es dinero nuevo: subir impuestos desde lo que ya se recauda hasta el límite. Lo que ya se recauda paga otros gastos.',
  dataTitle: 'De qué año es cada dato',
  dataYearsWarning: 'Ojo: los datos mezclan años distintos (hasta {years} años de diferencia).',
  missingTitle: 'Datos que faltan',
  updatedWith: 'Último dato disponible de los últimos cinco años.',
  indGdp: 'Lo que produce el país (PIB)',
  indPopulation: 'Habitantes',
  indChildren: 'Menores de 15 años',
  indGdpPc: 'Producción por persona (ajustada al coste de vida)',
  indTax: 'Impuestos que se recaudan',
  indGovExp: 'Gasto público',

  // Controles
  presets: 'Escenarios rápidos',
  advancedParams: 'Ajustes avanzados',
  breakdownTitle: 'Los números por dentro',
  modeSimple: 'Sencillo',
  modeAdvanced: 'Completo',
  simpleNote:
    'El resto de supuestos (IA, cobertura y límite de impuestos) se quedan como están. Pasa a Completo para cambiarlos.',
  simpleAmount: 'Qué parte de lo que produce cada persona se reparte',
  simpleAmountHint:
    'Ejemplo: si el país produce 10.000 $ por persona al año, el 25% son 2.500 $ al año (unos 208 $ al mes).',
  showTechnical: 'Ver los números por dentro',
  coverage: 'A quién se le paga',
  adultsOnly: 'Solo a personas adultas',
  adultsAndChildren: 'A adultos y menores (los menores cobran la mitad)',
  ubiAmount: 'Cuánto se paga al mes',
  pctGdpPc: 'Parte de lo que produce cada persona',
  usdMonth: 'Cantidad fija en $ al mes',
  publicSpendingReplace: 'Cuánto del gasto público actual se reaprovecha',
  aiGrowth: 'Cuánto más produciría el país gracias a la IA (%)',
  stateCapture: 'Cuánto de esa producción extra se queda el Estado (%)',
  domesticAi: 'Cuánto de esa producción extra se queda en el país (%)',
  fiscalCeiling: 'Hasta qué parte de lo que produce el país se podría cobrar impuestos (%)',
  adults: 'Personas adultas',
  children: 'Menores',

  // Leyenda de brechas y métricas
  gapCovered: 'No faltaría nada',
  gap0to3: 'Faltarían menos de 3 de cada 100',
  gap3to8: 'Entre 3 y 8 de cada 100',
  gap8to20: 'Entre 8 y 20 de cada 100',
  gapOver20: 'Más de 20 de cada 100',
  costUnder5: 'Costaría menos de 5 de cada 100',
  cost5to10: 'Entre 5 y 10 de cada 100',
  cost10to20: 'Entre 10 y 20 de cada 100',
  cost20to35: 'Entre 20 y 35 de cada 100',
  costOver35: 'Más de 35 de cada 100',
  neededCovered: 'No haría falta IA extra',
  needed0to5: 'Poca IA extra (menos de 5 de cada 100)',
  needed5to15: 'Bastante IA extra (entre 5 y 15 de cada 100)',
  needed15to30: 'Muchísima IA extra (entre 15 y 30 de cada 100)',
  neededOver30: 'Más de 30 de cada 100, o imposible',

  // Glosario y ayuda
  glossary: 'Palabras difíciles',
  glossaryIntro: 'Explicaciones cortas, con un ejemplo cotidiano.',
  exampleLabel: 'Ejemplo',
  howItWorks: 'Cómo funciona',
  tourTitle: 'Tres cosas y ya está',
  tourStep1Title: 'Mira el mapa',
  tourStep1:
    'Cada país se colorea según si podría pagar una renta básica. Los grises son países sin datos suficientes.',
  tourStep2Title: 'Elige un país',
  tourStep2:
    'Toca uno o búscalo arriba. Verás cuánto cobraría cada adulto, cuánto costaría y cuánto faltaría.',
  tourStep3Title: 'Mueve los dos sliders',
  tourStep3:
    'Cambia cuánto se reparte y cuánto gasto se reaprovecha. El mapa y la frase de resumen se actualizan al instante.',
  tourNext: 'Siguiente',
  tourBack: 'Atrás',
  tourDone: 'Entendido',
  tourSkip: 'Saltar',
  tourProgress: '{current} de {total}',
  simpleFixed: 'Supuestos que no cambias en Sencillo',
}

export const en: typeof es = {
  title: 'UBI World',
  subtitle: 'What would it take to pay a basic income to everyone?',
  description:
    'A calculator to understand, country by country, what it would take to pay a universal basic income. It is not a prediction: it is a set of assumptions with the cards face up.',

  searchCountry: 'Search a country',
  noResults: 'Country not found',
  metric: 'What the map shows',
  category: 'Whether it could be paid',
  gap: 'What would be missing',
  metricGap: 'What would be missing',
  metricCost: 'What it would cost',
  metricNeeded: 'How much extra AI would be needed',
  legend: 'What the colours mean',
  legendHint: 'Tap a country on the map to see its explanation',
  noData: 'Not enough data',
  noDataDesc:
    'The World Bank is missing data for this country. We did not make it up: that is why it is grey.',
  methodology: 'How it is calculated',
  disclaimer:
    'This site does not predict the future. It only shows which assumptions would make the numbers work and how they change when you move them.',

  viableNow: 'It could be paid today',
  viableModerate: 'Close, or AI covers it',
  extremeAI: 'It would take a lot of AI',
  notViable: 'It does not add up even with a lot of AI',
  legendViableNow: 'It could be paid today',
  legendViableModerate: 'Close (or AI covers it)',
  legendExtremeAI: 'It would take a lot of AI',
  legendNotViable: 'It does not add up even with a lot of AI',
  legendNoData: 'Not enough data',

  noSelectionTitle: 'Choose a country',
  noSelectionHint: 'Search above or tap the map to see what it would cost and what would be missing.',
  close: 'Close',
  summaryIncome: 'Per adult, per month',
  summaryCost: 'Cost of paying it',
  summaryGap: 'What would be missing',
  summaryCovered: 'Nothing is missing',
  nominalApprox: '≈ {value} $ per month',
  grossShort: 'Before reusing spending: {value}',
  grossCost: 'Gross cost',
  netCost: 'Net cost',
  fiscalMargin: 'New taxes',
  aiIncome: 'Money from AI',
  gapTotal: 'What would be missing',
  aiGrowthNeeded: 'How much extra AI would be needed',
  perMonth: 'month',
  perYear: 'year',
  perMonthPpp: 'PPP $ per month',
  perMonthNominal: 'current $ per month',
  perYearNominal: 'current $ per year',
  perAdultNote: '(≈ {value} {unit} per adult)',
  ofGdp: 'of what the country produces',
  coveredWord: 'covered',

  plainSummaryCost:
    'Out of every 100 $ the country produces in a year, paying the UBI would cost about {cost} $.',
  plainSummaryFunding:
    'That money could come from {replaced} $ of spending that already exists, {margin} $ of new taxes and {ai} $ from AI.',
  plainSummaryGap: 'Even so, {gap} $ out of every 100 would still be missing.',
  plainSummaryCovered: 'And nothing would be missing: {surplus} $ out of every 100 would be left over.',

  reasonCoveredNow: 'With these settings, the numbers work without any extra AI.',
  reasonCoveredWithAi: 'The numbers work thanks to the extra output from AI.',
  reasonModerate:
    '{gap} out of every 100 $ produced would be missing. With today’s AI, the country would need to produce {needed} more out of every 100 $: a moderate amount.',
  reasonExtreme:
    '{gap} out of every 100 $ produced would be missing. The country would need AI to produce {needed} more out of every 100 $: a lot of AI.',
  reasonBeyond:
    '{gap} out of every 100 $ produced would be missing. It would take {needed}% more output from AI, beyond what this tool considers reasonable.',
  reasonNoCapture:
    'It cannot work like this: the state keeps none of what AI produces. In Advanced mode you can raise capture or domestic production.',
  impossibleShort: 'It cannot be closed this way',

  fundingTitle: 'Where the money would come from',
  fundingSubtitle:
    'The cost of paying everyone splits into reused spending, new taxes, AI and what would be missing.',
  howCalculated: 'The numbers inside',
  fundingReplaced: 'Reused spending',
  fundingMargin: 'New taxes',
  fundingAi: 'AI',
  fundingGap: 'Missing',
  surplus: 'With these settings, {value} out of every 100 $ would be left over.',
  stepPeople: 'Who gets paid and how much',
  stepGross: 'What it would cost to pay everyone',
  stepReplace: 'Spending that already exists and is reused',
  stepMargin: 'New taxes up to the limit',
  stepAi: 'Money from the extra AI output',
  stepGap: 'What would be missing',
  stepNeeded: 'How much extra AI would be needed',
  stepNeededNone: 'No extra AI is needed: the numbers already work.',
  stepNeededImpossible:
    'The gap cannot be closed this way: the state keeps none of the extra AI output.',
  stepReplaceText:
    '{substitution}% of {govExp} ({govLabel}) is {potential} {ofGdp}. Of the {gross} cost, {replaced} is reused: {net} would still have to be paid.',
  stepMarginText:
    'Limit of {ceiling}% − current taxes of {tax} = {margin} {ofGdp} in new taxes.',
  stepAiText:
    'Extra output ({growth}%) × the share that stays in the country ({domestic}%) × the share the state captures ({capture}%) = {ai} {ofGdp}.',
  stepGapText: 'Cost {net} − new taxes {margin} − AI {ai} = {gap} {ofGdp}.',
  stepNeededText: '{gap} ÷ ({domestic}% × {capture}%) = +{needed} {ofGdp}.',
  replaceHint:
    'It applies to the country’s total public spending. The app does not know which specific programmes would be cut.',
  marginHint:
    'This is new money: taxes raised from what is already collected up to the limit. What is already collected pays for other spending.',
  dataTitle: 'What year each figure is from',
  dataYearsWarning: 'Note: the figures mix different years (up to {years} years apart).',
  missingTitle: 'Missing data',
  updatedWith: 'Latest figure available from the last five years.',
  indGdp: 'What the country produces (GDP)',
  indPopulation: 'People',
  indChildren: 'Under 15',
  indGdpPc: 'Output per person (adjusted for cost of living)',
  indTax: 'Taxes collected',
  indGovExp: 'Public spending',

  presets: 'Quick scenarios',
  advancedParams: 'Advanced settings',
  breakdownTitle: 'The numbers inside',
  modeSimple: 'Simple',
  modeAdvanced: 'Advanced',
  simpleNote:
    'The other assumptions (AI, coverage and tax limit) stay as they are. Switch to Advanced to change them.',
  simpleAmount: 'How much of each person’s output is shared out',
  simpleAmountHint:
    'Example: if the country produces 10,000 $ per person per year, 25% is 2,500 $ per year (about 208 $ per month).',
  showTechnical: 'See the numbers inside',
  coverage: 'Who gets paid',
  adultsOnly: 'Adults only',
  adultsAndChildren: 'Adults and children (children get half)',
  ubiAmount: 'How much is paid per month',
  pctGdpPc: 'A share of what each person produces',
  usdMonth: 'A fixed amount in $ per month',
  publicSpendingReplace: 'How much current public spending is reused',
  aiGrowth: 'How much more the country would produce thanks to AI (%)',
  stateCapture: 'How much of that extra output the state keeps (%)',
  domesticAi: 'How much of that extra output stays in the country (%)',
  fiscalCeiling: 'How much of what the country produces could be taxed (%)',
  adults: 'Adults',
  children: 'Children',

  gapCovered: 'Nothing would be missing',
  gap0to3: 'Less than 3 out of every 100 missing',
  gap3to8: 'Between 3 and 8 out of every 100',
  gap8to20: 'Between 8 and 20 out of every 100',
  gapOver20: 'More than 20 out of every 100',
  costUnder5: 'Less than 5 out of every 100',
  cost5to10: 'Between 5 and 10 out of every 100',
  cost10to20: 'Between 10 and 20 out of every 100',
  cost20to35: 'Between 20 and 35 out of every 100',
  costOver35: 'More than 35 out of every 100',
  neededCovered: 'No extra AI needed',
  needed0to5: 'A little extra AI (less than 5 out of every 100)',
  needed5to15: 'Quite a lot of extra AI (5 to 15 out of every 100)',
  needed15to30: 'A huge amount of extra AI (15 to 30 out of every 100)',
  neededOver30: 'More than 30 out of every 100, or impossible',

  glossary: 'Hard words',
  glossaryIntro: 'Short explanations, with an everyday example.',
  exampleLabel: 'Example',
  howItWorks: 'How it works',
  tourTitle: 'Three things and that’s it',
  tourStep1Title: 'Look at the map',
  tourStep1:
    'Each country is coloured by whether it could pay a basic income. Grey means there is not enough data.',
  tourStep2Title: 'Choose a country',
  tourStep2:
    'Tap one or search above. You will see how much each adult would get, what it would cost and what would be missing.',
  tourStep3Title: 'Move the two sliders',
  tourStep3:
    'Change how much is shared out and how much spending is reused. The map and the summary sentence update instantly.',
  tourNext: 'Next',
  tourBack: 'Back',
  tourDone: 'Got it',
  tourSkip: 'Skip',
  tourProgress: '{current} of {total}',
  simpleFixed: 'Assumptions you do not change in Simple mode',
}

export type Translations = typeof es
export type Lang = 'es' | 'en'

export const getDict = (lang: Lang): Translations => (lang === 'es' ? es : en)
