export const methodologyContent = {
  es: {
    back: '← Volver al mapa',
    oneLineTitle: 'En una frase',
    oneLine:
      'Miramos cuánto costaría dar una renta básica en cada país y lo comparamos con el dinero que ya se gasta, el que se podría recaudar y el que podría aportar la IA. Si falta, decimos cuánta IA extra haría falta.',
    notPrediction:
      'No es una predicción ni una propuesta política. Es una calculadora de supuestos: cambia los sliders y mira qué pasa.',
    whatTitle: 'Qué estás viendo',
    what: [
      'Cada país se colorea según si las cuentas saldrían con los supuestos elegidos.',
      'Al tocar un país ves una frase con las cifras: cuánto costaría, de dónde saldría el dinero y cuánto faltaría.',
      'Los países en gris no tienen datos suficientes. No rellenamos huecos.',
    ],
    ingredientsTitle: 'Los tres ingredientes',
    ingredients: [
      [
        'Gasto que ya existe',
        'Si el Estado ya paga ayudas o servicios, parte de ese dinero se puede cambiar por la renta básica en vez de sumar dos pagos. El slider dice qué porcentaje del gasto público se reaprovecha; nunca puede ser mayor que el coste de la renta básica.',
      ],
      [
        'Impuestos nuevos',
        'Es dinero que se podría recaudar subiendo impuestos desde lo que ya se paga hasta el límite que elijas. Lo que ya se recauda no cuenta: ese dinero ya paga otros gastos.',
      ],
      [
        'Producción extra de la IA',
        'En este escenario, la IA hace que el país produzca más. Solo cuenta la parte que se queda en el país y de la que el Estado se lleva una porción. Es un supuesto, no una previsión.',
      ],
    ],
    stepsTitle: 'Cómo se calcula, en pasos sencillos',
    steps: [
      [
        '1. ¿Quién cobra y cuánto?',
        'Cada adulto recibe la cantidad elegida. Si también cobran los menores, reciben la mitad. La cantidad se compara con lo que produce el país por persona, ajustado al coste de vida.',
      ],
      [
        '2. ¿Cuánto costaría pagarlo a todos?',
        'Se multiplica lo que cobra cada persona por el número de personas. El resultado se mide como una parte de lo que produce el país en un año.',
      ],
      [
        '3. ¿Cuánto se reaprovecha?',
        'Del gasto público actual se toma el porcentaje que elijas, sin pasarse del coste total. Eso reduce lo que habría que pagar de nuevo.',
      ],
      [
        '4. ¿Cuántos impuestos nuevos caben?',
        'Se resta lo que ya se recauda al límite de impuestos elegido. La diferencia es el dinero nuevo que se podría recaudar.',
      ],
      [
        '5. ¿Cuánto aporta la IA?',
        'Se multiplican tres cosas: la producción extra, la parte que se queda en el país y la parte que capta el Estado.',
      ],
      [
        '6. ¿Qué falta?',
        'Al coste que queda por pagar se le restan los impuestos nuevos y el dinero de la IA. Si el resultado es positivo, eso es lo que falta.',
      ],
      [
        '7. ¿Cuánta IA haría falta?',
        'Si falta dinero, se divide entre la parte de la producción extra que de verdad llega al Estado. Si esa parte es cero, la diferencia no se puede cerrar por esta vía.',
      ],
    ],
    categoriesTitle: 'Qué significan las categorías',
    categories: [
      ['Se podría pagar hoy', 'Las cuentas salen sin contar con IA extra.'],
      ['Faltaría poco o lo cubre la IA', 'Las cuentas salen con la IA que ya has puesto, o faltaría menos de 5 de cada 100.'],
      ['Haría falta mucha IA', 'Faltaría entre 5 y 15 de cada 100 de lo que produce el país.'],
      ['No cuadra ni con mucha IA', 'Faltaría más de 15 de cada 100, o el Estado no capta nada de la IA.'],
      ['Sin datos suficientes', 'Falta alguno de los seis datos del Banco Mundial.'],
    ],
    limitsTitle: 'Qué no tiene en cuenta',
    limits: [
      'No dice qué programas concretos se recortarían: el gasto público es un total, no una lista.',
      'Los impuestos del Banco Mundial no incluyen todas las cotizaciones sociales; según el país, el margen puede quedarse corto o largo.',
      'No modela evasión, economía sumergida, deuda, inflación, tipos de cambio ni cambios de comportamiento.',
      'Compara países con promedios nacionales: no dice cómo se reparte dentro de cada país.',
      'Los parámetros de la IA son especulativos. Cambiarlos cambia el resultado.',
      'Los cortes de las categorías (5 y 15 de cada 100) son convenciones de esta herramienta.',
    ],
    wordsTitle: 'Palabras difíciles',
    wordsIntro: 'Si te pierdes con algún término, aquí está en corto.',
    technicalTitle: 'Detalle técnico (para quien quiera fórmulas)',
    technical: [
      'PIB en PPA = PIB per cápita PPA × población. Los porcentajes se calculan en PPA; los importes en dólares corrientes usan el deflactor del PIB (PIB nominal ÷ PIB PPA), sin mezclar unidades.',
      'Coste bruto = adultos × importe adulto + menores × importe menor. Importe menor = importe adulto × 50% (configurable).',
      'Gasto redirigido = mínimo(coste bruto, gasto público × % de reaprovechamiento). Coste neto = coste bruto − gasto redirigido.',
      'Impuestos nuevos = máximo(0, techo fiscal − ingresos fiscales actuales). La recaudación actual no se suma como dinero disponible.',
      'Ingreso IA = crecimiento extra del PIB × % de producción doméstica × % captado por el Estado.',
      'Brecha = coste neto − impuestos nuevos − ingreso IA. IA necesaria = brecha ÷ (% doméstico × % captado); infinito si el denominador es 0.',
    ],
    dataTitle: 'Datos y años',
    dataIntro:
      'Seis indicadores del Banco Mundial. Para cada uno se usa el último año disponible de los últimos cinco. Si falta alguno, el país queda en gris. Los años pueden no coincidir; el panel avisa si hay desfases.',
    docs: 'Fórmulas completas y limitaciones (GitHub)',
  },
  en: {
    back: '← Back to map',
    oneLineTitle: 'In one sentence',
    oneLine:
      'We look at what it would cost to pay a basic income in each country and compare it with money already being spent, money that could be raised and money AI could contribute. If something is missing, we say how much extra AI it would take.',
    notPrediction:
      'It is not a prediction or a policy proposal. It is a calculator of assumptions: move the sliders and see what happens.',
    whatTitle: 'What you are seeing',
    what: [
      'Each country is coloured by whether the numbers would work with the chosen assumptions.',
      'Tap a country to see a sentence with figures: what it would cost, where the money would come from and what would be missing.',
      'Grey countries do not have enough data. We do not fill the gaps.',
    ],
    ingredientsTitle: 'The three ingredients',
    ingredients: [
      [
        'Spending that already exists',
        'If the state already pays benefits or services, part of that money can be switched to the basic income instead of adding a second payment. The slider sets what share of public spending is reused; it can never exceed the cost of the basic income.',
      ],
      [
        'New taxes',
        'Money that could be raised by increasing taxes from what is already paid up to the limit you choose. What is already collected does not count: it already pays for other spending.',
      ],
      [
        'Extra output from AI',
        'In this scenario, AI makes the country produce more. Only the part that stays in the country counts, and only the share the state captures. It is an assumption, not a forecast.',
      ],
    ],
    stepsTitle: 'How it is calculated, in simple steps',
    steps: [
      [
        '1. Who gets paid and how much?',
        'Each adult receives the chosen amount. If children are covered too, they receive half. The amount is compared with what the country produces per person, adjusted for cost of living.',
      ],
      [
        '2. What would it cost to pay everyone?',
        'What each person receives is multiplied by the number of people. The result is measured as a share of what the country produces in a year.',
      ],
      [
        '3. How much is reused?',
        'A share of current public spending is taken, without exceeding the total cost. That reduces what would have to be paid again.',
      ],
      [
        '4. How much room for new taxes is there?',
        'What is already collected is subtracted from the chosen tax limit. The difference is the new money that could be raised.',
      ],
      [
        '5. How much does AI contribute?',
        'Three things are multiplied: extra output, the share that stays in the country and the share the state captures.',
      ],
      [
        '6. What is missing?',
        'New taxes and AI money are subtracted from the cost still to be paid. If the result is positive, that is what is missing.',
      ],
      [
        '7. How much AI would be needed?',
        'If money is missing, it is divided by the share of extra output that actually reaches the state. If that share is zero, the gap cannot be closed this way.',
      ],
    ],
    categoriesTitle: 'What the categories mean',
    categories: [
      ['It could be paid today', 'The numbers work without extra AI.'],
      ['Close, or AI covers it', 'The numbers work with the AI already included, or less than 5 out of every 100 would be missing.'],
      ['It would take a lot of AI', 'Between 5 and 15 out of every 100 of what the country produces would be missing.'],
      ['It does not add up even with a lot of AI', 'More than 15 out of every 100 would be missing, or the state captures nothing from AI.'],
      ['Not enough data', 'One of the six World Bank figures is missing.'],
    ],
    limitsTitle: 'What it does not take into account',
    limits: [
      'It does not say which specific programmes would be cut: public spending is a total, not a list.',
      'World Bank taxes do not include all social contributions; depending on the country, the margin may be too small or too large.',
      'It does not model evasion, the shadow economy, debt, inflation, exchange rates or behaviour changes.',
      'It compares countries with national averages: it says nothing about distribution within each country.',
      'The AI parameters are speculative. Changing them changes the result.',
      'The category cut-offs (5 and 15 out of every 100) are conventions of this tool.',
    ],
    wordsTitle: 'Hard words',
    wordsIntro: 'If a term is confusing, here it is in short.',
    technicalTitle: 'Technical detail (for formula lovers)',
    technical: [
      'PPP GDP = PPP GDP per capita × population. Percentages are calculated in PPP; current-dollar amounts use the GDP deflator (nominal GDP ÷ PPP GDP), without mixing units.',
      'Gross cost = adults × adult amount + children × child amount. Child amount = adult amount × 50% (configurable).',
      'Redirected spending = min(gross cost, public spending × reuse share). Net cost = gross cost − redirected spending.',
      'New taxes = max(0, tax ceiling − current tax revenue). Current revenue is not added as available money.',
      'AI revenue = extra GDP growth × domestic production share × share captured by the state.',
      'Gap = net cost − new taxes − AI revenue. Required AI = gap ÷ (domestic share × capture share); infinite if the denominator is 0.',
    ],
    dataTitle: 'Data and years',
    dataIntro:
      'Six World Bank indicators. For each one, the latest year available within the last five is used. If one is missing, the country stays grey. Years may not match; the panel warns when the spread is large.',
    docs: 'Full formulas and limitations (GitHub)',
  },
} as const

export type MethodologyContent = typeof methodologyContent.es
