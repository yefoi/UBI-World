# AGENTS.md - UBI World

## Proyecto
UBI World: mapamundi interactivo que muestra, para cada país, qué tendría que pasar para financiar una renta básica universal (UBI) en un escenario de abundancia por IA. Herramienta divulgativa, no un paper. Público objetivo: personas sin conocimientos de economía.

## Stack
- React + TypeScript + Vite
- d3-geo + topojson-client + world-atlas
- Sin backend. Estático desplegable en Vercel
- Vitest para tests
- Idiomas: español (por defecto) e inglés

## Principios
- **Cero invención**: si falta un dato, el país sale en gris con aviso. NUNCA inventar ni rellenar.
- **Cálculo puro**: la lógica vive en `src/model/ubi.ts` (función pura, sin I/O).
- **Datos estáticos**: `src/data/countries.json` se genera con `scripts/fetch-data.ts` y se commitea. La app NO llama a APIs en runtime.
- **Lenguaje llano**: nada de jerga sin explicación. PIB = "lo que produce el país", coste bruto = "lo que costaría pagarlo a todos", brecha = "lo que faltaría".
- **Todo el texto de UI en i18n**: `src/i18n/translations.ts`, `methodology.ts` y `glossary.ts`. No hardcodear frases en componentes.
- **Accesibilidad**: teclado, `aria-label`, foco visible, leyenda con texto y texturas (no solo color), ayudas `?` y glosario.
- **Dos modos**: Sencillo (2 sliders + frase-resumen) por defecto; Completo con todos los parámetros y fórmulas.
- **Sin dependencias innecesarias**: añadir solo lo imprescindible.

## Comandos
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Previsualizar build
- `npm test` - Tests con Vitest
- `npm run test:ui` - Tests con UI
- `npm run fetch-data` - Regenera `src/data/countries.json` desde el Banco Mundial
- `npm run typecheck` - Comprobación TypeScript
- CI en `.github/workflows/ci.yml`: typecheck + tests + build.

## Estructura
```
src/
├── components/       # Mapa, leyenda, búsqueda, resumen, desglose, controles, glosario, tour
├── data/             # countries.json (generado, commiteado)
├── hooks/            # useMediaQuery
├── i18n/             # translations.ts, glossary.ts, methodology.ts
├── model/            # ubi.ts (modelo puro) + tests
├── pages/            # Methodology
├── utils/            # formato, país, resumen, URL, presets, indicadores
└── index.css         # tokens y estilos
scripts/fetch-data.ts # descarga y valida datos del Banco Mundial
docs/METHODOLOGY.md   # fórmulas, supuestos y limitaciones
.github/workflows/ci.yml
```

## Reglas
- Documentar todos los supuestos en `docs/METHODOLOGY.md` y en la página `/metodologia`.
- Commits pequeños y descriptivos, en español.
- Tests para casos límite (PIB 0, datos faltantes, g negativo) y para el resumen llano y la URL.
- El mapa debe actualizarse en <100 ms al mover los sliders (cálculos memoizados).
- Países sin datos en gris con aviso; nunca rellenar.
- La sustitución de gasto se aplica al gasto público, nunca como descuento del coste del UBI; la recaudación actual no es dinero disponible.
- No romper el estado compartible: país, métrica, modo, idioma y parámetros van en la URL.
