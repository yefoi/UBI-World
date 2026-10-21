# AGENTS.md - UBI World

## Proyecto
UBI World: mapamundi interactivo que muestra, para cada país, qué tendría que pasar para financiar una Renta Básica Universal (UBI) en un escenario de abundancia por IA. Herramienta divulgativa, no un paper.

## Stack
- React + TypeScript + Vite
- d3-geo + topojson-client + world-atlas
- Sin backend. Estático desplegable en Vercel
- Vitest para tests del modelo
- Idiomas: español (por defecto) e inglés

## Principios
- **Cero invención**: si falta un dato, el país sale en gris con aviso. NUNCA inventar ni rellenar datos.
- **Cálculo puro**: la lógica de negocio vive en `src/model/ubi.ts` (función pura, sin I/O).
- **Datos estáticos**: `src/data/countries.json` se genera con `scripts/fetch-data.ts` y se commitea. La app NO llama a APIs en runtime.
- **Sin backend**: toda la lógica corre en cliente.
- **Divulgativo**: NO es una predicción, es "¿qué tendría que pasar para que cuadre?".
- **Sin dependencias innecesarias**: añadir solo lo imprescindible.

## Comandos
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Previsualizar build
- `npm test` - Tests con Vitest
- `npm run test:ui` - Tests con UI
- `npm run fetch-data` - Regenera `src/data/countries.json` desde Banco Mundial
- `npm run typecheck` - Comprobación TypeScript

## Estructura
```
src/
├── components/     # Componentes React
├── data/           # countries.json (generado)
├── i18n/           # Traducciones es/en
├── model/          # Modelo puro ubi.ts + tests
├── pages/          # Páginas (Map, Metodología)
├── styles/         # CSS/globales
└── utils/          # Utilidades
scripts/
├── fetch-data.ts   # Descarga datos Banco Mundial
docs/
└── METHODOLOGY.md  # Fórmulas, supuestos, limitaciones
```

## Reglas
- Documentar TODOS los supuestos en `docs/METHODOLOGY.md`
- Commits pequeños y descriptivos
- Añadir tests para casos límite (PIB 0, datos faltantes, g negativo)
- Actualizar mapa < 100ms al mover sliders (memoizar cálculos)
- Países sin datos en gris con aviso
